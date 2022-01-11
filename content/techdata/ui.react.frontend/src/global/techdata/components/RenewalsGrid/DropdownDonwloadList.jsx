import React from "react";

function DropdownDownloadList({ data }) {
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
      <button>
        <i className="far fa-eye"></i>
        See details
      </button>
    </div>
  );
}

export default DropdownDownloadList;
