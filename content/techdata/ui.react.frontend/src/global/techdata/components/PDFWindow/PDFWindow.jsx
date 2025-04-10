import React from 'react';
import { Document, Page, Text, View , Image, PDFDownloadLink} from '@react-pdf/renderer';
import { render } from 'react-dom';
import PDFStyles from "./PDFStyles";
import PDFTable from "./../PDFTable/PDFTable";
import ReactPDFImageWrapper from "../ReactPDFImageWrapper/ReactPDFImageWrapper";
import { formatPriceNumber } from '../../../../utils/utils';

// Create styles
const styles = PDFStyles;

const PDFWindow = ({quoteDetails, logoURL, fileName, downloadLinkText}) =>  {
    return (
        <>
                <button id="pdfDownloadButton" onClick={() => downloadClicked(quoteDetails, true, logoURL, fileName, downloadLinkText)}>
                    <i className="fas fa-download"></i>
                    {downloadLinkText}
                </button>
            <div id="pdfDownloadLink" className="cmp-pdfPrinter"></div>
        </>
    );
};

/**
 * 
 * @param {any} details 
 * @param {boolean} isDownloadLink 
 * @param {string} logoURL 
 * @param {string} fileName 
 * @param {string} downloadLinkText 
 * @param {string} whiteLabelLogo
 * @param {string[]} options
 * @param {any[]} ancillaryItems
 * @param {any[]} checkboxItems
 * @param {string} logoValueProp
 * @param {any} actualQuoteLinesData
 */
export const downloadClicked = (
    details,
    isDownloadLink,
    logoURL,
    fileName,
    downloadLinkText,
    whiteLabelLogo,
    options,
    ancillaryItems,
    checkboxItems,
    logoValueProp,
    actualQuoteLinesData,
    quoteId,
) => {
    const extraOptionsFormater = {
        style: 'currency',
        currency: 'USD'
    };
    const totalEndPrice = formatPriceNumber(
        actualQuoteLinesData.summary.yourMarkup !== 0 ? actualQuoteLinesData.summary.endUserTotal : actualQuoteLinesData.summary.subtotal
        , extraOptionsFormater
    ).replace('$', '');
    
    const imagePath = logoURL;
    let whiteLabelLogoFlag = false;
    let extraOptions = [];
    if (options) {
        options.forEach(o => {
            Object.entries(checkboxItems).forEach(f => {
                const key = f[0];
                const value = f[1];
                if (value == o) {
                    extraOptions[key] = value
                }
            })
            if (o === logoValueProp) {
                whiteLabelLogoFlag = true;
            }
        })
    }

    const openPDF = (url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    const PDFDocument = () => {
        return (
                <Document>
                    <Page size="A4" orientation="landscape" style={styles.page}>
                        <View style={styles.pageWidthSection}>
                            <View style={{width: '100', margin:'0'}}>
                                { whiteLabelLogoFlag ? whiteLabelLogo ? <Image src={whiteLabelLogo}/> : <ReactPDFImageWrapper path={imagePath}/> : null} 
                            </View>
                            <View style={styles.headerSection}>
                                <View style={styles.addressSectionYourCompany}>
                                    <Text style={styles.resellerName}>Your Company Info</Text>
                                    <Text style={styles.resellerName}>{details.reseller.companyName}</Text>
                                    <Text style={styles.resellerAddress}>{details.reseller.line1}</Text>
                                    <Text style={styles.resellerAddress}>Quote ID:{quoteId}</Text>
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
                                <PDFTable 
                                    quoteItems={details.items}
                                    currencySymbol={details.currencySymbol}
                                    extraOptions={extraOptions}
                                    ancillaryItems={ancillaryItems}
                                />
                            </View>
                            <View  style={styles.footerSection}>
                                <View style={styles.subTotalSection}>
                                    <Text> </Text>
                                </View>
                                <View style={styles.subTotalSection}>
                                    <Text>Quote Sub-total : {details.currencySymbol} {totalEndPrice} </Text>
                                </View>
                            </View>
                        </View>

                    </Page>
                </Document>
        )
    };

    const DownLoadLink = () => {
        return (
            <PDFDownloadLink document={<PDFDocument />} fileName={fileName}>
                {({ blob, url, loading, error }) =>
                    loading ? 'Preparing PDF to download...' : openPDF(url)
                }
            </PDFDownloadLink>
        )
    };


    if (isDownloadLink)
    {
        render(<DownLoadLink fileName={fileName} downloadLinkText={downloadLinkText}/>, document.getElementById("pdfDownloadLink"));
    }
};

export default PDFWindow;