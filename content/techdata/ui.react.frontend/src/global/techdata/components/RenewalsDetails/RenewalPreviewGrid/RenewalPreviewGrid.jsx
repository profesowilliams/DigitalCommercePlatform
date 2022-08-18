import React, { useState, useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from "react";
import {Button} from "@mui/material";
import { teal } from "@mui/material/colors";
import PlaceOrderDialog from '../../RenewalsGrid/Orders/PlaceOrderDialog';
import Grid from "../../Grid/Grid";
import Modal from "../../Modal/Modal";
import RenewalProductLinesItemInformation from "./RenewalProductLinesItemInformation";
import RenewalManufacturer from "./RenewalManufacturer";
import { thousandSeparator } from "../../../helpers/formatting";
import QuantityColumn from "../Columns/QuantityColumn.jsx";
import buildColumnDefinitions from "./buildColumnDefinitions";
import UnitPriceColumn from "../Columns/UnitPriceColumn";
import { isInternalUser } from "../../../../../utils/user-utils";
import TransactionNumber from "../../RenewalsGrid/Orders/TransactionNumber";

function GridSubTotal({ subtotal, data, gridProps }) {
  return (
    <div className="cmp-renewal-preview__subtotal">
      <div className="cmp-renewal-preview__subtotal--note">
        <b>Note: </b>
        {gridProps?.note?.replace("Note: ", "")}
      </div>
      <div className="cmp-renewal-preview__subtotal--price-note">
        <b className="cmp-renewal-preview__subtotal--description">
          {gridProps.quoteSubtotal}
        </b>
        <span className="cmp-renewal-preview__subtotal--value">
          <span className="cmp-renewal-preview__subtotal--currency-symbol">
            {gridProps?.quoteSubtotalCurrencySymbol || ''}
          </span>
          <span>{thousandSeparator(subtotal || data?.price)}</span>
          {gridProps?.quoteSubtotalCurrency?.length > 0 && (
            <span className="cmp-renewal-preview__subtotal--currency-code">
              {gridProps.quoteSubtotalCurrency?.replace(
                '{currency-code}',
                data?.currency || '' 
              )}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

function Price({ value }) {
  return <div className="price">{thousandSeparator(value)}</div>;
}

function RenewalPreviewGrid({ data, gridProps, shopDomainPage, isEditing, compProps }, ref) {
  const [modal, setModal] = useState(null);
  const [isPODialogOpen, setIsPODialogOpen] = useState(false);
  const orderEndpoints = {
    updateRenewalOrderEndpoint: compProps.updateRenewalOrderEndpoint,
    getStatusEndpoint: compProps.getStatusEndpoint, 
    orderRenewalEndpoint: compProps.orderRenewalEndpoint
  };
  const [subtotal, setSubtotal] = useState(null);
  const gridData = data.items ?? [];
  const gridConfig = {
    ...gridProps,
    serverSide: false,
    paginationStyle: "none",
  };

  // Keep track of isEditing on rerenders, will be used by quantity cell on redraw
  const isEditingRef = useRef(isEditing);

  // Get gridApi, save also as ref to be used on imperative handle
  const [gridApi, setGridApi] = useState(null);
  const gridApiRef = useRef(null);

  function onAfterGridInit({ api }) {
    setGridApi(api);
    gridApiRef.current = api;
  }

  // On isEditing prop change, update ref and refresh the cell
  useEffect(() => {
    isEditingRef.current = isEditing;
    if(gridApi) {
      gridApi.refreshCells({
        columns: ["quantity","unitPrice"],
        force: true,
      });
    }
  }, [isEditing])

  useImperativeHandle(ref, () => ({
    cancelEdit () {
      // Copy original grid data
      const copyGridData = JSON.parse(JSON.stringify(gridData));

      // Replace grid data with original
      setMutableGridData(copyGridData);

      // Api call needed to refresh grid
      if(gridApiRef.current) {
        gridApiRef.current.setRowData(copyGridData);
      }
    }
  }), [])

  const columnDefinitionsOverride = [
    {
      field: "id",
      headerName: gridProps?.line,
    },
    {
      field: "vendorPartNo",
      headerName: gridProps?.productfamily,
      valueGetter: ({ data }) =>
        data.product.find((p) => p.family)?.family ?? "N/A",
    },
    {
      field: "shortDescription",
      headerName: gridProps?.productdescription,
      cellHeight: () => 80,
      cellRenderer: ({ data }) => (
        <RenewalProductLinesItemInformation
          line={data}
          isLinkDisabled={gridProps.disableProductDetailsLink}
          shopDomainPage={shopDomainPage}
          invokeModal={invokeModal}
        />
      ),
    },
    {
      field: "mfrNumber",
      headerName: gridProps?.vendorPartNo,
      cellRenderer: (props) => RenewalManufacturer(props),
    },
    {
      field: "unitListPrice",
      headerName: gridProps.listPrice?.replace(
        "{currency-code}",
        data?.currency || ""
      ),
      cellRenderer: (props) => Price(props)
    },
    {
      field:'value',
      headerName: gridProps?.percentOffListPrice,
      valueGetter: ({ data }) => data.discounts && data.discounts[0]?.value,
      cellRenderer: (props) => Price(props),
    },
    {
      field:'unitPrice',
      headerName: gridProps.unitPrice?.replace(
        "{currency-code}",
        data?.currency || ""
      ),
      cellRenderer: (props) => {
        const isEditing = isEditingRef.current && isInternalUser && data?.canEditResellerPrice;
        return UnitPriceColumn({...props, isEditing})
      },

    },
    {
      field:'quantity',
      headerName: gridProps?.quantity,
      cellRenderer: (props) =>{
        const isEditing = isEditingRef.current && data?.canEditQty;
        return QuantityColumn({ ...props, isEditing })
      }      
    },
    {
      field:'totalPrice',
      headerName: gridProps.totalPrice?.replace(
        "{currency-code}",
        data?.currency || ""
      ),
      cellRenderer: (props) => Price(props),
      valueGetter:'data.quantity * data.unitPrice',
      // Use sum aggFunc to also update subtotal value.
      // Function is triggered on internal grid updates.
      aggFunc: params => {
        let total = 0;
        params.values.forEach(value => total += value);
        setSubtotal(total);
        return total;
      }
    }
  ];

  const columnDefs = useMemo(() => buildColumnDefinitions(columnDefinitionsOverride),[]); 


  /*
    mutableGridData is copied version of response that can be safely mutated,
    original state is preserved in gridData.
  */
  const [mutableGridData, setMutableGridData] = useState(JSON.parse(JSON.stringify(gridData)));

  function invokeModal(modal) {
    setModal(modal);
  }
  const onOrderButtonClicked = () => {
    setIsPODialogOpen(true);
  }
  const onClosDialog =() => {
    setIsPODialogOpen(false);
  }

  const fixQuoteDataUponRequest = data => {
    const mapped = {...data};
    mapped.items = data.items.map(item => {
      const product = !item?.prouct || !item?.prouct.length ? {} : item.product[1];   
      return {...item, product}
    });
    // TODO: Refactor this into renewalOrderUtils in a function
    const endUser = {
      name: mapped?.endUser?.name.text,
      contact: {
        name: mapped?.endUser?.contact[0]?.name?.text,
        email: mapped?.endUser?.contact[0]?.email?.text,
        phone: mapped?.endUser?.contact[0]?.phone?.text
      },
      address: {
        line1: mapped?.endUser?.address?.line1?.text,
        line2: mapped?.endUser?.address?.line2?.text,
        line3: mapped?.endUser?.address?.line3?.text,
        city: mapped?.endUser?.address?.city?.text,
        state: mapped?.endUser?.address?.state?.text,
        postalCode: mapped?.endUser?.address?.postalCode?.text,
        country: mapped?.endUser?.address?.country?.text,
        county: mapped?.endUser?.address?.county?.text,
        countryCode: mapped?.endUser?.address?.countryCode?.text
      }
    }
    const reseller = {
      contact: {
        name: mapped?.reseller?.contact[0]?.name?.text,
        email: mapped?.reseller?.contact[0]?.email?.text,
        phone: mapped?.reseller?.contact[0]?.phone?.text
      },
      address: {
        line1: mapped?.reseller?.address?.line1?.text,
        line2: mapped?.reseller?.address?.line2?.text,
        line3: mapped?.reseller?.address?.line3?.text,
        city: mapped?.reseller?.address?.city?.text,
        state: mapped?.reseller?.address?.state?.text,
        postalCode: mapped?.reseller?.address?.postalCode?.text,
        country: mapped?.reseller?.address?.country?.text,
        county: mapped?.reseller?.address?.county?.text,
        countryCode: mapped?.reseller?.address?.countryCode?.text
      }
    }
    mapped.endUser = endUser;
    mapped.reseller = reseller;
    const resellerName = mapped?.reseller?.contact?.name; 
    const endUserName = mapped?.endUser?.contact?.name; 
    //temporarely fix to make update service work
    if (!resellerName){
      mapped.reseller.contact.name = "rs rs1";
    }
    if (!endUserName){
      mapped.endUser.contact.name = "en en1";
    }
    return mapped;
  };
  return (
    <div className="cmp-product-lines-grid cmp-renewals-details">
      <section>
        <Grid
          onAfterGridInit={onAfterGridInit}
          columnDefinition={columnDefs}
          config={gridConfig}
          data={mutableGridData}
        />
        <GridSubTotal data={data} gridProps={gridProps} subtotal={subtotal} />
        <div className="place-cmp-order-dialog-container">
        <p className="cmp-place-order-actions">
            <Button
              disabled={!data.canPlaceOrder}
              sx={{background: teal[800],"&:hover": { background: teal[600] }}}
              onClick={onOrderButtonClicked}
              variant="contained"           
            >
              Order
            </Button>
          </p>
        </div>
      </section>
      {modal && (
        <Modal
          modalAction={modal.action}
          modalContent={modal.content}
          modalProperties={modal.properties}
          actionErrorMessage={modal.errorMessage}
          onModalClosed={() => setModal(null)}
        ></Modal>
      )}
      <PlaceOrderDialog
        onClose={onClosDialog}
        isDialogOpen={isPODialogOpen}
        orderingFromDashboard={compProps.orderingFromDashboard}
        orderEndpoints={orderEndpoints}
        closeOnBackdropClick={false}
        ToasterDataVerification={({data}) => data ? TransactionNumber(data) : null}
        renewalData={fixQuoteDataUponRequest(data)} />
    </div>
  );
}

export default forwardRef(RenewalPreviewGrid);
