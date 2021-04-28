import React from 'react';
import PropTypes from 'prop-types';
import { getUrlParams } from '../../../../utils';

const QuotesSubHeader = ({ componentProp }) => {
    const {
        label, 
        title
    } = JSON.parse(componentProp)
    const urlParams = getUrlParams();
    const getQuoteId = ({ tdQuoteId }) => tdQuoteId; 

    return (
        <div class="cmp-td-quote-subheader">
            <div class="cmp-td-quote-subheader__sub-title">
            {urlParams.hasOwnProperty('tdQuoteId') 
            ?   <><span>{label}</span> {getQuoteId(urlParams)}</>
            :   <><span>{label}</span> {title}</>
            }
            </div>
        </div>
    )
}

export default QuotesSubHeader;

QuotesSubHeader.propTypes = {
    componentProp: PropTypes.string.isRequired,
};