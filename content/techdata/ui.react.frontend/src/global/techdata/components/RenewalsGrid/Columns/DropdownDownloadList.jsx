import React from "react";
import { fileExtensions, generateFileFromPost } from "../../../../../utils/utils";
import { pushEvent, ANALYTICS_TYPES } from "../../../../../utils/dataLayerUtils";

function DropdownDownloadList({ data, aemConfig }) {
  const { exportXLSRenewalsEndpoint, exportPDFRenewalsEndpoint, detailUrl, productGrid } = aemConfig;


  const dataToPush = (name) => ({
    type: ANALYTICS_TYPES.types.button,
    category: ANALYTICS_TYPES.category.renewalsActionColumn,
    name,
  });
  const redirectToRenewalDetail = () => {
    pushEvent(ANALYTICS_TYPES.events.click, dataToPush(ANALYTICS_TYPES.name.seeDetails));
    const renewalDetailsURL = encodeURI(
      `${window.location.origin}${detailUrl}.html?id=${data?.source?.id ?? ""}`
    );
    window.location.href = renewalDetailsURL;
  };

  const downloadXLS = () => {
    try {
      pushEvent(ANALYTICS_TYPES.events.click, dataToPush(ANALYTICS_TYPES.name.downloadXLS));
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
      pushEvent(ANALYTICS_TYPES.events.click, dataToPush(ANALYTICS_TYPES.name.downloadPDF));
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
        <i className="fas fa-file-pdf"></i>
        Download PDF
      </button>|
      {
        !productGrid?.hideDownloadXLSButton && (
        <>
          <button onClick={downloadXLS}>
            <i className="fas fa-file-excel"></i>
            Download XLS
          </button>
          |
        </>
      )}
      <button onClick={redirectToRenewalDetail}>
        <i className="far fa-eye"></i>
        See details
      </button>
    </div>
  );
}

export default DropdownDownloadList;
