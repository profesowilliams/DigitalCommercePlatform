import React from "react";

function ContractColumn({ data }) {
  return (
    <>{data ? `Renewal: ${data?.renewedDuration}, ${data?.support} ` : ""}</>
  );
}

export default ContractColumn;
