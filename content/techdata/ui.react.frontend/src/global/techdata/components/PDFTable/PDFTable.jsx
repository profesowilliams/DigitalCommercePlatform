import React from "react";
import PDFTableRow from "../PDFTableRow/PDFTableRow";
import PDFAncilllaryRow from "../PDFTableRow/PDFAncilllaryRow";

const PDFTable = ({quoteItems, currencySymbol, extraOptions, ancillaryItems}) => {
    const getExtraOptions = () => {
        let localItem = {}
        if (extraOptions) {
            if (extraOptions.manufacturerLabel){
                
                localItem['manufacturerLabel'] = true;
            }

            if (extraOptions.partNumberTDLabel){
                localItem['partNumberTDLabel'] = true;
            }

            if (extraOptions.msrpLabel){
                localItem['msrpLabel'] = true;
            }
            if (extraOptions.imageLabel ){
                localItem['imageLabel'] = true;
            }
        }
        return localItem
    };

    let quoteLineItems;
    let ancillaryLineItems = null;
    const headerItems = {
        "id" : "ID",
        "description" : "Description",
        "unitPriceFormatted" : "Unit Price",
        "quantity": "Quantity",
        "totalPriceFormatted":"Total",
        ...extraOptions
    }

    const ancillaryHeaderItems = {
        "description" : "Description",
        "value" : "Value",
    }
    const flagsValue = getExtraOptions()
    if (quoteItems && quoteItems.length>0)
    {
        quoteLineItems = quoteItems.map((item, index) =>{
            return <PDFTableRow
                        quoteItem={item}
                        key={index}
                        header={false}
                        flags={flagsValue}
                        currencySymbol={currencySymbol}
                    />
        });
    }

    if (ancillaryItems && ancillaryItems.length>0)
    {
        ancillaryLineItems = ancillaryItems.map((item, index) =>{
            return <PDFAncilllaryRow
                        item={item}
                        key={index}
                        header={false}
                        flags={flagsValue}
                        currencySymbol={currencySymbol}
                    />
        });
    }
    return (
        <>
            <PDFTableRow 
                quoteItem={headerItems}
                header={true}
                flags={flagsValue}
                currencySymbol={""}
            />
            {quoteLineItems ? quoteLineItems : null}

            {ancillaryLineItems ? (
            <>
                <PDFAncilllaryRow 
                    item={ancillaryHeaderItems}
                    header={true}
                    flags={flagsValue}
                    currencySymbol={""}
                />
                {ancillaryLineItems}
            </>) : null}
        </>
    )
}

export default PDFTable;