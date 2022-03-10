import React from "react";
import {
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import PDFStyles from "./PDFStyles";
import PDFRenewalTable from "./../PDFTable/PDFRenewalTable";

// Create styles
const styles = PDFStyles;
export const openPDF = (url) => {
  if (url) {
    window.open(url, "_blank");
  }
};


export const PDFRenewalDocument = ({ reseller, endUser, items }) => {
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
