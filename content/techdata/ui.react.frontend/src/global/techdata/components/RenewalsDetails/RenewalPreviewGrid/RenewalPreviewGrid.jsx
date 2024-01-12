import React, { useState, useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from "react";
import {Button} from "@mui/material";
import { teal } from "@mui/material/colors";
import sanitizeHtml from 'sanitize-html';
import PlaceOrderDialog from '../../RenewalsGrid/Orders/PlaceOrderDialog';
import Grid from "../../Grid/Grid";
import Modal from "../../Modal/Modal";
import RenewalProductLinesItemInformation, { getItemInformation } from "./RenewalProductLinesItemInformation";
import RenewalManufacturer, { getRenewalManufacturer } from "./RenewalManufacturer";
import { thousandSeparator } from "../../../helpers/formatting";
import QuantityColumn from "../Columns/QuantityColumn.jsx";
import buildColumnDefinitions from "./buildColumnDefinitions";
import UnitPriceColumn from "../Columns/UnitPriceColumn";
import TransactionNumber from "../../RenewalsGrid/Orders/TransactionNumber";
import { suppressNavigation } from "./supressAgGridKeyboardEvents";
import { mapRenewalForUpdateDetails, mapRenewalItemProducts } from "../../RenewalsGrid/Orders/orderingRequests";
import { useRenewalsDetailsStore } from "../store/RenewalsDetailsStore";
import Toaster from "../../Widgets/Toaster";
import { TOASTER_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import useIsIconEnabled from "../../RenewalsGrid/Orders/hooks/useIsIconEnabled";
import { copyToClipboardAction, getContextMenuItems, setLocalStorageData } from "../../RenewalsGrid/utils/renewalUtils";
import useComputeBranding from "../../../hooks/useComputeBranding";
import { getDictionaryValue } from "../../../../../utils/utils";

function GridSubTotal({ subtotal, data, gridProps }) {
  return (
    <div className="cmp-renewal-preview__subtotal">
      <div className="cmp-renewal-preview__subtotal--note"
        dangerouslySetInnerHTML={{
            __html: sanitizeHtml(gridProps?.note)
        }}>
      </div>
      <div className="cmp-renewal-preview__subtotal--price-note">
        <b className="cmp-renewal-preview__subtotal--description">
          { getDictionaryValue("details.renewal.label.subtotal", "Quote Subtotal") }
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
  const [multipleFlag, setMultipleFlag] = useState(false);
  const [isPODialogOpen, setIsPODialogOpen] = useState(false);
  const orderEndpoints = {
    updateRenewalOrderEndpoint: compProps.updateRenewalOrderEndpoint,
    getStatusEndpoint: compProps.getStatusEndpoint,
    orderRenewalEndpoint: compProps.orderRenewalEndpoint
  };
  const { computeClassName } = useComputeBranding(useRenewalsDetailsStore);
  const [subtotal, setSubtotal] = useState(null);
  const [orderButtonLabel, setOrderButtonLabel] = useState(gridProps?.orderButtonLabel);
  const gridData = data.items ?? [];
  const dataObj = data;
  const gridConfig = {
    ...gridProps,
    serverSide: false,
    paginationStyle: "none",
  };
  const effects = useRenewalsDetailsStore( state => state.effects);
  const { closeAndCleanToaster } = effects;
  const isEditingDetails = useRenewalsDetailsStore( state => state.isEditingDetails);
  const gridSavedItems = useRenewalsDetailsStore( state => state.savedItems);

  // Keep track of isEditing on rerenders, will be used by quantity cell on redraw
  const isEditingRef = useRef(isEditing);

  // Get gridApi, save also as ref to be used on imperative handle
  const [gridApi, setGridApi] = useState(null);
  const gridApiRef = useRef(null);
  const isIconEnabled = useIsIconEnabled(data?.firstAvailableOrderDate, data?.canOrder, compProps?.orderingFromDashboard?.showOrderingIcon);

  function onAfterGridInit({ api }) {
    setGridApi(api);
    gridApiRef.current = api;
  }

  useEffect(() => {
   setOrderButtonLabel(
     isEditingDetails
       ? gridProps?.saveAndOrderButtonLabel
       : gridProps?.orderButtonLabel
   );
  }, [isEditingDetails])

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

  useEffect(() => {
    if(isEditing) {
      effects.setCustomState({ key: 'items', value: mapRenewalItemProducts(mutableGridData) });
    } else {
      effects.clearItems();
    }
  }, [subtotal])

  useImperativeHandle(ref, () => ({
    cancelEdit () {
      // Copy original grid data
      let copyGridData = JSON.parse(JSON.stringify(gridData));
      if (gridSavedItems) {
        copyGridData.map((item, index) => {
          item.id = gridSavedItems[index].id;
          item.quantity = gridSavedItems[index].quantity;
          item.unitPrice = gridSavedItems[index].unitPrice;
        })
      }

      // Replace grid data with original
      setMutableGridData(copyGridData);
      effects.clearItems();

      // Api call needed to refresh grid
      if(gridApiRef.current) {
        gridApiRef.current.setRowData(copyGridData);
      }
    },
    getMutableGridData () {
      return mutableGridData;
    }
  }), [gridSavedItems])
  const contractMap = new Map();
  const sortedGridData = gridData.sort((a, b) => {
    const contractIdA = a.contract.id;
    const contractIdB = b.contract.id;

    return contractIdA - contractIdB;
  });
  JSON.parse(JSON.stringify(sortedGridData))?.forEach(item => {
    const contractId = item.contract.id;
    if (!contractMap.has(contractId)) {
      contractMap.set(contractId, []);
    }
    contractMap.get(contractId).push(item);
  });

  const resultArray = [];
  contractMap?.forEach((contractGroup, index) => {
    if (contractGroup.length >= 1 && contractMap?.size > 1) {
      resultArray.push(
        {
          ...gridData[0],
          totalPrice: 0,
          value: 0,
          unitPrice: 0,
          quantity:0,
          section: 'big-title', id: `Agreement No:  ${index}`
      }
      );
    }
    resultArray.push(...contractGroup);
  });
  const gridColumnWidths = Object.freeze({
    line: "29px",
    productFamily: "150px",
    productDescription: "368px",
    vendorPartNo: "220px",
    listPrice: "70px",
    percentageOfflist: "65px",
    unitPrice: "100px",
    quantity: "60px",
    total: "100px",
  });

  const columnDefinitionsOverride = [
    {
      field: "id",
      headerName: gridProps?.line,
      width: gridColumnWidths.line,
      cellRenderer: ({ data }) => {
        if (contractMap.size > 1) {
          setMultipleFlag(true);
        }
        return !(data?.id?.includes('Agreement')) ? data.id :
          <div className="row-header">
            <div><span>{data.id?.split(":")[0]}:</span> {data.id?.split(":")[1]}</div>
          </div>
      },
      headerClass: contractMap.size <= 1 ? 'contract-header' : "normal-header",
    },
    {
      field: "vendorPartNo",
      headerName: gridProps?.productfamily,
      // cellRenderer: (props) => Object.keys(props?.data).includes("contract") ? <div>{props?.data?.vendorPartNo}</div>: "",
      valueGetter: ({ data }) => !(data?.id?.includes("Agreement")) ? data.product.find((p) => p.family)?.family ?? "N/A" : "",
      width: gridColumnWidths.productFamily,
    },
    {
      field: "shortDescription",
      headerName: gridProps?.productdescription,
      cellHeight: () => 80,
      cellRenderer: ({ data }) => {
        return !(data?.id?.includes("Agreement")) ?
        <RenewalProductLinesItemInformation
          line={data}
          dataObj={dataObj}
          lineDetailsLabels={compProps.lineItemDetailLabels}
          isLinkDisabled={gridProps.disableProductDetailsLink}
          shopDomainPage={shopDomainPage}
          invokeModal={invokeModal}
        /> : ""
      },
      width: gridColumnWidths.productDescription,
    },
    {
      field: "mfrNumber",
      headerName: gridProps?.vendorPartNo,
      cellRenderer: (props) => !(props?.data?.id?.includes("Agreement")) ? RenewalManufacturer(props) : "",
      width: gridColumnWidths.vendorPartNo,
    },
    {
      field: "unitListPrice",
      headerName: gridProps.listPrice?.replace(
        "{currency-code}",
        data?.currency || ""
      ),
      cellRenderer: (props) => {
        return !(props?.data?.id?.includes("Agreement")) ? Price(props) : ""
      },
      width: gridColumnWidths.listPrice,
    },
    {
      field:'value',
      headerName: gridProps?.percentOffListPrice,
      valueGetter: ({ data }) => data.discounts && data.discounts[0]?.value,
      cellRenderer: (props) => !(props?.data?.id?.includes("Agreement")) ? Price(props) : "",
      width: gridColumnWidths.percentageOfflist,
      valueGetter:'(data.unitListPrice - data.unitPrice) / data.unitListPrice * 100'
    },
    {
      field:'unitPrice',
      headerName: gridProps.unitPrice?.replace(
        "{currency-code}",
        data?.currency || ""
      ),
      suppressKeyboardEvent: (params) => suppressNavigation(params),
      cellRenderer: (props) => {
        const isEditing = isEditingRef.current && data?.canEditResellerPrice;
        return !(props?.data?.id?.includes("Agreement")) ? UnitPriceColumn({...(props), isEditing}) : ""
      },
      width: gridColumnWidths.unitPrice,
    },
    {
      field:'quantity',
      headerName: gridProps?.quantity,
      cellRenderer: (props) => {
        const isEditing = isEditingRef.current && data?.canEditQty;
        return !(props?.data?.id?.includes("Agreement")) ? QuantityColumn({ ...(props), isEditing }) : ""
      },
      width: gridColumnWidths.quantity,
    },
    {
      field:'totalPrice',
      headerName: gridProps.totalPrice?.replace(
        "{currency-code}",
        data?.currency || ""
      ),
      cellRenderer: (props) =>
        !(props?.data?.id?.includes("Agreement")) ? Price(props) : ""
      ,
      valueGetter:'data.quantity * data.unitPrice',
      // Use sum aggFunc to also update subtotal value.
      // Function is triggered on internal grid updates.
      aggFunc: (params, props) => {

        let total = 0;
        params.values.forEach(value => total += value);
        setSubtotal(total);
        return total;
      },
      width: gridColumnWidths.total,
    },
  ];

  const columnDefs = useMemo(() => buildColumnDefinitions(columnDefinitionsOverride),[]);

  /*
    mutableGridData is copied version of response that can be safely mutated,
    original state is preserved in gridData.
  */

  const [mutableGridData, setMutableGridData] = useState(resultArray);

  function invokeModal(modal) {
    setModal(modal);
  }
  const onOrderButtonClicked = () => {
    effects.setCustomState({ key: 'toaster', value: { isOpen: false } });
    setIsPODialogOpen(true);
  }

  const onCloseOrderDialog =(options = {}) => {
    const {isSuccess = false, toaster} = options || {isSuccess : false, toaster:false} ;
    setIsPODialogOpen(false);
    if (!isSuccess) return;
    if(isSuccess){
      setLocalStorageData(TOASTER_LOCAL_STORAGE_KEY,toaster);
      location.href=compProps.quotePreview.renewalsUrl
    }
  }



  const getDefaultCopyValue = (params) => {
    const colId = params?.column?.colId;
    const nodeData = params?.node?.data

    switch (colId) {
      case 'mfrNumber':
        return getRenewalManufacturer(nodeData);
      case "shortDescription":
        return getItemInformation(nodeData);
      default:
        return "";
    }
  }

  const contextMenuItems = (params) => getContextMenuItems(params, compProps.productLines);
  const processCustomClipboardAction = (params) => copyToClipboardAction(params);

  return (
    <div className={multipleFlag ? "cmp-product-lines-grid cmp-renewals-details renewals-has-multiple" :"cmp-product-lines-grid cmp-renewals-details"}>
      <section>
        <Grid
          onAfterGridInit={onAfterGridInit}
          columnDefinition={columnDefs}
          config={gridConfig}
          data={resultArray}
          getDefaultCopyValue={getDefaultCopyValue}
          contextMenuItems={contextMenuItems}
          processCustomClipboardAction={processCustomClipboardAction}
          />
        {/* <AgGridReact
          rowData={mutableGridData}
          columnDefs={columnDefs}

        /> */}
        <GridSubTotal data={data} gridProps={gridProps} subtotal={subtotal} />
        <div className="place-cmp-order-dialog-container">
        <p className="cmp-place-order-actions">
            <Button
              disabled={!isIconEnabled}
              className={computeClassName('cmp-detail-order-button')}
              onClick={onOrderButtonClicked}
              variant="contained"
            >
              { getDictionaryValue("button.common.label.order", "Order") }
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
        onClose={onCloseOrderDialog}
        isDialogOpen={isPODialogOpen}
        orderingFromDashboard={compProps.orderingFromDashboard}
        orderEndpoints={orderEndpoints}
        closeOnBackdropClick={false}
        ToasterDataVerification={({data}) => data ? TransactionNumber(data) : null}
        renewalData={mapRenewalForUpdateDetails(data)}
        store={useRenewalsDetailsStore}
        isDetails={true}
        />
      <Toaster
        onClose={() => closeAndCleanToaster()}
        store={useRenewalsDetailsStore}
        message={{successSubmission:'successSubmission', failedSubmission:'failedSubmission'}}/>
    </div>
  );
}

export default forwardRef(RenewalPreviewGrid);

