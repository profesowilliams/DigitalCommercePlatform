import React, { useState } from "react";
import AgreementInfo from "./AgreementInfo";
import EndUserInfo from "./EndUser/EndUserInfo";
import ResellerInfo from "./Reseller/ResellerInfo";
import Link from "../../Widgets/Link";
import { generateFileFromPost as generateExcelFileFromPost } from "../../../../../utils/utils";
import { fileExtensions, generateFileFromPost } from "../../../../../utils/utils";
import { DownloadIcon } from "../../../../../fluentIcons/FluentIcons";

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

  const downloadPDF = () => {
    try {      
      generateFileFromPost({
        url: gridProps.exportPDFRenewalsEndpoint,
        name: `Renewals Quote ${data?.source?.id}.pdf`,
        postData: {
          Id: data?.source?.id
        },
        fileTypeExtension: fileExtensions.pdf
      })
    } catch (error) {
      console.error("error", error);
    }
    }

    <button onClick={() => setPDFDownloadableOnDemand(true)}>
    <span className="separator">{gridProps.pdf || "Export PDF"}</span>
  </button>

  return (
    <div className="cmp-product-lines-grid__header">
      <span className="cmp-product-lines-grid__header__title">
        {gridProps.lineItemDetailsLabel}
      </span>
      <div className="cmp-renewal-preview__download">
        {
          !gridProps?.productLines?.hideDownloadXLSButton && (
          <button onClick={downloadXLS}>
            <span className="separator">
              {gridProps?.productLines?.downloadXLSLabel || "Export XLS"}
            </span>
          </button>
        )}
        <button onClick={downloadPDF}>
          <span>
            <DownloadIcon className="cmp-renewal-preview__download--icon"/>
            {gridProps?.productLines?.downloadPDFLabel || "Export PDF"}
          </span>
        </button>
        {/* These buttons are going to be added in a near future, so by now i'll left them commented, and also add the 'separator' class to the xls button */}
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

function ConfigGrid({ data, gridProps, updateDetails }) {
  const { reseller, endUser, items, programName, dueDate, endUserType, source, expiry, customerPO, vendorLogo, EANumber } = data;
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
      <div className="header-container">
        <div className="image-container">
          <Link
            variant="back-to-renewal"
            href={quotePreview.renewalsUrl || "#"}
            underline="none"
          >
            <i className="fas fa-chevron-left"></i>
            {quotePreview.renewalsUrlLabel || "Back to all Renewals"}
          </Link>
          <img className="vendorLogo" src={vendorLogo} alt="vendor logo" />
        </div>
        <div className="export-container">
          <span className="quote-preview">
            {gridProps?.quotePreview?.quotePreviewlabel}
          </span>
          <GridHeader data={data} gridProps={gridProps} />
        </div>
      </div>
      <div className="info-container">
        <ResellerInfo
          resellerLabels={quotePreview.reseller}
          reseller={reseller}
          updateDetails={updateDetails}
        />
        <EndUserInfo
          productLines={quotePreview.productLines}
          endUserType={endUserType}
          endUser={{
            ...endUser,
            vendorAccountNumber: EANumber,
            previousEndUserPO: data?.previousEndUserPO,
          }}
          updateDetails={updateDetails}
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
