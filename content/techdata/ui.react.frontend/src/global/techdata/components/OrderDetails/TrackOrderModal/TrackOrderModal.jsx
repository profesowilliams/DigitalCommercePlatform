import React from "react";
import MyOrderTrackings from "./MyOrderTrackings";

function TrackOrderModal({ data }) {
  return (
    <div>
      {data?.trackings?.map((tracking, index) => {
        return <MyOrderTrackings key={index} tracking={tracking}></MyOrderTrackings>;
      })}
    </div>
  );
}

export default TrackOrderModal;
