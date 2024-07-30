import React from "react";
import PropTypes from "prop-types";
import OrderDetailsStatusInfo from "./OrderDetailsStatusInfo";
import { thousandSeparator } from "../../../helpers/formatting";


const OrderDetailsInfo = ({ infoConfig, orderDetails }) => {
    const {
        shipTo,
        endUser,
        paymentDetails,
        blindPackagingUsed
    } = orderDetails;

    let endUserInfo = endUser && endUser.length > 0 ?  endUser[0] : undefined;

    return (
        <div className="cmp-td-order-details__info-cards cmp-quote-details--header-container">
            <OrderDetailsStatusInfo
                infoConfig={infoConfig}
                orderDetails={orderDetails}/>
            {endUserInfo ?
                <div className="cmp-td-order-details__info-cards__card">
                    <div className="cmp-td-order-details__info-cards__card__container">
                        <h4 className="cmp-td-order-details__info-cards__card__container__label">{infoConfig.endUserLabel}</h4>
                        <div className="cmp-td-order-details__info-cards__card__container__end-user">
                            <div className="cmp-td-order-details__info-cards__card__container__ship-to__address-name">
                                {endUserInfo.companyName}
                            </div>
                            <div className="cmp-td-order-details__info-cards__card__container__ship-to__address-lines">
                                <p>{endUserInfo.line1}</p>
                                {endUserInfo.line2 ? <p>{endUserInfo.line2}</p> : ""}
                                {endUserInfo.line3 ? <p>{endUserInfo.line3}</p> : ""}
                                <p>{endUserInfo.city} {endUserInfo.state} {endUserInfo.postalCode}</p>
                                <p>{endUserInfo.country}</p>
                            </div>
                            <div className="cmp-td-order-details__info-cards__card__container__ship-to__contact-info-name">
                                {endUserInfo.name}
                            </div>
                            <div
                                className="cmp-td-order-details__info-cards__card__container__ship-to__contact-info-details">
                                <p><i className="fas fa-phone fa-flip-horizontal"></i> {endUserInfo.phoneNumber}</p>
                                <p><i className="fas fa-envelope"></i> {endUserInfo.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="cmp-td-order-details__info-cards__card">
                    <div className="cmp-td-order-details__info-cards__card__container">
                        <h4 className="cmp-td-order-details__info-cards__card__container__label">{infoConfig.endUserLabel}</h4>
                        <div className="cmp-td-order-details__info-cards__card__container__end-user">
                            <div className="cmp-td-order-details__info-cards__card__container__ship-to__address-name">
                                End User Information Not Found
                            </div>
                        </div>
                    </div>
                </div>}
            {shipTo ?
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
                                {blindPackagingUsed ?
                                    <p><i className="fas fa-check"></i> {infoConfig.blindPackagingUsed}</p> :
                                    <p><i className="fas fa-times"></i> {infoConfig.blindPackagingNotUsed}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="cmp-td-order-details__info-cards__card">
                    <div className="cmp-td-order-details__info-cards__card__container">
                        <h4 className="cmp-td-order-details__info-cards__card__container__label">{infoConfig.shipToLabel}</h4>
                        <div className="cmp-td-order-details__info-cards__card__container__ship-to">
                            <div className="cmp-td-order-details__info-cards__card__container__ship-to__address-name">
                                Shipping Information Not Found
                            </div>
                        </div>
                    </div>
                </div>}
            {paymentDetails ?
                <div className="cmp-td-order-details__info-cards__card">
                    <div className="cmp-td-order-details__info-cards__card__container">
                        <h4 className="cmp-td-order-details__info-cards__card__container__label">{infoConfig.paymentLabel}</h4>
                        <div className="cmp-td-order-details__info-cards__card__container__payment">
                                <div className="cmp-td-order-details__info-cards__card__container__payment__line-item">
                                    <div
                                        className="cmp-td-order-details__info-cards__card__container__payment__line-item__left">
                                        {infoConfig.subTotalLabel}
                                    </div>
                                    <div
                                        className="cmp-td-order-details__info-cards__card__container__payment__line-item__right">
                                        {thousandSeparator(paymentDetails.subtotal)}
                                    </div>
                                </div>
                                <div className="cmp-td-order-details__info-cards__card__container__payment__line-item">
                                    <div
                                        className="cmp-td-order-details__info-cards__card__container__payment__line-item__left">
                                        {infoConfig.taxLabel}
                                    </div>
                                    <div
                                        className="cmp-td-order-details__info-cards__card__container__payment__line-item__right">
                                        {thousandSeparator(paymentDetails.tax)}
                                    </div>
                                </div>
                                <div className="cmp-td-order-details__info-cards__card__container__payment__line-item">
                                    <div
                                        className="cmp-td-order-details__info-cards__card__container__payment__line-item__left">
                                        {infoConfig.freightLabel}
                                    </div>
                                    <div
                                        className="cmp-td-order-details__info-cards__card__container__payment__line-item__right">
                                        {thousandSeparator(paymentDetails.freight)}
                                    </div>
                                </div>
                                <div className="cmp-td-order-details__info-cards__card__container__payment__line-item">
                                    <div
                                        className="cmp-td-order-details__info-cards__card__container__payment__line-item__left">
                                        {infoConfig.otherFeesLabel}
                                    </div>
                                    <div
                                        className="cmp-td-order-details__info-cards__card__container__payment__line-item__right">
                                        {thousandSeparator(paymentDetails.otherFees)}
                                    </div>
                                </div>
                                <div className="cmp-td-order-details__info-cards__card__container__payment__total">
                                    <div
                                        className="cmp-td-order-details__info-cards__card__container__payment__line-item__left">
                                        {infoConfig.paymentTotalLabel}
                                    </div>
                                    <div
                                        className="cmp-td-order-details__info-cards__card__container__payment__line-item__right">
                                        {thousandSeparator(paymentDetails.total)}
                                    </div>
                                </div>
                                <div className="cmp-td-order-details__info-cards__card__container__payment__line-item">
                                    <div
                                        className="cmp-td-order-details__info-cards__card__container__payment__line-item__left">
                                        {infoConfig.paymentTermsLabel}
                                    </div>
                                    <div
                                        className="cmp-td-order-details__info-cards__card__container__payment__line-item__right">
                                        {paymentDetails.paymentTermText}
                                    </div>
                                </div>
                                <div className="cmp-td-order-details__info-cards__card__container__payment__line-item">
                                    <div
                                        className="cmp-td-order-details__info-cards__card__container__payment__line-item__left">
                                    </div>
                                    <div
                                        className="cmp-td-order-details__info-cards__card__container__payment__line-item__right">
                                        {infoConfig.currencyLabel} {paymentDetails.currency}
                                    </div>
                                </div>
                        </div>
                    </div>
                </div> :
                <div className="cmp-td-order-details__info-cards__card">
                    <div className="cmp-td-order-details__info-cards__card__container">
                        <h4 className="cmp-td-order-details__info-cards__card__container__label">{infoConfig.paymentLabel}</h4>
                        <div className="cmp-td-order-details__info-cards__card__container__payment">
                            <div className="cmp-td-order-details__info-cards__card__container__payment__line-item">
                                <div className="cmp-td-order-details__info-cards__card__container__payment__line-item__error">
                                    Payment Details Not found
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
        </div>
    );
}


export default OrderDetailsInfo;

OrderDetailsInfo.propTypes = {
    shipTo: PropTypes.shape({
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
    endUser: PropTypes.shape({
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
    paymentDetails: PropTypes.shape({
        currency: PropTypes.string,
        currencySymbol: PropTypes.string,
        terms: PropTypes.string,
        subTotalFormatted: PropTypes.string,
        taxFormatted: PropTypes.string,
        freightFormatted: PropTypes.string,
        totalFormatted: PropTypes.string,
    }),
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
        orderStatusItemsInProcess: PropTypes.string,
        orderStatusItemsInReview: PropTypes.string,
        orderStatusItemsShippedDescription: PropTypes.string,
        orderStatusItemsInProcessDescription: PropTypes.string,
        orderStatusItemsInReviewDescription: PropTypes.string,
        endUserLabel: PropTypes.string,
        shipToLabel: PropTypes.string,
        blindPackagingUsed: PropTypes.string,
        blindPackagingNotUsed: PropTypes.string,
    }),
};
