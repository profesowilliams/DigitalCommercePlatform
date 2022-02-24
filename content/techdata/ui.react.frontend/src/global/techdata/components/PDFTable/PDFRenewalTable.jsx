import React from "react";
import PDFTableRow from "../PDFTableRow/PDFTableRow";
import PDFAncilllaryRow from "../PDFTableRow/PDFAncilllaryRow";

const PDFRenewalTable = ({quoteItems, currencySymbol, extraOptions, ancillaryItems}) => {
    console.log('quote items', quoteItems);
    let quoteLineItems;
    const headerItems = {
        "id" : "ID",
        "name" : "Description",
        "manufacturer" : "Manufacterer",
        "quantity": "Quantity",
        "totalPriceFormatted":"Total",
    }

    if (quoteItems && quoteItems.length>0)
    {
        quoteLineItems = quoteItems.map((item, index) =>{
            return <PDFTableRow
                        isRenewals={true}
                        quoteItem={item}
                        key={index}
                        header={false}
                        currencySymbol={currencySymbol}
                    />
        });
    }

    return (
        <>
            <PDFTableRow
                isRenewals={true}
                quoteItem={headerItems}
                header={true}
                currencySymbol={""}
            />
            {quoteLineItems ? quoteLineItems : null}
        </>
    )
}

export default PDFRenewalTable;