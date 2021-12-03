import React from "react";
import { Text, View} from '@react-pdf/renderer';
import PDFStyles from "../PDFWindow/PDFStyles";
const styles = PDFStyles;

const PDFTableCell = ({cellItem, cellWidth, cellStyle, header = false, style = null}) => {
    return (
        <View style={{...cellStyle, width:cellWidth}}>
            <Text wrap break style={header ? styles.tableTextHeader : style ? style :styles.tableTextBody}>{cellItem}</Text>
        </View>
    )
}

export default PDFTableCell;