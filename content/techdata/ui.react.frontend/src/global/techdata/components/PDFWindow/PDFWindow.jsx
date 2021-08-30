import React from 'react';
import { Document, Page, Text, View , PDFViewer, PDFDownloadLink} from '@react-pdf/renderer';
import * as ReactDOM from "react-dom";
import PDFStyles from "./PDFStyles";
import PDFTable from "./../PDFTable/PDFTable";
import ReactPDFImageWrapper from "../ReactPDFImageWrapper/ReactPDFImageWrapper";

// Create styles
const styles = PDFStyles;

const PDFWindow = ({quoteDetails, logoURL, fileName}) =>  {

    console.log(`PDF window`);
    console.log(logoURL);
    console.log(fileName);
    return (
        <>
        <div className='cmp-sign-in'>
            <div className='cmp-sign-in-option'>
                <button className='cmp-sign-in-button' onClick={() => onSignIn(quoteDetails, true, logoURL)}>
                    <i className="fas fa-download"></i>
                    Download
                </button>
                <button className='cmp-sign-in-button' onClick={() => onSignIn(quoteDetails, false, logoURL)}>
                    <i className="fas fa-print"></i>
                    Print
                </button>
            </div>
        </div>
        </>
    );
}

const onSignIn = async (details, isDownloadLink, logoURL) => {
    const imagePath = logoURL;

    const PrintHelper = () => {
        console.log(`PrintHelper function onclick`)
        console.log(details);
        return (
                <Document>
                    <Page size="A4" orientation="landscape" style={styles.page}>
                        <View style={styles.pageWidthSection}>
                            <View style={{width: '100', margin:'0'}}>
                                <ReactPDFImageWrapper path={imagePath} />
                            </View>
                            <View style={styles.headerSection}>
                                <View style={styles.addressSectionYourCompany}>
                                    <Text style={styles.resellerName}>Your Company Info</Text>
                                    <Text style={styles.resellerName}>{details.reseller.companyName}</Text>
                                    <Text style={styles.resellerAddress}>{details.reseller.line1}</Text>
                                    {details.reseller.line2 ? <Text style={styles.resellerAddress}>{details.reseller.line2}</Text> : null}
                                    {details.reseller.line3 ? <Text style={styles.resellerAddress}>{details.reseller.line3}</Text> : null}
                                    <Text style={styles.resellerAddress}>{details.reseller.city} {details.reseller.state} {details.reseller.postalCode}</Text>
                                    <Text style={styles.resellerAddress}>{details.reseller.country}</Text>
                                    <Text style={styles.resellerAddress}>{details.reseller.phoneNumber}</Text>
                                </View>
                                <View style={styles.addressSectionEndUserInfo}>
                                    <Text style={styles.endUserName}>End User Information</Text>
                                    <Text style={styles.endUserCompanyName}>{details.endUser.companyName}</Text>
                                    <Text style={styles.endUserAddress}>{details.endUser.name}</Text>
                                    <Text style={styles.endUserAddress}>{details.endUser.line1}</Text>
                                    {details.endUser.line2 ? <Text style={styles.endUserAddress}>{details.endUser.line2}</Text> : null }
                                    {details.endUser.line3 ? <Text style={styles.endUserAddress}>{details.endUser.line3}</Text>  : null }
                                    <Text style={styles.endUserAddress}>{details.endUser.city} {details.endUser.state} {details.endUser.postalCode}</Text>
                                    <Text style={styles.endUserAddress}>{details.endUser.country}</Text>
                                    <Text style={styles.endUserAddress}>{details.endUser.phoneNumber}</Text>
                                </View>
                            </View>
                            <View  style={styles.tableSection}>
                                <PDFTable quoteItems={details.items} currencySymbol={details.currencySymbol}/>
                            </View>
                            <View  style={styles.footerSection}>
                                <View style={styles.subTotalSection}>
                                    <Text> </Text>
                                </View>
                                <View style={styles.subTotalSection}>
                                    <Text>Quote Sub-total : {details.currencySymbol} {details.subTotalFormatted} </Text>
                                </View>
                            </View>
                        </View>

                    </Page>
                </Document>
        )
    }

    const DownLoadLink = ({fileName}) => {
        return (
            <PDFDownloadLink document={<PrintHelper />} fileName={fileName}>
                {({ blob, url, loading, error }) =>
                    loading ? 'Loading document...' : 'Download PDF'
                }
            </PDFDownloadLink>
        )
    }

    const PDFViewerExample= () => {
        return (
            <PDFViewer>
                <PrintHelper />
            </PDFViewer>
        )
    }

    if (isDownloadLink)
    {
        ReactDOM.render(<DownLoadLink />, document.getElementById("downloadlink"));
    }else{
        ReactDOM.render(<PDFViewerExample />, document.getElementById("printutil"));
    }


};

// Create Document Component
// (
//     <Document>
//         <Page size="A4" style={styles.page}>
//             <View style={styles.section}>
//                 <Text>Section #1</Text>
//             </View>
//             <View style={styles.section}>
//                 <Text>Section #2</Text>
//             </View>
//         </Page>
//     </Document>
// );

export default PDFWindow;