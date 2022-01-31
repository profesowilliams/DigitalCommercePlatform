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
        const itemDefinition = {
            id: "123456789",
            version: "1",
            vendorId: "2323232",
            selectionFlag: "flag",
        };
        for (let i = 0; i < arrayLength; i++) {
            ids.push(itemDefinition);
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
        return {
          "content": {
            "details": {
              "shipTo": {
                "id": null,
                "companyName": "TECH DATA PRODUCT MANAGEMENT INC",
                "name": null,
                "line1": "13472 MARLAY AVENUE",
                "line2": null,
                "line3": null,
                "city": "FONTANA",
                "state": "CA",
                "zip": null,
                "postalCode": "92337",
                "country": "US",
                "email": null,
                "contactEmail": null,
                "phoneNumber": null
              },
              "endUser": {
                "id": null,
                "companyName": "COLINX",
                "name": "Jose  Caceres",
                "line1": "1536 GENESIS ROAD",
                "line2": null,
                "line3": null,
                "city": "CROSSVILLE",
                "state": "TN",
                "zip": null,
                "postalCode": "38555",
                "country": "US",
                "email": "jcaceres@techdata.com",
                "contactEmail": null,
                "phoneNumber": "666666666"
              },
              "reseller": {
                "id": null,
                "companyName": "SHI INTERNATIONAL CORP",
                "name": "XML TEST  XML TEST",
                "line1": "290 Davidson Ave",
                "line2": " ",
                "line3": null,
                "city": "Somerset",
                "state": "NJ",
                "zip": null,
                "postalCode": "08873-4145",
                "country": "US",
                "email": "noreply@techdata.com",
                "contactEmail": null,
                "phoneNumber": null
              },
              "source": [{ "type": "Vendor Quote", "value": "261044799" }],
              "notes": null,
              "items": [
                {
                  "id": "1",
                  "parent": null,
                  "vendorPartNo": "CON-SNTP-2901VSCC",
                  "manufacturer": "CISCO",
                  "description": "SMARTNT 24X7X4 C2901 CUBE BDL PVDM3-16 U",
                  "quantity": 1,
                  "unitPrice": 583.66,
                  "unitPriceFormatted": "583.66",
                  "totalPrice": 583.66,
                  "totalPriceFormatted": "583.66",
                  "msrp": null,
                  "invoice": null,
                  "shipDates": null,
                  "invoices": null,
                  "trackings": null,
                  "discounts": null,
                  "contract": null,
                  "shortDescription": "Cisco SMARTnet extended service agreement",
                  "mfrNumber": "CON-SNTP-2901VSCC",
                  "tdNumber": "10132983",
                  "upcNumber": null,
                  "unitListPrice": "606.0000000",
                  "unitListPriceFormatted": "606.00",
                  "extendedPrice": null,
                  "extendedPriceFormatted": "",
                  "availability": null,
                  "rebateValue": null,
                  "urlProductImage": "http://cdn.cnetcontent.com/cd/45/cd45ab63-01c6-4264-a43b-4f54b196f2d7.jpg",
                  "urlProductSpecs": null,
                  "children": [],
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
                        "id": "cd45ab63-01c6-4264-a43b-4f54b196f2d7",
                        "url": "http://cdn.cnetcontent.com/cd/45/cd45ab63-01c6-4264-a43b-4f54b196f2d7.jpg",
                        "type": "Product shot",
                        "angle": "Front"
                      }
                    ],
                    "400x300": [
                      {
                        "id": "dcc8e3b4-2d20-4877-9da2-6f2b6554edac",
                        "url": "http://cdn.cnetcontent.com/dc/c8/dcc8e3b4-2d20-4877-9da2-6f2b6554edac.jpg",
                        "type": "Product shot",
                        "angle": "Front"
                      }
                    ],
                    "200x150": [
                      {
                        "id": "c17d51e4-c044-4db8-8862-d8e34ab03e99",
                        "url": "http://cdn.cnetcontent.com/c1/7d/c17d51e4-c044-4db8-8862-d8e34ab03e99.jpg",
                        "type": "Product shot",
                        "angle": "Front"
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
                  "displayName": "Cisco SMARTnet extended service agreement"
                },
                {
                  "id": "2",
                  "parent": null,
                  "vendorPartNo": "CON-SNT-3702EA",
                  "manufacturer": "CISCO",
                  "description": "SMARTNET 8X5XNBD 802.11AC CTRLR AP 4X4",
                  "quantity": 95,
                  "unitPrice": 56.21,
                  "unitPriceFormatted": "56.21",
                  "totalPrice": 5339.95,
                  "totalPriceFormatted": "5,339.95",
                  "msrp": null,
                  "invoice": null,
                  "shipDates": null,
                  "invoices": null,
                  "trackings": null,
                  "discounts": null,
                  "contract": null,
                  "shortDescription": "Cisco SMARTnet extended service agreement",
                  "mfrNumber": "CON-SNT-3702EA",
                  "tdNumber": "11274805",
                  "upcNumber": null,
                  "unitListPrice": "73.0000000",
                  "unitListPriceFormatted": "73.00",
                  "extendedPrice": null,
                  "extendedPriceFormatted": "",
                  "availability": null,
                  "rebateValue": null,
                  "urlProductImage": "http://cdn.cnetcontent.com/cd/45/cd45ab63-01c6-4264-a43b-4f54b196f2d7.jpg",
                  "urlProductSpecs": null,
                  "children": [],
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
                        "id": "cd45ab63-01c6-4264-a43b-4f54b196f2d7",
                        "url": "http://cdn.cnetcontent.com/cd/45/cd45ab63-01c6-4264-a43b-4f54b196f2d7.jpg",
                        "type": "Product shot",
                        "angle": "Front"
                      }
                    ],
                    "400x300": [
                      {
                        "id": "dcc8e3b4-2d20-4877-9da2-6f2b6554edac",
                        "url": "http://cdn.cnetcontent.com/dc/c8/dcc8e3b4-2d20-4877-9da2-6f2b6554edac.jpg",
                        "type": "Product shot",
                        "angle": "Front"
                      }
                    ],
                    "200x150": [
                      {
                        "id": "c17d51e4-c044-4db8-8862-d8e34ab03e99",
                        "url": "http://cdn.cnetcontent.com/c1/7d/c17d51e4-c044-4db8-8862-d8e34ab03e99.jpg",
                        "type": "Product shot",
                        "angle": "Front"
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
                  "displayName": "Cisco SMARTnet extended service agreement"
                },
              ],
              "id": "121778162",
              "orders": [],
              "customerPO": "JoseTestNov_quoteAgain-013",
              "endUserPO": null,
              "poDate": null,
              "quoteReference": "CCW-R QuoteId:261044799",
              "spaId": null,
              "currency": "USD",
              "currencySymbol": "$",
              "subTotal": 50887.24,
              "subTotalFormatted": "50,887.24",
              "tier": "Commercial",
              "created": "12/01/21",
              "expires": "01/01/22",
              "buyMethod": "TDAvnet67",
              "deals": [],
              "attributes": [
                { "name": "VENDORQUOTEID", "value": "261044799" },
                { "name": "DF_CONFIRMATION_NO", "value": "2838415538" },
                { "name": "CustomerPoNumber", "value": "JoseTestNov_quoteAgain-013" },
                { "name": "VENDOR", "value": "CISCO" },
                { "name": "VENDORQUOTETYPE", "value": "CCW-R" },
                {
                  "name": "INTERNAL_COMMENT",
                  "value": " Input Order has a product which is not included in Cisco API response: 3000. Additional non-0$ items found on Deal/Quote that were not submitted on order VendorPartNos:CON-ECMU-LCSR5M1Y. "
                },
                { "name": "ShipCompleteType", "value": "NA" },
                { "name": "TAKEOVER", "value": "true" }
              ]
            }
          },
          "error": { "code": 0, "messages": [], "isError": false }
        };
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
                "companyName": null,
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
                  "status": "open",
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
              "poDate": "",
              "blindPackaging": false,
              "shipComplete": false,
              "canBeExpedited": false,
              "status": "inProcess"
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
                    "status": "Shipped",
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
    getConfigGridResponse() {
      return {
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
                {
                  id: "CD_ID_4735099626_1",
                  line: "513",
                  quantity: 8,
                  price: 49.0,
                  created: "9/29/2021",
                  status: "Created",
                },
                {
                  "id:": "CD_ID_4735099626_2",
                  line: "901",
                  quantity: 2,
                  price: 62.0,
                  created: "9/24/2021",
                  status: "Created",
                },
                {
                  id: "",
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
      }
    },
};
