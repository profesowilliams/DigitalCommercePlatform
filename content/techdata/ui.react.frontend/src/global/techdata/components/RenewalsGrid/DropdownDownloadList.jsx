import React, { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { generateExcelFileFromPost } from "../../../../utils/utils";
import { PDFRenewalDocument } from "../PDFWindow/PDFRenewalWindow";
import { useRenewalGridState } from "./store/RenewalsStore";
import { pushEvent, ANALYTICS_TYPES } from "../../../../utils/dataLayerUtils";

function DropdownDownloadList({ data, aemConfig }) {
  const { detailUrl = "" } = useRenewalGridState((state) => state.aemConfig);
  const { exportXLSRenewalsEndpoint } = aemConfig;
  const [isPDFDownloadableOnDemand, setPDFDownloadableOnDemand] =
    useState(false);

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
      generateExcelFileFromPost({
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

  const openPDF = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const RenewalDocument = () => (
    <PDFRenewalDocument
      reseller={data?.reseller}
      endUser={data?.endUser}
      items={data?.options}
    />
  );

  const DownloadPDF = () =>
    isPDFDownloadableOnDemand ? (
      <PDFDownloadLink document={<RenewalDocument />} fileName={"Renewals.pdf"}>
        {({ blob, url, loading, error }) => {
          loading ? "loading..." : openPDF(url);

          return (
            <button
              onClick={() => pushEvent(ANALYTICS_TYPES.events.click, dataToPush(ANALYTICS_TYPES.name.downloadPDF))}
            >
              <i className="fas fa-file-pdf"></i>
              Download PDF
            </button>
          );
        }}
      </PDFDownloadLink>
    ) : (
      <button
        onClick={() => {
          pushEvent(ANALYTICS_TYPES.events.click, dataToPush(ANALYTICS_TYPES.name.downloadPDF));
          setPDFDownloadableOnDemand(true);
        }}
      >
        <i className="fas fa-file-pdf"></i>
        Download PDF
      </button>
    );

  return (
    <div className="icon-container">
      <DownloadPDF />|
      <button onClick={downloadXLS}>
        <i className="fas fa-file-excel"></i>
        Download XLS
      </button>
      |
      <button onClick={redirectToRenewalDetail}>
        <i className="far fa-eye"></i>
        See details
      </button>
    </div>
  );
}

export default DropdownDownloadList;
