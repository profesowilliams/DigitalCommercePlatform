
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
      <b>Note:</b>{gridProps?.note?.replace('Note: ', ' ')}
    </div>
    <div className="cmp-renewal-preview__subtotal--price-note">
      <span className="cmp-renewal-preview__subtotal--description">
        {gridProps.quoteSubtotal}
      </span>
      <span className="cmp-renewal-preview__subtotal--value">
        $ {thousandSeparator(data?.price)}
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

  //refactor later as renewals-grid
  columnDefs[6] = {
    ...columnDefs[6],
    cellStyle: {"justify-content": "flex-end"},
    cellRenderer: (props) => Price(props)
  }
  columnDefs[5] = {
    ...columnDefs[5],
    cellStyle: {"justify-content": "flex-end"}
  }
  columnDefs[4] = {
    ...columnDefs[4],
    cellStyle: {"justify-content": "flex-end"},
    cellRenderer: (props) => Price(props)
  }
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
