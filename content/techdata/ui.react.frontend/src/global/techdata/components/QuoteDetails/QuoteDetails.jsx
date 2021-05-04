import React, { useEffect, useState } from "react";
import QuotesSubHeader from "../QuotesSubHeader/QuotesSubHeader";
import QuoteContactInfo from "../QuoteContactInfo/QuoteContactInfo";
import QuoteSubtotal from "../QuoteSubtotal/QuoteSubtotal";
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
        const {
            data: {
                content: { details },
            },
        } = await get(uiServiceEndPoint);
        setQuoteDetails(details);
    }, []);

    const {
        shipTo,
        reseller,
        endUser,
        subTotalFormatted,
        currencySymbol,
    } = quoteDetails;

    return quoteDetails ? (
        <>
            <QuotesSubHeader label={subheaderLabel} title={subheaderTitle} />
            <QuoteContactInfo
                label={resellerContactLabel}
                company={shipTo}
                contact={reseller}
            />
            <QuoteContactInfo
                label={endUserContactLabel}
                company={shipTo}
                contact={endUser}
            />
            <QuoteSubtotal
                label={subtotalLabel}
                amount={subTotalFormatted}
                currencySymbol={currencySymbol}
            />
        </>
    ) : null;
};

export default QuoteDetails;
