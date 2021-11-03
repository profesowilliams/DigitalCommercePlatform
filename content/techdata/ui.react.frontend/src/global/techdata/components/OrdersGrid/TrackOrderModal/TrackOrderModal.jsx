import React from "react";
import MyOrderTrackings from "./MyOrderTrackings";

export function getTrackingModalTitle(modalTitle, value) {
  let orderNumber = (value.length > 0 ? value[0].orderNumber : "");

  return `${modalTitle} : ${orderNumber}`;
}

function TrackOrderModal({ data, trackingConfig }) {

  return (
    <div>
      <div>{data?.trackings?.length > 1 ? trackingConfig.multipleOrderInformation : ""}</div>
      {data?.trackings?.map((tracking, index) => {
        return <MyOrderTrackings key={index} tracking={tracking} trackingIcons={trackingConfig.trackingIcons}></MyOrderTrackings>;
      })}
    </div>
  );
}

export default TrackOrderModal;
