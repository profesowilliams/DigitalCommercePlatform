import React from "react";
import PDFTableCell from "../PDFTableCell/PDFTableCell";
import PDFStyles from "../PDFWindow/PDFStyles";
import { Image, View } from '@react-pdf/renderer';
import { getBase64FromUrl } from "../../../../utils/utils";

const styles = PDFStyles;
const idStyle = {...styles.tableCell, width:'5%', textAlign:'center'};
const unitPriceStyle = {...styles.tableCell, width:'10%', textAlign:'right'};
const totalPriceStyle = {...styles.tableCell, width:'10%', textAlign:'right'};
const descriptionStyle = {...styles.tableCell, width:'60%'};
const quantityStyle = {...styles.tableCell, width:'10%', textAlign:'center'};
const manufacturerStyle = {...styles.tableCell,width:'10%',textAlign:'center'}; 
const vendorPartNoStyle = {...styles.tableCell,width:'10%',textAlign:'center'};
const msrpStyle = {...styles.tableCell,width:'10%',textAlign:'center'};
const imageStyle = {...styles.tableCell,width:'10%',textAlign:'center'};

const PDFTableRow = ({quoteItem, header, currencySymbol, flags}) => {

    const CheckBoxFields = () => {
        return <>
            {flags && Object.keys(flags).length > 0 ? (
                <>
                    {flags.manufacturer === true ? (
                        <PDFTableCell 
                            cellItem={quoteItem.manufacturer}
                            cellWidth="15%" type={"currency"}
                            cellStyle={manufacturerStyle}
                        />
                    ) : null}
                    
                    {flags.vendorPartNo === true ? (
                        <PDFTableCell 
                            cellItem={quoteItem.vendorPartNo}
                            cellWidth="15%" type={"currency"}
                            cellStyle={vendorPartNoStyle}
                        />
                    ) : null}
                    
                    {flags.msrp === true ? (
                        <PDFTableCell 
                            cellItem={quoteItem.msrp} cellWidth="15%"
                            type={"currency"}  cellStyle={msrpStyle}
                        />
                    ) : null}

                    {flags.image === true ? (
                        <View style={imageStyle}>
                        { quoteItem?.urlProductImage ?
                            (<Image
                                src={quoteItem.urlProductImage ? getBase64FromUrl(quoteItem.urlProductImage) : ''}
                            /> ) : (
                                <PDFTableCell 
                                    cellItem={'Image'} cellWidth="10%"
                                    type={"currency"}  cellStyle={imageStyle}
                                />
                            ) 
                        }
                        </View>
                    ) : null}
                </>
                
            ) : null}
        </>
    }

    return (
        <View style={header ? styles.tableHeader : styles.tableRow}>
            <PDFTableCell cellItem={quoteItem.id} cellWidth="5%" type={"string"} cellStyle={idStyle} />
            <PDFTableCell cellItem={quoteItem.description} cellWidth="55%"  type={"string"}  cellStyle={descriptionStyle}/>
            <PDFTableCell cellItem={currencySymbol + quoteItem.unitListPriceFormatted} type={"currency"} cellWidth="15%"  cellStyle={unitPriceStyle}/>
            <PDFTableCell cellItem={quoteItem.quantity} type={"int"} cellWidth="10%"  cellStyle={quantityStyle} />
            <PDFTableCell cellItem={currencySymbol + quoteItem.totalPriceFormatted} cellWidth="15%" type={"currency"}  cellStyle={totalPriceStyle}/>
            <CheckBoxFields />
        </View>
    )
}

export default PDFTableRow;