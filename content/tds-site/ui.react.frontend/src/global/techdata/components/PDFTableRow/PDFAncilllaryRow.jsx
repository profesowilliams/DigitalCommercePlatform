import React from "react";
import PDFTableCell from "../PDFTableCell/PDFTableCell";
import PDFStyles from "../PDFWindow/PDFStyles";
import { View } from '@react-pdf/renderer';

const styles = PDFStyles;
const valueStyle = {...styles.tableCell, width:'30%', textAlign:'right'};
const descriptionStyle = {...styles.tableCell, width:'70%'};

const PDFAncilllaryRow = ({item, header}) => {
    return (
        <View style={header ? styles.tableHeader : styles.tableRow}>
            <PDFTableCell 
                cellItem={item.description}
                cellWidth="70%"
                 type={"string"}
                 cellStyle={descriptionStyle}
                />
            <PDFTableCell 
                cellItem={item.value}
                type={"currency"}
                cellWidth="30%"
                cellStyle={valueStyle}
            />
        </View>
    )
}

export default PDFAncilllaryRow;