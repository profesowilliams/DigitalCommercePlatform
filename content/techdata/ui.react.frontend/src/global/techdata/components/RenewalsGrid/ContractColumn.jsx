import React from "react";

function ContractColumn({ data }) {
  return (
    <>{data ? (
      <>
        Renewal: {data?.renewedDuration}, {data?.support}
        <i className="fas fa-caret-down" style={{ color: "#21314D" }}/>
      </>
    ) : ""}</>
  );
}

export default ContractColumn;
