import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from '../../../../utils/api';

const MyQuotes = ({ componentProp }) => {
    const [myQuotesDetails, setMyQuotes] = useState({});
    const {
        label,
        labelConverted,
        labelOpen,
        labelQuoteToOrder,
        labelActiveQuoteValue,
        uiServiceEndPoint
    } = JSON.parse(componentProp);
    useEffect(async () => {
        const body = { code: localStorage.getItem("signInCode") };
        const { data: { content: { items } } } = await get(uiServiceEndPoint, { params: body });
        console.log('items: ', items);
        setMyQuotes(items)
    }, [])
    const {
        converted,
        open,
        quoteToOrder,
        formattedAmount,
        currencySign
    } = myQuotesDetails;
    return (
        <section id="cmp-quotes">
            <div className="cmp-quotes">
                <div className="cmp-quotes__title">{label}</div>
                <div className="cmp-quotes__all-myQuotes">
                <div className="cmp-quotes__sub-title">
                        {labelConverted}
                    <div className="cmp-quotes__sub-title--digits">{converted}</div>
                </div>
                <div className="cmp-quotes__sub-title">
                        {labelOpen}
                    <div className="cmp-quotes__sub-title--digits">{open}</div>
                </div>
                <div className="cmp-quotes__sub-title">
                        {labelQuoteToOrder}
                    <div className="cmp-quotes__sub-title--digits">{quoteToOrder}</div>
                </div>
                </div>
            </div>
            <div className="cmp-quotes">
                <div className="cmp-quotes__active-value">
                    <div className="cmp-quotes__active-value--price">{currencySign}{formattedAmount}</div>
                    <div className="cmp-quotes__active-value--title">{labelActiveQuoteValue}</div>
                </div>
            </div>
        </section>
    )
}

export default MyQuotes;

MyQuotes.propTypes = {
    componentProp: PropTypes.shape({
        label: PropTypes.string.isRequired,
        labelConverted: PropTypes.string.isRequired,
        labelOpen: PropTypes.string.isRequired,
        labelQuoteToOrder: PropTypes.string.isRequired,
        labelActiveQuoteValue: PropTypes.string.isRequired,
        uiServiceEndPoint: PropTypes.string.isRequired
    })
};