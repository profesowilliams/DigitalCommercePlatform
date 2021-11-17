const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const port = 3000;
const { URLSearchParams } = require("url");
const fetch = require("node-fetch");
const encodedParams = new URLSearchParams();
var bodyParser = require("body-parser");
var dateFormat = require("dateformat");
var now = new Date();
var codeValue = "DYSjfUsN1GIOMnQt-YITfti0w9APbRTDPwcAAABk";
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var utils = require('./utils');
var mockResponses = require('./responses');
var mockVendors = require('./vendors');

function checkCreds(user, pass) {
    return (
        user in { admin: "admin", user: "temp", bru: "temp" } &&
        pass in { admin: "admin", pass: "temp", 123: "temp" }
    );
}

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, PUT, POST, DELETE, OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With, TraceId, Consumer, SessionId, Accept-Language, Site, traceparent, Request-Id, Referer"
    );
    res.header("Consumer", "*");
    res.header("SessionId", "*");
    res.header("Accept-Language", "*");
    res.header("Site", "*");
    res.header("TraceId", "*");

    // "TraceId" : "NA",
    //     "Site": "NA",
    //     "Accept-Language" : "en-us",
    //     "Consumer" : "NA",
    //     "SessionId" : nanoid(16),
    //     "Content-Type": "application/json"

    //intercepts OPTIONS method
    if ("OPTIONS" === req.method) {
        //respond with 200
        res.send(200);
    } else {
        //move on
        next();
    }
});

app.use("/", express.static("public"));

app.post("/auth", function (req, res) {
    let userid = req.body.userid;
    let password = req.body.password;
    let redirect = req.query.redirect_uri;

    console.log("post submit");
    console.log(req.query);
    console.log(req.body);
    console.log(userid);
    console.log(password);
    console.log(redirect);

    res.append("custom", "value");
    res.type("application/json");

    if (checkCreds(userid, password)) {
        res.redirect(redirect + "?code=" + codeValue);
    } else {
        // res.send({"userid" : req.body.userid, "password" : req.body.password, auth : checkCreds(userid, password)})
        // res.render('<h1>error</h1>');
        // res.write("<h1>error</h1>");

        res.set("Content-Type", "text/html");
        res.write("<html>");
        res.write("<head> <title> Hello TutorialsPoint </title> </head>");
        res.write(
            ' <body><div id="notfound" style="position: relative;height: 100vh;"><div class="notfound" style="max-width: 920px;width: 100%;line-height: 1.4;text-align: center;padding-left: 15px;padding-right: 15px;position: absolute; left: 50%;top: 50%;transform: translate(-50%, -50%);"><div class="notfound-404" style="position: absolute;height: 100px;top: 0;left: 50%;-webkit-transform: translateX(-50%);-ms-transform: translateX(-50%);transform: translateX(-50%);z-index: -1;"></div><h2 style="font-family:sans-serif;font-size: 46px;color: #000;font-weight: 900;text-transform: uppercase;margin: 0px;">We are sorry, User not found!</h2><p style="font-family: sans-serif;font-size: 16px;color: #000;font-weight: 400;text-transform: uppercase;margin-top: 15px;"></p><a href="http://localhost:8080/signin" style="font-family: sans-serif;font-size: 14px;text-decoration: none;text-transform: uppercase;background: #189cf0;display: inline-block;padding: 16px 38px;border: 2px solid transparent;border-radius: 40px;color: #fff;font-weight: 400;-webkit-transition: 0.2s all;transition: 0.2s all;">Back To Homepage</a></div></div></body>'
        );
        res.write("</html>");
        //write end to mark it as stop for node js response.
        res.end();
    }
});

app.get("/success", function (req, res) {
    res.json({ message: "success" });
});

app.get("/masthead", function (req, res) {
    let resJson = {
        user: null,
        cart: {
            count: 2,
            items: [],
        },
        links: {
            home: "http://localhost:3000/auth",
        },
    };
    res.json(resJson);
});

app.post("/login", function (req, res) {
    let code = req.body.code;
    let redirectUrl = req.body.RedirectUri;
    let applicationName = req.body.applicationName;

    console.log("post submit");
    console.log(req.body);
    console.log(code);
    console.log(redirectUrl);
    console.log(applicationName);

    let resJsonSuccess = {
        content: {
            user: {
              "id": "516514",
              "firstName": "DAYNA",
              "lastName": "KARAPHILLIS",
              "name": "516514",
              "email": "daniel.vogt@techdata.com",
              "phone": null,
              "customers": ["0038048612", "0009000325", "0009000325"],
              "roles": null,
              "roleList": [{
                "entitlement": "CanManageOwnProfile",
                "accountId": ""
              }, {
                "entitlement": "CanAccessAccount",
                "accountId": "0038048612"
              }, {
                "entitlement": "CanAccessDeveloperCenter",
                "accountId": "0038048612"
              }, {
                "entitlement": "CanViewCreditStatement",
                "accountId": "0038048612"
              }, {
                "entitlement": "CanDownloadPriceFiles",
                "accountId": "0038048612"
              }, {
                "entitlement": "CanViewInvoices",
                "accountId": "0038048612"
              }, {
                "entitlement": "CanPlaceOrder",
                "accountId": "0038048612"
              }, {
                "entitlement": "AdminUser",
                "accountId": "0038048612"
              }, {
                "entitlement": "CanViewOrders",
                "accountId": "0038048612"
              }, {
                "entitlement": "hasDCPAccess",
                "accountId": ""
              }],
              "customersV2": [{
                "number": "0038048612",
                "name": "SHI INTERNATIONAL CORP",
                "customerNumber": "0038048612",
                "customerName": "SHI INTERNATIONAL CORP",
                "salesOrg": "0101",
                "system": "2",
                "dcpAccess": true
              }, {
                "number": "0009000325",
                "name": "SHI INTERNATIONAL CORP.",
                "customerNumber": "0009000325",
                "customerName": "SHI INTERNATIONAL CORP.",
                "salesOrg": "1001",
                "system": "3",
                "dcpAccess": false
              }, {
                "number": "0009000325",
                "name": null,
                "customerNumber": "0009000325",
                "customerName": null,
                "salesOrg": null,
                "system": null,
                "dcpAccess": false
              }],
              "activeCustomer": {
                "number": "0038048612",
                "name": "SHI INTERNATIONAL CORP",
                "customerNumber": "0038048612",
                "customerName": "SHI INTERNATIONAL CORP",
                "salesOrg": "0101",
                "system": "2",
                "dcpAccess": true
              }
            },
        },
        error: { code: 0, messages: [], isError: false },
    };

    let resJsonFail = {
        isError: true,
        user: null,
    };

    if (code === codeValue) {
        res.json(resJsonSuccess);
    } else {
        res.json(resJsonFail);
    }
});

app.post("/logoutservice", function (req, res) {
    let code = req.body.code;
    let redirectUrl = req.body.RedirectUri;
    let applicationName = req.body.applicationName;

    console.log("post submit");
    console.log(errorPage);
    console.log(redirectUrl);
    let resJsonSuccess = {
        content: {
            message: "User logged out successfully"
        },
        error: {
            code: 0,
            messages:[],
            isError: false
        }
    };

    let resJsonFail = {
        isError: true,
        user: null,
    };

    res.redirect(redirectUrl);
});

app.post("/logout", function (req, res) {

    let applicationName = req.body.applicationName;

    console.log("logout service post submit");
    console.log(req.body);
    let resJsonSuccess = {
        content: {
            message: "User logged out successfully"
        },
        error: {
            code: 0,
            messages:[],
            isError: false
        }
    };

    let resJsonFail = {
        isError: true,
        user: null,
    };

    res.json(resJsonSuccess);
});

app.options("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With"
    );
    res.send(200);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

//---TOP n OPEN CONFIG MOCK API---//
app.get("/ui-account/v1/topQuotes/get", function (req, res) {
    const param = req.query.top || 5;
    const items = [];
    for (let i = 0; i < param; i++) {
        const random = Math.floor(Math.random() * 100000);
        items.push({
            sequence: i + 1,
            endUserName: `End User 38${i}`,
            amount: random,
            formattedAmount:
                random.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ".0",
            currencyCode: "USD",
            currencySymbol: "$",
        });
    }
    const response = {
        content: {
            summary: {
                items: items,
            },
        },
        error: {
            code: 0,
            message: [],
            isError: false,
        },
    };

    res.json(response);
});

app.get("/quote/MyQuote", function (req, res) {
    const code = req.query.code;

    if (!req.headers["sessionid"]) return res.status(401);

    res.json({
        content: {
            items: {
                converted: "31.49%",
                open: 38,
                quoteToOrder: "3:1",
                activeQuoteValue: 6251968.0,
                currencyCode: "USD",
                currencySymbol: "$",
                formattedAmount: "6,251,968",
            },
        },
        error: {
            code: "",
            message: "",
            isError: false,
        },
    });
});

app.get("/myorderstatus", function (req, res) {
    const code = req.query.code;

    if (!req.headers["sessionid"]) return res.status(401);

    res.json({
        content: {
            items: {
                onHold: "0",
                inProcess: "0",
                shipped: "42",
            },
        },
        error: {
            code: "",
            message: "",
            isError: false,
        },
    });
});

app.post("/quote/create", function (req, res) {

    if (!req.headers["sessionid"]) return res.status(401);

    res.json({
        content: {
            quoteId: "121752813",
            confirmationId: "2946606046"
        },
        error: {
            code: "",
            message: "",
            isError: false,
        },
    });
});
app.get("/activeCart", function (req, res) {
    if (!req.headers["sessionid"])
        return res.status(500).json({
            error: {
                code: 200,
                message: "",
                isError: false,
            },
        });

    res.json({
        content: {
            data: {
                source: {
                    salesOrg: "0100,1002",
                    system: "Shop",
                },
                lines: [
                    {
                        lineNo: "100",
                        parentLineNo: null,
                        productId: "13641675",
                        quantity: 1,
                    },
                    {
                        lineNo: "200",
                        parentLineNo: null,
                        productId: "11337383",
                        quantity: 1,
                    },
                    {
                        lineNo: "300",
                        parentLineNo: null,
                        productId: "11357376",
                        quantity: 1,
                    },
                    {
                        lineNo: "400",
                        parentLineNo: null,
                        productId: "11456989",
                        quantity: 1,
                    },
                ],
                totalQuantity: 0,
            },
        },
        error: {
            code: 200,
            message: "",
            isError: false,
        },
    });
});

app.get("/configurationsSummary/get", function (req, res) {
  function random(min, max) {
    return Math.trunc(min + Math.random() * (max - min));
  }
    if (!req.headers["sessionid"])
        return res.status(401).json({
            error: {
                code: 0,
                messages: [],
                isError: false,
            },
        });

    res.json({
        content: {
            summary: {
                quoted: random(100,9999),
                unQuoted: random(100,9999),
                oldConfigurations: random(100,9999),
                currencyCode: 'USD',
            },
        },
        error: {
            code: 0,
            messages: [],
            isError: false,
        },
    });
});
//---MY RENEWALS MOCK API---//
app.get("/ui-account/v1/getRenewals", function (req, res) {
    const param = req.query.days || "30,60,90";
    const items = [];
    function getRandom(maxValue) {
        return Math.floor(Math.random() * maxValue);
    }
    for (let i = 0; i < param.split(",").length + 1; i++) {
        items.push({
            value: getRandom(100),
        });
    }
    const response = {
        content: {
            items: items,
        },
        error: {
            code: 0,
            message: [],
            isError: false,
        },
    };
    res.json(response);
});

app.get("/dealsSummary", function (req, res) {
    if (!req.headers["sessionid"])
        return res.status(500).json({
            error: {
                code: 0,
                message: [],
                isError: true,
            },
        });

    res.json({
        content: {
            items: [{ value: 5 }, { value: 15 }, { value: 20 }],
        },
        error: {
            code: 0,
            message: [],
            isError: false,
        },
    });
});

//---QUOTES GRID MOCK API---//
app.get("/ui-commerce/v1/quote/", function (req, res) {
    const id = req.query.id;
    const details = req.query.details || true;
    const pageSize = req.query.PageSize || 25;
    const pageNumber = req.query.PageNumber || 1;
    const items = [];
    function getRandom(maxValue) {
        return Math.floor(Math.random() * maxValue);
    }
    const examplesQuoteReference = [
      'CCW QuoteId:4734474647',
      'CCW webapi',
      'Tech Data webapi',
      'ESTIMATE QuoteId:UQ123422927SN'
    ]; 
    let count = 0;
    for (let i = 0; i < pageSize; i++) {
        if (count === 3) {
          count = 0;
        }

        items.push({
            id: Number(`${pageNumber}${4009754974 + i}`),
            quoteReference: examplesQuoteReference[count],
            vendor: null,
            created: utils.getRandomDate(),
            expires: utils.getRandomDate(),
            endUserName: null,
            deals: utils.getRandomArrayWithIds(4),
            status: i % 2 ? "OPEN" : "CLOSED",
            quoteValue: 73002.31 + getRandom(1000),
            formatedQuoteValue: "USD",
            currencySymbol: "$",
            canUpdate: i % 2 ? true : false,
            canCheckOut: i % 2 ? true : false,
        });
        count++;
    }
    const response = {
        content: {
            items: items,
            totalItems: 2500,
            pageCount: 10,
            pageSize: pageSize,
        },
        error: {
            code: 0,
            message: [],
            isError: false,
        },
    };
    res.json(response);
});

app.get("/ui-commerce/v1/quote", function (req, res) {
    const id = req.query.id;
    const response = {
        data: [id],
        error: {
            code: 0,
            message: [],
            isError: false,
        },
    };
    res.json(response);
});

app.get("/ui-commerce/v1/quotedetails", function (req, res) {
    console.log(req.url)
    const id = req.query.id;
    const response = utils.getQuoteDetailsResponse();
    res.json(response);
});

//---ORDER DETAILS MOCK API---//
app.get("/ui-commerce/v1/orderdetails", function (req, res) {
  console.log(req.url)
  const id = req.query.id;
  const response = utils.getOrderDetailsResponse();;
  res.json(response);
}); 

app.get("/ui-commerce/v1/order/details", function (req, res) {
    console.log(req.url)
    const id = req.query.id;
    const errorObject = {
      "content": null,
      "error": {
        "code": 404,
        "messages": [
          "UserId : 702318 for TraceId : NA Error connecting to http://app-order/v1. Reported an error: NotFound. http://app-order/v1?id=603068538"
        ],
        "isError": true
      }
    };
    const response = id != 603068538 ? utils.getOrderDetailsResponse() : errorObject;
    res.json(response);
});

app.get("/ui-commerce/v1/order/", function (req, res) {
  const id = req.query.id || 0;
  const details = req.query.details || true;
  const pageSize = req.query.PageSize || 25;
  const pageNumber = req.query.PageNumber || 1;
  const response = utils.getOrderDetailsResponse();
  res.json(response);
});

//---ORDERS GRID MOCK API---//
app.get("/ui-commerce/v1/orders/", function (req, res) {
    const details = req.query.details || true;
    const pageSize = req.query.PageSize || 25;
    const pageNumber = req.query.PageNumber || 1;
    const items = [];
    const status = [
        'onHold',
        'inProcess',
        'open',
        'shipped',
        'cancelled',
    ];
    const orderReportFlag = req.query.status 
                              ? 
                              req.query.status 
                                === 'OPEN' ? true : false
                              : false ;
    function getRandom(maxValue) {
        return Math.floor(Math.random() * maxValue);
    }

    function getInvoices(noOfInvoices) {
        const invoices = [];
        for (let i = 0; i <= noOfInvoices; i++) {
            const invoice = {
                id: i % 2 ? Number(`${pageNumber}${4009754974 + i + getRandom(10)}`) : "Pending",
                line: i % 2 ? 1 + getRandom(10) : "",
                quantity: 1 + getRandom(100),
                price: 4750.70 + getRandom(1000),
                created: i % 2 ? new Date().toISOString() : null,
            }
            invoices.push(invoice);
        }
        return invoices;
    }
    for (let i = 0; i < pageSize; i++) {
        const totalPrice = 73002.31 + getRandom(1000);
        const statusID = getRandom(5);
        const manufacturerExample = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 6);
        items.push({
            id: Number(`${pageNumber}${4009754974 + i}`),
            created: new Date().toISOString(),
            reseller: Number(`${pageNumber}${111048 + i}`),
            shipTo: "UPS",
            type: "Manual",
            priceFormatted: 73002.31 + getRandom(1000),
            invoices: getInvoices(getRandom(10) - 1),
            status: status[getRandom(5)],
            trackings: i % 2 ?  [
                {
                  "orderNumber": "6030692072",
                  "invoiceNumber": null,
                  "id": null,
                  "carrier": "PITT-OHIO",
                  "serviceLevel": "LTL",
                  "trackingNumber": "7038806680",
                  "trackingLink": "http://expo.expeditors.com/expo/SQGuest?SearchType=shipmentSearch&TrackingNumber=7038806680",
                  "type": "JQ",
                  "description": "Pitt-Ohio Express",
                  "date": "10-06-2021",
                  "dNote": "7038806680",
                  "dNoteLineNumber": "10",
                  "goodsReceiptNo": null
                },
                {
                  "orderNumber": "6030692072",
                  "invoiceNumber": null,
                  "id": null,
                  "carrier": "PITT-OHIO",
                  "serviceLevel": "LTL",
                  "trackingNumber": "7038806680",
                  "trackingLink": "http://expo.expeditors.com/expo/SQGuest?SearchType=shipmentSearch&TrackingNumber=7038806680",
                  "type": "JQ",
                  "description": "Pitt-Ohio Express",
                  "date": "10-06-2021",
                  "dNote": "7038806680",
                  "dNoteLineNumber": "10",
                  "goodsReceiptNo": null
                }
            ] : [{
                "orderNumber": "6030684674",
                "invoiceNumber": null,
                "id": null,
                "carrier": "FEDEX",
                "serviceLevel": "FEDEX GROUND",
                "trackingNumber": "486197188378",
                "trackingLink": "http://www.fedex.com/Tracking?&cntry_code=us&language=english&tracknumbers=486197188378",
                "type": "W0",
                "description": "FEDX GRND",
                "date": "07-13-2021",
                "dNote": "7038811481",
                "dNoteLineNumber": "30",
                "goodsReceiptNo": null
            }],
            isReturn: i % 2 ? true : false,
            currency: "USD",
            currencySymbol: "$",
            line: Number(`${pageNumber}${4009754974 + i}`),
            manufacturer: manufacturerExample.toUpperCase(),
            description: "PLTNM TAB PRTNR STOCK $5+ MRC ACTIVATION",
            quantity: getRandom(10),
            serial: i % 2 ? 'View' : 'n/a',
            unitPrice: totalPrice,
            totalPrice: totalPrice,
            shipDate: i % 2 ? new Date().toISOString() : 'Emailed',
        })
    }

    const itemsResponeOrderStatus = items.filter(i => i.status === 'open');
    const response = {
        content: {
            items: orderReportFlag ? itemsResponeOrderStatus : items,
            totalItems: 2500,
            pageCount: 25,
            pageSize
        },
        error: {
            code: 0,
            message: [],
            isError: false,
        },
    };
    res.json(response);
});

app.get("/browse", function (req, res) {
    if (!req.headers["sessionid"])
        return res.status(500).json({
            error: {
                code: 0,
                message: [],
                isError: true,
            },
        });

    res.json({
        content: {
            userId: "12345",
            userName: "Techdata User",
            customerId: "38048612",
            customerName: "SHI INTERNATIONAL CORP",
            cartId: "1",
            cartItemCount: 27,
            catalogHierarchies: [
                {
                    source: {
                        system: "2",
                        id: "FCS",
                    },
                },
            ],
        },
        error: {
            code: 0,
            messages: [],
            isError: false,
        },
    });
});

app.get("/savedCarts", function (req, res) {
    if (!req.headers["sessionid"] || req.headers["site"] !== "US")
        return res.status(500).json({
            error: {
                code: 0,
                message: [],
                isError: true,
            },
        });

    res.json({
        content: {
            items: [
                { id: "96721037", name: "Test_Global_157024" },
                { id: "96718606", name: "Blah 1" },
                { id: "96718607", name: "Blah 2" },
                { id: "96718608", name: "Blah 3" },
                { id: "96718609", name: "Blah 4" },
            ],
            totalRecords: 2,
        },
        error: {
            code: 0,
            messages: [],
            isError: false,
        },
    });
});

app.get("/cart", function (req, res) {
    if (!req.headers["sessionid"] || req.headers["site"] !== "US")
        return res.status(500).json({
            error: {
                code: 0,
                message: [],
                isError: true,
            },
        });

    res.json({
        content: {
            data: {
                items: [
                    {
                        itemId: "100",
                        parentItemId: "0",
                        productId: "11189283",
                        quantity: 1,
                    },
                    {
                        itemId: "200",
                        parentItemId: "0",
                        productId: "11272301",
                        quantity: 1,
                    },
                ],
                source: {
                    id: "96721203",
                    system: "Shop",
                },
                name: "ParentlineNo",
            },
        },
        error: { code: 0, messages: [], isError: false },
    });
});


//---QUOTE DETAILS MOCK API---//
app.get("/ui-commerce/v1/quote/details", function (req, res) {
  const { id } = req.query;

  if (!req.headers["SessionId"] && !id) {
      return res.status(500).json({
          error: {
              code: 0,
              message: [],
              isError: true,
          },
      });
  }

  function getItems(amount){
    let items = [];
    for(let i = 0; i<=amount; i++){
      items.push(
        {
          "id": i,
          "displayLineNumber": i,
          "parent": null,
          "vendorPartNo": null,
          "manufacturer": null,
          "description": "MS321DN LASERPR 38PPM USB TAA LV",
          "displayName": "MS321DN LASERPR 38PPM USB TAA LV",
          "quantity": 30+i,
          "unitPrice": i,
          "unitPriceFormatted": "0.00",
          "totalPrice": 0,
          "totalPriceFormatted": "0.00",
          "msrp": null,
          "invoice": null,
          "discounts": null,
          "contract": null,
          "shortDescription": null,
          "mfrNumber": null,
          "tdNumber": "000000000013278748",
          "upcNumber": null,
          "unitListPrice": "0.0",
          "unitListPriceFormatted": "0.00",
          "extendedPrice": null,
          "extendedPriceFormatted": "",
          "availability": null,
          "rebateValue": null,
          "urlProductImage": i%2 ? null : "/non-existing-image.png",
          "urlProductSpecs": null,
          "children": [
            {
              "id": i+".1",
              "displayLineNumber":  i+".1",
              "parent": i,
              "vendorPartNo": "DUO-MFA-FED",
              "manufacturer": "CISCO",
              "description": "Cisco Duo MFA edition for Federal customers",
              "displayName": "Cisco Duo MFA edition for Federal customers",
              "quantity": 20+i,
              "unitPrice": 36,
              "unitPriceFormatted": "36.00",
              "totalPrice": null,
              "totalPriceFormatted": "",
              "msrp": null,
              "invoice": null,
              "discounts": [],
              "contract": {
                "id": null,
                "status": null,
                "duration": null,
                "renewedDuration": null,
                "startDate": "01-01-0001",
                "endDate": "01-01-0001",
                "newAgreementStartDate": "01-01-0001",
                "newAgreementEndDate": "01-01-0001",
                "newUsagePeriodStartDate": "01-01-0001",
                "newUsagePeriodEndDate": "01-01-0001",
                "supportLevel": null,
                "serviceLevel": null,
                "usagePeriod": "01-01-0001",
                "renewalTerm": 0
              },
              "shortDescription": "Cisco Duo MFA edition for Federal customers",
              "mfrNumber": "DUO-MFA-FED",
              "tdNumber": "13817869",
              "upcNumber": null,
              "unitListPrice": null,
              "unitListPriceFormatted": "36.00",
              "extendedPrice": "720.0",
              "extendedPriceFormatted": "720.0",
              "availability": null,
              "rebateValue": null,
              "urlProductImage": i%2 ? null : "/non-existing-image.png",
              "urlProductSpecs": null,
              "children": null,
              "agreements": null,
              "ancillaryChargesWithTitles": null,
              "annuity": null,
              "isSubLine": false,
              "displayLineNumber": "100.1"
            },
            {
              "id": i+".2",
              "displayLineNumber":  i+".2",
              "parent": i,
              "vendorPartNo": "SVS-DUO-FED-SUP-B",
              "manufacturer": "CISCO",
              "description": "Cisco Duo Basic Support - Federal",
              "displayName": "Cisco Duo MFA edition for Federal customers",
              "quantity": 1,
              "unitPrice": 0,
              "unitPriceFormatted": "0.00",
              "totalPrice": null,
              "totalPriceFormatted": "",
              "msrp": null,
              "invoice": null,
              "discounts": [],
              "contract": {
                "id": null,
                "status": null,
                "duration": null,
                "renewedDuration": null,
                "startDate": "01-01-0001",
                "endDate": "01-01-0001",
                "newAgreementStartDate": "01-01-0001",
                "newAgreementEndDate": "01-01-0001",
                "newUsagePeriodStartDate": "01-01-0001",
                "newUsagePeriodEndDate": "01-01-0001",
                "supportLevel": null,
                "serviceLevel": null,
                "usagePeriod": "01-01-0001",
                "renewalTerm": 0
              },
              "shortDescription": "Cisco Duo Basic Support - Federal",
              "mfrNumber": "SVS-DUO-FED-SUP-B",
              "tdNumber": null,
              "upcNumber": null,
              "unitListPrice": null,
              "unitListPriceFormatted": "0.00",
              "extendedPrice": "0.0",
              "extendedPriceFormatted": "0.0",
              "availability": null,
              "rebateValue": null,
              "urlProductImage": null,
              "urlProductSpecs": null,
              "children": null,
              "agreements": null,
              "ancillaryChargesWithTitles": null,
              "annuity": null,
              "isSubLine": false,
              "displayLineNumber": "100.2"
            }
          ],
          "agreements": [
            {
              "id": "4000608",
              "version": "1",
              "vendorId": "DD19-447562",
              "selectionFlag": "E"
            },
            {
              "id": "3058624",
              "version": "3",
              "vendorId": "DD18-350965",
              "selectionFlag": "M"
            }
          ],
          "ancillaryChargesWithTitles": null,
          "annuity": null,
          "isSubLine": false,
          "displayLineNumber": i,
          "attributes": [{
            "name": "VENDORQUOTEID",
            "value": "4734509146"
          }, {
            "name": "DF_CONFIRMATION_NO",
            "value": "1320795298"
          }, {
            "name": "PRICELISTID",
            "value": "1109"
          }, {
            "name": "CustomerPoNumber",
            "value": "JoseDemoOctober_Deal-B-again"
          }, {
            "name": "VENDOR",
            "value": "CISCO"
          }, {
            "name": "DEALIDENTIFIER",
            "value": "686450750"
          }, {
            "name": "VENDORQUOTETYPE",
            "value": "CCW"
          }, {
            "name": "INTERNAL_COMMENT",
            "value": "Can't check UAN with no renewalQuoteId."
          }, {
            "name": "ShipCompleteType",
            "value": "NA"
          }, {
            "name": "TAKEOVER",
            "value": "true"
          }]
        }
      )
    }
    return items;
  }

  const response = {
    "content": {
      "details": {
        "shipTo": {
          "id": null,
          "companyName": "TELOS CORPORATION",
          "name": "TELOS CORPORATION",
          "line1": "19886 Ashburn Rd",
          "line2": " ",
          "line3": " ",
          "city": "Ashburn",
          "state": "VA",
          "zip": null,
          "postalCode": "20147-2358",
          "country": "US",
          "email": "accounts.payable@telos.com",
          "phoneNumber": "7037243800"
        },
        "endUser": {
          "id": null,
          "companyName": "CLEVER CORP",
          "name": "CLEVER CORP",
          "line1": "68819 Miami Beach",
          "line2": " ",
          "line3": " ",
          "city": "Miami",
          "state": "Florida",
          "zip": "56783",
          "postalCode": "31258-3469",
          "country": "US",
          "email": "accounts.payable@clever.com",
          "phoneNumber": "8148354911"
        },
        "reseller": {
          "id": null,
          "companyName": "TELOS CORPORATION",
          "name": "TELOS CORPORATION",
          "line1": null,
          "line2": " ",
          "line3": " ",
          "city": "Ashburn",
          "state": "VA",
          "zip": null,
          "postalCode": "20147-2358",
          "country": "US",
          "email": "accounts.payable@telos.com",
          "phoneNumber": "7037243800"
        },
        "source": [{
          "type": "Vendor Quote",
          "value": "4734509146"
        }, {
          "type": "Deal",
          "value": "686450750"
        }, {
          "type": "Estimate Id",
          "value": "NH114095623CY"
        }],
        "notes": null,
        "items": getItems(4),
        "id": "4009611164",
        "orders": [
          {
            "id": "6030441624",
            "system": "2",
            "salesOrg": "0100"
          },
          {
            "id": "6030303524",
            "system": "2",
            "salesOrg": "0100"
          }
        ],
        "customerPO": " ",
        "endUserPO": " ",
        "poDate": null,
        "quoteReference": null,
        "spaId": null,
        "currency": "USD",
        "currencySymbol": "$",
        "subTotal": 5422.3,
        "subTotalFormatted": "5,422.30",
        "tier": "Government",
        "created": "07/14/20",
        "expires": "12/31/21",
        "attributes": [{
            "name": "VENDORQUOTEID",
            "value": "4734509146"
          }, {
            "name": "DF_CONFIRMATION_NO",
            "value": "1320795298"
          }, {
            "name": "PRICELISTID",
            "value": "1109"
          }, {
            "name": "CustomerPoNumber",
            "value": "JoseDemoOctober_Deal-B-again"
          }, {
            "name": "VENDOR",
            "value": "CISCO"
          }, {
            "name": "DEALIDENTIFIER",
            "value": "686450750"
          }, {
            "name": "VENDORQUOTETYPE",
            "value": "CCW"
          }, {
            "name": "INTERNAL_COMMENT",
            "value": "Can't check UAN with no renewalQuoteId."
          }, {
            "name": "ShipCompleteType",
            "value": "NA"
          }, {
            "name": "TAKEOVER",
            "value": "true"
        }]
      }
    },
    "error": {
      "code": 0,
      "messages": [],
      "isError": false
    }
  }

  setTimeout(() => {
      res.json(response);
  }, 2000)
});

app.get("/myorders", (req, res) => {

    console.log(utils.getRandomValues(100) + 1.0)

    if (!req.headers["sessionid"])
        return res.status(500).json({
            error: {
                code: 0,
                message: [],
                isError: true,
            },
        });

    if (req.query.isMonthly === "true") {
        res.json({
            content: {
                items: {
                    isMonthly: false,
                    currencyCode: "USD",
                    currencySymbol: "$",
                    total: {
                        amount: 42037,
                        formattedAmount: "42,037.00",
                        percentage: "100%"
                    },
                    processed: {
                        amount: 12700,
                        formattedAmount: "12,700.00",
                        percentage: "30.211%"
                    },
                    shipped: {
                        amount: 5877,
                        formattedAmount: "5,877.00",
                        percentage: "13.981%"
                    },
                    processedOrderPercentage: "26",
                    processedOrdersAmount: 268,
                    totalOrderAmount: 529,
                    totalFormattedAmount: utils.getRandomValues(100) + ".00",
                    processedFormattedAmount: utils.getRandomValues(100) + ".00",
                },
            },
            error: {
                code: 0,
                messages: [],
                isError: false,
            },
        });
    } else {
        res.json({
            content: {
                items: {
                    isMonthly: false,
                    currencyCode: "USD",
                    currencySymbol: "$",
                    total: {
                        amount: 126921,
                        formattedAmount: "126,921.00",
                        percentage: "100%"
                    },
                    processed: {
                        amount: 38100,
                        formattedAmount: "38,100.00",
                        percentage: "30.018%"
                    },
                    shipped: {
                        amount: 34000,
                        formattedAmount: "34,000.00",
                        percentage: "26.788%"
                    },
                },
            },
            error: {
                code: 0,
                messages: [],
                isError: false,
            },
        })
    }

});

app.get("/getAddress", (req, res) => {
    if (!req.headers["sessionid"])
        return res.status(500).json({
            error: {
                code: 0,
                message: [],
                isError: true,
            },
        });
    res.json({
        content: {
            items: [
                {
                    name: "SHI INTERNATIONAL CORP",
                    companies: [
                        {
                            companyCode: "0101",
                            paymentTermsCode: "Z271",
                            paymentTermsText: "1.50 % 10 Net 30",
                        },
                        {
                            companyCode: "0100",
                            paymentTermsCode: "Z271",
                            paymentTermsText: "1.50 % 10 Net 30",
                        },
                    ],
                    addresses: [
                        {
                            addressNumber: "0001445402",
                            addressLine1: "290 Davidson Ave",
                            addressLine2: " ",
                            addressLine3: " ",
                            city: "Somerset",
                            state: "NJ",
                            country: "US",
                            zip: "08873-4145",
                            email: null,
                            addressType: "PAY",
                            phone: "8005276389",
                            salesOrganization: "0100",
                        },
                        {
                            addressNumber: "0001369841",
                            addressLine1: "4111 Northside Parkway",
                            addressLine2: " ",
                            addressLine3: " ",
                            city: "ATLANTA",
                            state: "GA",
                            country: "US",
                            zip: "30327",
                            email: null,
                            addressType: "PAY",
                            phone: " ",
                            salesOrganization: "0100",
                        },
                        {
                            addressNumber: "0001369845",
                            addressLine1: "116 Inverness Dr E",
                            addressLine2: "Ste 375",
                            addressLine3: " ",
                            city: "Englewood",
                            state: "CO",
                            country: "US",
                            zip: "80112-5149",
                            email: null,
                            addressType: "PAY",
                            phone: " ",
                            salesOrganization: "0100",
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
    });
});

app.get("/ui-account/v1/getAddress", (req, res) => {
    if (!req.headers["sessionid"]) {
        return res.status(500).json({
            error: {
                code: 0,
                message: [],
                isError: true,
            },
        });
    }


    const response = {
        "content": {
            "items": [
                {
                    "name": "SHI INTERNATIONAL CORP",
                    "companies": [
                        {
                            "companyCode": "0100",
                            "paymentTermsCode": "Z271",
                            "paymentTermsText": "1.50 % 10 Net 30"
                        },
                        {
                            "companyCode": "0101",
                            "paymentTermsCode": "Z271",
                            "paymentTermsText": "1.50 % 10 Net 30"
                        }
                    ],
                    "addresses": [
                        {
                            "addressNumber": "0001445402",
                            "addressLine1": "290 Davidson Ave",
                            "addressLine2": " ",
                            "addressLine3": " ",
                            "city": "Somerset",
                            "state": "NJ",
                            "country": "US",
                            "zip": "08873-4145",
                            "email": null,
                            "addressType": "CUS",
                            "phone": "8005276389",
                            "salesOrganization": "0100"
                        },
                        {
                          "addressNumber": "0001369841",
                          "addressLine1": "4111 Northside Parkway",
                          "addressLine2": " ",
                          "addressLine3": " ",
                          "city": "ATLANTA",
                          "state": "GA",
                          "country": "US",
                          "zip": "30327",
                          "email": null,
                          "addressType": "PAY",
                          "phone": "8005276389",
                          "salesOrganization": "0100",
                      },
                      {
                        "addressNumber": "0001369845",
                        "addressLine1": "116 Inverness Dr E",
                        "addressLine2": "Ste 375",
                        "addressLine3": " ",
                        "city": "Englewood",
                        "state": "CO",
                        "country": "US",
                        "zip": "80112-5149",
                        "email": null,
                        "addressType": "PAY",
                        "phone": " ",
                        "salesOrganization": "0100",
                      },
                    ]
                }
            ]
        },
        "error": {
            "code": 0,
            "messages": [],
            "isError": false
        }
    };

    setTimeout(() => {
        res.json(response);
    }, 2000)
});

app.get("/pricingConditions", (req, res) => {
    if (!req.headers["sessionid"])
        return res.status(500).json({
            error: {
                code: 0,
                message: [],
                isError: true,
            },
        });

    res.json({
        content: {
            pricingConditions: {
                items: [
                    { key: "Commercial(Non-Govt)", value: "0" },
                    { key: "Education(Student,Staff)", value: "1" },
                    { key: "Education(Higher)", value: "2" },
                    { key: "Education(K-12)", value: "3" },
                    { key: "EducationE-Rate(K-12)", value: "4" },
                    { key: "Federal", value: "5" },
                    { key: "FederalGSA", value: "6" },
                    { key: "State", value: "7" },
                    { key: "Medical", value: "8" },
                    { key: "SEWPContract", value: "11" },
                ],
            },
        },
        error: {
            code: 0,
            messages: [],
            isError: false,
        },
    });
});

app.get("/estimates", function (req, res) {
    if (!req.headers["sessionid"] || req.headers["site"] !== "US")
        return res.status(500).json({
            error: {
                code: 0,
                message: [],
                isError: true,
            },
        });

    res.json({
        content: {
            items: [
                {
                    "configId": "VI112127534ZT",
                    "configurationType": "Estimate",
                    "vendor": "Cisco"
                },
                {
                    "configId": "WC121011624NR",
                    "configurationType": "Estimate",
                    "vendor": "Cisco"
                },
                {
                    "configId": "VI112127534ZT1",
                    "configurationType": "Estimate",
                    "vendor": "Cisco"
                },
                {
                    "configId": "WC121011624NR2",
                    "configurationType": "Estimate",
                    "vendor": "Cisco"
                },
            ],
        },
        error: {
            code: 0,
            messages: [],
            isError: false,
        },
    });
});
app.get("/estimations/validate/:id", function (req, res) {
    const { id } = req.params;
    if (!req.headers["sessionid"] || !id)
        return res.status(500).json({
            error: {
                code: 0,
                message: [],
                isError: true,
            },
        });

    res.json({
        content: {
            isValid: true,
        },
        error: { code: 0, messages: [], isError: false },
    });
});
app.get("/catalog", (req, res) => {
    console.log(req);
    res.json(mockResponses.catalogResponse());
    // res.json(mockResponses.shortResponse());

})

app.get("/vendors", (req, res) => {
    console.log(req);
    res.json(mockVendors.vendorsJsonData());
})

//---VENDOR CONNECTIONS MOCK API---//
app.get("/ui-account/v1/getVendorConnections", function (req, res) {
    const response = {
        content: {
            items: [
                {
                    vendor: "Cisco",
                    isConnected: utils.getRandomNumber(10) % 2 ? true : false,
                    connectionDate: utils.getRandomDate(),
                    isValidRefreshToken: utils.getRandomNumber(10) % 2 ? true : false,
                },
                {
                    vendor: "HP",
                    isConnected: utils.getRandomNumber(10) % 2 ? true : false,
                    connectionDate: utils.getRandomDate(),
                    isValidRefreshToken: utils.getRandomNumber(10) % 2 ? true : false,
                },
                {
                    vendor: "Dell",
                    isConnected: utils.getRandomNumber(10) % 2 ? true : false,
                    connectionDate: utils.getRandomDate(),
                    isValidRefreshToken: utils.getRandomNumber(10) % 2 ? true : false,
                }
            ]
        },
        error: {
            code: 0,
            messages: [],
            isError: false
        }
    };
    setTimeout(() => {
        res.json(response);
    }, 2000)
});

app.get("/ui-commerce/v1/downloadInvoice", function (req, res) {
  const { orderId, downloadAl} = req.query;

  if (!req.headers["sessionid"] || orderId === '14009754975') {
    return res.status(500).json({
      error: {
        code: 0,
        message: [],
        isError: true,
      },
    });
  }
  if (downloadAl) {
    res.download(`file.zip`);
  }
  return res.download('invoice.pdf')
});

app.get("/ui-config/v1/getdealsFor", function (req, res) {
    const { endUserName, mfrPartNumbers, orderLevel } = req.query;
  
    console.log("/ui-config/v1/getdealsFor", endUserName, mfrPartNumbers, orderLevel);
  
    if (endUserName == 'error') {
      res.status(500).json({
        error: {
          code: 0,
          message: [],
          isError: true,
        },
      });
    }
    else if (endUserName == 'empty') {
      res.json({
        "content": {
          "items": [
          ]
        }
      });
    }
    else {
      res.json({
        "content": {
          "items": [
            {
              "bid": "3443554545",
              "version": "001",
              "dealId": "0012",
              "endUserName": endUserName,
              "vendor": "Red Hat Inc",
              "expiryDate": "12/31/2025",
            },
            {
              "bid": "212121323",
              "version": "002",
              "dealId": "0013",
              "endUserName": endUserName,
              "vendor": "Cisco",
              "expiryDate": "12/31/2025",
            },
            {
              "bid": "76676767",
              "version": "004",
              "dealId": "0014",
              "endUserName": endUserName,
              "vendor": "AMD",
              "expiryDate": "12/31/2025",
            },
          ]
        }
      });
    }
  });

app.get("/ui-commerce/v1/pricingConditions", function (req, res) {
  res.json({
    "content": {
      "pricingConditions": {
        "items": [
          {
            "key": "Commercial (Non-Govt)",
            "value": "Commercial"
          },
          {
            "key": "Education (Student, Staff)",
            "value": "EduStudentStaff"
          },
          {
            "key": "Education (Higher)",
            "value": "EduHigher"
          },
          {
            "key": "Education (K - 12)",
            "value": "EduK12"
          },
          {
            "key": "Education E-Rate (K - 12)",
            "value": "EduErate"
          },
          {
            "key": "Federal",
            "value": "GovtFederal"
          },
          {
            "key": "Federal GSA",
            "value": "GovtFederalGSA"
          },
          {
            "key": "Local",
            "value": "GovtLocal"
          },
          {
            "key": "State",
            "value": "GovtState"
          },
          {
            "key": "Medical",
            "value": "Medical"
          },
          {
            "key": "SEWP Contract",
            "value": "SEWPContract "
          }
        ]
      }
    },
    "error": {
      "code": 0,
      "messages": [],
      "isError": false
    }
  });
});

app.post("/ui-commerce/v1/downloadQuoteDetails", async function (req, res) {
  const {
    acceptLanguage,
    site,
    consumer,
    traceId,
    sessionid,
    contentType,
  } = req.headers;
  
  if (!req.headers["sessionid"] && !sessionid) {
    return res.status(500).json({
        error: {
            code: 0,
            message: ['SessionId Error'],
            isError: true,
        },
    });
  }

  try {
    res.download(`response.xlsx`);
  } catch (error) {
    console.log('Error', error)
  }
});

app.post("/ui-commerce/v1/downloadOrderDetails", async function (req, res) {
  const {
    acceptLanguage,
    site,
    consumer,
    traceId,
    sessionid,
    contentType,
  } = req.headers;
  
  if (!req.headers["sessionid"] && !sessionid) {
    return res.status(500).json({
        error: {
            code: 0,
            message: ['SessionId Error'],
            isError: true,
        },
    });
  }

  try {
    res.download(`response.xlsx`);
  } catch (error) {
    console.log('Error', error)
  }
});

app.get("/searchbar/orders", function (req, res) {
  const { keyword } = req.query;

  res.json({
    "content": {
      "items": [{
        "id": 24009754974,
        "created": "2021-11-16T20:51:54.646Z",
        "reseller": 2111048,
        "shipTo": "UPS",
        "type": "Manual",
        "priceFormatted": 73398.31,
        "invoices": [{
          "id": "Pending",
          "line": "",
          "quantity": 94,
          "price": 5646.7,
          "created": null
        }, {
          "id": 24009754978,
          "line": 7,
          "quantity": 38,
          "price": 4841.7,
          "created": "2021-11-16T20:51:54.646Z"
        }, {
          "id": "Pending",
          "line": "",
          "quantity": 96,
          "price": 4752.7,
          "created": null
        }, {
          "id": 24009754979,
          "line": 2,
          "quantity": 8,
          "price": 4940.7,
          "created": "2021-11-16T20:51:54.646Z"
        }, {
          "id": "Pending",
          "line": "",
          "quantity": 64,
          "price": 5332.7,
          "created": null
        }, {
          "id": 24009754984,
          "line": 6,
          "quantity": 19,
          "price": 5317.7,
          "created": "2021-11-16T20:51:54.646Z"
        }, {
          "id": "Pending",
          "line": "",
          "quantity": 90,
          "price": 5203.7,
          "created": null
        }, {
          "id": 24009754983,
          "line": 5,
          "quantity": 40,
          "price": 4887.7,
          "created": "2021-11-16T20:51:54.646Z"
        }],
        "status": "inProcess",
        "trackings": [{
          "orderNumber": "6030684674",
          "invoiceNumber": null,
          "id": null,
          "carrier": "FEDEX",
          "serviceLevel": "FEDEX GROUND",
          "trackingNumber": "486197188378",
          "trackingLink": "http://www.fedex.com/Tracking?&cntry_code=us&language=english&tracknumbers=486197188378",
          "type": "W0",
          "description": "FEDX GRND",
          "date": "07-13-2021",
          "dNote": "7038811481",
          "dNoteLineNumber": "30",
          "goodsReceiptNo": null
        }],
        "isReturn": false,
        "currency": "USD",
        "currencySymbol": "$",
        "line": 24009754974,
        "manufacturer": "2752GIQ",
        "description": "PLTNM TAB PRTNR STOCK $5+ MRC ACTIVATION",
        "quantity": 9,
        "serial": "n/a",
        "unitPrice": 73718.31,
        "totalPrice": 73718.31,
        "shipDate": "Emailed"
      }],
      "totalItems": 2500,
      "pageCount": 25,
      "pageSize": "25"
    },
    "error": {
      "code": 0,
      "message": [],
      "isError": false
    }
  })
})

app.get("/typeahead", function (req, res) {
  const { keyword } = req.query;

  res.json({
    "Request": {
      "SearchApplication": "shop",
      "Keyword": `${keyword}`,
      "MaxResults": 10
    },
    "Suggestions": [
      {
        "Keyword": `${keyword}`,
        "Refinements": [
          {
            "Description": "Desktops & Workstations > Desktops",
            "RefinementId": "510010101",
            "RefinementType": 0
          }
        ],
        "SuggestionType": 1
      },
      {
          "Keyword": `${keyword} optiplex`,
          "Refinements": null,
          "SuggestionType": 1
      },
      {
          "Keyword": `${keyword} laptop`,
          "Refinements": null,
          "SuggestionType": 1
      },
      {
          "Keyword": `${keyword} monitor`,
          "Refinements": [
            {
              "Description": "Desktops & Workstations > Desktops",
              "RefinementId": "510010101",
              "RefinementType": 0
            }
          ],
          "SuggestionType": 1
      },
      {
          "Keyword": `${keyword} optiplex 3060`,
          "Refinements": null,
          "SuggestionType": 1
      },
      {
          "Keyword": `${keyword} precision`,
          "Refinements": null,
          "SuggestionType": 1
      },
      {
          "Keyword": `${keyword} xps`,
          "Refinements": [
            {
              "Description": "Desktops & Workstations > Desktops",
              "RefinementId": "510010101",
              "RefinementType": 0
            }
          ],
          "SuggestionType": 1
      },
      {
          "Keyword": `${keyword} inspiron`,
          "Refinements": null,
          "SuggestionType": 1
      }
    ]
  });
});

app.get("/ui-config/v1/configurations", function (req, res) {
  res.json({
    "content": {
      "pageNumber": 1,
      "pageSize": 25,
      "totalItems": 25,
      "items": [
        {
          "configId": "VG116957111OI",
          "configurationType": "Estimate",
          "created": utils.getRandomDate(),
          "expires":"n/a",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "AVNET TS LTD",
          "tdQuoteId": null,
          "quotes": [
            {
                "id": "CD_ID__1",
                "line": "Line_863",
                "quantity": 6,
                "price": "54,048.50",
                "priceFormatted": "54,048.50",
                "currency": "USD",
                "currencySymbol": "$",
                "created": "8/8/2021",
                "status": "Created"
            },
            {
                "id": "CD_ID__2",
                "line": "Line_104",
                "quantity": 9,
                "price": "54,048.50",
                "priceFormatted": "54,048.50",
                "currency": "USD",
                "currencySymbol": "$",
                "created": "8/6/2021",
                "status": "Created"
            },
            {
                "id": "CD_ID__2",
                "line": "Line_104",
                "quantity": 9,
                "price": "54,048.50",
                "priceFormatted": "54,048.50",
                "currency": "USD",
                "currencySymbol": "$",
                "created": "8/6/2021",
                "status": "Failed"
            },
            {
                "id": "CD_ID__3",
                "line": "",
                "quantity": 0,
                "price": 0.0,
                "created": "",
                "status": "Expired"
            },
            {
                "id": "",
                "line": "",
                "quantity": 0,
                "price": 0.0,
                "created": "",
                "status": "Pending"
            }
          ],
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_VG116957111OI_1",
              "line": "Line_780",
              "quantity": 9,
              "price": 4,
              "created": "2021-07-28T13:30:00.7123344Z"
            },
            {
              "id": "CD_ID_VG116957111OI_2",
              "line": "Line_558",
              "quantity": 2,
              "price": 59,
              "created": "2021-08-04T13:30:00.7123387Z"
            },
            {
              "id": "CD_ID_VG116957111OI_3",
              "line": "Line_484",
              "quantity": 6,
              "price": 82,
              "created": "2021-07-31T13:30:00.7123395Z"
            },
            {
              "id": "CD_ID_VG116957111OI_4",
              "line": "Line_421",
              "quantity": 9,
              "price": 97,
              "created": "2021-07-29T13:30:00.7123414Z"
            }
          ]
        },
        {
          "configId": "FZ91408441LN",
          "configurationType": "Estimate",
          "created": utils.getRandomDate(),
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "EUMETSAT",
          "tdQuoteId": null,
          "quotes":[
            {
              "id": "CD_ID_4735099626_1",
              "line": "513",
              "quantity": 8,
              "price": 49.0,
              "created": "9/29/2021",
              "status": "Created",
            },
            {
              "id:": "CD_ID_4735099626_2",
              "line": "901",
              "quantity": 2,
              "price": 62.0,
              "created": "9/24/2021",
              "status": "Created",
            },
            {
              "id": "",
              "line": "",
              "quantity": 0,
              "price": 0.0,
              "created": "",
              "status": "Expired",
            },
          ],
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_FZ91408441LN_1",
              "line": "Line_360",
              "quantity": 5,
              "price": 41,
              "created": "2021-07-31T13:30:00.7123421Z"
            },
            {
              "id": "CD_ID_FZ91408441LN_2",
              "line": "Line_807",
              "quantity": 6,
              "price": 68,
              "created": "2021-08-04T13:30:00.7123427Z"
            },
            {
              "id": "CD_ID_FZ91408441LN_3",
              "line": "Line_711",
              "quantity": 9,
              "price": 54,
              "created": "2021-07-28T13:30:00.7123432Z"
            }
          ]
        },
        {
          "configId": "RX119069703KD",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": null,
          "tdQuoteId": null,
          "quotes": [
            {
                "id": "CD_ID__1",
                "line": "Line_863",
                "quantity": 6,
                "price": 54.0,
                "created": "8/8/2021",
                "status": "Pending"
            },
          ],
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_RX119069703KD_1",
              "line": "Line_686",
              "quantity": 1,
              "price": 87,
              "created": "2021-08-05T13:30:00.7123437Z"
            },
            {
              "id": "CD_ID_RX119069703KD_2",
              "line": "Line_343",
              "quantity": 2,
              "price": 65,
              "created": "2021-08-03T13:30:00.7123444Z"
            },
            {
              "id": "CD_ID_RX119069703KD_3",
              "line": "Line_252",
              "quantity": 7,
              "price": 23,
              "created": "2021-08-02T13:30:00.7123449Z"
            },
            {
              "id": "CD_ID_RX119069703KD_4",
              "line": "Line_211",
              "quantity": 3,
              "price": 18,
              "created": "2021-07-28T13:30:00.7123453Z"
            }
          ]
        },
        {
          "configId": "GV77554631XP",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "AXCIOM UK LTD",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_GV77554631XP_1",
              "line": "Line_508",
              "quantity": 7,
              "price": 4,
              "created": "2021-08-02T13:30:00.7123459Z"
            },
            {
              "id": "CD_ID_GV77554631XP_2",
              "line": "Line_549",
              "quantity": 7,
              "price": 65,
              "created": "2021-07-31T13:30:00.7123465Z"
            },
            {
              "id": "CD_ID_GV77554631XP_3",
              "line": "Line_160",
              "quantity": 4,
              "price": 30,
              "created": "2021-07-31T13:30:00.7123469Z"
            }
          ]
        },
        {
          "configId": "VI112127534ZT",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "VITALITY CORPORATE SERVICES LTD",
          "tdQuoteId": null,
          "quotes": [
            {
                "id": "CD_ID__3",
                "line": "",
                "quantity": 0,
                "price": 0.0,
                "created": "",
                "status": "Expired"
            }
          ],
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_VI112127534ZT_1",
              "line": "Line_422",
              "quantity": 1,
              "price": 40,
              "created": "2021-08-03T13:30:00.7123475Z"
            },
            {
              "id": "CD_ID_VI112127534ZT_2",
              "line": "Line_852",
              "quantity": 6,
              "price": 79,
              "created": "2021-08-02T13:30:00.712348Z"
            },
            {
              "id": "CD_ID_VI112127534ZT_3",
              "line": "Line_13",
              "quantity": 5,
              "price": 5,
              "created": "2021-07-29T13:30:00.7123486Z"
            }
          ]
        },
        {
          "configId": "SN120740841PY",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "NIKE",
          "tdQuoteId": null,
          "quotes": [
            {
                "id": "CD_ID__2",
                "line": "Line_104",
                "quantity": 9,
                "price": "54,048.50",
                "priceFormatted": "54,048.50",
                "currency": "USD",
                "currencySymbol": "$",
                "created": "8/6/2021",
                "status": "Failed"
            },
          ],
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_SN120740841PY_1",
              "line": "Line_932",
              "quantity": 2,
              "price": 60,
              "created": "2021-07-28T13:30:00.7123492Z"
            },
            {
              "id": "CD_ID_SN120740841PY_2",
              "line": "Line_625",
              "quantity": 8,
              "price": 63,
              "created": "2021-08-02T13:30:00.7123497Z"
            }
          ]
        },
        {
          "configId": "BB119209153JS",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "NIKE",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_BB119209153JS_1",
              "line": "Line_749",
              "quantity": 9,
              "price": 11,
              "created": "2021-08-02T13:30:00.7123503Z"
            },
            {
              "id": "CD_ID_BB119209153JS_2",
              "line": "Line_830",
              "quantity": 7,
              "price": 91,
              "created": "2021-08-02T13:30:00.7123509Z"
            },
            {
              "id": "CD_ID_BB119209153JS_3",
              "line": "Line_868",
              "quantity": 6,
              "price": 3,
              "created": "2021-08-02T13:30:00.7123514Z"
            }
          ]
        },
        {
          "configId": "AH119209147IG",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "NIKE",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_AH119209147IG_1",
              "line": "Line_780",
              "quantity": 6,
              "price": 54,
              "created": "2021-08-01T13:30:00.712352Z"
            },
            {
              "id": "CD_ID_AH119209147IG_2",
              "line": "Line_15",
              "quantity": 4,
              "price": 18,
              "created": "2021-07-28T13:30:00.7123525Z"
            },
            {
              "id": "CD_ID_AH119209147IG_3",
              "line": "Line_231",
              "quantity": 8,
              "price": 95,
              "created": "2021-08-05T13:30:00.712353Z"
            },
            {
              "id": "CD_ID_AH119209147IG_4",
              "line": "Line_745",
              "quantity": 4,
              "price": 5,
              "created": "2021-08-03T13:30:00.7123535Z"
            }
          ]
        },
        {
          "configId": "YR116957121WZ",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "NIKE",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_YR116957121WZ_1",
              "line": "Line_466",
              "quantity": 2,
              "price": 59,
              "created": "2021-08-01T13:30:00.7123541Z"
            },
            {
              "id": "CD_ID_YR116957121WZ_2",
              "line": "Line_715",
              "quantity": 1,
              "price": 59,
              "created": "2021-07-31T13:30:00.7123546Z"
            },
            {
              "id": "CD_ID_YR116957121WZ_3",
              "line": "Line_610",
              "quantity": 2,
              "price": 16,
              "created": "2021-08-01T13:30:00.7123551Z"
            },
            {
              "id": "CD_ID_YR116957121WZ_4",
              "line": "Line_397",
              "quantity": 5,
              "price": 11,
              "created": "2021-08-03T13:30:00.7123556Z"
            }
          ]
        },
        {
          "configId": "WC121011624NR",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "NIKE",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_WC121011624NR_1",
              "line": "Line_559",
              "quantity": 6,
              "price": 32,
              "created": "2021-07-31T13:30:00.7123562Z"
            },
            {
              "id": "CD_ID_WC121011624NR_2",
              "line": "Line_144",
              "quantity": 2,
              "price": 19,
              "created": "2021-07-28T13:30:00.7123567Z"
            },
            {
              "id": "CD_ID_WC121011624NR_3",
              "line": "Line_197",
              "quantity": 9,
              "price": 73,
              "created": "2021-08-04T13:30:00.7123572Z"
            }
          ]
        },
        {
          "configId": "LL116577524NC",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "NIKE",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_LL116577524NC_1",
              "line": "Line_686",
              "quantity": 3,
              "price": 31,
              "created": "2021-08-02T13:30:00.7123577Z"
            },
            {
              "id": "CD_ID_LL116577524NC_2",
              "line": "Line_220",
              "quantity": 6,
              "price": 59,
              "created": "2021-08-03T13:30:00.7123582Z"
            },
            {
              "id": "CD_ID_LL116577524NC_3",
              "line": "Line_924",
              "quantity": 4,
              "price": 96,
              "created": "2021-07-31T13:30:00.7123594Z"
            },
            {
              "id": "CD_ID_LL116577524NC_4",
              "line": "Line_306",
              "quantity": 9,
              "price": 55,
              "created": "2021-07-28T13:30:00.71236Z"
            },
            {
              "id": "CD_ID_LL116577524NC_5",
              "line": "Line_603",
              "quantity": 6,
              "price": 63,
              "created": "2021-08-03T13:30:00.7123605Z"
            }
          ]
        },
        {
          "configId": "RZ93817768PM",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "WTS GLOBAL",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_RZ93817768PM_1",
              "line": "Line_598",
              "quantity": 4,
              "price": 32,
              "created": "2021-07-28T13:30:00.7123611Z"
            },
            {
              "id": "CD_ID_RZ93817768PM_2",
              "line": "Line_530",
              "quantity": 9,
              "price": 32,
              "created": "2021-08-03T13:30:00.7123616Z"
            },
            {
              "id": "CD_ID_RZ93817768PM_3",
              "line": "Line_436",
              "quantity": 3,
              "price": 34,
              "created": "2021-08-04T13:30:00.7123621Z"
            }
          ]
        },
        {
          "configId": "DI114806079WY",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "AVNET TS LTD",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_DI114806079WY_1",
              "line": "Line_165",
              "quantity": 2,
              "price": 34,
              "created": "2021-07-28T13:30:00.7123627Z"
            },
            {
              "id": "CD_ID_DI114806079WY_2",
              "line": "Line_38",
              "quantity": 9,
              "price": 27,
              "created": "2021-07-30T13:30:00.7123632Z"
            }
          ]
        },
        {
          "configId": "IZ118585707YL",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
        },
        {
          "configId": "FZ91408441LN",
          "configurationType": "Estimate",
          "created": utils.getRandomDate(),
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "EUMETSAT",
          "tdQuoteId": null,
          "quotes": [
            {
                "id": "CD_ID__1",
                "line": "Line_863",
                "quantity": 6,
                "price": 54.0,
                "created": "8/8/2021",
                "status": "Created"
            },
          ],
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_FZ91408441LN_1",
              "line": "Line_360",
              "quantity": 5,
              "price": 41,
              "created": "2021-07-31T13:30:00.7123421Z"
            },
            {
              "id": "CD_ID_FZ91408441LN_2",
              "line": "Line_807",
              "quantity": 6,
              "price": 68,
              "created": "2021-08-04T13:30:00.7123427Z"
            },
            {
              "id": "CD_ID_FZ91408441LN_3",
              "line": "Line_711",
              "quantity": 9,
              "price": 54,
              "created": "2021-07-28T13:30:00.7123432Z"
            }
          ]
        },
        {
          "configId": "RX119069703KD",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": null,
          "tdQuoteId": null,
          "quotes": [
            {
                "id": "CD_ID__1",
                "line": "Line_863",
                "quantity": 6,
                "price": 54.0,
                "created": "8/8/2021",
                "status": "Pending"
            },
          ],
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_RX119069703KD_1",
              "line": "Line_686",
              "quantity": 1,
              "price": 87,
              "created": "2021-08-05T13:30:00.7123437Z"
            },
            {
              "id": "CD_ID_RX119069703KD_2",
              "line": "Line_343",
              "quantity": 2,
              "price": 65,
              "created": "2021-08-03T13:30:00.7123444Z"
            },
            {
              "id": "CD_ID_RX119069703KD_3",
              "line": "Line_252",
              "quantity": 7,
              "price": 23,
              "created": "2021-08-02T13:30:00.7123449Z"
            },
            {
              "id": "CD_ID_RX119069703KD_4",
              "line": "Line_211",
              "quantity": 3,
              "price": 18,
              "created": "2021-07-28T13:30:00.7123453Z"
            }
          ]
        },
        {
          "configId": "GV77554631XP",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "AXCIOM UK LTD",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_GV77554631XP_1",
              "line": "Line_508",
              "quantity": 7,
              "price": 4,
              "created": "2021-08-02T13:30:00.7123459Z"
            },
            {
              "id": "CD_ID_GV77554631XP_2",
              "line": "Line_549",
              "quantity": 7,
              "price": 65,
              "created": "2021-07-31T13:30:00.7123465Z"
            },
            {
              "id": "CD_ID_GV77554631XP_3",
              "line": "Line_160",
              "quantity": 4,
              "price": 30,
              "created": "2021-07-31T13:30:00.7123469Z"
            }
          ]
        },
        {
          "configId": "VI112127534ZT",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "VITALITY CORPORATE SERVICES LTD",
          "tdQuoteId": null,
          "quotes": [
            {
                "id": "CD_ID__3",
                "line": "",
                "quantity": 0,
                "price": 0.0,
                "created": "",
                "status": "Expired"
            }
          ],
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_VI112127534ZT_1",
              "line": "Line_422",
              "quantity": 1,
              "price": 40,
              "created": "2021-08-03T13:30:00.7123475Z"
            },
            {
              "id": "CD_ID_VI112127534ZT_2",
              "line": "Line_852",
              "quantity": 6,
              "price": 79,
              "created": "2021-08-02T13:30:00.712348Z"
            },
            {
              "id": "CD_ID_VI112127534ZT_3",
              "line": "Line_13",
              "quantity": 5,
              "price": 5,
              "created": "2021-07-29T13:30:00.7123486Z"
            }
          ]
        },
        {
          "configId": "SN120740841PY",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "NIKE",
          "tdQuoteId": null,
          "quotes": [
            {
                "id": "CD_ID__2",
                "line": "Line_104",
                "quantity": 9,
                "price": "54,048.50",
                "priceFormatted": "54,048.50",
                "currency": "USD",
                "currencySymbol": "$",
                "created": "8/6/2021",
                "status": "Failed"
            },
          ],
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_SN120740841PY_1",
              "line": "Line_932",
              "quantity": 2,
              "price": 60,
              "created": "2021-07-28T13:30:00.7123492Z"
            },
            {
              "id": "CD_ID_SN120740841PY_2",
              "line": "Line_625",
              "quantity": 8,
              "price": 63,
              "created": "2021-08-02T13:30:00.7123497Z"
            }
          ]
        },
        {
          "configId": "BB119209153JS",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "NIKE",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_BB119209153JS_1",
              "line": "Line_749",
              "quantity": 9,
              "price": 11,
              "created": "2021-08-02T13:30:00.7123503Z"
            },
            {
              "id": "CD_ID_BB119209153JS_2",
              "line": "Line_830",
              "quantity": 7,
              "price": 91,
              "created": "2021-08-02T13:30:00.7123509Z"
            },
            {
              "id": "CD_ID_BB119209153JS_3",
              "line": "Line_868",
              "quantity": 6,
              "price": 3,
              "created": "2021-08-02T13:30:00.7123514Z"
            }
          ]
        },
        {
          "configId": "AH119209147IG",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "NIKE",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_AH119209147IG_1",
              "line": "Line_780",
              "quantity": 6,
              "price": 54,
              "created": "2021-08-01T13:30:00.712352Z"
            },
            {
              "id": "CD_ID_AH119209147IG_2",
              "line": "Line_15",
              "quantity": 4,
              "price": 18,
              "created": "2021-07-28T13:30:00.7123525Z"
            },
            {
              "id": "CD_ID_AH119209147IG_3",
              "line": "Line_231",
              "quantity": 8,
              "price": 95,
              "created": "2021-08-05T13:30:00.712353Z"
            },
            {
              "id": "CD_ID_AH119209147IG_4",
              "line": "Line_745",
              "quantity": 4,
              "price": 5,
              "created": "2021-08-03T13:30:00.7123535Z"
            }
          ]
        },
        {
          "configId": "YR116957121WZ",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "NIKE",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_YR116957121WZ_1",
              "line": "Line_466",
              "quantity": 2,
              "price": 59,
              "created": "2021-08-01T13:30:00.7123541Z"
            },
            {
              "id": "CD_ID_YR116957121WZ_2",
              "line": "Line_715",
              "quantity": 1,
              "price": 59,
              "created": "2021-07-31T13:30:00.7123546Z"
            },
            {
              "id": "CD_ID_YR116957121WZ_3",
              "line": "Line_610",
              "quantity": 2,
              "price": 16,
              "created": "2021-08-01T13:30:00.7123551Z"
            },
            {
              "id": "CD_ID_YR116957121WZ_4",
              "line": "Line_397",
              "quantity": 5,
              "price": 11,
              "created": "2021-08-03T13:30:00.7123556Z"
            }
          ]
        },
        {
          "configId": "WC121011624NR",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "NIKE",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_WC121011624NR_1",
              "line": "Line_559",
              "quantity": 6,
              "price": 32,
              "created": "2021-07-31T13:30:00.7123562Z"
            },
            {
              "id": "CD_ID_WC121011624NR_2",
              "line": "Line_144",
              "quantity": 2,
              "price": 19,
              "created": "2021-07-28T13:30:00.7123567Z"
            },
            {
              "id": "CD_ID_WC121011624NR_3",
              "line": "Line_197",
              "quantity": 9,
              "price": 73,
              "created": "2021-08-04T13:30:00.7123572Z"
            }
          ]
        },
        {
          "configId": "LL116577524NC",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "NIKE",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_LL116577524NC_1",
              "line": "Line_686",
              "quantity": 3,
              "price": 31,
              "created": "2021-08-02T13:30:00.7123577Z"
            },
            {
              "id": "CD_ID_LL116577524NC_2",
              "line": "Line_220",
              "quantity": 6,
              "price": 59,
              "created": "2021-08-03T13:30:00.7123582Z"
            },
            {
              "id": "CD_ID_LL116577524NC_3",
              "line": "Line_924",
              "quantity": 4,
              "price": 96,
              "created": "2021-07-31T13:30:00.7123594Z"
            },
            {
              "id": "CD_ID_LL116577524NC_4",
              "line": "Line_306",
              "quantity": 9,
              "price": 55,
              "created": "2021-07-28T13:30:00.71236Z"
            },
            {
              "id": "CD_ID_LL116577524NC_5",
              "line": "Line_603",
              "quantity": 6,
              "price": 63,
              "created": "2021-08-03T13:30:00.7123605Z"
            }
          ]
        },
        {
          "configId": "RZ93817768PM",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "WTS GLOBAL",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_RZ93817768PM_1",
              "line": "Line_598",
              "quantity": 4,
              "price": 32,
              "created": "2021-07-28T13:30:00.7123611Z"
            },
            {
              "id": "CD_ID_RZ93817768PM_2",
              "line": "Line_530",
              "quantity": 9,
              "price": 32,
              "created": "2021-08-03T13:30:00.7123616Z"
            },
            {
              "id": "CD_ID_RZ93817768PM_3",
              "line": "Line_436",
              "quantity": 3,
              "price": 34,
              "created": "2021-08-04T13:30:00.7123621Z"
            }
          ]
        },
        {
          "configId": "DI114806079WY",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "AVNET TS LTD",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_DI114806079WY_1",
              "line": "Line_165",
              "quantity": 2,
              "price": 34,
              "created": "2021-07-28T13:30:00.7123627Z"
            },
            {
              "id": "CD_ID_DI114806079WY_2",
              "line": "Line_38",
              "quantity": 9,
              "price": 27,
              "created": "2021-07-30T13:30:00.7123632Z"
            }
          ]
        },
        {
          "configId": "IZ118585707YL",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "EUMETSAT",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_IZ118585707YL_1",
              "line": "Line_676",
              "quantity": 1,
              "price": 80,
              "created": "2021-08-02T13:30:00.7123638Z"
            },
            {
              "id": "CD_ID_IZ118585707YL_2",
              "line": "Line_184",
              "quantity": 6,
              "price": 36,
              "created": "2021-07-30T13:30:00.7123643Z"
            },
            {
              "id": "CD_ID_IZ118585707YL_3",
              "line": "Line_378",
              "quantity": 4,
              "price": 38,
              "created": "2021-08-04T13:30:00.7123648Z"
            },
            {
              "id": "CD_ID_IZ118585707YL_4",
              "line": "Line_532",
              "quantity": 8,
              "price": 76,
              "created": "2021-08-02T13:30:00.7123653Z"
            }
          ]
        },
        {
          "configId": "XQ116957118HQ",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "NIKE",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_XQ116957118HQ_1",
              "line": "Line_543",
              "quantity": 5,
              "price": 63,
              "created": "2021-07-31T13:30:00.7123659Z"
            },
            {
              "id": "CD_ID_XQ116957118HQ_2",
              "line": "Line_191",
              "quantity": 6,
              "price": 18,
              "created": "2021-08-02T13:30:00.7123665Z"
            }
          ]
        },
        {
          "configId": "OK116957113XB",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "AVNET TS LTD",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_OK116957113XB_1",
              "line": "Line_279",
              "quantity": 6,
              "price": 14,
              "created": "2021-08-03T13:30:00.712367Z"
            },
            {
              "id": "CD_ID_OK116957113XB_2",
              "line": "Line_548",
              "quantity": 2,
              "price": 71,
              "created": "2021-08-02T13:30:00.7123675Z"
            },
            {
              "id": "CD_ID_OK116957113XB_3",
              "line": "Line_453",
              "quantity": 8,
              "price": 77,
              "created": "2021-07-30T13:30:00.712368Z"
            },
            {
              "id": "CD_ID_OK116957113XB_4",
              "line": "Line_556",
              "quantity": 5,
              "price": 42,
              "created": "2021-07-29T13:30:00.7123685Z"
            }
          ]
        },
        {
          "configId": "DX117055392DU",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "Tech Data Azlan",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_DX117055392DU_1",
              "line": "Line_302",
              "quantity": 2,
              "price": 83,
              "created": "2021-07-28T13:30:00.7123691Z"
            },
            {
              "id": "CD_ID_DX117055392DU_2",
              "line": "Line_314",
              "quantity": 9,
              "price": 38,
              "created": "2021-07-31T13:30:00.7123696Z"
            }
          ]
        },
        {
          "configId": "VT116852093GP",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "AVNET TS LTD",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_VT116852093GP_1",
              "line": "Line_684",
              "quantity": 1,
              "price": 16,
              "created": "2021-08-03T13:30:00.7123702Z"
            },
            {
              "id": "CD_ID_VT116852093GP_2",
              "line": "Line_173",
              "quantity": 2,
              "price": 20,
              "created": "2021-08-05T13:30:00.7123708Z"
            }
          ]
        },
        {
          "configId": "RH116936683UF",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": null,
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_RH116936683UF_1",
              "line": "Line_852",
              "quantity": 8,
              "price": 10,
              "created": "2021-07-30T13:30:00.7123713Z"
            },
            {
              "id": "CD_ID_RH116936683UF_2",
              "line": "Line_527",
              "quantity": 7,
              "price": 64,
              "created": "2021-08-02T13:30:00.7123718Z"
            }
          ]
        },
        {
          "configId": "GP116942601FT",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": null,
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_GP116942601FT_1",
              "line": "Line_258",
              "quantity": 3,
              "price": 97,
              "created": "2021-08-01T13:30:00.7123724Z"
            },
            {
              "id": "CD_ID_GP116942601FT_2",
              "line": "Line_742",
              "quantity": 3,
              "price": 24,
              "created": "2021-08-05T13:30:00.712373Z"
            }
          ]
        },
        {
          "configId": "HE116856613ZL",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "AVNET TS LTD",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_HE116856613ZL_1",
              "line": "Line_226",
              "quantity": 6,
              "price": 10,
              "created": "2021-07-31T13:30:00.7123735Z"
            },
            {
              "id": "CD_ID_HE116856613ZL_2",
              "line": "Line_530",
              "quantity": 3,
              "price": 25,
              "created": "2021-08-01T13:30:00.7123741Z"
            },
            {
              "id": "CD_ID_HE116856613ZL_3",
              "line": "Line_913",
              "quantity": 9,
              "price": 56,
              "created": "2021-07-29T13:30:00.7123746Z"
            }
          ]
        },
        {
          "configId": "PM114055193ZJ",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": null,
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_PM114055193ZJ_1",
              "line": "Line_951",
              "quantity": 4,
              "price": 85,
              "created": "2021-07-28T13:30:00.7123751Z"
            },
            {
              "id": "CD_ID_PM114055193ZJ_2",
              "line": "Line_673",
              "quantity": 8,
              "price": 19,
              "created": "2021-08-05T13:30:00.7123767Z"
            }
          ]
        },
        {
          "configId": "KP115520116KI",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "AVNET TS LTD",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_KP115520116KI_1",
              "line": "Line_166",
              "quantity": 9,
              "price": 45,
              "created": "2021-08-01T13:30:00.7123773Z"
            },
            {
              "id": "CD_ID_KP115520116KI_2",
              "line": "Line_996",
              "quantity": 8,
              "price": 21,
              "created": "2021-07-28T13:30:00.7123779Z"
            },
            {
              "id": "CD_ID_KP115520116KI_3",
              "line": "Line_488",
              "quantity": 1,
              "price": 97,
              "created": "2021-08-05T13:30:00.7123784Z"
            },
            {
              "id": "CD_ID_KP115520116KI_4",
              "line": "Line_272",
              "quantity": 4,
              "price": 65,
              "created": "2021-07-30T13:30:00.7123789Z"
            }
          ]
        },
        {
          "configId": "TS114826584DF",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "AVNET TS LTD",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_TS114826584DF_1",
              "line": "Line_678",
              "quantity": 3,
              "price": 81,
              "created": "2021-08-01T13:30:00.7123794Z"
            },
            {
              "id": "CD_ID_TS114826584DF_2",
              "line": "Line_315",
              "quantity": 5,
              "price": 65,
              "created": "2021-07-29T13:30:00.7123799Z"
            },
            {
              "id": "CD_ID_TS114826584DF_3",
              "line": "Line_759",
              "quantity": 1,
              "price": 58,
              "created": "2021-07-30T13:30:00.7123804Z"
            }
          ]
        },
        {
          "configId": "MM116066602KC",
          "configurationType": "Estimate",
          "created": "0001-01-01T00:00:00",
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "AVNET TS LTD",
          "tdQuoteId": null,
          "vendorQuoteId": null,
          "action": "CreateQuote",
          "details": [
            {
              "id": "CD_ID_MM116066602KC_1",
              "line": "Line_28",
              "quantity": 6,
              "price": 2,
              "created": "2021-08-03T13:30:00.712381Z"
            },
            {
              "id": "CD_ID_MM116066602KC_2",
              "line": "Line_565",
              "quantity": 5,
              "price": 90,
              "created": "2021-08-04T13:30:00.7123816Z"
            },
            {
              "id": "CD_ID_MM116066602KC_3",
              "line": "Line_920",
              "quantity": 4,
              "price": 28,
              "created": "2021-08-03T13:30:00.7123821Z"
            },
            {
              "id": "CD_ID_MM116066602KC_4",
              "line": "Line_696",
              "quantity": 1,
              "price": 68,
              "created": "2021-08-01T13:30:00.7123826Z"
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
  });
});

app.get("/ui-config/v1/estimations/validate/", function (req, res) {
  const { id } = req.query;
  if (!req.headers["sessionid"] || !id) {
    return res.status(500).json({
      error: {
        code: 0,
        message: [],
        isError: true,
      },
    });
  }
  return res.status(200).json({
    content: { isValid: true },
    error: { code: 0, messages: [], isError: false },
  });
});

app.get("/ui-config/v1/renewals", function (req, res) {
  res.json({
    content: {
      pageNumber: 1,
      pageSize: 25,
      totalItems: 25,
      items: [
        {
          configId: "renewalVG116957111OI",
          configurationType: "Estimate",
          dueDate: utils.getRandomDate(),
          expires: "n/a",
          vendor: "Cisco",
          configName: null,
          resellerName: "A Reseller",
          endUserName: "AVNET TS LTD",
          agreementNumber: "234928433",
          renewalPlan: "234928433",
          price: "234928433",
          vendorQuoteId: null,
          action: "CreateQuote",
        },
      ],
    },
    error: {
      code: 0,
      messages: [],
      isError: false,
    },
    "error": {
      "code": 0,
      "messages": [],
      "isError": false
    }
  });
});
//---QUOTE PREVIEW MOCK API---//
app.get("/ui-commerce/v1/quote/preview", function (req, res) {
    const { id, isEstimateId, vendor } = req.query;

    if (!req.headers["sessionid"] || !id || !isEstimateId) {
        return res.status(500).json({
            error: {
                code: 0,
                message: [],
                isError: true,
            },
        });
    }
    const response = {
      "content": {
        "quotePreview": {
          "quoteDetails": {
            "shipTo": null,
            "endUser": {
              "id": null,
              "companyName": "Some Company",
              "name": "name",
              "line1": "line1",
              "line2": "line2",
              "line3": "line3",
              "city": "city",
              "state": "state",
              "zip": "zip",
              "postalCode": "postalCode",
              "country": "country",
              "email": "email",
              "phoneNumber": "phoneNumber"
            },
            "reseller": [
              {
                "companyName": "Some Company",
                "name": "thomas",
                "addressNumber": "0001369841",
                "line1": "4111 Northside Parkway",
                "line2": " ",
                "line3": " ",
                "city": "ATLANTA",
                "state": "GA",
                "country": "US",
                "postalCode": "30327",
                "email": null,
                "phoneNumber": "8005276389",
                "salesOrganization": "0100",
              }
            ],
            "source": {
              "type": isEstimateId=== 'true' ? "Estimate": "VendorQuote",
              "value": "QJ128146301OP"
            },
            "notes": null,
            "items": [
              {
                "id": "1.0",
                "parent": null,
                "vendorPartNo": "N3K-C3524P-XL",
                "manufacturer": "CISCO",
                "description": "Nexus 3524-XL 24 SFP+ ports, Enhanced, Extended Memory",
                "quantity": 1,
                "unitPrice": 15361,
                "unitPriceFormatted": "15,361.00",
                "totalPrice": null,
                "totalPriceFormatted": "",
                "msrp": null,
                "invoice": null,
                "discounts": [],
                "contract": null,
                "shortDescription": "Nexus 3524-XL 24 SFP+ ports, Enhanced, Extended Memory",
                "mfrNumber": "N3K-C3524P-XL",
                "tdNumber": null,
                "upcNumber": null,
                "unitListPrice": null,
                "unitListPriceFormatted": "15,361.00",
                "extendedPrice": "15361.0",
                "extendedPriceFormatted": "15361.0",
                "availability": null,
                "rebateValue": null,
                "urlProductImage": null,
                "urlProductSpecs": null,
                "children": [
                  {
                    "id": "1.1",
                    "parent": "1.0",
                    "vendorPartNo": "N3548-BAS1K9",
                    "manufacturer": "CISCO",
                    "description": "Nexus 3500 Base License",
                    "quantity": 1,
                    "unitPrice": 0,
                    "unitPriceFormatted": "0.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "Nexus 3500 Base License",
                    "mfrNumber": "N3548-BAS1K9",
                    "tdNumber": null,
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "0.00",
                    "extendedPrice": "0.0",
                    "extendedPriceFormatted": "0.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": null,
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "1.1"
                  },
                  {
                    "id": "1.2",
                    "parent": "1.0",
                    "vendorPartNo": "N3524-LAN1K9",
                    "manufacturer": "CISCO",
                    "description": "Nexus 3524 Layer 3 LAN Enterprise License",
                    "quantity": 1,
                    "unitPrice": 4014,
                    "unitPriceFormatted": "4,014.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "Nexus 3524 Layer 3 LAN Enterprise License",
                    "mfrNumber": "N3524-LAN1K9",
                    "tdNumber": null,
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "4,014.00",
                    "extendedPrice": "4014.0",
                    "extendedPriceFormatted": "4014.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": null,
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "1.2"
                  },
                  {
                    "id": "1.2.0.1",
                    "parent": "1.2",
                    "vendorPartNo": "CON-ECMU-N35243LA",
                    "manufacturer": "CISCO",
                    "description": null,
                    "quantity": 1,
                    "unitPrice": 720,
                    "unitPriceFormatted": "720.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": null,
                    "mfrNumber": "CON-ECMU-N35243LA",
                    "tdNumber": "13776578",
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "720.00",
                    "extendedPrice": "720.0",
                    "extendedPriceFormatted": "720.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "1.2.0.1"
                  },
                  {
                    "id": "1.3",
                    "parent": "1.0",
                    "vendorPartNo": "NXOS-9.2.2",
                    "manufacturer": "CISCO",
                    "description": "Nexus 9500, 9300, 3000 Base NX-OS Software Rel 9.2.2",
                    "quantity": 1,
                    "unitPrice": 0,
                    "unitPriceFormatted": "0.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "Nexus 9500, 9300, 3000 Base NX-OS Software Rel 9.2.2",
                    "mfrNumber": "NXOS-9.2.2",
                    "tdNumber": null,
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "0.00",
                    "extendedPrice": "0.0",
                    "extendedPriceFormatted": "0.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": null,
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "1.3"
                  },
                  {
                    "id": "1.4",
                    "parent": "1.0",
                    "vendorPartNo": "NXA-FAN-30CFM-F",
                    "manufacturer": "CISCO",
                    "description": "Nexus Fan, 30CFM, port side exhaust airflow",
                    "quantity": 4,
                    "unitPrice": 0,
                    "unitPriceFormatted": "0.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "Nexus Fan, 30CFM, port side exhaust airflow",
                    "mfrNumber": "NXA-FAN-30CFM-F",
                    "tdNumber": null,
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "0.00",
                    "extendedPrice": "0.0",
                    "extendedPriceFormatted": "0.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": null,
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "1.4"
                  },
                  {
                    "id": "1.5",
                    "parent": "1.0",
                    "vendorPartNo": "N3548-24P-LIC",
                    "manufacturer": "CISCO",
                    "description": "Nexus 3524 Factory Installed 24 port license",
                    "quantity": 1,
                    "unitPrice": 0,
                    "unitPriceFormatted": "0.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "Nexus 3524 Factory Installed 24 port license",
                    "mfrNumber": "N3548-24P-LIC",
                    "tdNumber": null,
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "0.00",
                    "extendedPrice": "0.0",
                    "extendedPriceFormatted": "0.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": null,
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "1.5"
                  },
                  {
                    "id": "1.6",
                    "parent": "1.0",
                    "vendorPartNo": "N3K-C3064-ACC-KIT",
                    "manufacturer": "CISCO",
                    "description": "Nexus 3K/9K Fixed Accessory Kit",
                    "quantity": 1,
                    "unitPrice": 0,
                    "unitPriceFormatted": "0.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "Nexus 3K/9K Fixed Accessory Kit",
                    "mfrNumber": "N3K-C3064-ACC-KIT",
                    "tdNumber": null,
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "0.00",
                    "extendedPrice": "0.0",
                    "extendedPriceFormatted": "0.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": null,
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "1.6"
                  },
                  {
                    "id": "1.7",
                    "parent": "1.0",
                    "vendorPartNo": "SFP-H10GB-CU1M",
                    "manufacturer": "CISCO",
                    "description": "10GBASE-CU SFP+ Cable 1 Meter",
                    "quantity": 8,
                    "unitPrice": 108.35,
                    "unitPriceFormatted": "108.35",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "10GBASE-CU SFP+ Cable 1 Meter",
                    "mfrNumber": "SFP-H10GB-CU1M",
                    "tdNumber": null,
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "108.35",
                    "extendedPrice": "866.8",
                    "extendedPriceFormatted": "866.8",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": null,
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "1.7"
                  },
                  {
                    "id": "1.8",
                    "parent": "1.0",
                    "vendorPartNo": "N2200-PAC-400W",
                    "manufacturer": "CISCO",
                    "description": "Nexus 400W AC Power Supply, Std airflow (port side exhaust)",
                    "quantity": 2,
                    "unitPrice": 0,
                    "unitPriceFormatted": "0.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "Nexus 400W AC Power Supply, Std airflow (port side exhaust)",
                    "mfrNumber": "N2200-PAC-400W",
                    "tdNumber": null,
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "0.00",
                    "extendedPrice": "0.0",
                    "extendedPriceFormatted": "0.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": null,
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "1.8"
                  },
                  {
                    "id": "1.9",
                    "parent": "1.0",
                    "vendorPartNo": "CAB-9K12A-NA",
                    "manufacturer": "CISCO",
                    "description": "Power Cord, 125VAC 13A NEMA 5-15 Plug, North America",
                    "quantity": 2,
                    "unitPrice": 0,
                    "unitPriceFormatted": "0.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "Power Cord, 125VAC 13A NEMA 5-15 Plug, North America",
                    "mfrNumber": "CAB-9K12A-NA",
                    "tdNumber": "10117017",
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "0.00",
                    "extendedPrice": "0.0",
                    "extendedPriceFormatted": "0.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "1.9"
                  },
                  {
                    "id": "1.0.1",
                    "parent": "1.0",
                    "vendorPartNo": "CON-SNTP-3524PXL",
                    "manufacturer": "CISCO",
                    "description": null,
                    "quantity": 1,
                    "unitPrice": 3222.18,
                    "unitPriceFormatted": "3,222.18",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": null,
                    "mfrNumber": "CON-SNTP-3524PXL",
                    "tdNumber": "13248139",
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "3,222.18",
                    "extendedPrice": "3222.18",
                    "extendedPriceFormatted": "3222.18",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "1.0.1"
                  }
                ],
                "agreements": null,
                "ancillaryChargesWithTitles": null,
                "annuity": null,
                "isSubLine": false,
                "displayLineNumber": "1.0"
              },
              {
                "id": "2.0",
                "parent": null,
                "vendorPartNo": "C1000-48FP-4X-L",
                "manufacturer": "CISCO",
                "description": "Catalyst 1000 48port GE, Full POE, 4x10G SFP",
                "quantity": 4,
                "unitPrice": 8424.38,
                "unitPriceFormatted": "8,424.38",
                "totalPrice": null,
                "totalPriceFormatted": "",
                "msrp": null,
                "invoice": null,
                "discounts": [],
                "contract": null,
                "shortDescription": "Catalyst 1000 48port GE, Full POE, 4x10G SFP",
                "mfrNumber": "C1000-48FP-4X-L",
                "tdNumber": "13901846",
                "upcNumber": null,
                "unitListPrice": null,
                "unitListPriceFormatted": "8,424.38",
                "extendedPrice": "33697.52",
                "extendedPriceFormatted": "33697.52",
                "availability": null,
                "rebateValue": null,
                "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                "urlProductSpecs": null,
                "children": [
                  {
                    "id": "2.1",
                    "parent": "2.0",
                    "vendorPartNo": "CAB-16AWG-AC",
                    "manufacturer": "CISCO",
                    "description": "AC Power cord, 16AWG",
                    "quantity": 4,
                    "unitPrice": 0,
                    "unitPriceFormatted": "0.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "AC Power cord, 16AWG",
                    "mfrNumber": "CAB-16AWG-AC",
                    "tdNumber": "14116470",
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "0.00",
                    "extendedPrice": "0.0",
                    "extendedPriceFormatted": "0.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "2.1"
                  },
                  {
                    "id": "2.2",
                    "parent": "2.0",
                    "vendorPartNo": "CAB-CONSOLE-USB",
                    "manufacturer": "CISCO",
                    "description": "Console Cable 6ft with USB Type A and mini-B",
                    "quantity": 4,
                    "unitPrice": 100.35,
                    "unitPriceFormatted": "100.35",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "Console Cable 6ft with USB Type A and mini-B",
                    "mfrNumber": "CAB-CONSOLE-USB",
                    "tdNumber": "10117153",
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "100.35",
                    "extendedPrice": "401.4",
                    "extendedPriceFormatted": "401.4",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "2.2"
                  },
                  {
                    "id": "2.3",
                    "parent": "2.0",
                    "vendorPartNo": "PWR-CLP",
                    "manufacturer": "CISCO",
                    "description": "Power Retainer Clip For 3560-C, 2960-L  & C1000 Switches",
                    "quantity": 4,
                    "unitPrice": 0,
                    "unitPriceFormatted": "0.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "Power Retainer Clip For 3560-C, 2960-L  & C1000 Switches",
                    "mfrNumber": "PWR-CLP",
                    "tdNumber": null,
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "0.00",
                    "extendedPrice": "0.0",
                    "extendedPriceFormatted": "0.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": null,
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "2.3"
                  },
                  {
                    "id": "2.0.1",
                    "parent": "2.0",
                    "vendorPartNo": "CON-SNTP-C1048X4L",
                    "manufacturer": "CISCO",
                    "description": null,
                    "quantity": 4,
                    "unitPrice": 2898,
                    "unitPriceFormatted": "2,898.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": null,
                    "mfrNumber": "CON-SNTP-C1048X4L",
                    "tdNumber": "14250300",
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "2,898.00",
                    "extendedPrice": "11592.0",
                    "extendedPriceFormatted": "11592.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "2.0.1"
                  }
                ],
                "agreements": null,
                "ancillaryChargesWithTitles": null,
                "annuity": null,
                "isSubLine": false,
                "displayLineNumber": "2.0"
              },
              {
                "id": "3.0",
                "parent": null,
                "vendorPartNo": "C1000-24FP-4X-L",
                "manufacturer": "CISCO",
                "description": "Catalyst 1000 24port GE, Full POE, 4x10G SFP",
                "quantity": 2,
                "unitPrice": 4841.89,
                "unitPriceFormatted": "4,841.89",
                "totalPrice": null,
                "totalPriceFormatted": "",
                "msrp": null,
                "invoice": null,
                "discounts": [],
                "contract": null,
                "shortDescription": "Catalyst 1000 24port GE, Full POE, 4x10G SFP",
                "mfrNumber": "C1000-24FP-4X-L",
                "tdNumber": "13901845",
                "upcNumber": null,
                "unitListPrice": null,
                "unitListPriceFormatted": "4,841.89",
                "extendedPrice": "9683.78",
                "extendedPriceFormatted": "9683.78",
                "availability": null,
                "rebateValue": null,
                "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                "urlProductSpecs": null,
                "children": [
                  {
                    "id": "3.1",
                    "parent": "3.0",
                    "vendorPartNo": "CAB-16AWG-AC",
                    "manufacturer": null,
                    "description": "AC Power cord, 16AWG",
                    "quantity": 2,
                    "unitPrice": 0,
                    "unitPriceFormatted": "0.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "AC Power cord, 16AWG",
                    "mfrNumber": "CAB-16AWG-AC",
                    "tdNumber": "14116470",
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "0.00",
                    "extendedPrice": "0.0",
                    "extendedPriceFormatted": "0.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "3.1"
                  },
                  {
                    "id": "3.2",
                    "parent": "3.0",
                    "vendorPartNo": "CAB-CONSOLE-USB",
                    "manufacturer": null,
                    "description": "Console Cable 6ft with USB Type A and mini-B",
                    "quantity": 2,
                    "unitPrice": 100.35,
                    "unitPriceFormatted": "100.35",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "Console Cable 6ft with USB Type A and mini-B",
                    "mfrNumber": "CAB-CONSOLE-USB",
                    "tdNumber": "10117153",
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "100.35",
                    "extendedPrice": "200.7",
                    "extendedPriceFormatted": "200.7",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "3.2"
                  },
                  {
                    "id": "3.3",
                    "parent": "3.0",
                    "vendorPartNo": "PWR-CLP",
                    "manufacturer": null,
                    "description": "Power Retainer Clip For 3560-C, 2960-L  & C1000 Switches",
                    "quantity": 2,
                    "unitPrice": 0,
                    "unitPriceFormatted": "0.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "Power Retainer Clip For 3560-C, 2960-L  & C1000 Switches",
                    "mfrNumber": "PWR-CLP",
                    "tdNumber": null,
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "0.00",
                    "extendedPrice": "0.0",
                    "extendedPriceFormatted": "0.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": null,
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "3.3"
                  },
                  {
                    "id": "3.0.1",
                    "parent": "3.0",
                    "vendorPartNo": "CON-SNTP-C10X4L24",
                    "manufacturer": "CISCO",
                    "description": null,
                    "quantity": 2,
                    "unitPrice": 1665,
                    "unitPriceFormatted": "1,665.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": null,
                    "mfrNumber": "CON-SNTP-C10X4L24",
                    "tdNumber": null,
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "1,665.00",
                    "extendedPrice": "3330.0",
                    "extendedPriceFormatted": "3330.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": null,
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "3.0.1"
                  }
                ],
                "agreements": null,
                "ancillaryChargesWithTitles": null,
                "annuity": null,
                "isSubLine": false,
                "displayLineNumber": "3.0"
              },
              {
                "id": "4.0",
                "parent": null,
                "vendorPartNo": "SFP-10G-SR-S=",
                "manufacturer": "CISCO",
                "description": "10GBASE-SR SFP Module, Enterprise-Class",
                "quantity": 18,
                "unitPrice": 730.45,
                "unitPriceFormatted": "730.45",
                "totalPrice": null,
                "totalPriceFormatted": "",
                "msrp": null,
                "invoice": null,
                "discounts": [],
                "contract": null,
                "shortDescription": "10GBASE-SR SFP Module, Enterprise-Class",
                "mfrNumber": "SFP-10G-SR-S=",
                "tdNumber": null,
                "upcNumber": null,
                "unitListPrice": null,
                "unitListPriceFormatted": "730.45",
                "extendedPrice": "13148.1",
                "extendedPriceFormatted": "13148.1",
                "availability": null,
                "rebateValue": null,
                "urlProductImage": null,
                "urlProductSpecs": null,
                "children": [],
                "agreements": null,
                "ancillaryChargesWithTitles": null,
                "annuity": null,
                "isSubLine": false,
                "displayLineNumber": "4.0"
              },
              {
                "id": "5.0",
                "parent": null,
                "vendorPartNo": "DUO-FED-SUB",
                "manufacturer": "CISCO",
                "description": "Cisco Duo Federal subscription",
                "quantity": 1,
                "unitPrice": 0,
                "unitPriceFormatted": "0.00",
                "totalPrice": null,
                "totalPriceFormatted": "",
                "msrp": null,
                "invoice": null,
                "discounts": [],
                "contract": null,
                "shortDescription": "Cisco Duo Federal subscription",
                "mfrNumber": "DUO-FED-SUB",
                "tdNumber": "13859516",
                "upcNumber": null,
                "unitListPrice": null,
                "unitListPriceFormatted": "0.00",
                "extendedPrice": "0.0",
                "extendedPriceFormatted": "0.0",
                "availability": null,
                "rebateValue": null,
                "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                "urlProductSpecs": null,
                "children": [
                  {
                    "id": "5.1",
                    "parent": "5.0",
                    "vendorPartNo": "DUO-MFA-FED",
                    "manufacturer": "CISCO",
                    "description": "Cisco Duo MFA edition for Federal customers",
                    "quantity": 20,
                    "unitPrice": 36,
                    "unitPriceFormatted": "36.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "Cisco Duo MFA edition for Federal customers",
                    "mfrNumber": "DUO-MFA-FED",
                    "tdNumber": "13817869",
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "36.00",
                    "extendedPrice": "720.0",
                    "extendedPriceFormatted": "720.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": null,
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "5.1"
                  },
                  {
                    "id": "5.2",
                    "parent": "5.0",
                    "vendorPartNo": "SVS-DUO-FED-SUP-B",
                    "manufacturer": "CISCO",
                    "description": "Cisco Duo Basic Support - Federal",
                    "quantity": 1,
                    "unitPrice": 0,
                    "unitPriceFormatted": "0.00",
                    "totalPrice": null,
                    "totalPriceFormatted": "",
                    "msrp": null,
                    "invoice": null,
                    "discounts": [],
                    "contract": {
                      "id": null,
                      "status": null,
                      "duration": null,
                      "renewedDuration": null,
                      "startDate": "01-01-0001",
                      "endDate": "01-01-0001",
                      "newAgreementStartDate": "01-01-0001",
                      "newAgreementEndDate": "01-01-0001",
                      "newUsagePeriodStartDate": "01-01-0001",
                      "newUsagePeriodEndDate": "01-01-0001",
                      "supportLevel": null,
                      "serviceLevel": null,
                      "usagePeriod": "01-01-0001",
                      "renewalTerm": 0
                    },
                    "shortDescription": "Cisco Duo Basic Support - Federal",
                    "mfrNumber": "SVS-DUO-FED-SUP-B",
                    "tdNumber": null,
                    "upcNumber": null,
                    "unitListPrice": null,
                    "unitListPriceFormatted": "0.00",
                    "extendedPrice": "0.0",
                    "extendedPriceFormatted": "0.0",
                    "availability": null,
                    "rebateValue": null,
                    "urlProductImage": null,
                    "urlProductSpecs": null,
                    "children": null,
                    "agreements": null,
                    "ancillaryChargesWithTitles": null,
                    "annuity": null,
                    "isSubLine": false,
                    "displayLineNumber": "5.2"
                  }
                ],
                "agreements": null,
                "ancillaryChargesWithTitles": null,
                "annuity": null,
                "isSubLine": false,
                "displayLineNumber": "5.0"
              }
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
            "subTotal": 96957.48,
            "subTotalFormatted": "96,957.48",
            "tier": "EduErate",
            "configurationId": "QJ128146301OP",
            "description": "Deal ID 52296358",
            "vendor": vendor || "CISCO"
          }
        }
      },
      "error": {
        "code": 0,
        "messages": [],
        "isError": false
      }
    }
    setTimeout(() => {
        res.json(response);
    }, 2000)
});

// Punchout to vendor - CREATE CONFIG //
app.post("/ui-config/v1/getPunchOutURL", function (req,res){
  console.log('test post punchout url ✌✌✌');
  if (!req.headers["sessionid"]) return res.status(401);
  res.json({
    "content":null,
    "error": {
        "code": 0,
        "messages": ["not bla blas"],
        "isError": false
    }
}) })
//Replace cart id//
app.put("/ui-content/v1/replaceCart", function (req, res) {
  console.log("test post punchout url ✌✌✌");
  if (!req.headers["sessionid"]) return res.status(401);
  return res.json({
    "content": {
    "isSuccess": false
    },
    "error": {
    "code": 0,
    "messages": [],
    "isError": false
    }
    });
});

//---QUICK QUOTE CONTINUE BTN---//
app.post("/ui-commerce/v1/quote/create", function (req, res) {
  if (!req.headers["sessionid"]) return res.status(401);

  res.json({
    content: {
      quoteId: "121772374",
      confirmationId: "1734535579",
    },
    error: {
      code: 0,
      messages: [],
      isError: false,
    },
  });
});

// Punchout to vendor - CREATE CONFIG //
app.post("/ui-config/v1/getPunchOutURL", function (req, res) {
  console.log(req.body);

  if (!req.headers["sessionid"]) return res.status(401);

  res.json({
      content: {
           url: "https://apps.cisco.com/eb2b/tnxshop/U2hcServlet?P1=081940553-4009d55f-17ba623a67f-c99417e13b6c4681f7d4d16d678eaa5e&P2=https%3A%2F%2Fapps.cisco.com%2Fccw%2Fcpc%2Fhome&P4=CREATE&P6=N"
      },
      error: {
          code: 0,
          messages: [],
          isError: false
      }
  });
});




//Replace cart id//
app.put("/ui-content/v1/replaceCart", function (req, res) {
  console.log("test post punchout url ✌✌✌");
  if (!req.headers["sessionid"]) return res.status(401);
  return res.json({
    "content": {
    "isSuccess": true
    },
    "error": {
    "code": 0,
    "messages": [],
    "isError": false
    }
    });
});

//---QUICK QUOTE CONTINUE BTN---//
app.post("/ui-commerce/v1/quote/createFrom", function (req, res) {

    console.log("post submit");
    console.log(req.body);

    if (!req.headers["sessionid"]) return res.status(401);

    res.json({
        content: {
          quoteId: "121772374",
          confirmationId: "1734535579",
        },
        error: {
          code: 0,
          messages: [],
          isError: false,
        },
    });
});


//---TOP n OPEN CONFIG MOCK API---//
app.get("/ui-account/v1/topActions", function (req, res) {
  // try {
    function getRandom(maxValue) {
      return Math.floor(Math.random() * maxValue);
  }
    if (!req.headers["sessionid"]) {
      return res.status(500).json({
          error: {
              code: 0,
              message: ['No SessionId'],
              isError: true,
          },
      });
    }
    const response = {
        content: {
            summary: {
              newOpportunities: getRandom(20),
              ordersBlocked: getRandom(20),
              expiringDeals: getRandom(20)
            },
        },
        error: {
            code: 0,
            message: [],
            isError: false,
        },
    };

    res.json(response);
});
