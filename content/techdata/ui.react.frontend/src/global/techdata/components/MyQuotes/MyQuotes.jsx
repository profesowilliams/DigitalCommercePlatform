import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from '../../../../utils/api';
import {useStore} from "../../../../utils/useStore"
import { removeStringDecimals } from '../../helpers/formatting';
import {isExtraReloadDisabled} from "../../../../utils/featureFlagUtils"

const Pill = ({type, msg}) => {
    return <span className={`pill ${type}`}>{msg}</span>
}

const NoData = ({type = "error", msg = 'N/A'}) => {
    return <Pill type={type} msg={msg}/>;
}

const MyQuotes = ({ componentProp }) => {
    const [myQuotesDetails, setMyQuotes] = useState({});
    const isLoggedIn = useStore(state => state.isLoggedIn)
    const {
        label,
        labelConverted,
        labelOpen,
        labelQuoteToOrder,
        labelActiveQuoteValue,
        daysLabel,
        uiServiceEndPoint
    } = JSON.parse(componentProp);
    const {
        converted,
        open,
        quoteToOrder,
        formattedAmount,
        currencySymbol
    } = myQuotesDetails;
    useEffect(() => {
        (async function(){
            const body = { code: localStorage.getItem("signInCode") };
            const { data: { content: { items } } } = await get(uiServiceEndPoint, { params: body });
            if((isExtraReloadDisabled() && isLoggedIn) || !isExtraReloadDisabled()){
                setMyQuotes(items)
            }
        })()
    }, [isExtraReloadDisabled() && isLoggedIn])
  
    return (
        <section id="cmp-quotes">
            <div className="cmp-quotes">
                <div className="cmp-quotes__title">
                    <span>{label}</span>
                    <span className="cmp-quotes__label">{daysLabel}</span>
                </div>
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
                    <div className="cmp-quotes__active-value--price">
                        {currencySymbol || <NoData msg={"not available"}/>}
                        {removeStringDecimals(formattedAmount) || <NoData msg={"not available"}/>}
                    </div>
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
