import React from "react";
import MyOrderTrackings from "./MyOrderTrackings";

function TrackOrderModal({ data, trackingConfig }) {
  console.log("TrackOrderModal");
  console.log(trackingConfig);
  return (
    <div>
      {data?.trackings?.map((tracking, index) => {
        console.log(tracking);
        return <MyOrderTrackings key={index} tracking={tracking} trackingIcons={trackingConfig.trackingIcons}></MyOrderTrackings>;
      })}
    </div>
  );
}

export default TrackOrderModal;
