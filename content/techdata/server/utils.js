module.exports = {
    getRandomDate: function () {
        let [month, date, year] = new Date()
            .toLocaleDateString("en-US")
            .split("/");
        let dayFactor = Math.floor(Math.random() * 7);
        let deltaFactor = Math.floor(Math.random() * 2) ? 1 : -1;
        let randomDate = parseInt(date) + dayFactor * deltaFactor;
        console.log(month, date, year, dayFactor, deltaFactor, randomDate);
        return new Date(year, month, randomDate).toISOString();
    },
    getRandomArrayWithIds: (maxLength) => {
        const arrayLength = Math.floor(Math.random() * (maxLength + 1));
        let ids = [];
        for (let i = 0; i < arrayLength; i++) {
            ids.push(Math.floor(Math.random() * 100000000).toString());
        }
        return ids;
    },
    getRandomValues(range) {
        return String(1.0 * Math.floor(Math.random() * (range + 1)));
    },
    getRandomNumber(maxValue) {
        return Math.floor(Math.random() * maxValue + 1);
    },
    getQuoteDetailsResponse() {
        return { "content": { "details": { "status": "OPEN", "quoteSource": { "id": "121791261", "system": "Q", "salesOrg": "0100", "targetSystem": "R3", "key": "8227668392" }, "shipTo": { "id": null, "companyName": "SHI INTERNATIONAL CORP", "name": null, "line1": "290 Davidson Ave", "line2": " ", "line3": null, "city": "Somerset", "state": "NJ", "zip": null, "postalCode": "08873-4145", "country": "US", "email": null, "contactEmail": null, "phoneNumber": null }, "endUser": { "id": null, "companyName": "test_COMPANY", "name": "EndUser-name  EndUser-name", "line1": "AM STRANDE 3", "line2": "D", "line3": null, "city": "ROSTOCK-Warsaw", "state": "PL", "zip": null, "postalCode": null, "country": "DE", "email": "email@techdata.com", "contactEmail": null, "phoneNumber": "777" }, "reseller": { "id": null, "companyName": "SHI INTERNATIONAL CORP", "name": null, "line1": "290 Davidson Ave", "line2": " ", "line3": null, "city": "Somerset", "state": "NJ", "zip": null, "postalCode": "08873-4145", "country": "US", "email": null, "contactEmail": null, "phoneNumber": null }, "source": [{ "type": "Estimate Id", "value": "53848426" }], "notes": null, "items": [{ "id": "1.0", "parent": null, "vendorPartNo": "A-MST-WX", "manufacturer": "CISCO", "description": "Cisco Video Integration for Microso", "quantity": 1, "unitPrice": 0.0, "unitPriceFormatted": "0.00", "totalPrice": 0.0, "totalPriceFormatted": "0.00", "msrp": 0.0, "invoice": null, "shipDates": null, "invoices": null, "trackings": null, "discounts": [{ "type": "Quote", "value": 0.0, "formattedValue": "0.00" }], "contract": null, "shortDescription": "Cisco Video Integration for Microso", "mfrNumber": "A-MST-WX", "tdNumber": "14231446", "upcNumber": null, "unitPriceCurrency": null, "unitCost": 0.0, "unitCostCurrency": null, "unitListPrice": 0.0, "unitListPriceCurrency": null, "extendedListPrice": 0.0, "unitListPriceFormatted": "0.00", "extendedPrice": null, "extendedPriceFormatted": "", "availability": null, "rebateValue": null, "urlProductImage": " https://uat.dc.tdebusiness.cloud/content/dam/techdata/digital-commerce-platform/product-default-images/80000406.png", "urlProductSpecs": null, "children": [{ "id": "1.1", "parent": "1.0", "vendorPartNo": "A-MST-WX-CVI-ROOMS", "manufacturer": "CISCO", "description": "Webex Video Int MS Teams CVI", "quantity": 20, "unitPrice": 34.6500000, "unitPriceFormatted": "34.65", "totalPrice": 693.0, "totalPriceFormatted": "693.00", "msrp": 49.5000000, "invoice": null, "shipDates": null, "invoices": null, "trackings": null, "discounts": [{ "type": "Quote", "value": 30.0, "formattedValue": "30.00" }], "contract": null, "shortDescription": null, "mfrNumber": "A-MST-WX-CVI-ROOMS", "tdNumber": "14225465", "upcNumber": null, "unitPriceCurrency": null, "unitCost": 34.6500000, "unitCostCurrency": null, "unitListPrice": 49.5000000, "unitListPriceCurrency": null, "extendedListPrice": 0.0, "unitListPriceFormatted": "49.50", "extendedPrice": null, "extendedPriceFormatted": "", "availability": null, "rebateValue": null, "urlProductImage": "https://cdn.cnetcontent.com/e1/e2/e1e25900-af02-42ab-a965-13047381d9d4.jpg", "urlProductSpecs": null, "children": null, "agreements": [], "ancillaryChargesWithTitles": null, "annuity": { "isAnnuity": false, "startDate": null, "endDate": null, "autoRenewal": false, "autoRenewalTerm": null, "duration": "", "billingFrequency": "", "initialTerm": "" }, "isSubLine": false, "displayLineNumber": "1.1", "licenseStartDate": null, "licenseEndDate": null, "contractStartDate": null, "contractEndDate": null, "serviceContractDetails": null, "contractNo": null, "contractType": null, "license": null, "status": null, "vendorStatus": null, "customerPOLine": null, "supplierQuoteRef": null, "configID": null, "locationID": null, "serials": null, "paKs": null, "images": { "200x150": [{ "id": "2df2bb37-9ed7-46a5-ae63-0d2f3364e868", "url": "https://cdn.cnetcontent.com/2d/f2/2df2bb37-9ed7-46a5-ae63-0d2f3364e868.jpg", "type": "Software logo", "angle": "Front" }], "75x75": [{ "id": "e1e25900-af02-42ab-a965-13047381d9d4", "url": "https://cdn.cnetcontent.com/e1/e2/e1e25900-af02-42ab-a965-13047381d9d4.jpg", "type": "Software logo", "angle": "Front" }], "640x480": [{ "id": "62a7601f-605c-421c-82f5-365b61a0ed6d", "url": "https://cdn.cnetcontent.com/62/a7/62a7601f-605c-421c-82f5-365b61a0ed6d.jpg", "type": "Software logo", "angle": "Front" }], "400x300": [{ "id": "23dc4236-8dfe-40bf-b7d0-71606d17aab7", "url": "https://cdn.cnetcontent.com/23/dc/23dc4236-8dfe-40bf-b7d0-71606d17aab7.jpg", "type": "Software logo", "angle": "Front" }] }, "logos": { "200x150": [{ "id": "e7ea6e83-4b75-4b7f-b385-6a497622323f", "url": "https://cdn.cnetcontent.com/e7/ea/e7ea6e83-4b75-4b7f-b385-6a497622323f.jpg" }], "400x300": [{ "id": "d2de6a78-ca77-4d75-8508-02326319f617", "url": "https://cdn.cnetcontent.com/d2/de/d2de6a78-ca77-4d75-8508-02326319f617.jpg" }], "75x75": [{ "id": "c50819db-6344-452e-a701-da44b7795b61", "url": "https://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg" }] }, "displayName": "Webex Video Int MS Teams CVI", "authorization": { "canOrder": true, "canViewPrice": true, "customerCanView": true }, "posType": "", "purchaseCost": 0.0, "billingModel": null, "attributes": [{ "name": "LISTPRICE", "value": "" }, { "name": "CONFIGPARENT", "value": "1.0" }, { "name": "THIRDPARTYFREIGHT", "value": "N" }, { "name": "VENDORQUOTEID", "value": "53848426" }, { "name": "APILINENUMBER", "value": "2" }, { "name": "CONFIGLINE", "value": "1.1" }, { "name": "PRODUCTTYPE", "value": "NON_SERVICE" }, { "name": "APIMANUALCOST", "value": "" }, { "name": "MANUFACTURER", "value": "CISCO" }, { "name": "APIOVERRIDECOST", "value": "Y" }, { "name": "QUANTITY", "value": "" }, { "name": "DONOTINVOICE", "value": "N" }, { "name": "PAMF_FL", "value": "Y" }], "classificationType": null }, { "id": "1.2", "parent": "1.0", "vendorPartNo": "SVS-FLEX-SUPT-BAS", "manufacturer": "CISCO", "description": "SKU DESC: SVS-FLEX-SUPT-BAS", "quantity": 1, "unitPrice": 0.0, "unitPriceFormatted": "0.00", "totalPrice": 0.0, "totalPriceFormatted": "0.00", "msrp": 0.0, "invoice": null, "shipDates": null, "invoices": null, "trackings": null, "discounts": [{ "type": "Quote", "value": 0.0, "formattedValue": "0.00" }], "contract": null, "shortDescription": "SKU DESC: SVS-FLEX-SUPT-BAS", "mfrNumber": "SVS-FLEX-SUPT-BAS", "tdNumber": "13617722", "upcNumber": null, "unitPriceCurrency": null, "unitCost": 0.0, "unitCostCurrency": null, "unitListPrice": 0.0, "unitListPriceCurrency": null, "extendedListPrice": 0.0, "unitListPriceFormatted": "0.00", "extendedPrice": null, "extendedPriceFormatted": "", "availability": null, "rebateValue": null, "urlProductImage": " https://uat.dc.tdebusiness.cloud/content/dam/techdata/digital-commerce-platform/product-default-images/80000553.png", "urlProductSpecs": null, "children": null, "agreements": [], "ancillaryChargesWithTitles": null, "annuity": { "isAnnuity": false, "startDate": null, "endDate": null, "autoRenewal": false, "autoRenewalTerm": null, "duration": "", "billingFrequency": "", "initialTerm": "" }, "isSubLine": false, "displayLineNumber": "1.2", "licenseStartDate": null, "licenseEndDate": null, "contractStartDate": null, "contractEndDate": null, "serviceContractDetails": null, "contractNo": null, "contractType": null, "license": null, "status": null, "vendorStatus": null, "customerPOLine": null, "supplierQuoteRef": null, "configID": null, "locationID": null, "serials": null, "paKs": null, "images": { "130x80": [{ "id": "80000553.png", "url": " https://uat.dc.tdebusiness.cloud/content/dam/techdata/digital-commerce-platform/product-default-images/80000553.png", "type": "Category Image", "angle": "Front" }] }, "logos": {}, "displayName": "SKU DESC: SVS-FLEX-SUPT-BAS", "authorization": { "canOrder": true, "canViewPrice": true, "customerCanView": true }, "posType": "", "purchaseCost": 0.0, "billingModel": null, "attributes": [{ "name": "LISTPRICE", "value": "" }, { "name": "CONFIGPARENT", "value": "1.0" }, { "name": "THIRDPARTYFREIGHT", "value": "N" }, { "name": "VENDORQUOTEID", "value": "53848426" }, { "name": "APILINENUMBER", "value": "3" }, { "name": "CONFIGLINE", "value": "1.2" }, { "name": "PRODUCTTYPE", "value": "NON_SERVICE" }, { "name": "APIMANUALCOST", "value": "" }, { "name": "MANUFACTURER", "value": "CISCO" }, { "name": "APIOVERRIDECOST", "value": "Y" }, { "name": "QUANTITY", "value": "" }, { "name": "DONOTINVOICE", "value": "N" }, { "name": "PAMF_FL", "value": "Y" }], "classificationType": null }], "agreements": null, "ancillaryChargesWithTitles": null, "annuity": { "isAnnuity": false, "startDate": null, "endDate": null, "autoRenewal": false, "autoRenewalTerm": null, "duration": "", "billingFrequency": "", "initialTerm": "" }, "isSubLine": false, "displayLineNumber": "1.0", "licenseStartDate": null, "licenseEndDate": null, "contractStartDate": null, "contractEndDate": null, "serviceContractDetails": null, "contractNo": null, "contractType": null, "license": null, "status": null, "vendorStatus": null, "customerPOLine": null, "supplierQuoteRef": null, "configID": null, "locationID": null, "serials": null, "paKs": null, "images": { "130x80": [{ "id": "80000406.png", "url": " https://uat.dc.tdebusiness.cloud/content/dam/techdata/digital-commerce-platform/product-default-images/80000406.png", "type": "Category Image", "angle": "Front" }] }, "logos": {}, "displayName": "Cisco Video Integration for Microso", "authorization": { "canOrder": false, "canViewPrice": false, "customerCanView": false }, "posType": "", "purchaseCost": 0.0, "billingModel": null, "attributes": null, "classificationType": null }], "id": "121791261", "orders": [], "customerPO": null, "endUserPO": null, "poDate": null, "quoteReference": "CCW webapi", "spaId": null, "currency": "USD", "currencySymbol": "$", "subTotal": 693.0000000, "subTotalFormatted": "693.00", "tier": "Commercial", "created": "03/23/22", "expires": "04/23/22", "buyMethod": "sap46", "customerBuyMethod": "TD", "deals": [], "attributes": [{ "name": "CONFIRMATIONNUMBER", "value": "220324045133000335" }, { "name": "DEAL", "value": "53848426" }, { "name": "ORIGINALESTIMATEID", "value": "53848426" }, { "name": "VENDORQUOTETYPE", "value": "CCW" }, { "name": "SHIPCOMPLETETYPE", "value": "NA" }, { "name": "TAKEOVER", "value": "FALSE" }], "isExclusive": null, "checkoutSystem": "4.6-checkout", "canCheckOut": true } }, "error": { "code": 0, "messages": [], "isError": false } };
        //return {
        //  "content": {
        //    "details": {
        //      "shipTo": {
        //        "id": null,
        //        "companyName": "TECH DATA PRODUCT MANAGEMENT INC",
        //        "name": null,
        //        "line1": "13472 MARLAY AVENUE",
        //        "line2": null,
        //        "line3": null,
        //        "city": "FONTANA",
        //        "state": "CA",
        //        "zip": null,
        //        "postalCode": "92337",
        //        "country": "US",
        //        "email": null,
        //        "contactEmail": null,
        //        "phoneNumber": null
        //      },
        //      "endUser": {
        //        "id": null,
        //        "companyName": "COLINX",
        //        "name": "Jose  Caceres",
        //        "line1": "1536 GENESIS ROAD",
        //        "line2": null,
        //        "line3": null,
        //        "city": "CROSSVILLE",
        //        "state": "TN",
        //        "zip": null,
        //        "postalCode": "38555",
        //        "country": "US",
        //        "email": "jcaceres@techdata.com",
        //        "contactEmail": null,
        //        "phoneNumber": "666666666"
        //      },
        //      "reseller": {
        //        "id": null,
        //        "companyName": "SHI INTERNATIONAL CORP",
        //        "name": "XML TEST  XML TEST",
        //        "line1": "290 Davidson Ave",
        //        "line2": " ",
        //        "line3": null,
        //        "city": "Somerset",
        //        "state": "NJ",
        //        "zip": null,
        //        "postalCode": "08873-4145",
        //        "country": "US",
        //        "email": "noreply@techdata.com",
        //        "contactEmail": null,
        //        "phoneNumber": null
        //      },
        //      "source": [{ "type": "Vendor Quote", "value": "261044799" }],
        //      "notes": null,
        //      "items": [
        //        {
        //          "id": "1",
        //          "parent": null,
        //          "vendorPartNo": "CON-SNTP-2901VSCC",
        //          "manufacturer": "CISCO",
        //          "description": "SMARTNT 24X7X4 C2901 CUBE BDL PVDM3-16 U",
        //          "quantity": 1,
        //          "unitPrice": 583.66,
        //          "unitPriceFormatted": "583.66",
        //          "totalPrice": 583.66,
        //          "totalPriceFormatted": "583.66",
        //          "msrp": null,
        //          "invoice": null,
        //          "shipDates": null,
        //          "invoices": null,
        //          "trackings": null,
        //          "discounts": null,
        //          "contract": null,
        //          "shortDescription": "Cisco SMARTnet extended service agreement",
        //          "mfrNumber": "CON-SNTP-2901VSCC",
        //          "tdNumber": "10132983",
        //          "upcNumber": null,
        //          "unitListPrice": "606.0000000",
        //          "unitListPriceFormatted": "606.00",
        //          "extendedPrice": null,
        //          "extendedPriceFormatted": "",
        //          "availability": null,
        //          "rebateValue": null,
        //          "urlProductImage": "http://cdn.cnetcontent.com/cd/45/cd45ab63-01c6-4264-a43b-4f54b196f2d7.jpg",
        //          "urlProductSpecs": null,
        //          "children": [],
        //          "agreements": null,
        //          "ancillaryChargesWithTitles": null,
        //          "annuity": null,
        //          "isSubLine": false,
        //          "displayLineNumber": "1",
        //          "licenseStartDate": null,
        //          "licenseEndDate": null,
        //          "contractStartDate": null,
        //          "contractEndDate": null,
        //          "serviceContractDetails": null,
        //          "contractNo": null,
        //          "contractType": null,
        //          "license": null,
        //          "status": null,
        //          "vendorStatus": null,
        //          "customerPOLine": null,
        //          "supplierQuoteRef": null,
        //          "configID": null,
        //          "locationID": null,
        //          "serials": null,
        //          "paKs": null,
        //          "images": {
        //            "75x75": [
        //              {
        //                "id": "cd45ab63-01c6-4264-a43b-4f54b196f2d7",
        //                "url": "http://cdn.cnetcontent.com/cd/45/cd45ab63-01c6-4264-a43b-4f54b196f2d7.jpg",
        //                "type": "Product shot",
        //                "angle": "Front"
        //              }
        //            ],
        //            "400x300": [
        //              {
        //                "id": "dcc8e3b4-2d20-4877-9da2-6f2b6554edac",
        //                "url": "http://cdn.cnetcontent.com/dc/c8/dcc8e3b4-2d20-4877-9da2-6f2b6554edac.jpg",
        //                "type": "Product shot",
        //                "angle": "Front"
        //              }
        //            ],
        //            "200x150": [
        //              {
        //                "id": "c17d51e4-c044-4db8-8862-d8e34ab03e99",
        //                "url": "http://cdn.cnetcontent.com/c1/7d/c17d51e4-c044-4db8-8862-d8e34ab03e99.jpg",
        //                "type": "Product shot",
        //                "angle": "Front"
        //              }
        //            ]
        //          },
        //          "logos": {
        //            "200x150": [
        //              {
        //                "id": "e7ea6e83-4b75-4b7f-b385-6a497622323f",
        //                "url": "http://cdn.cnetcontent.com/e7/ea/e7ea6e83-4b75-4b7f-b385-6a497622323f.jpg"
        //              }
        //            ],
        //            "400x300": [
        //              {
        //                "id": "d2de6a78-ca77-4d75-8508-02326319f617",
        //                "url": "http://cdn.cnetcontent.com/d2/de/d2de6a78-ca77-4d75-8508-02326319f617.jpg"
        //              }
        //            ],
        //            "75x75": [
        //              {
        //                "id": "c50819db-6344-452e-a701-da44b7795b61",
        //                "url": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg"
        //              }
        //            ]
        //          },
        //          "displayName": "Cisco SMARTnet extended service agreement"
        //        },
        //        {
        //          "id": "2",
        //          "parent": null,
        //          "vendorPartNo": "CON-SNT-3702EA",
        //          "manufacturer": "CISCO",
        //          "description": "SMARTNET 8X5XNBD 802.11AC CTRLR AP 4X4",
        //          "quantity": 95,
        //          "unitPrice": 56.21,
        //          "unitPriceFormatted": "56.21",
        //          "totalPrice": 5339.95,
        //          "totalPriceFormatted": "5,339.95",
        //          "msrp": null,
        //          "invoice": null,
        //          "shipDates": null,
        //          "invoices": null,
        //          "trackings": null,
        //          "discounts": null,
        //          "contract": null,
        //          "shortDescription": "Cisco SMARTnet extended service agreement",
        //          "mfrNumber": "CON-SNT-3702EA",
        //          "tdNumber": "11274805",
        //          "upcNumber": null,
        //          "unitListPrice": "73.0000000",
        //          "unitListPriceFormatted": "73.00",
        //          "extendedPrice": null,
        //          "extendedPriceFormatted": "",
        //          "availability": null,
        //          "rebateValue": null,
        //          "urlProductImage": "http://cdn.cnetcontent.com/cd/45/cd45ab63-01c6-4264-a43b-4f54b196f2d7.jpg",
        //          "urlProductSpecs": null,
        //          "children": [],
        //          "agreements": null,
        //          "ancillaryChargesWithTitles": null,
        //          "annuity": null,
        //          "isSubLine": false,
        //          "displayLineNumber": "2",
        //          "licenseStartDate": null,
        //          "licenseEndDate": null,
        //          "contractStartDate": null,
        //          "contractEndDate": null,
        //          "serviceContractDetails": null,
        //          "contractNo": null,
        //          "contractType": null,
        //          "license": null,
        //          "status": null,
        //          "vendorStatus": null,
        //          "customerPOLine": null,
        //          "supplierQuoteRef": null,
        //          "configID": null,
        //          "locationID": null,
        //          "serials": null,
        //          "paKs": null,
        //          "images": {
        //            "75x75": [
        //              {
        //                "id": "cd45ab63-01c6-4264-a43b-4f54b196f2d7",
        //                "url": "http://cdn.cnetcontent.com/cd/45/cd45ab63-01c6-4264-a43b-4f54b196f2d7.jpg",
        //                "type": "Product shot",
        //                "angle": "Front"
        //              }
        //            ],
        //            "400x300": [
        //              {
        //                "id": "dcc8e3b4-2d20-4877-9da2-6f2b6554edac",
        //                "url": "http://cdn.cnetcontent.com/dc/c8/dcc8e3b4-2d20-4877-9da2-6f2b6554edac.jpg",
        //                "type": "Product shot",
        //                "angle": "Front"
        //              }
        //            ],
        //            "200x150": [
        //              {
        //                "id": "c17d51e4-c044-4db8-8862-d8e34ab03e99",
        //                "url": "http://cdn.cnetcontent.com/c1/7d/c17d51e4-c044-4db8-8862-d8e34ab03e99.jpg",
        //                "type": "Product shot",
        //                "angle": "Front"
        //              }
        //            ]
        //          },
        //          "logos": {
        //            "200x150": [
        //              {
        //                "id": "e7ea6e83-4b75-4b7f-b385-6a497622323f",
        //                "url": "http://cdn.cnetcontent.com/e7/ea/e7ea6e83-4b75-4b7f-b385-6a497622323f.jpg"
        //              }
        //            ],
        //            "400x300": [
        //              {
        //                "id": "d2de6a78-ca77-4d75-8508-02326319f617",
        //                "url": "http://cdn.cnetcontent.com/d2/de/d2de6a78-ca77-4d75-8508-02326319f617.jpg"
        //              }
        //            ],
        //            "75x75": [
        //              {
        //                "id": "c50819db-6344-452e-a701-da44b7795b61",
        //                "url": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg"
        //              }
        //            ]
        //          },
        //          "displayName": "Cisco SMARTnet extended service agreement"
        //        },
        //      ],
        //      "id": "121778162",
        //      "orders": [],
        //      "customerPO": "JoseTestNov_quoteAgain-013",
        //      "endUserPO": null,
        //      "poDate": null,
        //      "quoteReference": "CCW-R QuoteId:261044799",
        //      "spaId": null,
        //      "currency": "USD",
        //      "currencySymbol": "$",
        //      "subTotal": 50887.24,
        //      "subTotalFormatted": "50,887.24",
        //      "tier": "Commercial",
        //      "created": "12/01/21",
        //      "expires": "01/01/22",
        //      "buyMethod": "TDAvnet67",
        //      "deals": [],
        //      "attributes": [
        //        { "name": "VENDORQUOTEID", "value": "261044799" },
        //        { "name": "DF_CONFIRMATION_NO", "value": "2838415538" },
        //        { "name": "CustomerPoNumber", "value": "JoseTestNov_quoteAgain-013" },
        //        { "name": "VENDOR", "value": "CISCO" },
        //        { "name": "VENDORQUOTETYPE", "value": "CCW-R" },
        //        {
        //          "name": "INTERNAL_COMMENT",
        //          "value": " Input Order has a product which is not included in Cisco API response: 3000. Additional non-0$ items found on Deal/Quote that were not submitted on order VendorPartNos:CON-ECMU-LCSR5M1Y. "
        //        },
        //        { "name": "ShipCompleteType", "value": "NA" },
        //        { "name": "TAKEOVER", "value": "true" }
        //      ]
        //    }
        //  },
        //  "error": { "code": 0, "messages": [], "isError": false }
        //};
    },
    getOrderDetailsResponse() {
        const  getRandomNumber = (maxValue) => {
            return Math.floor(Math.random() * maxValue + 1);
        };
        const randomStr = (len, arr) => {
            let ans = '';
            for (let i = len; i > 0; i--) {
                ans +=
                  arr[Math.floor(Math.random() * arr.length)];
            }
            return ans.toUpperCase();
        };
        const abc = '123456789abcdefghijkmnlopqrstvuwxyz'
        const randomDate = (start, end) => {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        }

        return {
            "content": {
              "shipTo": {
                "id": null,
                "companyName": "Some Company Name to Display",
                "name": "TECH DATA PRODUCT MANAGEMENT INC",
                "line1": "13472 MARLAY AVENUE",
                "line2": null,
                "line3": null,
                "city": "FONTANA",
                "state": "CA",
                "zip": "92337",
                "postalCode": null,
                "country": "US",
                "email": null,
                "contactEmail": null,
                "phoneNumber": null
              },
              "endUser": [],
              "paymentDetails": {
                "netValue": null,
                "reference": "JoseDemoOctober_quote1",
                "currency": "USD",
                "currencySymbol": "$",
                "paymentTermText": null,
                "subtotal": null,
                "tax": 0.0,
                "freight": 0.0,
                "otherFees": 0.0,
                "total": 0.0
              },
              "customer": "TECH DATA PRODUCT MANAGEMENT INC",
              "items": [
                {
                  "id": "100",
                  "parent": null,
                  "vendorPartNo": "C9200-48P-E",
                  "manufacturer": "CISCO",
                  "description1": null,
                  "quantity": 9,
                  "unitPrice": 0.0,
                  "unitPriceFormatted": "0.00",
                  "totalPrice": 0.0,
                  "totalPriceFormatted": "0.00",
                  "msrp": null,
                  "invoice": null,
                  "shipDates": ['10-6-2021', '10-8-2021'],
                  "invoices": [
                    {
                      "id": "8035189627",
                      "line": "1",
                      "quantity": 3,
                      "price": 38.19,
                      "created": "11-18-2021"
                    }
                  ],
                  "trackings": [
                    {
                      "orderNumber": null,
                      "invoiceNumber": null,
                      "id": null,
                      "carrier": "FEDEX",
                      "serviceLevel": "FEDEX GROUND",
                      "trackingNumber": "486179958091",
                      "trackingLink": "http://www.fedex.com/Tracking?&cntry_code=us&language=english&tracknumbers=486179958091",
                      "type": "W0",
                      "description": "FEDX GRND",
                      "date": "10-06-2021",
                      "dNote": "7038822559",
                      "dNoteLineNumber": "10",
                      "goodsReceiptNo": null
                    }
                  ],
                  "discounts": null,
                  "contract": null,
                  "displayName": "Cisco Catalyst 9200 - Essential Edition - switch - 48 ports - smart - rack-mountable",
                  "mfrNumber": "C9200-48P-E",
                  "tdNumber": "13523591",
                  "upcNumber": null,
                  "unitListPrice": null,
                  "unitListPriceFormatted": null,
                  "extendedPrice": null,
                  "extendedPriceFormatted": "",
                  "availability": null,
                  "rebateValue": null,
                  "urlProductImage": "/non-existing-image.png",
                  "urlProductSpecs": null,
                  "children": [
                    {
                      "id": "101",
                      "parent": "100",
                      "vendorPartNo": null,
                      "manufacturer": "HP ENT",
                      "displayName": "HP DL360P GEN8 S-BUY E5-2620 BASE US SVR",
                      "quantity": 6,
                      "unitPrice": 8572.18,
                      "unitPriceFormatted": "8,572.18",
                      "totalPrice": 51433.08,
                      "totalPriceFormatted": "51,433.08",
                      "msrp": null,
                      "invoice": null,
                      "invoices": [
                        {
                          "id": "8035207610",
                          "line": "2",
                          "quantity": 6,
                          "price": 51433.08,
                          "created": "07-16-2021"              }
                      ],
                      "shipDates": ['10-6-2021', '11-9-2021', '02-22-2021'],
                      "trackings": [
                        {
                          "orderNumber": null,
                          "invoiceNumber": null,
                          "id": null,
                          "carrier": "CAMPBELL'S EXPRESS",
                          "serviceLevel": "LTL",
                          "trackingNumber": "7038809671",
                          "trackingLink": "http://expo.expeditors.com/expo/SQGuest?SearchType=shipmentSearch&TrackingNumber=7038809671",
                          "type": "JV",
                          "displayName": "CAMPBELLS EXPESS",
                          "date": "10-06-2021",
                          "dNote": "7038809671",
                          "dNoteLineNumber": "20",
                          "goodsReceiptNo": null              }
                      ],
                      "discounts": null,
                      "contract": null,
                      "displayName": null,
                      "mfrNumber": "670633-S01",
                      "tdNumber": "10214041",
                      "upcNumber": null,
                      "unitListPrice": null,
                      "unitListPriceFormatted": null,
                      "extendedPrice": null,
                      "extendedPriceFormatted": "",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": "/non-existing-image.png",
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.1",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": [],
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": "shipped",
                      "vendorStatus": null,
                      "customerPOLine": "000100",
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": [
                        "MSNA005",
                        "MSNA001",
                        "MSNA004",
                        "MSNA000",
                        "MSNA002",
                        "MSNA003"            ],
                      "paKs": null,
                      "images": null,
                      "displayName": null          }
                  ],
                  "agreements": null,
                  "ancillaryChargesWithTitles": null,
                  "annuity": null,
                  "isSubLine": false,
                  "displayLineNumber": "1",
                  "licenseStartDate": null,
                  "licenseEndDate": null,
                  "contractStartDate": null,
                  "contractEndDate": null,
                  "serviceContractDetails": null,
                  "contractNo": null,
                  "contractType": null,
                  "license": randomStr(10, abc),
                  "status": "Sales Review",
                  "vendorStatus": null,
                  "customerPOLine": null,
                  "supplierQuoteRef": null,
                  "configID": null,
                  "locationID": null,
                  "serials": [],
                  "paKs": null,
                  "images": null
                },
                {
                  "id": "100",
                  "parent": null,
                  "vendorPartNo": "CON-SNT-C92048PE",
                  "manufacturer": "CISCO",
                  "displayName": null,
                  "quantity": 9,
                  "unitPrice": 0.0,
                  "unitPriceFormatted": "0.00",
                  "totalPrice": 0.0,
                  "totalPriceFormatted": "0.00",
                  "msrp": null,
                  "invoice": null,
                  "invoices": [
                    {
                      "id": "8035189627",
                      "line": "2",
                      "quantity": 3,
                      "price": 16.35,
                      "created": "11-18-2021"
                    }
                  ],
                  "trackings": [
                    {
                      "orderNumber": "6030684674",
                      "invoiceNumber": null,
                      "id": null,
                      "carrier": "FEDEX",
                      "serviceLevel": "FEDEX GROUND",
                      "trackingNumber": "486197188378",
                      "trackingLink": "http://www.fedex.com/Tracking?&cntry_code=us&language=english&tracknumbers=486197188378",
                      "type": "W0",
                      "description1": "FEDX GRND",
                      "date": "07-13-2021",
                      "dNote": "7038811481",
                      "dNoteLineNumber": "30",
                      "goodsReceiptNo": null
                    },
                    {
                      "orderNumber": "6030684674",
                      "invoiceNumber": null,
                      "id": null,
                      "carrier": "FEDEX",
                      "serviceLevel": "FEDEX GROUND",
                      "trackingNumber": "486197188378",
                      "trackingLink": "http://www.fedex.com/Tracking?&cntry_code=us&language=english&tracknumbers=486197188378",
                      "type": "W0",
                      "displayName": "FEDX GRND",
                      "date": "07-13-2021",
                      "dNote": "7038811481",
                      "dNoteLineNumber": "10",
                      "goodsReceiptNo": null
                    }
                  ],
                  "discounts": null,
                  "contract": null,
                  "displayName": "Cisco Smart Net Total Care - extended service agreement",
                  "mfrNumber": "CON-SNT-C92048PE",
                  "tdNumber": "13530066",
                  "upcNumber": null,
                  "unitListPrice": null,
                  "unitListPriceFormatted": null,
                  "extendedPrice": null,
                  "extendedPriceFormatted": "",
                  "availability": null,
                  "rebateValue": null,
                  "urlProductImage": null,
                  "urlProductSpecs": null,
                  "children": [
                    {
                      "id": "101",
                      "parent": "100",
                      "vendorPartNo": null,
                      "manufacturer": "HP ENT",
                      "displayName": "HP DL360P GEN8 S-BUY E5-2620 BASE US SVR",
                      "quantity": 6,
                      "unitPrice": 8572.18,
                      "unitPriceFormatted": "8,572.18",
                      "totalPrice": 51433.08,
                      "totalPriceFormatted": "51,433.08",
                      "msrp": null,
                      "invoice": null,
                      "invoices": [
                        {
                          "id": "8035207610",
                          "line": "2",
                          "quantity": 6,
                          "price": 51433.08,
                          "created": "07-16-2021"              }
                      ],
                      "trackings": [
                        {
                          "orderNumber": null,
                          "invoiceNumber": null,
                          "id": null,
                          "carrier": "CAMPBELL'S EXPRESS",
                          "serviceLevel": "LTL",
                          "trackingNumber": "7038809671",
                          "trackingLink": "http://expo.expeditors.com/expo/SQGuest?SearchType=shipmentSearch&TrackingNumber=7038809671",
                          "type": "JV",
                          "displayName": "CAMPBELLS EXPESS",
                          "date": "10-06-2021",
                          "dNote": "7038809671",
                          "dNoteLineNumber": "20",
                          "goodsReceiptNo": null              }
                      ],
                      "discounts": null,
                      "contract": null,
                      "displayName": null,
                      "mfrNumber": "670633-S01",
                      "tdNumber": "10214041",
                      "upcNumber": null,
                      "unitListPrice": null,
                      "unitListPriceFormatted": null,
                      "extendedPrice": null,
                      "extendedPriceFormatted": "",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": "/non-existing-image.png",
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.1",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": [],
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": "shipped",
                      "vendorStatus": null,
                      "customerPOLine": "000100",
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": [
                        "MSNA005",
                        "MSNA001",
                        "MSNA004",
                        "MSNA000",
                        "MSNA002",
                      "MSNA003"           ],
                      "paKs": null,
                      "images": null,
                      "displayName": null          }
                  ],
                  "agreements": null,
                  "ancillaryChargesWithTitles": null,
                  "annuity": null,
                  "isSubLine": false,
                  "displayLineNumber": "2",
                  "licenseStartDate": null,
                  "licenseEndDate": null,
                  "contractStartDate": null,
                  "contractEndDate": null,
                  "serviceContractDetails": null,
                  "contractNo": 'QEY-V8E-PP',
                  "contractType": null,
                  "license": null,
                  "status": "cancelled",
                  "vendorStatus": null,
                  "customerPOLine": null,
                  "supplierQuoteRef": null,
                  "configID": null,
                  "locationID": null,
                  "serials": [],
                  "paKs": null,
                  "images": null
                },
                {
                  "id": "100",
                  "parent": null,
                  "vendorPartNo": "PWR-C5-BLANK",
                  "manufacturer": "CISCO",
                  "description1": null,
                  "quantity": 9,
                  "unitPrice": 0.0,
                  "unitPriceFormatted": "0.00",
                  "totalPrice": 0.0,
                  "totalPriceFormatted": "0.00",
                  "msrp": null,
                  "invoice": null,
                  "invoices": [
                    {
                      "id": "8035189627",
                      "line": "2",
                      "quantity": 3,
                      "price": 16.35,
                      "created": "11-18-2021"
                    }
                  ],
                  "trackings": [],
                  "discounts": null,
                  "contract": null,
                  "displayName": null,
                  "mfrNumber": "PWR-C5-BLANK",
                  "tdNumber": "14120862",
                  "upcNumber": null,
                  "unitListPrice": null,
                  "unitListPriceFormatted": null,
                  "extendedPrice": null,
                  "extendedPriceFormatted": "",
                  "availability": null,
                  "rebateValue": null,
                  "urlProductImage": null,
                  "urlProductSpecs": null,
                  "children": [
                    {
                      "id": "101",
                      "parent": "100",
                      "vendorPartNo": null,
                      "manufacturer": "HP ENT",
                      "description1": "HP DL360P GEN8 S-BUY E5-2620 BASE US SVR",
                      "quantity": 6,
                      "unitPrice": 8572.18,
                      "unitPriceFormatted": "8,572.18",
                      "totalPrice": 51433.08,
                      "totalPriceFormatted": "51,433.08",
                      "msrp": null,
                      "invoice": null,
                      "invoices": [
                        {
                          "id": "8035207610",
                          "line": "2",
                          "quantity": 6,
                          "price": 51433.08,
                          "created": "07-16-2021"              }
                      ],
                      "trackings": [
                        {
                          "orderNumber": "6030684674",
                          "invoiceNumber": null,
                          "id": null,
                          "carrier": "FEDEX",
                          "serviceLevel": "FEDEX GROUND",
                          "trackingNumber": "486197188378",
                          "trackingLink": "http://www.fedex.com/Tracking?&cntry_code=us&language=english&tracknumbers=486197188378",
                          "type": "W0",
                          "description1": "FEDX GRND",
                          "date": "07-13-2021",
                          "dNote": "7038811481",
                          "dNoteLineNumber": "30",
                          "goodsReceiptNo": null
                        },
                        {
                          "orderNumber": "6030684674",
                          "invoiceNumber": null,
                          "id": null,
                          "carrier": "FEDEX",
                          "serviceLevel": "FEDEX GROUND",
                          "trackingNumber": "486197188378",
                          "trackingLink": "http://www.fedex.com/Tracking?&cntry_code=us&language=english&tracknumbers=486197188378",
                          "type": "W0",
                          "description1": "FEDX GRND",
                          "date": "07-13-2021",
                          "dNote": "7038811481",
                          "dNoteLineNumber": "10",
                          "goodsReceiptNo": null
                        }
                      ],
                      "discounts": null,
                      "contract": null,
                      "displayName": null,
                      "mfrNumber": "670633-S01",
                      "tdNumber": "10214041",
                      "upcNumber": null,
                      "unitListPrice": null,
                      "unitListPriceFormatted": null,
                      "extendedPrice": null,
                      "extendedPriceFormatted": "",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": null,
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.1",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": [],
                      "contracNo1": null,
                      "contractType": null,
                      "license": null,
                      "status": "shipped",
                      "vendorStatus": null,
                      "customerPOLine": "000100",
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": [
                        "MSNA005",
                        "MSNA001",
                        "MSNA004",
                        "MSNA000",
                        "MSNA002",
                        "MSNA003"            ],
                      "paKs": null,
                      "images": null,
                      "displayName": null          }
                  ],
                  "agreements": null,
                  "ancillaryChargesWithTitles": null,
                  "annuity": null,
                  "isSubLine": false,
                  "displayLineNumber": "3",
                  "licenseStartDate": null,
                  "licenseEndDate": null,
                  "contractStartDate": null,
                  "contractEndDate": null,
                  "serviceContractDetails": null,
                  "contractNo": null,
                  "contractType": null,
                  "license": randomStr(10, abc),
                  "status": "inProcess",
                  "vendorStatus": null,
                  "customerPOLine": null,
                  "supplierQuoteRef": null,
                  "configID": null,
                  "locationID": null,
                  "serials": [],
                  "paKs": null,
                  "images": null
                },
                {
                  "id": "100",
                  "parent": null,
                  "vendorPartNo": "C9200-NW-E-48",
                  "manufacturer": "CISCO",
                  "description1": null,
                  "quantity": 9,
                  "unitPrice": 0.0,
                  "unitPriceFormatted": "0.00",
                  "totalPrice": 0.0,
                  "totalPriceFormatted": "0.00",
                  "msrp": null,
                  "invoice": null,
                  "invoices": [
                    {
                      "id": "8035189627",
                      "line": "1",
                      "quantity": 3,
                      "price": 38.19,
                      "created": "11-18-2021"
                    }
                  ],
                  "trackings": [],
                  "discounts": null,
                  "contract": null,
                  "displayName": "Cisco Network Essentials - license - 48 ports",
                  "mfrNumber": "C9200-NW-E-48",
                  "tdNumber": "14173631",
                  "upcNumber": null,
                  "unitListPrice": null,
                  "unitListPriceFormatted": null,
                  "extendedPrice": null,
                  "extendedPriceFormatted": "",
                  "availability": null,
                  "rebateValue": null,
                  "urlProductImage": "/non-existing-image.png",
                  "urlProductSpecs": null,
                  "children": [],
                  "agreements": null,
                  "ancillaryChargesWithTitles": null,
                  "annuity": null,
                  "isSubLine": false,
                  "displayLineNumber": "4",
                  "licenseStartDate": null,
                  "licenseEndDate": null,
                  "contractStartDate": null,
                  "contractEndDate": null,
                  "serviceContractDetails": null,
                  "contractNo": 'ACDF ARKASLD',
                  "contractType": null,
                  "license": null,
                  "status": "inProcess",
                  "vendorStatus": null,
                  "customerPOLine": null,
                  "supplierQuoteRef": null,
                  "configID": null,
                  "locationID": null,
                  "serials": [],
                  "paKs": null,
                  "images": null
                }
              ],
              "orderNumber": "I008137569",
              "poNumber": "JoseDemoOctober_quote1",
              "endUserPO": "CCWR0007_8:35AM",
              "poDate": "1/20/2022",
              "blindPackaging": false,
              "shipComplete": false,
              "canBeExpedited": false,
              "status": "Sales Review"
            },
            "error": { "code": 0, "messages": [], "isError": false }
          }
    },
    getOrdersGridResponse() {
      return {
        "content": {
            "totalItems": 14,
            "pageCount": 1,
            "pageNumber": 1,
            "pageSize": 25,
            "items": [
                {
                    "id": "S300792867",
                    "reseller": "RECURRING_ORDER",
                    "vendor": [
                        {
                            "vendorName": "IPASS"
                        }
                    ],
                    "created": "01/04/22",
                    "shipTo": "SHI INTERNATIONAL CORP",
                    "type": "Web",
                    "price": "58.82",
                    "priceFormatted": "58.82",
                    "currency": "USD",
                    "currencySymbol": "$",
                    "status": "Shipped",
                    "invoice": null,
                    "isReturn": false,
                    "trackings": [],
                    "invoices": [
                        {
                            "id": "8035192051",
                            "line": "",
                            "quantity": 0,
                            "price": 58.82,
                            "created": "01-04-2022"
                        }
                    ]
                },
                {
                    "id": "S300792873",
                    "reseller": "CSP_30/DEC/2021_S1",
                    "vendor": [
                        {
                            "vendorName": "IPASS"
                        },
                        {
                            "vendorName": "MICROSOFT"
                        }
                    ],
                    "created": "01/04/22",
                    "shipTo": "SHI INTERNATIONAL CORP",
                    "type": "Web",
                    "price": "1,902.14",
                    "priceFormatted": "1,902.14",
                    "currency": "USD",
                    "currencySymbol": "$",
                    "status": "Shipped",
                    "invoice": null,
                    "isReturn": false,
                    "trackings": [],
                    "invoices": [
                        {
                            "id": "8035185441",
                            "line": "",
                            "quantity": 0,
                            "price": 1847.04,
                            "created": "01-04-2022"
                        },
                        {
                            "id": "8035192052",
                            "line": "",
                            "quantity": 0,
                            "price": 55.1,
                            "created": "01-04-2022"
                        }
                    ]
                },
                {
                    "id": "S300792868",
                    "reseller": "RECURRING_ORDER",
                    "vendor": [
                        {
                            "vendorName": "IPASS"
                        }
                    ],
                    "created": "01/03/22",
                    "shipTo": "SHI INTERNATIONAL CORP",
                    "type": "Web",
                    "price": "447.71",
                    "priceFormatted": "447.71",
                    "currency": "USD",
                    "currencySymbol": "$",
                    "status": "Sales Review",
                    "invoice": null,
                    "isReturn": false,
                    "trackings": [],
                    "invoices": [
                        {
                            "id": "8035186040",
                            "line": "",
                            "quantity": 0,
                            "price": 388.89,
                            "created": "01-10-2022"
                        },
                        {
                            "id": "8035189046",
                            "line": "",
                            "quantity": 0,
                            "price": 58.82,
                            "created": "01-04-2022"
                        }
                    ]
                },
                {
                    "id": "S300792870",
                    "reseller": "RECURRING_ORDER",
                    "vendor": [
                        {
                            "vendorName": "IPASS"
                        }
                    ],
                    "created": "01/03/22",
                    "shipTo": "SHI INTERNATIONAL CORP",
                    "type": "Web",
                    "price": "20.00",
                    "priceFormatted": "20.00",
                    "currency": "USD",
                    "currencySymbol": "$",
                    "status": "Shipped",
                    "invoice": null,
                    "isReturn": false,
                    "trackings": [],
                    "invoices": [
                        {
                            "id": "8035189047",
                            "line": "",
                            "quantity": 0,
                            "price": 20,
                            "created": "01-04-2022"
                        }
                    ]
                },
                {
                    "id": "S300792871",
                    "reseller": "RECURRING_ORDER",
                    "vendor": [
                        {
                            "vendorName": "IPASS"
                        }
                    ],
                    "created": "01/03/22",
                    "shipTo": "SHI INTERNATIONAL CORP",
                    "type": "Web",
                    "price": "58.82",
                    "priceFormatted": "58.82",
                    "currency": "USD",
                    "currencySymbol": "$",
                    "status": "Open",
                    "invoice": null,
                    "isReturn": false,
                    "trackings": [],
                    "invoices": [
                        {
                            "id": "Pending",
                            "line": "",
                            "quantity": 0,
                            "price": 0,
                            "created": null
                        }
                    ]
                },
                {
                    "id": "S300792853",
                    "reseller": "CSP_10/DEC/2021_S1",
                    "vendor": [
                        {
                            "vendorName": "MICROSOFT"
                        }
                    ],
                    "created": "12/13/21",
                    "shipTo": "SHI INTERNATIONAL CORP",
                    "type": "Web",
                    "price": "1,148.40",
                    "priceFormatted": "1,148.40",
                    "currency": "USD",
                    "currencySymbol": "$",
                    "status": "Shipped",
                    "invoice": null,
                    "isReturn": false,
                    "trackings": [],
                    "invoices": [
                        {
                            "id": "8035185440",
                            "line": "",
                            "quantity": 0,
                            "price": 1094.4,
                            "created": "12-13-2021"
                        },
                        {
                            "id": "8035176499",
                            "line": "",
                            "quantity": 0,
                            "price": 54,
                            "created": "12-13-2021"
                        }
                    ]
                },
                {
                    "id": "S300792847",
                    "reseller": "RECURRING_ORDER",
                    "vendor": [
                        {
                            "vendorName": "IPASS"
                        }
                    ],
                    "created": "12/10/21",
                    "shipTo": "SHI INTERNATIONAL CORP",
                    "type": "Web",
                    "price": "20.00",
                    "priceFormatted": "20.00",
                    "currency": "USD",
                    "currencySymbol": "$",
                    "status": "Shipped",
                    "invoice": null,
                    "isReturn": false,
                    "trackings": [],
                    "invoices": [
                        {
                            "id": "8035185439",
                            "line": "",
                            "quantity": 0,
                            "price": 20,
                            "created": "12-10-2021"
                        }
                    ]
                },
                {
                    "id": "S300792849",
                    "reseller": "RECURRING_ORDER",
                    "vendor": [
                        {
                            "vendorName": "IPASS"
                        }
                    ],
                    "created": "12/10/21",
                    "shipTo": "SHI INTERNATIONAL CORP",
                    "type": "Web",
                    "price": "58.82",
                    "priceFormatted": "58.82",
                    "currency": "USD",
                    "currencySymbol": "$",
                    "status": "Open",
                    "invoice": null,
                    "isReturn": false,
                    "trackings": [],
                    "invoices": [
                        {
                            "id": "Pending",
                            "line": "",
                            "quantity": 0,
                            "price": 0,
                            "created": null
                        }
                    ]
                },
                {
                    "id": "S300792834",
                    "reseller": "RECURRING_ORDER",
                    "vendor": [
                        {
                            "vendorName": "IPASS"
                        }
                    ],
                    "created": "11/30/21",
                    "shipTo": "SHI INTERNATIONAL CORP",
                    "type": "Web",
                    "price": "20.00",
                    "priceFormatted": "20.00",
                    "currency": "USD",
                    "currencySymbol": "$",
                    "status": "Shipped",
                    "invoice": null,
                    "isReturn": false,
                    "trackings": [],
                    "invoices": [
                        {
                            "id": "8035175259",
                            "line": "",
                            "quantity": 0,
                            "price": 20,
                            "created": "11-30-2021"
                        }
                    ]
                },
                {
                    "id": "S300792833",
                    "reseller": "RECURRING_ORDER",
                    "vendor": [
                        {
                            "vendorName": "IPASS"
                        }
                    ],
                    "created": "11/30/21",
                    "shipTo": "SHI INTERNATIONAL CORP",
                    "type": "Web",
                    "price": "20.00",
                    "priceFormatted": "20.00",
                    "currency": "USD",
                    "currencySymbol": "$",
                    "status": "Shipped",
                    "invoice": null,
                    "isReturn": false,
                    "trackings": [],
                    "invoices": [
                        {
                            "id": "8035175258",
                            "line": "",
                            "quantity": 0,
                            "price": 20,
                            "created": "11-30-2021"
                        }
                    ]
                },
                {
                    "id": "S300792825",
                    "reseller": "SEE_LINE_LEVEL_12/JUN/2021",
                    "vendor": [
                        {
                            "vendorName": "IPASS"
                        }
                    ],
                    "created": "11/29/21",
                    "shipTo": "SHI INTERNATIONAL CORP",
                    "type": "Web",
                    "price": "38.45",
                    "priceFormatted": "38.45",
                    "currency": "USD",
                    "currencySymbol": "$",
                    "status": "Shipped",
                    "invoice": null,
                    "isReturn": false,
                    "trackings": [],
                    "invoices": [
                        {
                            "id": "8035176498",
                            "line": "",
                            "quantity": 0,
                            "price": 38.45,
                            "created": "11-29-2021"
                        }
                    ]
                },
                {
                    "id": "S300792832",
                    "reseller": "RECURRING_ORDER",
                    "vendor": [
                        {
                            "vendorName": "IPASS"
                        }
                    ],
                    "created": "11/28/21",
                    "shipTo": "SHI INTERNATIONAL CORP",
                    "type": "Web",
                    "price": "40.00",
                    "priceFormatted": "40.00",
                    "currency": "USD",
                    "currencySymbol": "$",
                    "status": "Shipped",
                    "invoice": null,
                    "isReturn": false,
                    "trackings": [],
                    "invoices": [
                        {
                            "id": "8035173461",
                            "line": "",
                            "quantity": 0,
                            "price": 40,
                            "created": "11-29-2021"
                        }
                    ]
                },
                {
                    "id": "S300792835",
                    "reseller": "RECURRING_ORDER",
                    "vendor": [
                        {
                            "vendorName": "IPASS"
                        }
                    ],
                    "created": "11/28/21",
                    "shipTo": "SHI INTERNATIONAL CORP",
                    "type": "Web",
                    "price": "58.82",
                    "priceFormatted": "58.82",
                    "currency": "USD",
                    "currencySymbol": "$",
                    "status": "Open",
                    "invoice": null,
                    "isReturn": false,
                    "trackings": [],
                    "invoices": [
                        {
                            "id": "Pending",
                            "line": "",
                            "quantity": 0,
                            "price": 0,
                            "created": null
                        }
                    ]
                },
                {
                    "id": "S300792812",
                    "reseller": "RECURRING_ORDER",
                    "vendor": [
                        {
                            "vendorName": "IPASS"
                        }
                    ],
                    "created": "11/18/21",
                    "shipTo": "SHI INTERNATIONAL CORP",
                    "type": "Web",
                    "price": "58.82",
                    "priceFormatted": "58.82",
                    "currency": "USD",
                    "currencySymbol": "$",
                    "status": "Open",
                    "invoice": null,
                    "isReturn": false,
                    "trackings": [],
                    "invoices": [
                        {
                            "id": "Pending",
                            "line": "",
                            "quantity": 0,
                            "price": 0,
                            "created": null
                        }
                    ]
                }
            ]
        },
        "error": {
            "code": 0,
            "messages": [],
            "isError": false
        }
      }
    },
    getConfigGridResponse(sortBy, sortDir) {
      const resp = {
        content: {
          pageNumber: 1,
          pageSize: 25,
          totalItems: 25,
          items: [
            {
              configId: "VG116957111OI",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              expires: "n/a",
              vendor: "Cisco",
              configName: null,
              endUserName: "AVNET TS LTD",
              tdQuoteId: null,
              quotes: [
                {
                  id: "CD_ID__1",
                  line: "Line_863",
                  quantity: 6,
                  price: "54,048.50",
                  priceFormatted: "54,048.50",
                  currency: "USD",
                  currencySymbol: "$",
                  created: "8/8/2021",
                  status: "Created",
                },
                {
                  id: "CD_ID__2",
                  line: "Line_104",
                  quantity: 9,
                  price: "54,048.50",
                  priceFormatted: "54,048.50",
                  currency: "USD",
                  currencySymbol: "$",
                  created: "8/6/2021",
                  status: "Created",
                },
                {
                  id: "CD_ID__2",
                  line: "Line_104",
                  quantity: 9,
                  price: "54,048.50",
                  priceFormatted: "54,048.50",
                  currency: "USD",
                  currencySymbol: "$",
                  created: "8/6/2021",
                  status: "Failed",
                },
                {
                  id: "CD_ID__3",
                  line: "",
                  quantity: 0,
                  price: 0.0,
                  created: "",
                  status: "Expired",
                },
                {
                  id: "",
                  line: "",
                  quantity: 0,
                  price: 0.0,
                  created: "",
                  status: "Pending",
                },
                { "id": "220209164308000130", "salesOrg": "0100", "system": "R3", "status": "IN_PIPELINE", "price": 0.0, "priceFormatted": "0.00", "currency": "USD", "currencySymbol": "$", "created": "01/01/01" }
              ],
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_VG116957111OI_1",
                  line: "Line_780",
                  quantity: 9,
                  price: 4,
                  created: "2021-07-28T13:30:00.7123344Z",
                },
                {
                  id: "CD_ID_VG116957111OI_2",
                  line: "Line_558",
                  quantity: 2,
                  price: 59,
                  created: "2021-08-04T13:30:00.7123387Z",
                },
                {
                  id: "CD_ID_VG116957111OI_3",
                  line: "Line_484",
                  quantity: 6,
                  price: 82,
                  created: "2021-07-31T13:30:00.7123395Z",
                },
                {
                  id: "CD_ID_VG116957111OI_4",
                  line: "Line_421",
                  quantity: 9,
                  price: 97,
                  created: "2021-07-29T13:30:00.7123414Z",
                },
              ],
            },
            {
              configId: "FZ91408441LN",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "EUMETSAT",
              tdQuoteId: null,
              quotes: [
                { "id": "220209164308000130", "salesOrg": "0100", "system": "R3", "status": "IN_PIPELINE", "price": 0.0, "priceFormatted": "0.00", "currency": "USD", "currencySymbol": "$", "created": "01/01/01" }
              ],
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_FZ91408441LN_1",
                  line: "Line_360",
                  quantity: 5,
                  price: 41,
                  created: "2021-07-31T13:30:00.7123421Z",
                },
                {
                  id: "CD_ID_FZ91408441LN_2",
                  line: "Line_807",
                  quantity: 6,
                  price: 68,
                  created: "2021-08-04T13:30:00.7123427Z",
                },
                {
                  id: "CD_ID_FZ91408441LN_3",
                  line: "Line_711",
                  quantity: 9,
                  price: 54,
                  created: "2021-07-28T13:30:00.7123432Z",
                },
              ],
            },
            {
              configId: "RX119069703KD",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: null,
              tdQuoteId: null,
              quotes: [
                {
                  id: "CD_ID__1",
                  line: "Line_863",
                  quantity: 6,
                  price: 54.0,
                  created: "8/8/2021",
                  status: "Pending",
                },
              ],
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_RX119069703KD_1",
                  line: "Line_686",
                  quantity: 1,
                  price: 87,
                  created: "2021-08-05T13:30:00.7123437Z",
                },
                {
                  id: "CD_ID_RX119069703KD_2",
                  line: "Line_343",
                  quantity: 2,
                  price: 65,
                  created: "2021-08-03T13:30:00.7123444Z",
                },
                {
                  id: "CD_ID_RX119069703KD_3",
                  line: "Line_252",
                  quantity: 7,
                  price: 23,
                  created: "2021-08-02T13:30:00.7123449Z",
                },
                {
                  id: "CD_ID_RX119069703KD_4",
                  line: "Line_211",
                  quantity: 3,
                  price: 18,
                  created: "2021-07-28T13:30:00.7123453Z",
                },
              ],
            },
            {
              configId: "GV77554631XP",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "AXCIOM UK LTD",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_GV77554631XP_1",
                  line: "Line_508",
                  quantity: 7,
                  price: 4,
                  created: "2021-08-02T13:30:00.7123459Z",
                },
                {
                  id: "CD_ID_GV77554631XP_2",
                  line: "Line_549",
                  quantity: 7,
                  price: 65,
                  created: "2021-07-31T13:30:00.7123465Z",
                },
                {
                  id: "CD_ID_GV77554631XP_3",
                  line: "Line_160",
                  quantity: 4,
                  price: 30,
                  created: "2021-07-31T13:30:00.7123469Z",
                },
              ],
            },
            {
              configId: "VI112127534ZT",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "VITALITY CORPORATE SERVICES LTD",
              tdQuoteId: null,
              quotes: [
                {
                  id: "CD_ID__3",
                  line: "",
                  quantity: 0,
                  price: 0.0,
                  created: "",
                  status: "Expired",
                },
              ],
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_VI112127534ZT_1",
                  line: "Line_422",
                  quantity: 1,
                  price: 40,
                  created: "2021-08-03T13:30:00.7123475Z",
                },
                {
                  id: "CD_ID_VI112127534ZT_2",
                  line: "Line_852",
                  quantity: 6,
                  price: 79,
                  created: "2021-08-02T13:30:00.712348Z",
                },
                {
                  id: "CD_ID_VI112127534ZT_3",
                  line: "Line_13",
                  quantity: 5,
                  price: 5,
                  created: "2021-07-29T13:30:00.7123486Z",
                },
              ],
            },
            {
              configId: "SN120740841PY",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "NIKE",
              tdQuoteId: null,
              quotes: [
                {
                  id: "CD_ID__2",
                  line: "Line_104",
                  quantity: 9,
                  price: "54,048.50",
                  priceFormatted: "54,048.50",
                  currency: "USD",
                  currencySymbol: "$",
                  created: "8/6/2021",
                  status: "Failed",
                },
              ],
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_SN120740841PY_1",
                  line: "Line_932",
                  quantity: 2,
                  price: 60,
                  created: "2021-07-28T13:30:00.7123492Z",
                },
                {
                  id: "CD_ID_SN120740841PY_2",
                  line: "Line_625",
                  quantity: 8,
                  price: 63,
                  created: "2021-08-02T13:30:00.7123497Z",
                },
              ],
            },
            {
              configId: "BB119209153JS",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "NIKE",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_BB119209153JS_1",
                  line: "Line_749",
                  quantity: 9,
                  price: 11,
                  created: "2021-08-02T13:30:00.7123503Z",
                },
                {
                  id: "CD_ID_BB119209153JS_2",
                  line: "Line_830",
                  quantity: 7,
                  price: 91,
                  created: "2021-08-02T13:30:00.7123509Z",
                },
                {
                  id: "CD_ID_BB119209153JS_3",
                  line: "Line_868",
                  quantity: 6,
                  price: 3,
                  created: "2021-08-02T13:30:00.7123514Z",
                },
              ],
            },
            {
              configId: "AH119209147IG",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "NIKE",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_AH119209147IG_1",
                  line: "Line_780",
                  quantity: 6,
                  price: 54,
                  created: "2021-08-01T13:30:00.712352Z",
                },
                {
                  id: "CD_ID_AH119209147IG_2",
                  line: "Line_15",
                  quantity: 4,
                  price: 18,
                  created: "2021-07-28T13:30:00.7123525Z",
                },
                {
                  id: "CD_ID_AH119209147IG_3",
                  line: "Line_231",
                  quantity: 8,
                  price: 95,
                  created: "2021-08-05T13:30:00.712353Z",
                },
                {
                  id: "CD_ID_AH119209147IG_4",
                  line: "Line_745",
                  quantity: 4,
                  price: 5,
                  created: "2021-08-03T13:30:00.7123535Z",
                },
              ],
            },
            {
              configId: "YR116957121WZ",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "NIKE",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_YR116957121WZ_1",
                  line: "Line_466",
                  quantity: 2,
                  price: 59,
                  created: "2021-08-01T13:30:00.7123541Z",
                },
                {
                  id: "CD_ID_YR116957121WZ_2",
                  line: "Line_715",
                  quantity: 1,
                  price: 59,
                  created: "2021-07-31T13:30:00.7123546Z",
                },
                {
                  id: "CD_ID_YR116957121WZ_3",
                  line: "Line_610",
                  quantity: 2,
                  price: 16,
                  created: "2021-08-01T13:30:00.7123551Z",
                },
                {
                  id: "CD_ID_YR116957121WZ_4",
                  line: "Line_397",
                  quantity: 5,
                  price: 11,
                  created: "2021-08-03T13:30:00.7123556Z",
                },
              ],
            },
            {
              configId: "WC121011624NR",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "NIKE",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_WC121011624NR_1",
                  line: "Line_559",
                  quantity: 6,
                  price: 32,
                  created: "2021-07-31T13:30:00.7123562Z",
                },
                {
                  id: "CD_ID_WC121011624NR_2",
                  line: "Line_144",
                  quantity: 2,
                  price: 19,
                  created: "2021-07-28T13:30:00.7123567Z",
                },
                {
                  id: "CD_ID_WC121011624NR_3",
                  line: "Line_197",
                  quantity: 9,
                  price: 73,
                  created: "2021-08-04T13:30:00.7123572Z",
                },
              ],
            },
            {
              configId: "LL116577524NC",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "NIKE",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_LL116577524NC_1",
                  line: "Line_686",
                  quantity: 3,
                  price: 31,
                  created: "2021-08-02T13:30:00.7123577Z",
                },
                {
                  id: "CD_ID_LL116577524NC_2",
                  line: "Line_220",
                  quantity: 6,
                  price: 59,
                  created: "2021-08-03T13:30:00.7123582Z",
                },
                {
                  id: "CD_ID_LL116577524NC_3",
                  line: "Line_924",
                  quantity: 4,
                  price: 96,
                  created: "2021-07-31T13:30:00.7123594Z",
                },
                {
                  id: "CD_ID_LL116577524NC_4",
                  line: "Line_306",
                  quantity: 9,
                  price: 55,
                  created: "2021-07-28T13:30:00.71236Z",
                },
                {
                  id: "CD_ID_LL116577524NC_5",
                  line: "Line_603",
                  quantity: 6,
                  price: 63,
                  created: "2021-08-03T13:30:00.7123605Z",
                },
              ],
            },
            {
              configId: "RZ93817768PM",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "WTS GLOBAL",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_RZ93817768PM_1",
                  line: "Line_598",
                  quantity: 4,
                  price: 32,
                  created: "2021-07-28T13:30:00.7123611Z",
                },
                {
                  id: "CD_ID_RZ93817768PM_2",
                  line: "Line_530",
                  quantity: 9,
                  price: 32,
                  created: "2021-08-03T13:30:00.7123616Z",
                },
                {
                  id: "CD_ID_RZ93817768PM_3",
                  line: "Line_436",
                  quantity: 3,
                  price: 34,
                  created: "2021-08-04T13:30:00.7123621Z",
                },
              ],
            },
            {
              configId: "DI114806079WY",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "AVNET TS LTD",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_DI114806079WY_1",
                  line: "Line_165",
                  quantity: 2,
                  price: 34,
                  created: "2021-07-28T13:30:00.7123627Z",
                },
                {
                  id: "CD_ID_DI114806079WY_2",
                  line: "Line_38",
                  quantity: 9,
                  price: 27,
                  created: "2021-07-30T13:30:00.7123632Z",
                },
              ],
            },
            {
              configId: "IZ118585707YL",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
            },
            {
              configId: "FZ91408441LN",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "EUMETSAT",
              tdQuoteId: null,
              quotes: [
                {
                  id: "CD_ID__1",
                  line: "Line_863",
                  quantity: 6,
                  price: 54.0,
                  created: "8/8/2021",
                  status: "Created",
                },
              ],
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_FZ91408441LN_1",
                  line: "Line_360",
                  quantity: 5,
                  price: 41,
                  created: "2021-07-31T13:30:00.7123421Z",
                },
                {
                  id: "CD_ID_FZ91408441LN_2",
                  line: "Line_807",
                  quantity: 6,
                  price: 68,
                  created: "2021-08-04T13:30:00.7123427Z",
                },
                {
                  id: "CD_ID_FZ91408441LN_3",
                  line: "Line_711",
                  quantity: 9,
                  price: 54,
                  created: "2021-07-28T13:30:00.7123432Z",
                },
              ],
            },
            {
              configId: "RX119069703KD",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: null,
              tdQuoteId: null,
              quotes: [
                {
                  id: "CD_ID__1",
                  line: "Line_863",
                  quantity: 6,
                  price: 54.0,
                  created: "8/8/2021",
                  status: "Pending",
                },
              ],
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_RX119069703KD_1",
                  line: "Line_686",
                  quantity: 1,
                  price: 87,
                  created: "2021-08-05T13:30:00.7123437Z",
                },
                {
                  id: "CD_ID_RX119069703KD_2",
                  line: "Line_343",
                  quantity: 2,
                  price: 65,
                  created: "2021-08-03T13:30:00.7123444Z",
                },
                {
                  id: "CD_ID_RX119069703KD_3",
                  line: "Line_252",
                  quantity: 7,
                  price: 23,
                  created: "2021-08-02T13:30:00.7123449Z",
                },
                {
                  id: "CD_ID_RX119069703KD_4",
                  line: "Line_211",
                  quantity: 3,
                  price: 18,
                  created: "2021-07-28T13:30:00.7123453Z",
                },
              ],
            },
            {
              configId: "GV77554631XP",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "AXCIOM UK LTD",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_GV77554631XP_1",
                  line: "Line_508",
                  quantity: 7,
                  price: 4,
                  created: "2021-08-02T13:30:00.7123459Z",
                },
                {
                  id: "CD_ID_GV77554631XP_2",
                  line: "Line_549",
                  quantity: 7,
                  price: 65,
                  created: "2021-07-31T13:30:00.7123465Z",
                },
                {
                  id: "CD_ID_GV77554631XP_3",
                  line: "Line_160",
                  quantity: 4,
                  price: 30,
                  created: "2021-07-31T13:30:00.7123469Z",
                },
              ],
            },
            {
              configId: "VI112127534ZT",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "VITALITY CORPORATE SERVICES LTD",
              tdQuoteId: null,
              quotes: [
                {
                  id: "CD_ID__3",
                  line: "",
                  quantity: 0,
                  price: 0.0,
                  created: "",
                  status: "Expired",
                },
              ],
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_VI112127534ZT_1",
                  line: "Line_422",
                  quantity: 1,
                  price: 40,
                  created: "2021-08-03T13:30:00.7123475Z",
                },
                {
                  id: "CD_ID_VI112127534ZT_2",
                  line: "Line_852",
                  quantity: 6,
                  price: 79,
                  created: "2021-08-02T13:30:00.712348Z",
                },
                {
                  id: "CD_ID_VI112127534ZT_3",
                  line: "Line_13",
                  quantity: 5,
                  price: 5,
                  created: "2021-07-29T13:30:00.7123486Z",
                },
              ],
            },
            {
              configId: "SN120740841PY",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "NIKE",
              tdQuoteId: null,
              quotes: [
                {
                  id: "CD_ID__2",
                  line: "Line_104",
                  quantity: 9,
                  price: "54,048.50",
                  priceFormatted: "54,048.50",
                  currency: "USD",
                  currencySymbol: "$",
                  created: "8/6/2021",
                  status: "Failed",
                },
              ],
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_SN120740841PY_1",
                  line: "Line_932",
                  quantity: 2,
                  price: 60,
                  created: "2021-07-28T13:30:00.7123492Z",
                },
                {
                  id: "CD_ID_SN120740841PY_2",
                  line: "Line_625",
                  quantity: 8,
                  price: 63,
                  created: "2021-08-02T13:30:00.7123497Z",
                },
              ],
            },
            {
              configId: "BB119209153JS",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "NIKE",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_BB119209153JS_1",
                  line: "Line_749",
                  quantity: 9,
                  price: 11,
                  created: "2021-08-02T13:30:00.7123503Z",
                },
                {
                  id: "CD_ID_BB119209153JS_2",
                  line: "Line_830",
                  quantity: 7,
                  price: 91,
                  created: "2021-08-02T13:30:00.7123509Z",
                },
                {
                  id: "CD_ID_BB119209153JS_3",
                  line: "Line_868",
                  quantity: 6,
                  price: 3,
                  created: "2021-08-02T13:30:00.7123514Z",
                },
              ],
            },
            {
              configId: "AH119209147IG",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "NIKE",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_AH119209147IG_1",
                  line: "Line_780",
                  quantity: 6,
                  price: 54,
                  created: "2021-08-01T13:30:00.712352Z",
                },
                {
                  id: "CD_ID_AH119209147IG_2",
                  line: "Line_15",
                  quantity: 4,
                  price: 18,
                  created: "2021-07-28T13:30:00.7123525Z",
                },
                {
                  id: "CD_ID_AH119209147IG_3",
                  line: "Line_231",
                  quantity: 8,
                  price: 95,
                  created: "2021-08-05T13:30:00.712353Z",
                },
                {
                  id: "CD_ID_AH119209147IG_4",
                  line: "Line_745",
                  quantity: 4,
                  price: 5,
                  created: "2021-08-03T13:30:00.7123535Z",
                },
              ],
            },
            {
              configId: "YR116957121WZ",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "NIKE",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_YR116957121WZ_1",
                  line: "Line_466",
                  quantity: 2,
                  price: 59,
                  created: "2021-08-01T13:30:00.7123541Z",
                },
                {
                  id: "CD_ID_YR116957121WZ_2",
                  line: "Line_715",
                  quantity: 1,
                  price: 59,
                  created: "2021-07-31T13:30:00.7123546Z",
                },
                {
                  id: "CD_ID_YR116957121WZ_3",
                  line: "Line_610",
                  quantity: 2,
                  price: 16,
                  created: "2021-08-01T13:30:00.7123551Z",
                },
                {
                  id: "CD_ID_YR116957121WZ_4",
                  line: "Line_397",
                  quantity: 5,
                  price: 11,
                  created: "2021-08-03T13:30:00.7123556Z",
                },
              ],
            },
            {
              configId: "WC121011624NR",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "NIKE",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_WC121011624NR_1",
                  line: "Line_559",
                  quantity: 6,
                  price: 32,
                  created: "2021-07-31T13:30:00.7123562Z",
                },
                {
                  id: "CD_ID_WC121011624NR_2",
                  line: "Line_144",
                  quantity: 2,
                  price: 19,
                  created: "2021-07-28T13:30:00.7123567Z",
                },
                {
                  id: "CD_ID_WC121011624NR_3",
                  line: "Line_197",
                  quantity: 9,
                  price: 73,
                  created: "2021-08-04T13:30:00.7123572Z",
                },
              ],
            },
            {
              configId: "LL116577524NC",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "NIKE",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_LL116577524NC_1",
                  line: "Line_686",
                  quantity: 3,
                  price: 31,
                  created: "2021-08-02T13:30:00.7123577Z",
                },
                {
                  id: "CD_ID_LL116577524NC_2",
                  line: "Line_220",
                  quantity: 6,
                  price: 59,
                  created: "2021-08-03T13:30:00.7123582Z",
                },
                {
                  id: "CD_ID_LL116577524NC_3",
                  line: "Line_924",
                  quantity: 4,
                  price: 96,
                  created: "2021-07-31T13:30:00.7123594Z",
                },
                {
                  id: "CD_ID_LL116577524NC_4",
                  line: "Line_306",
                  quantity: 9,
                  price: 55,
                  created: "2021-07-28T13:30:00.71236Z",
                },
                {
                  id: "CD_ID_LL116577524NC_5",
                  line: "Line_603",
                  quantity: 6,
                  price: 63,
                  created: "2021-08-03T13:30:00.7123605Z",
                },
              ],
            },
            {
              configId: "RZ93817768PM",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "WTS GLOBAL",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_RZ93817768PM_1",
                  line: "Line_598",
                  quantity: 4,
                  price: 32,
                  created: "2021-07-28T13:30:00.7123611Z",
                },
                {
                  id: "CD_ID_RZ93817768PM_2",
                  line: "Line_530",
                  quantity: 9,
                  price: 32,
                  created: "2021-08-03T13:30:00.7123616Z",
                },
                {
                  id: "CD_ID_RZ93817768PM_3",
                  line: "Line_436",
                  quantity: 3,
                  price: 34,
                  created: "2021-08-04T13:30:00.7123621Z",
                },
              ],
            },
            {
              configId: "DI114806079WY",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "AVNET TS LTD",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_DI114806079WY_1",
                  line: "Line_165",
                  quantity: 2,
                  price: 34,
                  created: "2021-07-28T13:30:00.7123627Z",
                },
                {
                  id: "CD_ID_DI114806079WY_2",
                  line: "Line_38",
                  quantity: 9,
                  price: 27,
                  created: "2021-07-30T13:30:00.7123632Z",
                },
              ],
            },
            {
              configId: "IZ118585707YL",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "EUMETSAT",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_IZ118585707YL_1",
                  line: "Line_676",
                  quantity: 1,
                  price: 80,
                  created: "2021-08-02T13:30:00.7123638Z",
                },
                {
                  id: "CD_ID_IZ118585707YL_2",
                  line: "Line_184",
                  quantity: 6,
                  price: 36,
                  created: "2021-07-30T13:30:00.7123643Z",
                },
                {
                  id: "CD_ID_IZ118585707YL_3",
                  line: "Line_378",
                  quantity: 4,
                  price: 38,
                  created: "2021-08-04T13:30:00.7123648Z",
                },
                {
                  id: "CD_ID_IZ118585707YL_4",
                  line: "Line_532",
                  quantity: 8,
                  price: 76,
                  created: "2021-08-02T13:30:00.7123653Z",
                },
              ],
            },
            {
              configId: "XQ116957118HQ",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "NIKE",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_XQ116957118HQ_1",
                  line: "Line_543",
                  quantity: 5,
                  price: 63,
                  created: "2021-07-31T13:30:00.7123659Z",
                },
                {
                  id: "CD_ID_XQ116957118HQ_2",
                  line: "Line_191",
                  quantity: 6,
                  price: 18,
                  created: "2021-08-02T13:30:00.7123665Z",
                },
              ],
            },
            {
              configId: "OK116957113XB",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "AVNET TS LTD",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_OK116957113XB_1",
                  line: "Line_279",
                  quantity: 6,
                  price: 14,
                  created: "2021-08-03T13:30:00.712367Z",
                },
                {
                  id: "CD_ID_OK116957113XB_2",
                  line: "Line_548",
                  quantity: 2,
                  price: 71,
                  created: "2021-08-02T13:30:00.7123675Z",
                },
                {
                  id: "CD_ID_OK116957113XB_3",
                  line: "Line_453",
                  quantity: 8,
                  price: 77,
                  created: "2021-07-30T13:30:00.712368Z",
                },
                {
                  id: "CD_ID_OK116957113XB_4",
                  line: "Line_556",
                  quantity: 5,
                  price: 42,
                  created: "2021-07-29T13:30:00.7123685Z",
                },
              ],
            },
            {
              configId: "DX117055392DU",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "Tech Data Azlan",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_DX117055392DU_1",
                  line: "Line_302",
                  quantity: 2,
                  price: 83,
                  created: "2021-07-28T13:30:00.7123691Z",
                },
                {
                  id: "CD_ID_DX117055392DU_2",
                  line: "Line_314",
                  quantity: 9,
                  price: 38,
                  created: "2021-07-31T13:30:00.7123696Z",
                },
              ],
            },
            {
              configId: "VT116852093GP",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "AVNET TS LTD",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_VT116852093GP_1",
                  line: "Line_684",
                  quantity: 1,
                  price: 16,
                  created: "2021-08-03T13:30:00.7123702Z",
                },
                {
                  id: "CD_ID_VT116852093GP_2",
                  line: "Line_173",
                  quantity: 2,
                  price: 20,
                  created: "2021-08-05T13:30:00.7123708Z",
                },
              ],
            },
            {
              configId: "RH116936683UF",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: null,
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_RH116936683UF_1",
                  line: "Line_852",
                  quantity: 8,
                  price: 10,
                  created: "2021-07-30T13:30:00.7123713Z",
                },
                {
                  id: "CD_ID_RH116936683UF_2",
                  line: "Line_527",
                  quantity: 7,
                  price: 64,
                  created: "2021-08-02T13:30:00.7123718Z",
                },
              ],
            },
            {
              configId: "GP116942601FT",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: null,
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_GP116942601FT_1",
                  line: "Line_258",
                  quantity: 3,
                  price: 97,
                  created: "2021-08-01T13:30:00.7123724Z",
                },
                {
                  id: "CD_ID_GP116942601FT_2",
                  line: "Line_742",
                  quantity: 3,
                  price: 24,
                  created: "2021-08-05T13:30:00.712373Z",
                },
              ],
            },
            {
              configId: "HE116856613ZL",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "AVNET TS LTD",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_HE116856613ZL_1",
                  line: "Line_226",
                  quantity: 6,
                  price: 10,
                  created: "2021-07-31T13:30:00.7123735Z",
                },
                {
                  id: "CD_ID_HE116856613ZL_2",
                  line: "Line_530",
                  quantity: 3,
                  price: 25,
                  created: "2021-08-01T13:30:00.7123741Z",
                },
                {
                  id: "CD_ID_HE116856613ZL_3",
                  line: "Line_913",
                  quantity: 9,
                  price: 56,
                  created: "2021-07-29T13:30:00.7123746Z",
                },
              ],
            },
            {
              configId: "PM114055193ZJ",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: null,
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_PM114055193ZJ_1",
                  line: "Line_951",
                  quantity: 4,
                  price: 85,
                  created: "2021-07-28T13:30:00.7123751Z",
                },
                {
                  id: "CD_ID_PM114055193ZJ_2",
                  line: "Line_673",
                  quantity: 8,
                  price: 19,
                  created: "2021-08-05T13:30:00.7123767Z",
                },
              ],
            },
            {
              configId: "KP115520116KI",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "AVNET TS LTD",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_KP115520116KI_1",
                  line: "Line_166",
                  quantity: 9,
                  price: 45,
                  created: "2021-08-01T13:30:00.7123773Z",
                },
                {
                  id: "CD_ID_KP115520116KI_2",
                  line: "Line_996",
                  quantity: 8,
                  price: 21,
                  created: "2021-07-28T13:30:00.7123779Z",
                },
                {
                  id: "CD_ID_KP115520116KI_3",
                  line: "Line_488",
                  quantity: 1,
                  price: 97,
                  created: "2021-08-05T13:30:00.7123784Z",
                },
                {
                  id: "CD_ID_KP115520116KI_4",
                  line: "Line_272",
                  quantity: 4,
                  price: 65,
                  created: "2021-07-30T13:30:00.7123789Z",
                },
              ],
            },
            {
              configId: "TS114826584DF",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "AVNET TS LTD",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_TS114826584DF_1",
                  line: "Line_678",
                  quantity: 3,
                  price: 81,
                  created: "2021-08-01T13:30:00.7123794Z",
                },
                {
                  id: "CD_ID_TS114826584DF_2",
                  line: "Line_315",
                  quantity: 5,
                  price: 65,
                  created: "2021-07-29T13:30:00.7123799Z",
                },
                {
                  id: "CD_ID_TS114826584DF_3",
                  line: "Line_759",
                  quantity: 1,
                  price: 58,
                  created: "2021-07-30T13:30:00.7123804Z",
                },
              ],
            },
            {
              configId: "MM116066602KC",
              configurationType: "Estimate",
              created: "0001-01-01T00:00:00",
              vendor: "Cisco",
              configName: null,
              endUserName: "AVNET TS LTD",
              tdQuoteId: null,
              vendorQuoteId: null,
              action: "CreateQuote",
              details: [
                {
                  id: "CD_ID_MM116066602KC_1",
                  line: "Line_28",
                  quantity: 6,
                  price: 2,
                  created: "2021-08-03T13:30:00.712381Z",
                },
                {
                  id: "CD_ID_MM116066602KC_2",
                  line: "Line_565",
                  quantity: 5,
                  price: 90,
                  created: "2021-08-04T13:30:00.7123816Z",
                },
                {
                  id: "CD_ID_MM116066602KC_3",
                  line: "Line_920",
                  quantity: 4,
                  price: 28,
                  created: "2021-08-03T13:30:00.7123821Z",
                },
                {
                  id: "CD_ID_MM116066602KC_4",
                  line: "Line_696",
                  quantity: 1,
                  price: 68,
                  created: "2021-08-01T13:30:00.7123826Z",
                },
              ],
            },
          ],
        },
        error: {
          code: 0,
          messages: [],
          isError: false,
        },
      };
      resp.content.items.sort(this.sortItems(sortBy, sortDir));
      return resp;
    },
    getQuotePreviewResponse() {
      return {
        "content": {
          "quotePreview": {
            "quoteDetails": {
              "shipTo": null,
              "endUser": [
                {
                  "id": null,
                  "companyName": "ASOLO HOSPITAL SERVICE SPA",
                  "name": "Michele Franceschi",
                  "line1": "V OSPEDALE 18",
                  "line2": null,
                  "line3": null,
                  "city": "CASTELFRANCO VENETO",
                  "state": "TV",
                  "zip": null,
                  "postalCode": "31033",
                  "country": "IT",
                  "email": "michele.franceschi@coopservice.it",
                  "contactEmail": null,
                  "phoneNumber": null
                }
              ],
              "reseller": [
                {
                  "id": "38048612",
                  "companyName": null,
                  "name": " ",
                  "line1": null,
                  "line2": null,
                  "line3": null,
                  "city": null,
                  "state": null,
                  "zip": null,
                  "postalCode": null,
                  "country": null,
                  "email": null,
                  "contactEmail": null,
                  "phoneNumber": null
                }
              ],
              "source": {
                "type": "Deal",
                "value": "53901574"
              },
              "notes": null,
              "items": [
                {
                  "id": "1.0",
                  "parent": null,
                  "vendorPartNo": "C9300X-12Y-A",
                  "manufacturer": "CISCO",
                  "description": "Catalyst 9300X 12x25G Fiber Ports, modular uplink Switch",
                  "quantity": 7,
                  "unitPrice": null,
                  "unitPriceFormatted": "",
                  "totalPrice": null,
                  "totalPriceFormatted": "",
                  "msrp": null,
                  "invoice": null,
                  "shipDates": null,
                  "invoices": null,
                  "trackings": null,
                  "discounts": [
                    {
                      "type": null,
                      "value": 42,
                      "formattedValue": null
                    },
                    {
                      "type": null,
                      "value": 42,
                      "formattedValue": null
                    },
                    {
                      "type": null,
                      "value": 0,
                      "formattedValue": null
                    },
                    {
                      "type": null,
                      "value": 42,
                      "formattedValue": null
                    },
                    {
                      "type": null,
                      "value": 0,
                      "formattedValue": null
                    },
                    {
                      "type": null,
                      "value": 0,
                      "formattedValue": null
                    },
                    {
                      "type": null,
                      "value": 42,
                      "formattedValue": null
                    }
                  ],
                  "contract": null,
                  "shortDescription": "Catalyst 9300X 12x25G Fiber Ports, modular uplink Switch",
                  "mfrNumber": "C9300X-12Y-A",
                  "tdNumber": "",
                  "upcNumber": null,
                  "unitPriceCurrency": null,
                  "unitCost": 0,
                  "unitCostCurrency": null,
                  "unitListPrice": 20057.02,
                  "unitListPriceCurrency": null,
                  "extendedListPrice": 0,
                  "unitListPriceFormatted": "20,057.02",
                  "extendedPrice": "81431.49",
                  "extendedPriceFormatted": "81431.49",
                  "availability": null,
                  "rebateValue": null,
                  "urlProductImage": null,
                  "urlProductSpecs": null,
                  "children": [
                    {
                      "id": "1.0.1",
                      "parent": "1.0",
                      "vendorPartNo": "CON-SSSNT-C9300X21",
                      "manufacturer": "CISCO",
                      "description": "SOLN SUPP 8X5XNBD Catalyst 9300X 12x25G Fiber Ports, modul",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 35,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 35,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 35,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 35,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y12M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": "SSSNT",
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "SOLN SUPP 8X5XNBD Catalyst 9300X 12x25G Fiber Ports, modul",
                      "mfrNumber": "CON-SSSNT-C9300X21",
                      "tdNumber": null,
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 1845.75,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "1,845.75",
                      "extendedPrice": "8398.18",
                      "extendedPriceFormatted": "8398.18",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": null,
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.0.1",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": null,
                      "logos": null,
                      "displayName": "SOLN SUPP 8X5XNBD Catalyst 9300X 12x25G Fiber Ports, modul",
                      "authorization": {
                        "canOrder": false,
                        "canViewPrice": false,
                        "customerCanView": false
                      },
                      "posType": "",
                      "purchaseCost": 1199.74,
                      "attributes": null
                    },
                    {
                      "id": "1.1",
                      "parent": "1.0",
                      "vendorPartNo": "SC9300UK9-175",
                      "manufacturer": "CISCO",
                      "description": "Cisco Catalyst 9300 XE 17.5 UNIVERSAL UNIVERSAL",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y0M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": null,
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "Cisco Catalyst 9300 XE 17.5 UNIVERSAL UNIVERSAL",
                      "mfrNumber": "SC9300UK9-175",
                      "tdNumber": null,
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": null,
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.1",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": null,
                      "logos": null,
                      "displayName": "Cisco Catalyst 9300 XE 17.5 UNIVERSAL UNIVERSAL",
                      "authorization": {
                        "canOrder": false,
                        "canViewPrice": false,
                        "customerCanView": false
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    },
                    {
                      "id": "1.2",
                      "parent": "1.0",
                      "vendorPartNo": "PWR-C1-715WAC-P",
                      "manufacturer": "CISCO",
                      "description": "715W AC 80+ platinum Config 1 Power Supply",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y0M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": null,
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "Cisco Config 1 - power supply - hot-plug / redundant - 715 Watt",
                      "mfrNumber": "PWR-C1-715WAC-P",
                      "tdNumber": "14154830",
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": "http://cdn.cnetcontent.com/e5/1d/e51d33dd-091a-4558-9f1f-37e51ad98071.jpg",
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.2",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": {
                        "75x75": [
                          {
                            "id": "e51d33dd-091a-4558-9f1f-37e51ad98071",
                            "url": "http://cdn.cnetcontent.com/e5/1d/e51d33dd-091a-4558-9f1f-37e51ad98071.jpg",
                            "type": "Product shot",
                            "angle": "Right-angle"
                          }
                        ],
                        "640x480": [
                          {
                            "id": "2117f4ea-dd66-4ebc-832e-417aa2951ede",
                            "url": "http://cdn.cnetcontent.com/21/17/2117f4ea-dd66-4ebc-832e-417aa2951ede.jpg",
                            "type": "Product shot",
                            "angle": "Right-angle"
                          }
                        ],
                        "200x150": [
                          {
                            "id": "991ef749-b972-4081-8048-4d15232a0f14",
                            "url": "http://cdn.cnetcontent.com/99/1e/991ef749-b972-4081-8048-4d15232a0f14.jpg",
                            "type": "Product shot",
                            "angle": "Right-angle"
                          }
                        ],
                        "400x300": [
                          {
                            "id": "d33eed49-176d-4a15-a9e3-fecf6d6845a1",
                            "url": "http://cdn.cnetcontent.com/d3/3e/d33eed49-176d-4a15-a9e3-fecf6d6845a1.jpg",
                            "type": "Product shot",
                            "angle": "Right-angle"
                          }
                        ]
                      },
                      "logos": {
                        "200x150": [
                          {
                            "id": "e7ea6e83-4b75-4b7f-b385-6a497622323f",
                            "url": "http://cdn.cnetcontent.com/e7/ea/e7ea6e83-4b75-4b7f-b385-6a497622323f.jpg"
                          }
                        ],
                        "400x300": [
                          {
                            "id": "d2de6a78-ca77-4d75-8508-02326319f617",
                            "url": "http://cdn.cnetcontent.com/d2/de/d2de6a78-ca77-4d75-8508-02326319f617.jpg"
                          }
                        ],
                        "75x75": [
                          {
                            "id": "c50819db-6344-452e-a701-da44b7795b61",
                            "url": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg"
                          }
                        ]
                      },
                      "displayName": "Cisco Config 1 - power supply - hot-plug / redundant - 715 Watt",
                      "authorization": {
                        "canOrder": true,
                        "canViewPrice": true,
                        "customerCanView": true
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    },
                    {
                      "id": "1.3",
                      "parent": "1.0",
                      "vendorPartNo": "C9300-SPS-NONE",
                      "manufacturer": "CISCO",
                      "description": "No Secondary Power Supply Selected",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y0M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": null,
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "No Secondary Power Supply Selected",
                      "mfrNumber": "C9300-SPS-NONE",
                      "tdNumber": "14173557",
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": " https://uat.dc.tdebusiness.cloud/content/dam/techdata/digital-commerce-platform/product-default-images/80000719.png",
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.3",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": {
                        "130x80": [
                          {
                            "id": "80000719.png",
                            "url": " https://uat.dc.tdebusiness.cloud/content/dam/techdata/digital-commerce-platform/product-default-images/80000719.png",
                            "type": "Category Image",
                            "angle": "Front"
                          }
                        ]
                      },
                      "logos": {},
                      "displayName": "No Secondary Power Supply Selected",
                      "authorization": {
                        "canOrder": true,
                        "canViewPrice": true,
                        "customerCanView": true
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    },
                    {
                      "id": "1.4",
                      "parent": "1.0",
                      "vendorPartNo": "CAB-TA-EU",
                      "manufacturer": "CISCO",
                      "description": "Europe AC Type A Power Cable",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y0M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": null,
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "Cisco power cable - 8 ft",
                      "mfrNumber": "CAB-TA-EU",
                      "tdNumber": "14119555",
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.4",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": {},
                      "logos": {
                        "200x150": [
                          {
                            "id": "e7ea6e83-4b75-4b7f-b385-6a497622323f",
                            "url": "http://cdn.cnetcontent.com/e7/ea/e7ea6e83-4b75-4b7f-b385-6a497622323f.jpg"
                          }
                        ],
                        "400x300": [
                          {
                            "id": "d2de6a78-ca77-4d75-8508-02326319f617",
                            "url": "http://cdn.cnetcontent.com/d2/de/d2de6a78-ca77-4d75-8508-02326319f617.jpg"
                          }
                        ],
                        "75x75": [
                          {
                            "id": "c50819db-6344-452e-a701-da44b7795b61",
                            "url": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg"
                          }
                        ]
                      },
                      "displayName": "Cisco power cable - 8 ft",
                      "authorization": {
                        "canOrder": true,
                        "canViewPrice": true,
                        "customerCanView": true
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    },
                    {
                      "id": "1.5",
                      "parent": "1.0",
                      "vendorPartNo": "C9300X-NW-A-12",
                      "manufacturer": "CISCO",
                      "description": "C9300 Network Advantage, 12-port license",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y0M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": null,
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "C9300 Network Advantage, 12-port license",
                      "mfrNumber": "C9300X-NW-A-12",
                      "tdNumber": null,
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": null,
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.5",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": null,
                      "logos": null,
                      "displayName": "C9300 Network Advantage, 12-port license",
                      "authorization": {
                        "canOrder": false,
                        "canViewPrice": false,
                        "customerCanView": false
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    },
                    {
                      "id": "1.6",
                      "parent": "1.0",
                      "vendorPartNo": "C9300-STACK-NONE",
                      "manufacturer": "CISCO",
                      "description": "No Stack Cable Selected",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y0M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": null,
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "Cisco configuration option",
                      "mfrNumber": "C9300-STACK-NONE",
                      "tdNumber": "14173558",
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.6",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": {},
                      "logos": {
                        "200x150": [
                          {
                            "id": "e7ea6e83-4b75-4b7f-b385-6a497622323f",
                            "url": "http://cdn.cnetcontent.com/e7/ea/e7ea6e83-4b75-4b7f-b385-6a497622323f.jpg"
                          }
                        ],
                        "400x300": [
                          {
                            "id": "d2de6a78-ca77-4d75-8508-02326319f617",
                            "url": "http://cdn.cnetcontent.com/d2/de/d2de6a78-ca77-4d75-8508-02326319f617.jpg"
                          }
                        ],
                        "75x75": [
                          {
                            "id": "c50819db-6344-452e-a701-da44b7795b61",
                            "url": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg"
                          }
                        ]
                      },
                      "displayName": "Cisco configuration option",
                      "authorization": {
                        "canOrder": true,
                        "canViewPrice": true,
                        "customerCanView": true
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    },
                    {
                      "id": "1.7",
                      "parent": "1.0",
                      "vendorPartNo": "C9300-SPWR-NONE",
                      "manufacturer": "CISCO",
                      "description": "No Stack Power Cable Selected",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y0M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": null,
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "Cisco configuration option",
                      "mfrNumber": "C9300-SPWR-NONE",
                      "tdNumber": "14173584",
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.7",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": {},
                      "logos": {
                        "200x150": [
                          {
                            "id": "e7ea6e83-4b75-4b7f-b385-6a497622323f",
                            "url": "http://cdn.cnetcontent.com/e7/ea/e7ea6e83-4b75-4b7f-b385-6a497622323f.jpg"
                          }
                        ],
                        "400x300": [
                          {
                            "id": "d2de6a78-ca77-4d75-8508-02326319f617",
                            "url": "http://cdn.cnetcontent.com/d2/de/d2de6a78-ca77-4d75-8508-02326319f617.jpg"
                          }
                        ],
                        "75x75": [
                          {
                            "id": "c50819db-6344-452e-a701-da44b7795b61",
                            "url": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg"
                          }
                        ]
                      },
                      "displayName": "Cisco configuration option",
                      "authorization": {
                        "canOrder": true,
                        "canViewPrice": true,
                        "customerCanView": true
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    },
                    {
                      "id": "1.8",
                      "parent": "1.0",
                      "vendorPartNo": "SSD-240G",
                      "manufacturer": "CISCO",
                      "description": "Cisco pluggable USB3.0 SSD storage",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y0M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": null,
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "Cisco pluggable USB3.0 SSD storage",
                      "mfrNumber": "SSD-240G",
                      "tdNumber": "14265386",
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": " https://uat.dc.tdebusiness.cloud/content/dam/techdata/digital-commerce-platform/product-default-images/80000229.png",
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.8",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": {
                        "130x80": [
                          {
                            "id": "80000229.png",
                            "url": " https://uat.dc.tdebusiness.cloud/content/dam/techdata/digital-commerce-platform/product-default-images/80000229.png",
                            "type": "Category Image",
                            "angle": "Front"
                          }
                        ]
                      },
                      "logos": {},
                      "displayName": "Cisco pluggable USB3.0 SSD storage",
                      "authorization": {
                        "canOrder": true,
                        "canViewPrice": true,
                        "customerCanView": true
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    },
                    {
                      "id": "1.9",
                      "parent": "1.0",
                      "vendorPartNo": "PWR-C1-BLANK",
                      "manufacturer": "CISCO",
                      "description": "Config 1 Power Supply Blank",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y0M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": null,
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "Cisco power supply slot cover",
                      "mfrNumber": "PWR-C1-BLANK",
                      "tdNumber": "14118113",
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.9",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": {},
                      "logos": {
                        "200x150": [
                          {
                            "id": "e7ea6e83-4b75-4b7f-b385-6a497622323f",
                            "url": "http://cdn.cnetcontent.com/e7/ea/e7ea6e83-4b75-4b7f-b385-6a497622323f.jpg"
                          }
                        ],
                        "400x300": [
                          {
                            "id": "d2de6a78-ca77-4d75-8508-02326319f617",
                            "url": "http://cdn.cnetcontent.com/d2/de/d2de6a78-ca77-4d75-8508-02326319f617.jpg"
                          }
                        ],
                        "75x75": [
                          {
                            "id": "c50819db-6344-452e-a701-da44b7795b61",
                            "url": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg"
                          }
                        ]
                      },
                      "displayName": "Cisco power supply slot cover",
                      "authorization": {
                        "canOrder": true,
                        "canViewPrice": true,
                        "customerCanView": true
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    },
                    {
                      "id": "1.10",
                      "parent": "1.0",
                      "vendorPartNo": "C9300X-NM-BLANK",
                      "manufacturer": "CISCO",
                      "description": "Catalyst 9300 Network Module Blank Module",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y0M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": null,
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "Catalyst 9300 Network Module Blank Module",
                      "mfrNumber": "C9300X-NM-BLANK",
                      "tdNumber": null,
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": null,
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.10",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": null,
                      "logos": null,
                      "displayName": "Catalyst 9300 Network Module Blank Module",
                      "authorization": {
                        "canOrder": false,
                        "canViewPrice": false,
                        "customerCanView": false
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    },
                    {
                      "id": "1.11",
                      "parent": "1.0",
                      "vendorPartNo": "C9300X-DNA-12Y-A",
                      "manufacturer": "CISCO",
                      "description": "C9300 DNA Advantage, Term License",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y0M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": null,
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "C9300 DNA Advantage, Term License",
                      "mfrNumber": "C9300X-DNA-12Y-A",
                      "tdNumber": null,
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": null,
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.11",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": null,
                      "logos": null,
                      "displayName": "C9300 DNA Advantage, Term License",
                      "authorization": {
                        "canOrder": false,
                        "canViewPrice": false,
                        "customerCanView": false
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    },
                    {
                      "id": "1.12",
                      "parent": "1.0",
                      "vendorPartNo": "PI-LFAS-T",
                      "manufacturer": "CISCO",
                      "description": "Prime Infrastructure Lifecycle & Assurance Term - Smart Lic",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y0M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": null,
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "Cisco Prime Infrastructure Lifecycle and Assurance - Term License - 1 license",
                      "mfrNumber": "PI-LFAS-T",
                      "tdNumber": "14118810",
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.12",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": {},
                      "logos": {
                        "200x150": [
                          {
                            "id": "e7ea6e83-4b75-4b7f-b385-6a497622323f",
                            "url": "http://cdn.cnetcontent.com/e7/ea/e7ea6e83-4b75-4b7f-b385-6a497622323f.jpg"
                          }
                        ],
                        "400x300": [
                          {
                            "id": "d2de6a78-ca77-4d75-8508-02326319f617",
                            "url": "http://cdn.cnetcontent.com/d2/de/d2de6a78-ca77-4d75-8508-02326319f617.jpg"
                          }
                        ],
                        "75x75": [
                          {
                            "id": "c50819db-6344-452e-a701-da44b7795b61",
                            "url": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg"
                          }
                        ]
                      },
                      "displayName": "Cisco Prime Infrastructure Lifecycle and Assurance - Term License - 1 license",
                      "authorization": {
                        "canOrder": true,
                        "canViewPrice": true,
                        "customerCanView": true
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    },
                    {
                      "id": "1.13",
                      "parent": "1.0",
                      "vendorPartNo": "TE-EMBEDDED-T",
                      "manufacturer": "CISCO",
                      "description": "Cisco ThousandEyes Enterprise Agent IBN Embedded",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 32,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 32,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 32,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 32,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y0M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": null,
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "Cisco ThousandEyes Enterprise Agent IBN",
                      "mfrNumber": "TE-EMBEDDED-T",
                      "tdNumber": "14265380",
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": " https://uat.dc.tdebusiness.cloud/content/dam/techdata/digital-commerce-platform/product-default-images/80000404.png",
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.13",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": {
                        "130x80": [
                          {
                            "id": "80000404.png",
                            "url": " https://uat.dc.tdebusiness.cloud/content/dam/techdata/digital-commerce-platform/product-default-images/80000404.png",
                            "type": "Category Image",
                            "angle": "Front"
                          }
                        ]
                      },
                      "logos": {},
                      "displayName": "Cisco ThousandEyes Enterprise Agent IBN",
                      "authorization": {
                        "canOrder": true,
                        "canViewPrice": true,
                        "customerCanView": true
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    },
                    {
                      "id": "1.14",
                      "parent": "1.0",
                      "vendorPartNo": "C9300X-NM-NONE",
                      "manufacturer": "CISCO",
                      "description": "Catalyst 9300 No-Network Module Selection",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y0M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": null,
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "Catalyst 9300 No-Network Module Selection",
                      "mfrNumber": "C9300X-NM-NONE",
                      "tdNumber": null,
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": null,
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.14",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": null,
                      "logos": null,
                      "displayName": "Catalyst 9300 No-Network Module Selection",
                      "authorization": {
                        "canOrder": false,
                        "canViewPrice": false,
                        "customerCanView": false
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    },
                    {
                      "id": "1.15",
                      "parent": "1.0",
                      "vendorPartNo": "NETWORK-PNP-LIC",
                      "manufacturer": "CISCO",
                      "description": "Network Plug-n-Play Connect for zero-touch device deployment",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y0M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": null,
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "Cisco Network Plug-n-Play Connect - license - 1 license",
                      "mfrNumber": "NETWORK-PNP-LIC",
                      "tdNumber": "14118344",
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.15",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": {},
                      "logos": {
                        "200x150": [
                          {
                            "id": "e7ea6e83-4b75-4b7f-b385-6a497622323f",
                            "url": "http://cdn.cnetcontent.com/e7/ea/e7ea6e83-4b75-4b7f-b385-6a497622323f.jpg"
                          }
                        ],
                        "400x300": [
                          {
                            "id": "d2de6a78-ca77-4d75-8508-02326319f617",
                            "url": "http://cdn.cnetcontent.com/d2/de/d2de6a78-ca77-4d75-8508-02326319f617.jpg"
                          }
                        ],
                        "75x75": [
                          {
                            "id": "c50819db-6344-452e-a701-da44b7795b61",
                            "url": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg"
                          }
                        ]
                      },
                      "displayName": "Cisco Network Plug-n-Play Connect - license - 1 license",
                      "authorization": {
                        "canOrder": true,
                        "canViewPrice": true,
                        "customerCanView": true
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    },
                    {
                      "id": "1.11.0.1",
                      "parent": "1.11",
                      "vendorPartNo": "CON-SSTCM-C9300XXD",
                      "manufacturer": "CISCO",
                      "description": "SOLN SUPP SW SUB C9300 DNA Advantage,",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 35,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 35,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 35,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 35,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y12M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": "SSTCM",
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "SOLN SUPP SW SUB C9300 DNA Advantage,",
                      "mfrNumber": "CON-SSTCM-C9300XXD",
                      "tdNumber": null,
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 116.15,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "116.15",
                      "extendedPrice": "528.50",
                      "extendedPriceFormatted": "528.50",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": null,
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.11.0.1",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": null,
                      "logos": null,
                      "displayName": "SOLN SUPP SW SUB C9300 DNA Advantage,",
                      "authorization": {
                        "canOrder": false,
                        "canViewPrice": false,
                        "customerCanView": false
                      },
                      "posType": "",
                      "purchaseCost": 75.5,
                      "attributes": null
                    },
                    {
                      "id": "1.11.1",
                      "parent": "1.11",
                      "vendorPartNo": "C9300-DNA-L-A-3Y",
                      "manufacturer": "CISCO",
                      "description": "DNA Advantage 3 Year License",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y36M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": "SSTC",
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "DNA Advantage 3 Year License",
                      "mfrNumber": "C9300-DNA-L-A-3Y",
                      "tdNumber": null,
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 2371.45,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "2,371.45",
                      "extendedPrice": "9628.08",
                      "extendedPriceFormatted": "9628.08",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": null,
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.11.1",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": null,
                      "logos": null,
                      "displayName": "DNA Advantage 3 Year License",
                      "authorization": {
                        "canOrder": false,
                        "canViewPrice": false,
                        "customerCanView": false
                      },
                      "posType": "",
                      "purchaseCost": 1375.44,
                      "attributes": null
                    },
                    {
                      "id": "1.12.1",
                      "parent": "1.12",
                      "vendorPartNo": "PI-LFAS-AP-T-3Y",
                      "manufacturer": "CISCO",
                      "description": "PI Dev Lic for Lifecycle & Assurance Term 3Y",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 42,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y36M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": "SSTC",
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "Cisco Prime Infrastructure Lifecycle and Assurance - Term License (3 years) - 1 device",
                      "mfrNumber": "PI-LFAS-AP-T-3Y",
                      "tdNumber": "14155542",
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.12.1",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": {},
                      "logos": {
                        "200x150": [
                          {
                            "id": "e7ea6e83-4b75-4b7f-b385-6a497622323f",
                            "url": "http://cdn.cnetcontent.com/e7/ea/e7ea6e83-4b75-4b7f-b385-6a497622323f.jpg"
                          }
                        ],
                        "400x300": [
                          {
                            "id": "d2de6a78-ca77-4d75-8508-02326319f617",
                            "url": "http://cdn.cnetcontent.com/d2/de/d2de6a78-ca77-4d75-8508-02326319f617.jpg"
                          }
                        ],
                        "75x75": [
                          {
                            "id": "c50819db-6344-452e-a701-da44b7795b61",
                            "url": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg"
                          }
                        ]
                      },
                      "displayName": "Cisco Prime Infrastructure Lifecycle and Assurance - Term License (3 years) - 1 device",
                      "authorization": {
                        "canOrder": true,
                        "canViewPrice": true,
                        "customerCanView": true
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    },
                    {
                      "id": "1.13.1",
                      "parent": "1.13",
                      "vendorPartNo": "TE-EMBEDDED-T-3Y",
                      "manufacturer": "CISCO",
                      "description": "ThousandEyes - Enterprise Agents",
                      "quantity": 7,
                      "unitPrice": null,
                      "unitPriceFormatted": "",
                      "totalPrice": null,
                      "totalPriceFormatted": "",
                      "msrp": null,
                      "invoice": null,
                      "shipDates": null,
                      "invoices": null,
                      "trackings": null,
                      "discounts": [
                        {
                          "type": null,
                          "value": 32,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 32,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 32,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 0,
                          "formattedValue": null
                        },
                        {
                          "type": null,
                          "value": 32,
                          "formattedValue": null
                        }
                      ],
                      "contract": {
                        "id": null,
                        "status": null,
                        "duration": "P0Y36M0DT0H0M",
                        "renewedDuration": null,
                        "startDate": null,
                        "endDate": null,
                        "newAgreementStartDate": null,
                        "newAgreementEndDate": null,
                        "newUsagePeriodStartDate": null,
                        "newUsagePeriodEndDate": null,
                        "supportLevel": null,
                        "serviceLevel": "SSTC",
                        "usagePeriod": null,
                        "renewalTerm": 0
                      },
                      "shortDescription": "ThousandEyes - Enterprise Agents",
                      "mfrNumber": "TE-EMBEDDED-T-3Y",
                      "tdNumber": null,
                      "upcNumber": null,
                      "unitPriceCurrency": null,
                      "unitCost": 0,
                      "unitCostCurrency": null,
                      "unitListPrice": 0,
                      "unitListPriceCurrency": null,
                      "extendedListPrice": 0,
                      "unitListPriceFormatted": "0.00",
                      "extendedPrice": "0.00",
                      "extendedPriceFormatted": "0.00",
                      "availability": null,
                      "rebateValue": null,
                      "urlProductImage": null,
                      "urlProductSpecs": null,
                      "children": null,
                      "agreements": null,
                      "ancillaryChargesWithTitles": null,
                      "annuity": null,
                      "isSubLine": false,
                      "displayLineNumber": "1.13.1",
                      "licenseStartDate": null,
                      "licenseEndDate": null,
                      "contractStartDate": null,
                      "contractEndDate": null,
                      "serviceContractDetails": null,
                      "contractNo": null,
                      "contractType": null,
                      "license": null,
                      "status": null,
                      "vendorStatus": null,
                      "customerPOLine": null,
                      "supplierQuoteRef": null,
                      "configID": null,
                      "locationID": null,
                      "serials": null,
                      "paKs": null,
                      "images": null,
                      "logos": null,
                      "displayName": "ThousandEyes - Enterprise Agents",
                      "authorization": {
                        "canOrder": false,
                        "canViewPrice": false,
                        "customerCanView": false
                      },
                      "posType": "",
                      "purchaseCost": 0,
                      "attributes": null
                    }
                  ],
                  "agreements": null,
                  "ancillaryChargesWithTitles": null,
                  "annuity": null,
                  "isSubLine": false,
                  "displayLineNumber": "1.0",
                  "licenseStartDate": null,
                  "licenseEndDate": null,
                  "contractStartDate": null,
                  "contractEndDate": null,
                  "serviceContractDetails": null,
                  "contractNo": null,
                  "contractType": null,
                  "license": null,
                  "status": null,
                  "vendorStatus": null,
                  "customerPOLine": null,
                  "supplierQuoteRef": null,
                  "configID": null,
                  "locationID": null,
                  "serials": null,
                  "paKs": null,
                  "images": null,
                  "logos": null,
                  "displayName": "Catalyst 9300X 12x25G Fiber Ports, modular uplink Switch",
                  "authorization": {
                    "canOrder": false,
                    "canViewPrice": false,
                    "customerCanView": false
                  },
                  "posType": "",
                  "purchaseCost": 11633.07,
                  "attributes": null
                },
                {
                  "id": "2.0",
                  "parent": null,
                  "vendorPartNo": "CAB-SPWR-150CM=",
                  "manufacturer": "CISCO",
                  "description": "Catalyst Stack Power Cable 150 CM Spare",
                  "quantity": 7,
                  "unitPrice": null,
                  "unitPriceFormatted": "",
                  "totalPrice": null,
                  "totalPriceFormatted": "",
                  "msrp": null,
                  "invoice": null,
                  "shipDates": null,
                  "invoices": null,
                  "trackings": null,
                  "discounts": [
                    {
                      "type": null,
                      "value": 42,
                      "formattedValue": null
                    },
                    {
                      "type": null,
                      "value": 42,
                      "formattedValue": null
                    },
                    {
                      "type": null,
                      "value": 0,
                      "formattedValue": null
                    },
                    {
                      "type": null,
                      "value": 42,
                      "formattedValue": null
                    },
                    {
                      "type": null,
                      "value": 0,
                      "formattedValue": null
                    },
                    {
                      "type": null,
                      "value": 0,
                      "formattedValue": null
                    },
                    {
                      "type": null,
                      "value": 42,
                      "formattedValue": null
                    }
                  ],
                  "contract": null,
                  "shortDescription": "Cisco StackPower - power cable - 5 ft",
                  "mfrNumber": "CAB-SPWR-150CM=",
                  "tdNumber": "10117336",
                  "upcNumber": null,
                  "unitPriceCurrency": null,
                  "unitCost": 0,
                  "unitCostCurrency": null,
                  "unitListPrice": 253.96,
                  "unitListPriceCurrency": null,
                  "extendedListPrice": 0,
                  "unitListPriceFormatted": "253.96",
                  "extendedPrice": "1031.10",
                  "extendedPriceFormatted": "1031.10",
                  "availability": null,
                  "rebateValue": null,
                  "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                  "urlProductSpecs": null,
                  "children": [],
                  "agreements": null,
                  "ancillaryChargesWithTitles": null,
                  "annuity": null,
                  "isSubLine": false,
                  "displayLineNumber": "2.0",
                  "licenseStartDate": null,
                  "licenseEndDate": null,
                  "contractStartDate": null,
                  "contractEndDate": null,
                  "serviceContractDetails": null,
                  "contractNo": null,
                  "contractType": null,
                  "license": null,
                  "status": null,
                  "vendorStatus": null,
                  "customerPOLine": null,
                  "supplierQuoteRef": null,
                  "configID": null,
                  "locationID": null,
                  "serials": null,
                  "paKs": null,
                  "images": {},
                  "logos": {
                    "200x150": [
                      {
                        "id": "e7ea6e83-4b75-4b7f-b385-6a497622323f",
                        "url": "http://cdn.cnetcontent.com/e7/ea/e7ea6e83-4b75-4b7f-b385-6a497622323f.jpg"
                      }
                    ],
                    "400x300": [
                      {
                        "id": "d2de6a78-ca77-4d75-8508-02326319f617",
                        "url": "http://cdn.cnetcontent.com/d2/de/d2de6a78-ca77-4d75-8508-02326319f617.jpg"
                      }
                    ],
                    "75x75": [
                      {
                        "id": "c50819db-6344-452e-a701-da44b7795b61",
                        "url": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg"
                      }
                    ]
                  },
                  "displayName": "Cisco StackPower - power cable - 5 ft",
                  "authorization": {
                    "canOrder": true,
                    "canViewPrice": true,
                    "customerCanView": true
                  },
                  "posType": "",
                  "purchaseCost": 147.3,
                  "attributes": null
                },
              ],
              "id": null,
              "orders": null,
              "customerPO": null,
              "endUserPO": null,
              "poDate": null,
              "quoteReference": null,
              "spaId": null,
              "currency": "USD",
              "currencySymbol": "$",
              "subTotal": 249880.96,
              "subTotalFormatted": "249,880.96",
              "tier": null,
              "configurationId": "53901574",
              "description": "ASOLO HOSPITAL SERVICE SPA Quote",
              "vendor": "CISCO",
              "buyMethod": "tdavnet67",
              "customerBuyMethod": 'TDANDAVT', //'AVT' //"TD",//"TDANDAVT",
              "distiBuyMethod": 'AVT Technology Solutions LLC', // 'TECH DATA', "AVT Technology Solutions LLC",
              "isExclusive": null,
              "attributes": null
            }
          }
        },
        "error": {
          "code": 0,
          "messages": [],
          "isError": false
        }
      }
  },
  sortItems(sortBy, sortDir){
    let sortOrder = sortDir === 'asc' ? 1 : -1;
    return (itm1, itm2) => {
      let result = (itm1[sortBy] < itm2[sortBy])
        ? -1
        : (itm1[sortBy] > itm2[sortBy]) ? 1 : 0;
      return result * sortOrder;
    }
  }
};
