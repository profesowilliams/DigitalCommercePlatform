import React from "react";
import { Text, View} from '@react-pdf/renderer';
import PDFStyles from "../PDFWindow/PDFStyles";

const styles = PDFStyles;

const PDFTableCell = ({cellItem, cellWidth, cellStyle}) => {
    console.log(`cell`)
    return (
        <View style={{...cellStyle, width:cellWidth}}>
            <Text>{cellItem}</Text>
        </View>
    )
}

export default PDFTableCell;