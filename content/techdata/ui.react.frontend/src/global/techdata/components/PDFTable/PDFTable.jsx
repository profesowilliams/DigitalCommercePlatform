import React from "react";
import PDFTableRow from "../PDFTableRow/PDFTableRow";

const PDFTable = ({quoteItems, currencySymbol}) => {
    console.log(quoteItems);
    console.log(`currency`)
    console.log(currencySymbol)
    let quoteLineItems;
    const headerItems = {"id" : "ID", "description" : "Description", "unitListPriceFormatted" : "Unit Price", "quantity": "Quantity", "totalPriceFormatted":"Total"}

    if (quoteItems && quoteItems.length>0)
    {
        quoteLineItems = quoteItems.map((item, index) =>
            <PDFTableRow quoteItem={item} key={index} header={false} currencySymbol={currencySymbol}/>
        );
    }

    return (
        <>
            <PDFTableRow quoteItem={headerItems} header={true} currencySymbol={""}/>
            {quoteLineItems ? quoteLineItems : null}
        </>
    )
}

export default PDFTable;