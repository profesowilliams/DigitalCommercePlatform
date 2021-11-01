import React from "react";

function MyOrderTrackings({ tracking, trackingIcons }) {

    const getIcon = (carrier) => {
        let iconFound = undefined;
        iconFound = trackingIcons.find(trackingIconItem => {
            return trackingIconItem.carrier == carrier;
        })


        return iconFound ? (iconFound.logoPath ? iconFound.logoPath : "") : "" ;
    }

  return (
    <div className="cmp-track-my-order-modal__line">
      <div className="cmp-track-my-order-modal__line__show-more">
        <div className="cmp-track-my-order-modal__line__show-more__label">
          <span className="cmp-track-my-order-modal__line__show-more__label__icon">
            <i className="fas fa-chevron-right"></i>
          </span>
        </div>
      </div>
      <div className="cmp-track-my-order-modal__line__logo">
        {getIcon(tracking.carrier) ?
        <img src={getIcon(tracking.carrier)} />
            : tracking.carrier}
      </div>
      <div className="cmp-track-my-order-modal__line__tracking-number">
        <a href={tracking.trackingLink}>{tracking.trackingNumber ?? "Pending"}</a>
      </div>
    </div>
  );
}
export default MyOrderTrackings;
