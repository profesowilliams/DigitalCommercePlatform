import React from "react";

function ContractColumn({ data }) {
  return (
    <>
      {data?.items
        ? `Renewal: ${data?.items[0]?.contract?.renewedDuration}, ${data?.items[0]?.contract?.serviceLevel} `
        : ""}
    </>
  );
}

export default ContractColumn;
