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
import PDFRenewalTable from "./../PDFTable/PDFRenewalTable";
import ReactPDFImageWrapper from "../ReactPDFImageWrapper/ReactPDFImageWrapper";
import { DUMB_ITEMS } from "./DumbItems";

// Create styles
const styles = PDFStyles;

const PDFRenewalWindow = ({
  quoteDetails,
  logoURL,
  fileName,
  downloadLinkText,
}) => {
  return <div id="pdfDownloadLink" className="cmp-pdfPrinter"></div>;
};

/**
 *
 * @param {any} details
 * @param {boolean} isDownloadLink
 * @param {string} fileName
 * @param {string} downloadLinkText
*/

export const downloadClicked = (
  details,
  isDownloadLink,
  fileName,
  downloadLinkText,
) => {
  const {
    reseller,
    endUser,
    items,
    programName,
    dueDate,
    endUserType,
    source,
    expiry,
  } = details;

  console.log({
    reseller,
    endUser,
    items,
    programName,
    dueDate,
    endUserType,
    source,
    expiry,
  });
  const openPDF = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  }; 

console.log('items', items?.[0]);

  const PDFDocument = () => {
    return (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={styles.pageWidthSection}>
            <View style={styles.headerSection}>
              <View style={styles.addressSectionYourCompany}>
                <Text style={styles.resellerName}>Company Info</Text>
                <Text style={styles.resellerName}>{reseller?.name}</Text>
                <Text style={styles.resellerAddress}>
                  {reseller?.vendorAccountName}
                </Text>
                <Text style={styles.resellerAddress}>
                  {reseller?.vendorAccountName}
                </Text>
              </View>
              <View style={styles.addressSectionEndUserInfo}>
                <Text style={styles.endUserName}>End User Information</Text>
                <Text style={styles.endUserCompanyName}>
                  {endUser?.nameUpper}
                </Text>

                <Text style={styles.endUserAddress}>
                  {endUser?.address?.city} {endUser?.address?.state}{" "}
                  {endUser?.address?.postalCode}
                </Text>
                <Text style={styles.endUserAddress}>
                  {endUser?.address?.county} {endUser?.address?.countryCode}
                </Text>
              </View>
            </View>
            <View style={styles.tableSection}>
              <PDFRenewalTable
                quoteItems={items?.[0]?.product}
                currencySymbol={"$"}
              />
            </View>
            <View style={styles.footerSection}>
              <View style={styles.subTotalSection}>
                <Text> </Text>
              </View>
              <View style={styles.subTotalSection}>
                <Text>Sub-total : $ {items?.[0]?.subTotalFormatted || 0} </Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    );
  };

  const DownLoadLink = () => {
    return (
      <PDFDownloadLink document={<PDFDocument />} fileName={"Renewals.pdf"}>
        {({ blob, url, loading, error }) => {
          if (error) return;
          openPDF(url);
          return <span>{downloadLinkText}</span>;
        }}
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

export default PDFRenewalWindow;
