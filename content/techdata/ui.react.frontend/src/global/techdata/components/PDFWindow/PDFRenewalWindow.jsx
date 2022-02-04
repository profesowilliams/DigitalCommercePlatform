import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import * as ReactDOM from "react-dom";
import PDFStyles from "./PDFStyles";
import PDFTable from "./../PDFTable/PDFTable";
import ReactPDFImageWrapper from "../ReactPDFImageWrapper/ReactPDFImageWrapper";
import { DUMB_ITEMS } from "./DumbItems";

// Create styles
const styles = PDFStyles;

const PDFWindow = ({ quoteDetails, logoURL, fileName, downloadLinkText }) => {
  return (
    <>
      <button
        id="pdfDownloadButton"
        onClick={() =>
          downloadClicked(
            quoteDetails,
            true,
            logoURL,
            fileName,
            downloadLinkText
          )
        }
      >
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
  checkboxItems
) => {
  const imagePath = logoURL;
  let whiteLabelLogoFlag = false;
  let extraOptions = [];
  if (options) {
    options.forEach((o) => {
      Object.entries(checkboxItems).forEach((f) => {
        const key = f[0];
        const value = f[1];
        if (value == o) {
          extraOptions[key] = value;
        }
      });
      if (o === "The reseller logo") {
        whiteLabelLogoFlag = true;
      }
    });
  }

  const openPDF = (
    url = "http://localhost:8080/8ec5f51a-080a-4b10-81cb-4cde9a5666c0"
  ) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const PDFDocument = () => {
    return (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={styles.pageWidthSection}>
            {/* <View style={{width: '100', margin:'0'}}>
                                { whiteLabelLogoFlag ? whiteLabelLogo ? <Image src={whiteLabelLogo}/> : <ReactPDFImageWrapper path={imagePath}/> : null} 
                            </View> */}
            <View style={styles.headerSection}>
              <View style={styles.addressSectionYourCompany}>
                <Text style={styles.resellerName}>Your Company Info</Text>
                <Text style={styles.resellerName}>COMPANY NAME</Text>
                {/* <Text style={styles.resellerAddress}>LINE 1</Text>
                                    {details.reseller.line2 ? <Text style={styles.resellerAddress}>{details.reseller.line2}</Text> : null}
                                    {details.reseller.line3 ? <Text style={styles.resellerAddress}>{details.reseller.line3}</Text> : null} */}
                <Text style={styles.resellerAddress}>GOTHAM CITY 12344</Text>
                <Text style={styles.resellerAddress}>METROPOLI</Text>
                <Text style={styles.resellerAddress}>812931123</Text>
              </View>
              <View style={styles.addressSectionEndUserInfo}>
                <Text style={styles.endUserName}>End User Information</Text>
                <Text style={styles.endUserCompanyName}>
                  END USER COMPANY NAME
                </Text>
                <Text style={styles.endUserAddress}>END USER NAME</Text>
                {/* <Text style={styles.endUserAddress}>{details.endUser.line1}</Text>
                                    {details.endUser.line2 ? <Text style={styles.endUserAddress}>{details.endUser.line2}</Text> : null }
                                    {details.endUser.line3 ? <Text style={styles.endUserAddress}>{details.endUser.line3}</Text>  : null } */}
                <Text style={styles.endUserAddress}>
                  ENDUSERCITY ENDUSERSTATE ENDUSERPOSTALCODE
                </Text>
                <Text style={styles.endUserAddress}>ENDUSERCOUNTRY</Text>
                <Text style={styles.endUserAddress}>ENDUSERPHONENUMBER</Text>
              </View>
            </View>
            <View style={styles.tableSection}>
              <PDFTable quoteItems={DUMB_ITEMS} currencySymbol={"$"} />
              {/* extraOptions={extraOptions}
                                    ancillaryItems={ancillaryItems} */}
            </View>
            {/* <View  style={styles.footerSection}>
                                <View style={styles.subTotalSection}>
                                    <Text> </Text>
                                </View>
                                <View style={styles.subTotalSection}>
                                    <Text>Quote Sub-total : {details.currencySymbol} {details.subTotalFormatted} </Text>
                                </View>
                            </View> */}
          </View>
        </Page>
      </Document>
    );
  };

  const DownLoadLink = () => {
    return (
      <PDFDownloadLink document={<PDFDocument />} fileName={fileName}>
        {({ blob, url, loading, error }) => openPDF(url)}
      </PDFDownloadLink>
    );
  };

  if (isDownloadLink) {
    ReactDOM.render(
      <DownLoadLink fileName={fileName} downloadLinkText={downloadLinkText} />,
      document.getElementById("pdfDownloadLink")
    );
  }
};

export default PDFWindow;
