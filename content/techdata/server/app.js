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
        "Content-Type, Authorization, Content-Length, X-Requested-With, TraceId, Consumer, SessionId, Accept-Language, Site"
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
                id: "516514",
                firstName: "DAYNA Local Server",
                lastName: "KARAPHILLIS",
                name: "DAYNA KARAPHILLIS",
                email: "SHI@cstenet.com",
                phone: "9999999971",
                companyName: "SHI International",
                customers: ["0038048612", "0009000325"],
                customersV2: [
                    { number: "0038048612", name: "Company 0" },
                    { number: "0009000325", name: "Company 1" },
                    { number: "0038048612", name: "Company 2" },
                ],
                roles: [],
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
app.get("/quote/create/:cart", function (req, res) {
    const code = req.query.code;
    const cart = req.params.cart;

    res.json({
        content: {
            quoteDetails: {
                shipTo: {
                    name: "Sis Margaret's Inc",
                    line1: "Wade Wilson",
                    line2: "9071",
                    line3: "Santa Monica Blvd",
                    city: "West Hollywood",
                    state: "CA",
                    zip: "90069",
                    country: "United States",
                    email: "dpool@sismargarets.com",
                },
                endUser: {
                    name: "Stark Enterprises",
                    line1: "Tony Stark",
                    line2: "10880 ",
                    line3: "Malibu Point",
                    city: "Malibu",
                    state: "CA",
                    zip: "90069",
                    country: "United States",
                    email: "dpool@sismargarets.com",
                },
                generalInfo: {
                    configId: "12345!",
                    dealId: "hello",
                    tier: "hello",
                    reference: "",
                },
                notes: "Descrption of Internal Notes",
                details: [
                    {
                        id: "IN00000053",
                        parent: "TR123YU6653",
                        description: "Description of the Product is very good",
                        quantity: 53,
                        unitPrice: 53,
                        totalPrice: 53,
                        currency: "USD",
                        msrp: 53,
                        invoice: "IHT128763K0987",
                        shortDescription: "Product Description",
                        mfrNumber: "PUT9845011123",
                        tdNumber: "ITW398765243",
                        upcNumber: "924378465",
                        unitListPrice: "2489.00",
                        extendedPrice: "2349.00",
                        availability: "53",
                        rebateValue: "53",
                        urlProductImage: "https://Product/Image",
                        urlProductSpecs: "https://Product/details",
                    },
                    {
                        id: "IN00000053",
                        parent: "TR123YU6653",
                        description: "Description of the Product is very good",
                        quantity: 53,
                        unitPrice: 53,
                        totalPrice: 53,
                        currency: "USD",
                        msrp: 53,
                        invoice: "IHT128763K0987",
                        shortDescription: "Product Description",
                        mfrNumber: "PUT9845011123",
                        tdNumber: "ITW398765243",
                        upcNumber: "924378465",
                        unitListPrice: "2489.00",
                        extendedPrice: "2349.00",
                        availability: "53",
                        rebateValue: "53",
                        urlProductImage: "https://Product/Image",
                        urlProductSpecs: "https://Product/details",
                    },
                    {
                        id: "IN00000036",
                        parent: "TR123YU6636",
                        description: "Description of the Product is very good",
                        quantity: 36,
                        unitPrice: 36,
                        totalPrice: 36,
                        currency: "USD",
                        msrp: 36,
                        invoice: "IHT128763K0987",
                        shortDescription: "Product Description",
                        mfrNumber: "PUT9845011123",
                        tdNumber: "ITW398765243",
                        upcNumber: "924378465",
                        unitListPrice: "2489.00",
                        extendedPrice: "2349.00",
                        availability: "36",
                        rebateValue: "36",
                        urlProductImage: "https://Product/Image",
                        urlProductSpecs: "https://Product/details",
                    },
                ],
                quoteNumber: "TIW77755701",
                orderNumber: "NQL3339019538",
                poNumber: "PO12760",
                endUserPO: "EPO50142",
                poDate: "12/04/2020",
            },
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
                totalQuantity: 4,
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
                quoted: 14,
                unQuoted: 30,
                oldConfigurations: 25,
                currencyCode: null,
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
    console.log(req);
    const details = req.query.details || true;
    const pageSize = req.query.PageSize || 10;
    const pageNumber = req.query.PageNumber || 1;
    const items = [];
    function getRandom(maxValue) {
        return Math.floor(Math.random() * maxValue);
    }
    for (let i = 0; i < pageSize; i++) {
        items.push({
            id: Number(`${pageNumber}${4009754974 + i}`),
            quoteReference: null,
            vendor: null,
            created: utils.getRandomDate(),
            expires: utils.getRandomDate(),
            endUserName: null,
            dealId: null,
            status: i % 2 ? "OPEN" : "CLOSED",
            quoteValue: 73002.31 + getRandom(1000),
            formatedQuoteValue: "USD",
            currencySymbol: "$",
            canUpdate: i % 2 ? true : false,
            canCheckOut: i % 2 ? true : false,
        });
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

app.get("/ui-commerce/v1/orders/", function (req, res) {
    const details = req.query.details || true;
    const pageSize = req.query.pageSize || 10;
    const pageNumber = req.query.pageNumber || 1;
    const items = [];
    function getRandom(maxValue) {
      return Math.floor(Math.random() * maxValue);
    }
    for (let i = 0; i < pageSize; i++) {
      items.push({
        id: Number(`${pageNumber}${4009754974 + i}`),
        created: new Date().toISOString(),
        reseller: Number(`${pageNumber}${111048 + i}`),
        shipTo: "UPS",
        type: "Manual",
        priceFormatted: 73002.31 + getRandom(1000),
        invoice: Number(`${pageNumber}${4009754974 + i}`),
        status: i % 2 ? "OPEN" : "CLOSED",
        trackings:  i % 2 ? true : false,
        isReturn:  i % 2 ? true : false,
      })
    }
    const response = {
      content: {
        items: items,
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
    // var jsonResponseFromDIT =
    //     '{"content":{"totalItems":0,"pageCount":0,"pageNumber":0,"pageSize":0,
    //     "items":[{"id":"I008126269",
    //     "reseller":"SO-FLOORPLAN",
    //     "vendor":"GM 3M",
    //     "created":"2021-02-05T07:26:00Z",
    //     "shipTo":"SHI INTERNATIONAL CORP",
    //     "type":"ZZIT","price":"114.24 USD",
    //     "priceFormatted":"114.24 USD",
    //     "status":"OPEN",
    //     "invoice":null,
    //     "isReturn":null,
    //     "trackings":[],
    //     "invoices":[{"id":"Pending","line":"","quantity":4,"price":228.48,"created":null}]},
    //     {"id":"I008126271","reseller":"SO-NO-FREESHIP","vendor":"BRETFORD","created":"2021-02-05T07:42:50Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZIT","price":"2124.92 USD","priceFormatted":"2124.92 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":2,"price":4249.84,"created":null}]},{"id":"6030694406","reseller":"SO-ADVANCED CHECKOUT","vendor":"GM 3M","created":"2021-02-05T07:50:54Z","shipTo":"Prachi Khobragade CA","type":"ZZIT","price":"0.00 USD","priceFormatted":"0.00 USD","status":"CANCELLED","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":2,"price":20.92,"created":null}]},{"id":"I008126273","reseller":"05022021SHOPUSTEST7","vendor":"MICROSOFT","created":"2021-02-05T08:02:40Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZIT","price":"17.79 USD","priceFormatted":"17.79 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":2,"price":35.58,"created":null}]},{"id":"727182","reseller":"PO_ESTIMATEQ67ORDER","vendor":"CISCO","created":"2021-02-05T08:16:20Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZOR","price":"4194.00 USD","priceFormatted":"4194.00 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":3,"price":4194.00,"created":null}]},{"id":"I008126275","reseller":"05022021SHOPUSTEST8","vendor":"MICROSOFT","created":"2021-02-05T08:32:06Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZIT","price":"6977.79 USD","priceFormatted":"6977.79 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":3,"price":35.58,"created":null}]},{"id":"I008126276","reseller":"05022021SHOPUSTEST9","vendor":"CISCO","created":"2021-02-05T08:41:10Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZIT","price":"429.20 USD","priceFormatted":"429.20 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":1,"price":0.0,"created":null}]},{"id":"6030686028","reseller":"RTZRZRZ","vendor":"CISCO","created":"2021-02-05T09:23:15Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZOR","price":"5069.68 USD","priceFormatted":"5069.68 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":3,"price":0.0,"created":null}]},{"id":"I008126278","reseller":"TEST ORDER","vendor":"CISCO","created":"2021-02-05T09:49:11Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZIT","price":"40935.96 USD","priceFormatted":"40935.96 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":87,"price":0.0,"created":null}]},{"id":"I008126280","reseller":"TEST FOR 6.8","vendor":"MICROSOFT","created":"2021-02-05T11:29:52Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZIT","price":"17.79 USD","priceFormatted":"17.79 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":2,"price":35.58,"created":null}]},{"id":"I008126306","reseller":"SO-FLOORPLAN","vendor":"GM 3M","created":"2021-02-08T06:45:40Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZIT","price":"114.24 USD","priceFormatted":"114.24 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":4,"price":228.48,"created":null}]},{"id":"I008126307","reseller":"SO-EU PROMO ORDER","vendor":"HP INC","created":"2021-02-08T06:50:56Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZIT","price":"33.73 USD","priceFormatted":"33.73 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":1,"price":0.0,"created":null}]},{"id":"I008126308","reseller":"SO-NO-FREESHIP","vendor":"BRETFORD","created":"2021-02-08T07:02:58Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZIT","price":"2124.92 USD","priceFormatted":"2124.92 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":2,"price":4249.84,"created":null}]},{"id":"6030686029","reseller":"SO-ADVANCED CHECKOUT","vendor":"GM 3M","created":"2021-02-08T07:10:28Z","shipTo":"Prachi Khobragade CA","type":"ZZIT","price":"0.00 USD","priceFormatted":"0.00 USD","status":"CANCELLED","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":2,"price":20.92,"created":null}]},{"id":"I008126309","reseller":"SO-VENDORSHIPPED","vendor":"LENOVO","created":"2021-02-08T07:13:06Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZIT","price":"213.12 USD","priceFormatted":"213.12 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":2,"price":0.0,"created":null}]},{"id":"I008126311","reseller":"SO-VOLUMEPRICING","vendor":"CABLE 2 GO","created":"2021-02-08T07:35:31Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZIT","price":"757.50 USD","priceFormatted":"757.50 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":500,"price":1515.00,"created":null}]},{"id":"I008126318","reseller":"SO-EDUCATIONPRICING","vendor":"GM 3M","created":"2021-02-08T08:06:44Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZIT","price":"171.36 USD","priceFormatted":"171.36 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":6,"price":342.72,"created":null}]},{"id":"727191","reseller":"PO_ESTIMATEQ67ORDER","vendor":"CISCO","created":"2021-02-08T08:09:07Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZOR","price":"4194.00 USD","priceFormatted":"4194.00 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":3,"price":4194.00,"created":null}]},{"id":"I008126320","reseller":"SO-GOVTPRICING","vendor":"GM 3M","created":"2021-02-08T08:10:33Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZIT","price":"114.24 USD","priceFormatted":"114.24 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":4,"price":228.48,"created":null}]},{"id":"I008126321","reseller":"13213","vendor":"CISCO","created":"2021-02-08T08:35:02Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZIT","price":"60222.95 USD","priceFormatted":"60222.95 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":670,"price":120445.90,"created":null}]},{"id":"727192","reseller":"PO_ESTIMATEQ67ORDER","vendor":"CISCO","created":"2021-02-08T09:02:58Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZOR","price":"4194.00 USD","priceFormatted":"4194.00 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":3,"price":4194.00,"created":null}]},{"id":"I008126335","reseller":"WM_RPO_0208_EUTEST","vendor":"MICROSOFT","created":"2021-02-08T20:48:47Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZIT","price":"1453.94 USD","priceFormatted":"1453.94 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":6,"price":0.0,"created":null}]},{"id":"70135138","reseller":"8079","vendor":"HP","created":"2021-02-08T23:47:05Z","shipTo":"Tampa General Hospital","type":"ZDR4","price":"0.00 USD","priceFormatted":"0.00 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":0,"price":0.00,"created":null}]},{"id":"60132069","reseller":"8167","vendor":"CISCO","created":"2021-02-08T23:51:05Z","shipTo":"Tampa General Hospital","type":"ZCR4","price":"0.00 USD","priceFormatted":"0.00 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[]},{"id":"I008126343","reseller":"TEST ORDER FROM CART","vendor":"CISCO","created":"2021-02-09T06:45:43Z","shipTo":"SHI INTERNATIONAL CORP","type":"ZZIT","price":"463.13 USD","priceFormatted":"463.13 USD","status":"OPEN","invoice":null,"isReturn":null,"trackings":[],"invoices":[{"id":"Pending","line":"","quantity":10,"price":926.26,"created":null}]}]},"error":{"code":0,"messages":[],"isError":false}}';
    // res.json(JSON.parse(jsonResponseFromDIT));

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

app.get("/details", (req, res) => {
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
            details: {
                shipTo: {
                    id: null,
                    companyName: "SHI INTERNATIONAL CORP",
                    name: "SHI INTERNATIONAL CORP",
                    line1: "290 Davidson Ave",
                    line2: " ",
                    line3: null,
                    city: "Somerset",
                    state: "NJ",
                    zip: "08873-4145",
                    postalCode: null,
                    country: "US",
                    email: null,
                    phoneNumber: null,
                },
                endUser: {
                    id: null,
                    companyName: "SHI INTERNATIONAL CORP",
                    name: "Tony Stark",
                    line1: "10880 Malibu Point",
                    line2: null,
                    line3: null,
                    city: "Malibu",
                    state: "CA",
                    zip: null,
                    postalCode: "90069",
                    country: "United States",
                    email: "ironman@avengers.com",
                    phoneNumber: "(310) 440-7300",
                },
                reseller: {
                    id: null,
                    companyName: "SHI INTERNATIONAL CORP",
                    name: "Wade Wilson",
                    line1: "9071 Santa Monica Blvd",
                    line2: null,
                    line3: null,
                    city: "West Hollywood",
                    state: "CA",
                    zip: null,
                    postalCode: "90069",
                    country: "United States",
                    email: "dpool@sismargarets.com",
                    phoneNumber: "(424) 777-8399",
                },
                source: null,
                notes: null,
                items: [
                    {
                        id: "1",
                        parent: null,
                        description: "HPE ProLiant DL160 Gen10 Intel Xeon Silv",
                        quantity: 2,
                        unitPrice: 0.0,
                        unitPriceFormatted: "0.00",
                        totalPrice: 0.0,
                        totalPriceFormatted: "0.00",
                        msrp: null,
                        invoice: null,
                        shortDescription: null,
                        mfrNumber: "HPE ProLiant DL160 Gen10 Intel Xeon Silv",
                        tdNumber: "000000000013821375",
                        upcNumber: null,
                        unitListPrice: "2674.0000000",
                        unitListPriceFormatted: "2,674.00",
                        extendedPrice: null,
                        extendedPriceFormatted: "",
                        availability: null,
                        rebateValue: null,
                        urlProductImage: null,
                        urlProductSpecs: null,
                    },
                    {
                        id: "2",
                        parent: null,
                        description: "HPE 16GB (1x16GB) Single Rank x4 DDR4-29",
                        quantity: 6,
                        unitPrice: 0.0,
                        unitPriceFormatted: "0.00",
                        totalPrice: 0.0,
                        totalPriceFormatted: "0.00",
                        msrp: null,
                        invoice: null,
                        shortDescription: null,
                        mfrNumber: "HPE 16GB (1x16GB) Single Rank x4 DDR4-29",
                        tdNumber: "000000000013636087",
                        upcNumber: null,
                        unitListPrice: "500.0000000",
                        unitListPriceFormatted: "500.00",
                        extendedPrice: null,
                        extendedPriceFormatted: "",
                        availability: null,
                        rebateValue: null,
                        urlProductImage: null,
                        urlProductSpecs: null,
                    },
                    {
                        id: "3",
                        parent: null,
                        description: "Microsoft Windows Server 2019 (16-Core) ",
                        quantity: 2,
                        unitPrice: 0.0,
                        unitPriceFormatted: "0.00",
                        totalPrice: 0.0,
                        totalPriceFormatted: "0.00",
                        msrp: null,
                        invoice: null,
                        shortDescription: null,
                        mfrNumber: "Microsoft Windows Server 2019 (16-Core) ",
                        tdNumber: "000000000013632474",
                        upcNumber: null,
                        unitListPrice: "795.0000000",
                        unitListPriceFormatted: "795.00",
                        extendedPrice: null,
                        extendedPriceFormatted: "",
                        availability: null,
                        rebateValue: null,
                        urlProductImage: null,
                        urlProductSpecs: null,
                    },
                    {
                        id: "4",
                        parent: null,
                        description: "HPE iLO Advanced Electronic License with",
                        quantity: 2,
                        unitPrice: 0.0,
                        unitPriceFormatted: "0.00",
                        totalPrice: 0.0,
                        totalPriceFormatted: "0.00",
                        msrp: null,
                        invoice: null,
                        shortDescription: null,
                        mfrNumber: "HPE iLO Advanced Electronic License with",
                        tdNumber: "000000000011212057",
                        upcNumber: null,
                        unitListPrice: "469.0000000",
                        unitListPriceFormatted: "469.00",
                        extendedPrice: null,
                        extendedPriceFormatted: "",
                        availability: null,
                        rebateValue: null,
                        urlProductImage: null,
                        urlProductSpecs: null,
                    },
                    {
                        id: "5",
                        parent: null,
                        description: "HPE 500W Flex Slot Platinum Hot Plug Low",
                        quantity: 2,
                        unitPrice: 0.0,
                        unitPriceFormatted: "0.00",
                        totalPrice: 0.0,
                        totalPriceFormatted: "0.00",
                        msrp: null,
                        invoice: null,
                        shortDescription: null,
                        mfrNumber: "HPE 500W Flex Slot Platinum Hot Plug Low",
                        tdNumber: "000000000012735100",
                        upcNumber: null,
                        unitListPrice: "295.0000000",
                        unitListPriceFormatted: "295.00",
                        extendedPrice: null,
                        extendedPriceFormatted: "",
                        availability: null,
                        rebateValue: null,
                        urlProductImage: null,
                        urlProductSpecs: null,
                    },
                ],
                id: "121742712",
                orders: [],
                customerPO: null,
                endUserPO: null,
                poDate: null,
                quoteReference: null,
                spaId: null,
                currency: "USD",
                currencySymbol: "$",
                subTotal: 5150.92,
                subTotalFormatted: "5,150.92",
                tier: "Commercial",
            },
        },
        error: {
            code: 0,
            messages: [],
            isError: false,
        },
    });
});

app.get("/myorders", (req, res) => {
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
            items: {
                isMonthly: false,
                currencyCode: "USD",
                currencySymbol: "$",
                processedOrderPercentage: "26",
                processedOrdersAmount: 268,
                totalOrderAmount: 529,
                totalFormattedAmount: "529.00",
                processedFormattedAmount: "268.00",
            },
        },
        error: {
            code: 0,
            messages: [],
            isError: false,
        },
    });
});
