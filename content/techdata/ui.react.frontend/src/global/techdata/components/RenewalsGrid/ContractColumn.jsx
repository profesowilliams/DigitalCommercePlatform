import React from "react";
import Info from "../common/quotes/DisplayItemInfo";

function ContractColumn({ data }) {
  const renewed = data?.renewedDuration;
  return (
    <>{data ? (
      <>
        <div className="cmp-renewal-duration">
          <Info label="Renewal">{renewed ? (renewed + ",") : "" } {data?.support}</Info>          
          <i className="fas fa-caret-down" style={{ color: "#21314D", cursor: "pointer", fontSize:"1.2rem" }}/>
        </div>
      </>
    ) : ""}</>
  );
}

export default ContractColumn;
