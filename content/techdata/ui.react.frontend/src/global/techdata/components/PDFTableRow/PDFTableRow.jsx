import React from "react";
import PDFTableCell from "../PDFTableCell/PDFTableCell";
import PDFStyles from "../PDFWindow/PDFStyles";
import { View } from '@react-pdf/renderer';

const styles = PDFStyles;

const idStyle = {...styles.tableCell, width:'5%', textAlign:'center'};
const unitPriceStyle = {...styles.tableCell, width:'10%', textAlign:'right'};
const totalPriceStyle = {...styles.tableCell, width:'10%', textAlign:'right'};
const descriptionStyle = {...styles.tableCell, width:'65%'};
const quantityStyle = {...styles.tableCell, width:'10%', textAlign:'center'};

const PDFTableRow = ({quoteItem, header, currencySymbol}) => {
    return (
        <View style={header ? styles.tableHeader : styles.tableRow}>
            <PDFTableCell cellItem={quoteItem.id} cellWidth="5%" type={"string"} cellStyle={idStyle} />
            <PDFTableCell cellItem={quoteItem.description} cellWidth="55%"  type={"string"}  cellStyle={descriptionStyle}/>
            <PDFTableCell cellItem={currencySymbol + quoteItem.unitListPriceFormatted} type={"currency"} cellWidth="15%"  cellStyle={unitPriceStyle}/>
            <PDFTableCell cellItem={quoteItem.quantity} type={"int"} cellWidth="10%"  cellStyle={quantityStyle} />
            <PDFTableCell cellItem={currencySymbol + quoteItem.totalPriceFormatted} cellWidth="15%" type={"currency"}  cellStyle={totalPriceStyle}/>
        </View>
    )
}

export default PDFTableRow;