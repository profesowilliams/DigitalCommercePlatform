import React from "react";
import MyOrderTrackings from "./MyOrderTrackings";

export function getTrackingModalTitle(modalTitle, value) {
  let orderNumber = (value.length > 0 ? value[0].orderNumber : "");

  return `${modalTitle} : ${orderNumber}`;
}

const TrackOrderHeader = ({data, trackingConfig}) => {
  return(
    <div>
      {data?.trackings?.length > 1 ? trackingConfig.multipleOrderInformation : ""}
    </div>
  );
}

function TrackOrderModal({ data, trackingConfig, pendingInfo, showMoreFlag }) {
  return (
    <div style={{maxWidth: '31.25rem'}} >
      <TrackOrderHeader data={data} trackingConfig={trackingConfig} />
      {data?.trackings?.map((tracking, index) => {
        return (<MyOrderTrackings 
            key={index}
            tracking={tracking}
            trackingIcons={trackingConfig.trackingIcons}
            pendingInfo={pendingInfo}
            showMoreFlag={showMoreFlag}
          ></MyOrderTrackings>);
      })}
    </div>
  );
}

export default TrackOrderModal;
