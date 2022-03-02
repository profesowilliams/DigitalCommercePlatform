import React, { useState } from "react";
import { generateExcelFileFromPost } from "../../../../../utils/utils";
import Grid from "../../Grid/Grid";
import Modal from "../../Modal/Modal";
import { downloadClicked } from "../../PDFWindow/PDFRenewalWindow";
import columnDefs from "./columnDefinitions";
import RenewalProductLinesItemInformation from "./RenewalProductLinesItemInformation";

function GridHeader({ gridProps, data }) {  
  const downloadPDF = () => {
    downloadClicked(
      data,
      true,
      'logo',
      'link text',
    )
  }
  
  const downloadXLS = () => {
    try {
      generateExcelFileFromPost({
        url: gridProps?.excelFileUrl,
        name: `Renewals quote ${data?.source?.id}.xlsx`,
        id: data?.source?.id,
      });
    } catch (error) {
      console.error("error", error);
    }
  };



  return (
    <div className="cmp-product-lines-grid__header">
      <span className="cmp-product-lines-grid__header__title">
        {gridProps.label}
      </span>
      <div className={`cmp-renewal-preview__download`}>
        <button
          id="pdfDownloadLink"
          onClick={downloadPDF}
        >
          <span>{gridProps?.pdf || "Download PDF"}</span>
        </button>
        <button onClick={downloadXLS}>
          <span>{gridProps?.xls || "Download Excel"}</span>
        </button>
      </div>
    </div>
  );
}

function GridSubTotal({data}) {
  return (
    <div className="cmp-renewal-preview__subtotal">
      <span className="cmp-renewal-preview__subtotal--description">
        Quote SubTotal:
      </span>
      <span className="cmp-renewal-preview__subtotal--value">$ {data?.items?.[0]?.totalPrice}</span>
    </div>
  );
}

function Note() {
  return (
    <p className="note">
      <b>Note: </b>Pricing displayed is subject to vendor price changes and exchange
      rate fluctuations.
    </p>
  );
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
    valueGetter: ({ data }) => data.product.find(p => p.family).family
  };

  columnDefs[2] = {
    ...columnDefs[2],
    cellHeight: () => 80,
    cellRenderer: ({ data }) => <RenewalProductLinesItemInformation
                line={data}
                shopDomainPage={shopDomainPage}
                invokeModal={invokeModal}/>,
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
    <div className="cmp-product-lines-grid">
      <section>
        <GridHeader data={data} gridProps={gridProps} />
        <Grid
          columnDefinition={columnDefs}
          config={gridConfig}
          data={mutableGridData}
        ></Grid>
        <GridSubTotal data={data}/>
        <Note />
      </section>
      {modal && <Modal
          modalAction={modal.action}
          modalContent={modal.content}
          modalProperties={modal.properties}
          modalAction={modal.modalAction}
          actionErrorMessage={modal.errorMessage}
          onModalClosed={() => setModal(null)}
      ></Modal>}
    </div>
  );
}

export default RenewalPreviewGrid;
