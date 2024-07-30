import React from "react";
import PropTypes from "prop-types";
import { If } from "../../../helpers/If";
import Info from "../../common/quotes/DisplayItemInfo";

const QuoteContactInfo = ({ label, contact }) => {
    const {
        name = "",
        companyName = "",
        line1 = "",
        line2 = "",
        line3 = "",
        city = "",
        state = "",
        postalCode = "",
        country = "",
        email = "",
        phoneNumber = "",
    } = contact || {};
    const street = `${line1 ? line1 : ""}\n ${line2 ? line2 : ""}\n ${
        line3 ? line3 : ""
    }`;
    return (
            <section className='cmp-quote-address-info'>
                <div className='cmp-quote-address-info__title'>{label}</div>
                <div className='cmp-quote-address-info__company-name'>
                    {companyName}
                </div>
                <div className='cmp-quote-address-info__company-info'>
                    <If condition={contact}>
                        <div className='cmp-quote-address-info__company-info--name'>
                            <Info>{name}</Info>
                        </div>
                        <div className='cmp-quote-address-info__company-info--street'>
                            <Info>{street}</Info>
                        </div>
                        <div className='cmp-quote-address-info__company-info--city-state-zip'>
                            <Info>{city}, {state} {postalCode}</Info>
                        </div>
                        <div className='cmp-quote-address-info__company-info--state'>
                            <Info>{country}</Info>
                        </div>
                        <div>
                            <Info label='Email'>{email}</Info>
                        </div>
                        <div>
                            <Info label='Phone'>{phoneNumber}</Info>
                        </div>
                    </If>
                </div>
            </section>
       
    );
};

export default QuoteContactInfo;

QuoteContactInfo.propTypes = {
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
