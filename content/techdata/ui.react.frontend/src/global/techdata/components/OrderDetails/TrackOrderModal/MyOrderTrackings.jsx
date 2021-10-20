import React from "react";

function MyOrderTrackings({ tracking }) {
  return (
    <div className="cmp-track-my-order-modal__line">
      <div className="cmp-show-more">
        <div className="cmp-show-more__label">
          <span className="icon">
            <i className="fas fa-chevron-right"></i>
          </span>
        </div>
      </div>
      <div className="cmp-track-details-info__line__logo">
        {tracking.carrier}
      </div>
      <div className="id ongoing">
        <a href={tracking.trackingLink}>{tracking.trackingNumber ?? "Pending"}</a>
      </div>
      <div className="cmp-track-details-info__line__status">
        {tracking.status}
      </div>
    </div>
  );
}
export default MyOrderTrackings;
