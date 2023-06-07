import React from "react";
import PropTypes from "prop-types";

const WhiteLabelQuoteContactInfo = ({ label, contact }) => {
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
        <section className='cmp-whitelabelquoteheader-address-info'>
            <div className='cmp-whitelabelquoteheader-address-info__title'>{label}</div>
            <div className='cmp-whitelabelquoteheader-address-info__company-name'>
                {companyName}
            </div>
            <div className='cmp-whitelabelquoteheader-address-info__company-info'>
                <div className='cmp-whitelabelquoteheader-address-info__company-info--name'>
                    {name}
                </div>
                <div className='cmp-whitelabelquoteheader-address-info__company-info--street'>
                    {street}
                </div>
                <div className='cmp-whitelabelquoteheader-address-info__company-info--city-state-zip'>
                    {city}, {state} {postalCode}
                </div>
                <div className='cmp-whitelabelquoteheader-address-info__company-info--state'>
                    {country}
                </div>

                <div>Email: {email}</div>
                <div>Phone: {phoneNumber}</div>
            </div>
        </section>
    );
};

export default WhiteLabelQuoteContactInfo;

WhiteLabelQuoteContactInfo.propTypes = {
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
