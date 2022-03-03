import React from "react";
import { generateExcelFileFromPost } from "../../../../utils/utils";
import { useRenewalGridState } from "./store/RenewalsStore";

function DropdownDownloadList({ data }) {
  const { detailUrl = "" } = useRenewalGridState((state) => state.aemConfig);

  const redirectToRenewalDetail = () => {
    const renewalDetailsURL = encodeURI(
      `${window.location.origin}${detailUrl}.html?id=${data?.source?.id ?? ""}`
    );
    window.location.href = renewalDetailsURL;
  };

  const downloadXLS = () => {
    try {
      generateExcelFileFromPost({
        url: data?.excelApi,
        name: "renewalsQuote.xlsx",
        id: data?.source?.id,
      });
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <div className="icon-container">
      <button onClick={redirectToRenewalDetail}>
        <i className="fas fa-file-pdf"></i>
        Download PDF
      </button>
      |
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
