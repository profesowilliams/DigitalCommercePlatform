import React from "react";

function DropdownDownloadList({ data }) {
  const redirectToRenewalDetail = () => {
    const renewalDetailsURL = encodeURI(`${window.location.origin}${window.location.pathname.replace('.html', `/RenewalsPreview.html?id=${data?.reseller?.id}`)}`)
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
