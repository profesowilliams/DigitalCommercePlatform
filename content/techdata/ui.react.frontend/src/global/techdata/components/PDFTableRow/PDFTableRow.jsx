import React from "react";
import PDFTableCell from "../PDFTableCell/PDFTableCell";
import PDFStyles from "../PDFWindow/PDFStyles";
import { Image, View } from '@react-pdf/renderer';
import { formatPriceNumber, getBase64FromUrl, isNotEmptyValue } from "../../../../utils/utils";

const styles = PDFStyles;
const idStyle = {...styles.tableCell, width:'5%', textAlign:'center'};
const unitPriceStyle = {...styles.tableCell, width:'10%', textAlign:'right'};
const totalPriceStyle = {...styles.tableCell, width:'10%', textAlign:'right'};
const descriptionStyle = {...styles.tableCell, width:'60%'};
const quantityStyle = {...styles.tableCell, width:'10%', textAlign:'center'};
const manufacturerStyle = {...styles.tableCell,width:'10%'}; 
const vendorPartNoStyle = {...styles.tableCell,width:'20%', wordBreak: 'break-all'}; // 
const textStyle = styles.cellText;
const msrpStyle = {...styles.tableCell,width:'12%', wordBreak: 'break-all'};
const imageStyle = {...styles.tableCell,width:'15%', height:'8vh', wordBreak: 'break-all'};
const PDFTableRow = ({quoteItem, header, currencySymbol, flags, isRenewals}) => {
    const extraOptionsFormater = {
        style: 'currency',
        currency: 'USD'
    };
    const discountValue = 
        quoteItem.discounts && quoteItem.discounts[0]?.formattedValue 
            ? quoteItem.discounts[0]?.formattedValue 
            : typeof quoteItem.discounts === 'string' ? quoteItem.discounts 
                : 0;
    const totalValue = 
        isNotEmptyValue(quoteItem.clientExtendedPrice) && typeof quoteItem?.clientExtendedPrice !== 'string' 
            ? formatPriceNumber(quoteItem.clientExtendedPrice, extraOptionsFormater).replace('$', '')
            : quoteItem.totalPriceFormatted;
    const ImageValidation = ({quoteItem}) => {
        /**@type {string} */
        let urlImage = quoteItem?.urlProductImage;
        if (urlImage) {
            urlImage = urlImage.replace(/^http:\/\//i, 'https://');
        } else {
           urlImage = '*'
        }
        return(
    
            <View style={imageStyle}>
                { urlImage ?
                    urlImage === '*' ? (
                        <View></View>
                    ): (
                        (<Image src={urlImage ? getBase64FromUrl(urlImage) : ''}/> )
                    )
                     : (
                        <PDFTableCell
                            header={true}
                            cellItem={'Image'} 
                            cellWidth="8%"
                            cellStyle={imageStyle}
                        />
                    ) 
                }
            </View>
        );
    }

    const CheckBoxFields = () => {
        const extraOptionsFormater = {
            style: 'currency',
            currency: 'USD'
        };        
        return <>
            {flags && Object.keys(flags).length > 0 ? (
                <>  
                    {flags.msrpLabel === true ? (
                        <PDFTableCell 
                            header={header}
                            cellItem={quoteItem.unitListPrice ? formatPriceNumber(quoteItem.unitListPrice, extraOptionsFormater) : quoteItem.msrpLabel}
                            cellWidth={"15%"}
                            type={"string"}
                            cellStyle={msrpStyle}
                            style={textStyle}
                        />
                    ) : null}
                    {flags.manufacturerLabel === true ? (
                        <PDFTableCell 
                            header={header}
                            cellItem={quoteItem.mfrNumber ? quoteItem.mfrNumber  : quoteItem.manufacturerLabel}
                            cellWidth={"15%"}
                            type={"string"}
                            cellStyle={manufacturerStyle}
                            style={textStyle}
                        />
                    ) : null}
                    
                    {flags.partNumberTDLabel === true ? (
                        <PDFTableCell 
                            header={header}
                            cellItem={quoteItem.tdNumber ? quoteItem.tdNumber : quoteItem.partNumberTDLabel}
                            cellWidth={"15%"}
                            type={"string"}
                            cellStyle={vendorPartNoStyle}
                            style={textStyle}
                        />
                    ) : null}
                    
                    
                    {flags.imageLabel === true ? (
                        <ImageValidation quoteItem={quoteItem} />
                    ) : null}
                </>
                
            ) : null}
        </>
    }

    if(isRenewals) {
        return (
            <View style={header ? styles.tableHeader : styles.tableRow}>
                <PDFTableCell
                    header={header}
                    cellItem={quoteItem.id}
                    cellWidth="10%"
                    type={"string"}
                    cellStyle={idStyle}
                    style={textStyle}
                />
                <PDFTableCell 
                    header={header}
                    cellItem={quoteItem.name}
                    cellWidth={flags && Object.keys(flags).length > 0 ? "45%" :"55%"}
                    type={"string"}
                    cellStyle={descriptionStyle}
                    style={textStyle}
                />
                <PDFTableCell
                    header={header}
                    cellItem={`${quoteItem.manufacturer || ''} - ${quoteItem.manufacturerId || ''}`}
                    type={"string"}
                    cellWidth="15%"
                    cellStyle={unitPriceStyle}
                    style={textStyle}
                />
                <PDFTableCell
                    header={header}
                    cellItem={quoteItem.quantity}
                    type={"int"}
                    cellWidth="10%"  
                    cellStyle={quantityStyle}
                    style={textStyle}
                />
                <PDFTableCell
                    header={header}
                    cellItem={(currencySymbol + totalValue)}
                    cellWidth={flags && Object.keys(flags).length > 0 ? "10%" :"15%"}
                    type={"currency"}
                    cellStyle={totalPriceStyle}
                    style={textStyle}
                />
                <CheckBoxFields />
            </View>
        )
    }

    return (
        <View style={header ? styles.tableHeader : styles.tableRow}>
            <PDFTableCell
                header={header}
                cellItem={quoteItem.id}
                cellWidth="5%"
                type={"string"}
                cellStyle={idStyle}
                style={textStyle}
            />
            <PDFTableCell 
                header={header}
                cellItem={quoteItem.displayName}
                cellWidth={flags && Object.keys(flags).length > 0 ? "45%" :"55%"}
                type={"string"}
                cellStyle={descriptionStyle}
                style={textStyle}
            />
            <PDFTableCell
                header={header}
                cellItem={currencySymbol + quoteItem.unitPriceFormatted}
                type={"currency"}
                cellWidth="15%"
                cellStyle={unitPriceStyle}
                style={textStyle}
            />
            <PDFTableCell
                header={header}
                cellItem={discountValue + '% '}
                type={"currency"}
                cellWidth="15%"
                cellStyle={unitPriceStyle}
                style={textStyle}
            />
            <PDFTableCell
                header={header}
                cellItem={quoteItem.quantity}
                type={"int"}
                cellWidth="10%"  
                cellStyle={quantityStyle}
                style={textStyle}
            />
            <PDFTableCell
                header={header}
                cellItem={(currencySymbol + (totalValue !== '' ? totalValue : '0'))}
                cellWidth={flags && Object.keys(flags).length > 0 ? "10%" :"15%"}
                type={"currency"}
                cellStyle={totalPriceStyle}
                style={textStyle}
            />
            <CheckBoxFields />
        </View>
    )
}

export default PDFTableRow;