import {StyleSheet} from "@react-pdf/renderer";

const darkFontColor = "#555555";
const brandDarkBlue = "#000c21";


export default StyleSheet.create({
    page: {
        // fontFamily:'Open-Sans',
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    headerSection: {
        width: '100%',
        margin: '0',
        flexDirection: 'row',
        color: darkFontColor
    },
    footerSection: {
        width: '100%',
        margin: '0',
        flexDirection: 'row',
        color: darkFontColor
    },
    subTotalSection: {
        width: '50%',
        margin: '0',
        flexDirection: 'row',
        color: darkFontColor,
        textAlign: 'right'
    },
    addressSectionYourCompany: {
        width: '50%',
        padding: 10,
    },
    addressSectionEndUserInfo: {
        width: '50%',
        padding: 10,
    },
    image: {
        // marginVertical: 15,
        // marginHorizontal: 100,
    },
    pageWidthSection: {
        flexDirection: 'column',
        width: '100%'
    },
    endUserName: {
    },
    endUserCompanyName: {
    },
    endUserAddress: {
    },
    resellerName: {
    },
    resellerAddress: {
    },
    tableSection: {
        width: '100%',
        flexDirection: 'column'
    },
    tableRow:{
        flexDirection: 'row'
    },
    tableHeader:{
        flexDirection: 'row',
        backgroundColor: brandDarkBlue,
        color: 'white'
    },
    tableCell:{
        padding: '5',
        border: '1',
        borderColor: 'black'
    }
});