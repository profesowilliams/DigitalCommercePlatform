
import React, { useState, useEffect, useRef } from "react";
import Grid from "../../Grid/Grid";
import Modal from "../../Modal/Modal";
import columnDefs from "./columnDefinitions";
import RenewalProductLinesItemInformation from "./RenewalProductLinesItemInformation";
import RenewalManufacturer from "./RenewalManufacturer";
import { thousandSeparator } from "../../../helpers/formatting";
import QuantityColumn from "../Columns/QuantityColumn.jsx";

function GridSubTotal({ data, gridProps }) {
  return (
    <div className="cmp-renewal-preview__subtotal">
      <div className="cmp-renewal-preview__subtotal--note">
        <b>Note: </b>
        {gridProps?.note?.replace('Note: ', '')}
      </div>
      <div className="cmp-renewal-preview__subtotal--price-note">
        <b className="cmp-renewal-preview__subtotal--description">
          {gridProps.quoteSubtotal}
        </b>
        <span className="cmp-renewal-preview__subtotal--value">
          <span>{thousandSeparator(data?.price)}</span>
          <span className="cmp-renewal-preview__subtotal--currency">
            {gridProps.quoteSubtotalCurrency?.replace(
              '{currency-code}',
              data?.currency || ''
            )}
          </span>
        </span>
      </div>
    </div>
  );
}

function Price({ value }) {
  return <div className="price">{thousandSeparator(value)}</div>;
}

function RenewalPreviewGrid({ data, gridProps, shopDomainPage, isEditing }) {
  const [modal, setModal] = useState(null);
  const gridData = data.items ?? [];
  const gridConfig = {
    ...gridProps,
    serverSide: false,
    paginationStyle: "none",
  };

  // Keep track of isEditing on rerenders, will be used by quantity cell on redraw
  const isEditingRef = useRef(isEditing);

  // Get gridApi
  const [gridApi, setGridApi] = useState(null);
  function onAfterGridInit({ api }) {
    setGridApi(api);
  }

  // On isEditing prop change, update ref and refresh the cell
  useEffect(() => {
    isEditingRef.current = isEditing;
    if(gridApi) {
      gridApi.refreshCells({
        columns: ["quantity"],
        force: true,
      });
    }
  }, [isEditing])

  columnDefs[0] = {
    ...columnDefs[0],
    headerName: gridProps?.line
  };

  columnDefs[1] = {
    ...columnDefs[1],
    headerName: gridProps?.productfamily,
    valueGetter: ({ data }) =>
      data.product.find((p) => p.family)?.family ?? "N/A",
  };

  columnDefs[2] = {
    ...columnDefs[2],
    headerName: gridProps?.productdescription,
    cellHeight: () => 80,
    cellRenderer: ({ data }) => (
      <RenewalProductLinesItemInformation
        line={data}
        isLink={gridProps.productDescriptionIsLink}
        shopDomainPage={shopDomainPage}
        invokeModal={invokeModal}
      />
    ),
  };

  columnDefs[3] = {
    ...columnDefs[3],
    headerName: gridProps?.vendorPartNo,
    cellRenderer: (props) => RenewalManufacturer(props)
  }

  columnDefs[4] = {
    ...columnDefs[4],
    headerName: gridProps.listPrice?.replace('{currency-code}', data?.currency || ''),
    cellRenderer: (props) => Price(props)
  };

  columnDefs[5] = {
    ...columnDefs[5],
    headerName: gridProps?.percentOffListPrice,
    valueGetter: ({ data }) => data.discounts && data.discounts[0]?.value,
    cellRenderer: (props) => Price(props)
  };

  columnDefs[6] = {
    ...columnDefs[6],    
    headerName: gridProps.unitPrice?.replace('{currency-code}', data?.currency || ''),
    cellRenderer: (props) => Price(props)
  };

  // Pass isEditingRef value to quantity column for rendering
  columnDefs[7] = {
    ...columnDefs[7],
    headerName: gridProps?.quantity,
    cellRenderer: (props) => QuantityColumn({ ...props, isEditing: isEditingRef.current }),
  };

  //refactor later as renewals-grid  
  columnDefs[8] = {
    ...columnDefs[8],
    headerName: gridProps.totalPrice?.replace('{currency-code}', data?.currency || ''),
    cellRenderer: (props) => Price(props)
  };

  /*
    mutableGridData is copied version of response that can be safely mutated,
    original state is preserved in gridData.
  */
  const mutableGridData = JSON.parse(JSON.stringify(gridData));

  function invokeModal(modal) {
    setModal(modal);
  }

  return (
    <div className="cmp-product-lines-grid cmp-renewals-details">
      <section>
        <Grid
          onAfterGridInit={onAfterGridInit}
          columnDefinition={columnDefs}
          config={gridConfig}
          data={mutableGridData}
        />
        <GridSubTotal data={data} gridProps={gridProps} />
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
    </div>
  );
}

export default RenewalPreviewGrid;
