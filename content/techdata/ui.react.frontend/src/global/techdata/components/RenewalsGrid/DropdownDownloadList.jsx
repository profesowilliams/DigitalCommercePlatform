import React, { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { generateExcelFileFromPost } from "../../../../utils/utils";
import { PDFRenewalDocument } from "../PDFWindow/PDFRenewalWindow";
import { useRenewalGridState } from "./store/RenewalsStore";
import { pushEvent } from "../../../../utils/dataLayerUtils";

function DropdownDownloadList({ data, aemConfig }) {
  const { detailUrl = "" } = useRenewalGridState((state) => state.aemConfig);
  const { exportXLSRenewalsEndpoint } = aemConfig;
  const [isPDFDownloadableOnDemand, setPDFDownloadableOnDemand] =
    useState(false);

  const dataToPush = (name) => ({
    type: "button",
    category: "Renewals Action Column",
    name,
  });
  const redirectToRenewalDetail = () => {
    pushEvent("click", dataToPush("see details"));
    const renewalDetailsURL = encodeURI(
      `${window.location.origin}${detailUrl}.html?id=${data?.source?.id ?? ""}`
    );
    window.location.href = renewalDetailsURL;
  };

  const downloadXLS = () => {
    try {
      pushEvent("click", dataToPush("download XLS"));
      generateExcelFileFromPost({
        url: exportXLSRenewalsEndpoint,
        name: "renewalsQuote.xlsx",
        id: data?.source?.id,
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
              onClick={() => pushEvent("click", dataToPush("download PDF"))}
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
          pushEvent("click", dataToPush("download PDF"));
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
