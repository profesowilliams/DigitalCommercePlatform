import React from "react";
import { fileExtensions, generateFileFromPost } from "../../../../../utils/utils";
import { pushEvent, ANALYTICS_TYPES } from "../../../../../utils/dataLayerUtils";
import { redirectToRenewalDetail, analyticsColumnDataToPush } from "../renewalUtils";
import { DocumentExcelIcon, DocumentPdfIcon, EyeIcon } from "../../../../../fluentIcons/FluentIcons";

function DropdownDownloadList({ data, aemConfig }) {
  const { exportXLSRenewalsEndpoint, exportPDFRenewalsEndpoint, detailUrl, productGrid } = aemConfig;

  const downloadXLS = () => {
    try {
      pushEvent(ANALYTICS_TYPES.events.click, analyticsColumnDataToPush(ANALYTICS_TYPES.name.downloadXLS));
      generateFileFromPost({
        url: exportXLSRenewalsEndpoint,
        name: `Renewals Quote ${data?.source?.id}.xlsx`,
        postData: {
          Id: data?.source?.id
        }
      });
    } catch (error) {
      console.error("error", error);
    }
  };

  const downloadPDF = () => {
    try {      
      pushEvent(ANALYTICS_TYPES.events.click, analyticsColumnDataToPush(ANALYTICS_TYPES.name.downloadPDF));
      generateFileFromPost({
        url: exportPDFRenewalsEndpoint,
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

  return (
    <div className="icon-container">
       <button
        onClick={downloadPDF}
      >
        <DocumentPdfIcon />
        Download PDF
      </button>|
      {
        productGrid?.showDownloadXLSButton && (
        <>
          <button onClick={downloadXLS}>
            <DocumentExcelIcon />
            Download XLS
          </button>
          |
        </>
      )}
      <button onClick={() => redirectToRenewalDetail(detailUrl, data?.source?.id)}>
        <EyeIcon />
        See details
      </button>
    </div>
  );
}

export default DropdownDownloadList;
