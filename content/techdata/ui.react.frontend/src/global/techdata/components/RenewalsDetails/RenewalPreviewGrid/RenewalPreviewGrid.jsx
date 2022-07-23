
import React, { useState } from "react";
import Grid from "../../Grid/Grid";
import Modal from "../../Modal/Modal";
import columnDefs from "./columnDefinitions";
import RenewalProductLinesItemInformation from "./RenewalProductLinesItemInformation";
import RenewalManufacturer from "./RenewalManufacturer";
import { thousandSeparator } from "../../../helpers/formatting";


function GridSubTotal({ data, gridProps }) {
  return (
    <div className="cmp-renewal-preview__subtotal">
      <div className="cmp-renewal-preview__subtotal--note">
        <b>Note:</b>
        {gridProps?.note?.replace('Note: ', '')}
      </div>
      <div className="cmp-renewal-preview__subtotal--price-note">
        <b className="cmp-renewal-preview__subtotal--description">
          {gridProps.quoteSubtotal}
        </b>
        <span className="cmp-renewal-preview__subtotal--value">
          <span>{thousandSeparator(data?.price)}</span>
          <span className="cmp-renewal-preview__subtotal--currency">
            {gridProps.quoteSubtotalCurrency.replace(
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

function RenewalPreviewGrid({ data, gridProps, shopDomainPage }) {
  const [modal, setModal] = useState(null);
  const gridData = data.items ?? [];
  const gridConfig = {
    ...gridProps,
    serverSide: false,
    paginationStyle: "none",
  };

  const replaceCurrencyLabel = (label) => {
    return label.replace('{currency-code}', data?.currency || '');
  }
  
  columnDefs[1] = {
    ...columnDefs[1],
    valueGetter: ({ data }) =>
      data.product.find((p) => p.family)?.family ?? "N/A",
  };

  columnDefs[2] = {
    ...columnDefs[2],
    cellHeight: () => 80,
    cellRenderer: ({ data }) => (
      <RenewalProductLinesItemInformation
        line={data}
        shopDomainPage={shopDomainPage}
        invokeModal={invokeModal}
      />
    ),
  };

  columnDefs[4] = {
    ...columnDefs[4],
    cellStyle: { "justify-content": "flex-end" },
    cellRenderer: (props) => Price(props),
    headerValueGetter: () => replaceCurrencyLabel(gridProps.listPrice)
  };

  columnDefs[5] = {
    ...columnDefs[5],
    valueGetter: ({ data }) =>
      data.discounts && data.discounts[0]?.value,
    cellStyle: {"justify-content": "flex-end"},
  };

  //refactor later as renewals-grid
  columnDefs[8] = {
    ...columnDefs[8],
    cellStyle: { "justify-content": "flex-end" },
    cellRenderer: (props) => Price(props),
    headerValueGetter: () => replaceCurrencyLabel(gridProps.totalPrice)
  };
  columnDefs[7] = {
    ...columnDefs[7],
    cellStyle: {"justify-content": "flex-end"}
  }
  columnDefs[6] = {
    ...columnDefs[6],
    cellStyle: { "justify-content": "flex-end" },
    cellRenderer: (props) => Price(props),
    headerValueGetter: () => replaceCurrencyLabel(gridProps.unitPrice)
  };
  columnDefs[3] = {
    ...columnDefs[3],
    cellRenderer: (props) => RenewalManufacturer(props)
  }

  /*
    mutableGridData is copied version of response that can be safely mutated,
    original state is preserved in gridData.
  */
  const mutableGridData = JSON.parse(JSON.stringify(gridData));

  function invokeModal(modal) {
    setModal(modal);
  }

  return (
    <div className="cmp-product-lines-grid">
      <section>
        <Grid
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
