import React from "react";

function DropdownDownloadList({ data }) {
  const redirectToRenewalDetail = () => {
    const renewalDetailsURL = "content/techdata/testingbranch/shika/renewaldetails.html?wcmmode=disabled"
    // console.log("window", window.location);
    window.location.pathname = renewalDetailsURL
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
