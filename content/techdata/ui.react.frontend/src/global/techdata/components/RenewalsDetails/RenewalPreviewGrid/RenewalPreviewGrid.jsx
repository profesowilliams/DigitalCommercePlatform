
import React, { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { generateExcelFileFromPost } from "../../../../../utils/utils";
import Grid from "../../Grid/Grid";
import Modal from "../../Modal/Modal";
import {
  PDFRenewalDocument,
} from "../../PDFWindow/PDFRenewalWindow";
import columnDefs from "./columnDefinitions";
import RenewalProductLinesItemInformation from "./RenewalProductLinesItemInformation";
import RenewalManufacturer from "./RenewalManufacturer";
import { thousandSeparator } from "../../../helpers/formatting";

function GridHeader({ gridProps, data }) {
  const [isPDFDownloadableOnDemand, setPDFDownloadableOnDemand] =
    useState(false);

  const downloadXLS = () => {
    try {
      generateExcelFileFromPost({
        url: gridProps?.excelFileUrl,
        name: `Renewals quote ${data?.source?.id}.xlsx`,
        postData: {
          Id: data?.source?.id
        },
      });
    } catch (error) {
      console.error("error", error);
    }
  };

  const openPDF = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const RenewalDocument = () => (
    <PDFRenewalDocument
      reseller={data?.reseller}
      endUser={data?.endUser}
      items={data?.items}
    />
  );

  const DownloadPDF = () =>
    isPDFDownloadableOnDemand ? (
      <PDFDownloadLink document={<RenewalDocument />} fileName={"Renewals.pdf"}>
        {({ blob, url, loading, error }) => {
          loading ? "loading..." : openPDF(url);

          return (
            <button>
              <span>
                <i className="fas fa-file-pdf"></i>
                {gridProps.pdf || "Download PDF"}
              </span>
            </button>
          );
        }}
      </PDFDownloadLink>
    ) : (
      <button onClick={() => setPDFDownloadableOnDemand(true)}>
        <span>
          <i className="fas fa-file-pdf"></i>
          {gridProps.pdf || "Download PDF"}
        </span>
      </button>
    );

  return (
    <div className="cmp-product-lines-grid__header">
      <span className="cmp-product-lines-grid__header__title">
        {gridProps.label}
      </span>
      <div className={`cmp-renewal-preview__download`}>
        <DownloadPDF />
        <button onClick={downloadXLS}>
          <span>
            <i class="fas fa-file-excel"></i>
            {gridProps?.xls || "Download XLS"}
          </span>
        </button>
      </div>
    </div>
  );
}

function GridSubTotal({ data }) {
  return (
    <div className="cmp-renewal-preview__subtotal">
      <span className="cmp-renewal-preview__subtotal--description">
        Quote SubTotal:
      </span>
      <span className="cmp-renewal-preview__subtotal--value">
        $ {thousandSeparator(data?.price)}
      </span>
    </div>
  );
}

function Note() {
  return (
    <p className="note">
      <b>Note: </b>Pricing displayed is subject to vendor price changes and
      exchange rate fluctuations.
    </p>
  );
}

function Price({value}){
  return (
    <div className="price">
      {value}
      </div>
  )
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
    cellRenderer: (props) => Price(props)
  }
  columnDefs[4] = {
    ...columnDefs[4],
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
        <GridHeader data={data} gridProps={gridProps} />
        <Grid
          columnDefinition={columnDefs}
          config={gridConfig}
          data={mutableGridData}
        ></Grid>
        <GridSubTotal data={data} />
        <Note />
      </section>
      {modal && (
        <Modal
          modalAction={modal.action}
          modalContent={modal.content}
          modalProperties={modal.properties}
          modalAction={modal.modalAction}
          actionErrorMessage={modal.errorMessage}
          onModalClosed={() => setModal(null)}
        ></Modal>
      )}
    </div>
  );
}

export default RenewalPreviewGrid;
