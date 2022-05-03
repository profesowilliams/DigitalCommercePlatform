import React from 'react'
import { Page, Text, View, Document } from '@react-pdf/renderer';
import ReactPDFImageWrapper from '../ReactPDFImageWrapper/ReactPDFImageWrapper';
import PDFStyles from './RenewalPDFStyles';
import PDFTable from '../PDFTable/PDFTable';
import { dateToString } from '../../helpers/formatting';
import { If } from '../../helpers/If';

// Create styles
const styles = PDFStyles;
function PDFRenewalPlanOption({ renewalsDetails }) {
    const { reseller, endUser, source, programName, items, expiry, customerPO, dueDate, vendorLogo } = renewalsDetails;
    const address = endUser.address;
    const contact = (Array.isArray(endUser.contact) ? endUser.contact[0] : endUser.contact);
    const contract = (Array.isArray(items) ? items[0].contract : "");
    const formatDate = rawDate => rawDate ? dateToString(rawDate.replace(/[zZ]/g, ''), "MM/dd/uu") : "";
    let extraOptions = [];
    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.pageWidthSection}>

                    {/* {vendorLogo && 
                    <View style={{ width: '100', margin: '0' }}>
                        <ReactPDFImageWrapper path={vendorLogo} />
                    </View>
                    } */}

                    <View style={styles.headerSection}>
                        <View style={styles.addressSectionYourCompany}>
                            <Text style={styles.sectionTitle}>Reseller</Text>
                            <Text style={styles.textBold}>{reseller?.name}</Text>
                            <View style={styles.minSpacing} />
                            <Text style={styles.text}>{reseller?.id}</Text>
                            <Text style={styles.text}>{reseller?.vendorAccountNumbers}</Text>
                        </View>
                        <View style={styles.addressSectionEndUserInfo}>
                            <Text style={styles.sectionTitle}>End User</Text>
                            {endUser.nameUpper && <Text style={styles.textBold}>{endUser.nameUpper}</Text>}
                            <View style={styles.minSpacing} />
                            {endUser.name && <Text style={styles.text}>{endUser.name}</Text>}
                            {address?.line1 && <Text style={styles.text}>{address?.line1}</Text>}
                            {address?.line2 && <Text style={styles.text}>{address?.line2}</Text>}
                            <Text style={styles.text}>{(address?.city ?? '') + (address?.state ? `, ${address?.state}` : '') + (address?.postalCode ? ` ${address?.postalCode}` : '')}</Text>
                            <Text style={styles.text}>{address?.countryCode}</Text>
                            {contact?.email && <Text style={styles.text}>{contact?.email}</Text>}
                            {contact?.phone && <Text style={styles.text}>{contact?.phone}</Text>}
                        </View>
                        <View style={styles.agreementInfo}>
                            <Text style={styles.sectionTitle}>Agreement Information</Text>
                            <Text style={styles.textBold}>Program: {programName}</Text>
                            <View style={styles.minSpacing} />
                            <Text style={styles.text}>Duration: {contract.renewedDuration}</Text>
                            <Text style={styles.text}>Support Level: {contract.serviceLevel}</Text>
                            <Text style={styles.text}>Disti. Quote No: {source.id}</Text>
                            <Text style={styles.text}>Agreement No: {contract.id}</Text>
                            <Text style={styles.text}>Vendor Quote No: {customerPO}</Text>
                            <Text style={styles.text}>Due date: {formatDate(dueDate)}</Text>
                            <Text style={styles.text}>Expiry date: {formatDate(expiry)}</Text>
                            <If Condition={contract.newAgreementStartDate}>
                                <Text style={styles.text}>Agree Start Date: {formatDate(contract.newAgreementStartDate)}</Text>
                            </If>
                            <If Condition={contract.newAgreementEndDate}>
                                <Text style={styles.text}>Agree End Date: {formatDate(contract.newAgreementEndDate)}</Text>
                            </If>
                            <If Condition={contract.newUsagePeriodStartDate}>
                                <Text style={styles.text}>Usage Start Date: {formatDate(contract.newUsagePeriodStartDate)}</Text>
                            </If>
                            <If Condition={contract.newUsagePeriodEndDate}>
                                <Text style={styles.text}>Usage End Date: {formatDate(contract.newUsagePeriodEndDate)}</Text>
                            </If>
                        </View>
                    </View>
                    <View style={styles.spacing} />
                    <View style={styles.tableSection}>
                        <PDFTable
                            quoteItems={items?.[0]?.product}                        
                            extraOptions={extraOptions}
                            currencySymbol={"$"}
                        />
                    </View>
                </View>

            </Page>
        </Document>
    )
}


export default PDFRenewalPlanOption