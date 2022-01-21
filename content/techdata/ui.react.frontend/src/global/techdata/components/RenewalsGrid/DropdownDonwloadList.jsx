import React from "react";
import { useRenewalGridState } from "./store/RenewalsStore";

function DropdownDownloadList({ data }) {
  const {detailUrl = ''} = useRenewalGridState(state => state.aemConfig)
  const redirectToRenewalDetail = () => {
    // detailUrl = content/techdata/americas/us/en/dcp/renewals/renewal-details.html?id
    const renewalDetailsURL = encodeURI(`${window.location.origin}${detailUrl}?id=${data.source?.id ?? ''}`)
    window.location.href = renewalDetailsURL 
  };
  return (
    <div className="icon-container">
      <button>
        <i className="fas fa-file-pdf"></i>
        Download PDF
      </button>
      |
      <button>
        <i className="fas fa-file-excel"></i>
        Download Excel
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
