import React from "react";
import PropTypes from "prop-types";

const OrderDetailsInfo = ({ infoConfig, orderDetails }) => {




    const {
        shipTo,
        endUser,
        paymentDetails
    } = orderDetails;

    const blindPackagingUsed = shipTo?.blindPackaging;

    const orderStatus = orderDetails?.status && orderDetails?.status === "shipped";


    return (
        <div className="cmp-td-order-details__info-cards">
            <div className="cmp-td-order-details__info-cards__card">
                <div className="cmp-td-order-details__info-cards__card__container">
                    <h4 className="cmp-td-order-details__info-cards__card__container__label">{infoConfig.orderStatusLabel}</h4>
                    <div className="cmp-td-order-details__info-cards__card__container__status-body">

                            {orderStatus ?
                                <div className="cmp-td-order-details__info-cards__card__container__status-body__status-icon">
                                    <i className="fas fa-check"></i>
                                </div>
                                    :
                                <div className="cmp-td-order-details__info-cards__card__container__status-body__status-icon-inprocess">
                                    <i className="fas fa-times"></i>
                                </div>}

                        <div className="cmp-td-order-details__info-cards__card__container__status-body__status-heading">
                            {orderStatus ? infoConfig.orderStatusItemsShipped : infoConfig.orderStatusItemsInProcess}
                        </div>
                        <div
                            className="cmp-td-order-details__info-cards__card__container__status-body__status-description">
                            {orderStatus ? infoConfig.orderStatusItemsShippedDescription : infoConfig.orderStatusItemsInProcessDescription}
                        </div>
                    </div>
                </div>
            </div>
            <div className="cmp-td-order-details__info-cards__card">
                <div className="cmp-td-order-details__info-cards__card__container">
                    <h4 className="cmp-td-order-details__info-cards__card__container__label">{infoConfig.endUserLabel}</h4>
                    <div className="cmp-td-order-details__info-cards__card__container__end-user">
                        <div className="cmp-td-order-details__info-cards__card__container__ship-to__address-name">
                            {endUser.companyName}
                        </div>
                        <div className="cmp-td-order-details__info-cards__card__container__ship-to__address-lines">
                            <p>{endUser.line1}</p>
                            {endUser.line2 ? <p>{endUser.line2}</p> : ""}
                            {endUser.line3 ? <p>{endUser.line3}</p> : ""}
                            <p>{endUser.city} {endUser.state} {endUser.postalCode}</p>
                            <p>{endUser.country}</p>
                        </div>
                        <div className="cmp-td-order-details__info-cards__card__container__ship-to__contact-info-name">
                            {endUser.name}
                        </div>
                        <div
                            className="cmp-td-order-details__info-cards__card__container__ship-to__contact-info-details">
                            <p><i className="fas fa-phone fa-flip-horizontal"></i> {endUser.phoneNumber}</p>
                            <p><i className="fas fa-envelope"></i> {endUser.email}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="cmp-td-order-details__info-cards__card">
                <div className="cmp-td-order-details__info-cards__card__container">
                    <h4 className="cmp-td-order-details__info-cards__card__container__label">{infoConfig.shipToLabel}</h4>
                    <div className="cmp-td-order-details__info-cards__card__container__ship-to">
                        <div className="cmp-td-order-details__info-cards__card__container__ship-to__address-name">
                            {shipTo.companyName}
                        </div>
                        <div className="cmp-td-order-details__info-cards__card__container__ship-to__address-lines">
                            <p>{shipTo.line1}</p>
                            {shipTo.line2 ? <p>{shipTo.line2}</p> : ""}
                            {shipTo.line3 ? <p>{shipTo.line3}</p> : ""}
                            <p>{shipTo.city} {shipTo.state} {shipTo.postalCode}</p>
                            <p>{shipTo.country}</p>
                        </div>
                        <div className="cmp-td-order-details__info-cards__card__container__ship-to__contact-info-name">
                            {shipTo.name}
                        </div>
                        <div
                            className="cmp-td-order-details__info-cards__card__container__ship-to__contact-info-details">
                            <p><i className="fas fa-phone fa-flip-horizontal"></i> {shipTo.phoneNumber}</p>
                            <p><i className="fas fa-envelope"></i> {shipTo.email}</p>
                        </div>
                        <div className="cmp-td-order-details__info-cards__card__container__ship-to__packaging">
                            { blindPackagingUsed ? <p><i className="fas fa-check"></i> {infoConfig.blindPackagingUsed}</p> :
                                <p><i className="fas fa-times"></i> {infoConfig.blindPackagingNotUsed}</p>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="cmp-td-order-details__info-cards__card">
                <div className="cmp-td-order-details__info-cards__card__container">
                    <h4 className="cmp-td-order-details__info-cards__card__container__label">{infoConfig.paymentLabel}</h4>
                    <div className="cmp-td-order-details__info-cards__card__container__payment">
                        <div className="cmp-td-order-details__info-cards__card__container__payment__line-item">
                            <div
                                className="cmp-td-order-details__info-cards__card__container__payment__line-item__left">
                                Subtotal
                            </div>
                            <div
                                className="cmp-td-order-details__info-cards__card__container__payment__line-item__right">
                                {paymentDetails.subTotalFormatted}
                            </div>
                        </div>
                        <div className="cmp-td-order-details__info-cards__card__container__payment__line-item">
                            <div
                                className="cmp-td-order-details__info-cards__card__container__payment__line-item__left">
                                Tax
                            </div>
                            <div
                                className="cmp-td-order-details__info-cards__card__container__payment__line-item__right">
                                {paymentDetails.taxFormatted}
                            </div>
                        </div>
                        <div className="cmp-td-order-details__info-cards__card__container__payment__line-item">
                            <div
                                className="cmp-td-order-details__info-cards__card__container__payment__line-item__left">
                                Freight
                            </div>
                            <div
                                className="cmp-td-order-details__info-cards__card__container__payment__line-item__right">
                                {paymentDetails.freightFormatted}
                            </div>
                        </div>
                        <div className="cmp-td-order-details__info-cards__card__container__payment__total">
                            <div
                                className="cmp-td-order-details__info-cards__card__container__payment__line-item__left">
                                Total
                            </div>
                            <div
                                className="cmp-td-order-details__info-cards__card__container__payment__line-item__right">
                                {paymentDetails.totalFormatted}
                            </div>
                        </div>
                        <div className="cmp-td-order-details__info-cards__card__container__payment__line-item">
                            <div
                                className="cmp-td-order-details__info-cards__card__container__payment__line-item__left">
                                Terms:
                            </div>
                            <div
                                className="cmp-td-order-details__info-cards__card__container__payment__line-item__right">
                                {paymentDetails.terms}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsInfo;

OrderDetailsInfo.propTypes = {
    label: PropTypes.string.isRequired,
    contact: PropTypes.shape({
        name: PropTypes.string,
        companyName: PropTypes.string,
        line1: PropTypes.string,
        line2: PropTypes.string,
        line3: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        postalCode: PropTypes.string,
        country: PropTypes.string,
        email: PropTypes.string,
        phoneNumber: PropTypes.string,
    }),
};
