import React from "react";
import PropTypes from "prop-types";
import { getUrlParams } from "../../../../utils";

const QuotesSubHeader = ({ label, title }) => {
    const urlParams = getUrlParams();
    const getQuoteId = ({ id }) => id;

    return (
        <div className='cmp-td-quote-subheader'>
            <div className='cmp-td-quote-subheader__sub-title'>
                {urlParams.hasOwnProperty("id") ? (
                    <>
                        <span>{label}</span> {getQuoteId(urlParams)}
                    </>
                ) : (
                    <>
                        <span>{label}</span> {title}
                    </>
                )}
            </div>
        </div>
    );
};

export default QuotesSubHeader;

QuotesSubHeader.propTypes = {
    label: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};
