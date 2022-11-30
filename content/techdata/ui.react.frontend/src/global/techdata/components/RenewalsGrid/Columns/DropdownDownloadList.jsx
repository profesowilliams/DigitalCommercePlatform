import React from "react";
import { fileExtensions, generateFileFromPost, getDictionaryValue } from "../../../../../utils/utils";
import { pushEvent, ANALYTICS_TYPES } from "../../../../../utils/dataLayerUtils";
import { redirectToRenewalDetail, analyticsColumnDataToPush } from "../renewalUtils";
import { DocumentExcelIcon, DocumentPdfIcon, DownloadIcon, EyeIcon } from "../../../../../fluentIcons/FluentIcons";

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
      {productGrid?.showDownloadPDFButton && (
        <>
          <button onClick={downloadPDF}>
            <DownloadIcon className="cmp-svg-icon__charcoal" />
              { getDictionaryValue("button.common.label.downloadPDF", "Download PDF")}
          </button>
          |
        </>
      )}

      {productGrid?.showDownloadXLSButton && (
        <>
          <button onClick={downloadXLS}>
            <DownloadIcon className="cmp-svg-icon__charcoal"/>
            { getDictionaryValue("button.common.label.downloadXLS", "Download XLS")}
          </button>
          |
        </>
      )}
      <button onClick={() => redirectToRenewalDetail(detailUrl, data?.source?.id)}>
        <EyeIcon />
        { getDictionaryValue("button.common.label.seeDetails", "See details")}
      </button>
    </div>
  );
}

export default DropdownDownloadList;
