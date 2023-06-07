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
        justifyContent: 'flex-end',
        color: darkFontColor
    },
    subTotalSection: {
        width: '100%',
        margin: '0',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        alignItems: 'flex-end' ,
        color: darkFontColor,
        textAlign: 'right'
    },
    addressSectionYourCompany: {
        width: '33.333%',
        padding: 10,
    },
    addressSectionEndUserInfo: {
        width: '33.333%',
        padding: 10,
    },
    agreementInfo: {
        width: '33.333%',
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
    },
    tableTextHeader:{
        fontSize: 10,
        fontWeight: 100,
    },
    tableTextBody:{
        textOverflow: 'ellipsis',
        fontSize: 13,
        fontWeight: 100,
    },
    cellText: {
        textOverflow: 'ellipsis',
        fontSize: 8,
        fontWeight: 100,
        textAlign: 'left'
    },
    sectionTitle:{
        fontSize: 15,
        fontWeight:600,
        marginBottom: "12px",
        color:brandDarkBlue,
    },
    text:{
        fontSize: 11,
        color: darkFontColor,
    },
    textBold:{
        fontWeight:800,
        fontSize: 11,
        color: darkFontColor,
    },
    minSpacing:{
        margin:".5rem 0"
    },
    spacing:{
        margin:"2.7rem 0"
    }
});