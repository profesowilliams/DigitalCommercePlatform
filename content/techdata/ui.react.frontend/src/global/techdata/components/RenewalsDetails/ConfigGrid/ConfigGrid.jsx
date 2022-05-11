import React, { useState } from "react";
import AgreementInfo from "./AgreementInfo";
import EndUserInfo from "./EndUserInfo";
import ResellerInfo from "./ResellerInfo";
import { generateExcelFileFromPost } from "../../../../../utils/utils";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  PDFRenewalDocument, openPDF
} from "../../PDFWindow/PDFRenewalWindow";

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

  const DownloadPDF = () =>
    isPDFDownloadableOnDemand ? (
      <PDFDownloadLink
        document={
          <PDFRenewalDocument
            reseller={data?.reseller}
            endUser={data?.endUser}
            items={data?.items}
          />
        }
        fileName={"Renewals.pdf"}
      >
        {({ blob, url, loading, error }) => {
          loading ? "loading..." : openPDF(url);

          return (
            <button>
              <span className="separator">{gridProps.pdf || "Export PDF"}</span>
            </button>
          );
        }}
      </PDFDownloadLink>
    ) : (
      <button onClick={() => setPDFDownloadableOnDemand(true)}>
        <span className="separator">{gridProps.pdf || "Export PDF"}</span>
      </button>
    );

  return (
    <div className="cmp-product-lines-grid__header">
      <span className="cmp-product-lines-grid__header__title">
        {gridProps.lineItemDetailsLabel}
      </span>
      <div className="cmp-renewal-preview__download">
        <DownloadPDF />
        <button onClick={downloadXLS}>
          <span className="separator">
            {gridProps?.xls
              ? `Export ${gridProps?.menuExcelExport}`
              : "Export XLS"}
          </span>
        </button>
        {/* These buttons are going to be added in a near future, so by now i'll left them commented */}
        {/* <button>
          <span className="separator">Copy</span>
        </button>
        <button>
          <span>
          Share
          </span>
        </button> */}
      </div>
    </div>
  );
}

function ConfigGrid({ data, gridProps }) {
  const { reseller, endUser, items, programName, dueDate, endUserType, source, expiry, customerPO, vendorLogo } = data;
  const { quotePreview } = gridProps;
  Object.keys(quotePreview).forEach(key => {
    if (typeof quotePreview[key] === 'string') {
      quotePreview[key] = quotePreview[key].replace(/ No:/g,' \u2116:');
    } else if (typeof  quotePreview[key] === 'object') {
      Object.keys(quotePreview[key]).forEach(subkey => {
          quotePreview[key][subkey] = quotePreview[key][subkey].replace(/ No:/g,' \u2116:');
        });
    }
    
  });
  
  return (
    <div className="cmp-renewals-qp__config-grid">
      <div className="image-container">
        <img className="vendorLogo" src={vendorLogo} alt="vendor logo"/>
      </div>
      <div className="export-container">
        <span className="quote-preview">Quote Preview</span>
        <GridHeader data={data} gridProps={gridProps}/>
      </div>
      <div className="info-container">
        <ResellerInfo
          resellerLabels={quotePreview.reseller}
          reseller={reseller}
        />
        <EndUserInfo
          productLines={quotePreview.productLines}
          endUserType={endUserType}
          endUser={{...endUser, vendorAccountNumber: reseller?.vendorAccountNumber}}
        />
        <AgreementInfo
          source={source}
          programName={programName}
          dueDate={dueDate}
          agreementInfo={quotePreview.agreementInfo}
          contract={items[0].contract}
          expiry={expiry}
          customerPO={customerPO}
        />
      </div>
    </div>
  );
}

export default ConfigGrid;
