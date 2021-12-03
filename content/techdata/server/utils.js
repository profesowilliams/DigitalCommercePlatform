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
};
