import React, { useEffect, useState } from "react";
import QuotesSubHeader from "../QuotesSubHeader/QuotesSubHeader";
import QuoteContactInfo from "../QuoteContactInfo/QuoteContactInfo";
import QuoteSubtotal from "../QuoteSubtotal/QuoteSubtotal";
import { getUrlParams } from "../../../../utils";
import { get } from "../../../../utils/api";

const QuoteDetails = ({ componentProp }) => {
    const [quoteDetails, setQuoteDetails] = useState(false);
    const {
        subheaderLabel,
        subheaderTitle,
        resellerContactLabel,
        endUserContactLabel,
        subtotalLabel,
        uiServiceEndPoint,
    } = JSON.parse(componentProp);
    useEffect(async () => {
        const getDetailsId = ({ id }) => id;
        const id = getDetailsId(getUrlParams());
        const {
            data: {
                content: { details },
            },
        } = await get(`${uiServiceEndPoint}&id=${id}`);
        setQuoteDetails(details);
    }, []);

    const {
        reseller,
        endUser,
        subTotalFormatted,
        currencySymbol,
        created,
        expires
    } = quoteDetails;
 

    return quoteDetails ? (
        <>
            <QuotesSubHeader label={subheaderLabel} title={subheaderTitle} dates={{created,expires}} />
            <QuoteContactInfo label={resellerContactLabel} contact={reseller} />
            <QuoteContactInfo label={endUserContactLabel} contact={endUser} />
            <QuoteSubtotal
                label={subtotalLabel}
                amount={subTotalFormatted}
                currencySymbol={currencySymbol}
            />
        </>
    ) : null;
};

export default QuoteDetails;
