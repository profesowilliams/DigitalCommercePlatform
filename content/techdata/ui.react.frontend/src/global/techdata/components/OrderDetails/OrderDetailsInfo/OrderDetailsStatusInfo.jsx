import React from "react";
import PropTypes from "prop-types";
import  {orderStatusValues} from "../orderStatus";



const OrderDetailsStatusInfo = ({ infoConfig, orderDetails }) => {
    let orderStatusFontAwesomeIcon="", orderStatusIconClassName="", orderStatusMessage="", orderStatusDescription = "", status = orderDetails?.status;

    switch (status.toLowerCase()) {
        case orderStatusValues.OPEN:
            orderStatusFontAwesomeIcon="fa-check";
            orderStatusMessage=infoConfig.orderStatusItemsOpen;
            orderStatusDescription = infoConfig.orderStatusItemsOpenDescription;
            orderStatusIconClassName = "open";
            break;
        case orderStatusValues.OPEN_IN_PROCESS:
            orderStatusFontAwesomeIcon="fa-check";
            orderStatusMessage=infoConfig.orderStatusItemsInProcess;
            orderStatusDescription = infoConfig.orderStatusItemsInProcessDescription;
            orderStatusIconClassName = "inprocess";
            break;
        case orderStatusValues.CANCELLED:
            orderStatusFontAwesomeIcon="fa-ban";
            orderStatusMessage=infoConfig.orderStatusItemsCancelled;
            orderStatusDescription = infoConfig.orderStatusItemsCancelledDescription;
            orderStatusIconClassName = "cancelled";
            break;
        case orderStatusValues.SALES_REVIEW:
            orderStatusFontAwesomeIcon="fa-exclamation";
            orderStatusMessage=infoConfig.orderStatusItemsInReview;
            orderStatusDescription = infoConfig.orderStatusItemsInReviewDescription;
            orderStatusIconClassName = "inreview";
            break;
        case orderStatusValues.CREDIT_REVIEW:
            orderStatusFontAwesomeIcon="fa-exclamation";
            orderStatusMessage=infoConfig.orderStatusItemsInReview;
            orderStatusDescription = infoConfig.orderStatusItemsInReviewDescription;
            orderStatusIconClassName = "inreview";
            break;
        case orderStatusValues.SHIPPED:
            orderStatusFontAwesomeIcon="fa-check";
            orderStatusMessage=infoConfig.orderStatusItemsShipped;
            orderStatusDescription = infoConfig.orderStatusItemsShippedDescription;
            orderStatusIconClassName = "shipped";
            break;
        default :
            orderStatusFontAwesomeIcon="fa-question";
            orderStatusMessage="Order Status Not Found";
            orderStatusIconClassName = "error";
            break;
    }

    return (
        <div className="cmp-td-order-details__info-cards__card">
            <div className="cmp-td-order-details__info-cards__card__container">
                <h4 className="cmp-td-order-details__info-cards__card__container__label">{infoConfig.orderStatusLabel}</h4>
                <div className="cmp-td-order-details__info-cards__card__container__status-body">
                    <div className={`cmp-td-order-details__info-cards__card__container__status-body__status-icon-${orderStatusIconClassName}`}>
                        <i className={`fas ${orderStatusFontAwesomeIcon}`}></i>
                    </div>
                    <div className="cmp-td-order-details__info-cards__card__container__status-body__status-heading">
                        {orderStatusMessage}
                    </div>
                    <div
                        className="cmp-td-order-details__info-cards__card__container__status-body__status-description">
                        {orderStatusDescription}
                    </div>
                </div>
            </div>
        </div>
    );

};


export default OrderDetailsStatusInfo;

OrderDetailsStatusInfo.propTypes = {
    infoConfig: PropTypes.shape({
        subTotalLabel: PropTypes.string,
        freightLabel: PropTypes.string,
        taxLabel: PropTypes.string,
        otherFeesLabel: PropTypes.string,
        paymentTermsLabel: PropTypes.string,
        paymentTotalLabel: PropTypes.string,
        currencyLabel: PropTypes.string,
        orderStatusLabel: PropTypes.string,
        orderStatusItemsShipped: PropTypes.string,
        orderStatusItemsOpen: PropTypes.string,
        orderStatusItemsInProcess: PropTypes.string,
        orderStatusItemsInReview: PropTypes.string,
        orderStatusItemsCancelled: PropTypes.string,
        orderStatusItemsOpenDescription: PropTypes.string,
        orderStatusItemsCancelledDescription: PropTypes.string,
        orderStatusItemsShippedDescription: PropTypes.string,
        orderStatusItemsInProcessDescription: PropTypes.string,
        orderStatusItemsInReviewDescription: PropTypes.string,
        endUserLabel: PropTypes.string,
        shipToLabel: PropTypes.string,
        blindPackagingUsed: PropTypes.string,
        blindPackagingNotUsed: PropTypes.string,
    }),
};
