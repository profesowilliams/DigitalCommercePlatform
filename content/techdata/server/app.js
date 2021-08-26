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

app.post("/logout", function (req, res) {
    let code = req.body.code;
    let redirectUrl = req.body.RedirectUri;
    let applicationName = req.body.applicationName;

    console.log("post submit");
    console.log(req.body);
    console.log(code);
    console.log(redirectUrl);
    console.log(applicationName);
    // {"content":{"message":"User logged out successfully"},"error":{"code":0,"messages":[],"isError":false}}
    let resJsonSuccess = {
        content: {
            message: "User logged out successfully",
            error: {
              code: 0,
              messages:[],
              isError: false
            }
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
                totalQuantity: 14,
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
    const id = req.query.id;
    const details = req.query.details || true;
    const pageSize = req.query.PageSize || 25;
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
            deals: utils.getRandomArrayWithIds(4),
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
        items.push({
            id: Number(`${pageNumber}${4009754974 + i}`),
            created: new Date().toISOString(),
            reseller: Number(`${pageNumber}${111048 + i}`),
            shipTo: "UPS",
            type: "Manual",
            priceFormatted: 73002.31 + getRandom(1000),
            invoices: getInvoices(getRandom(10) - 1),
            status: status[getRandom(5)],
            trackings: i % 2 ? ['track1', 'track2'] : [],
            isReturn: i % 2 ? true : false,
            currency: "USD",
            currencySymbol: "$",
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
                created: "08/18/21",
                expires: "09/18/21",
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
          "vendor": "Cisco",
          "configName": null,
          "endUserName": "AVNET TS LTD",
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
            {
                "id": "CD_ID__2",
                "line": "Line_104",
                "quantity": 9,
                "price": 39.0,
                "created": "8/6/2021",
                "status": "Created"
            },
            {
                "id": "",
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
//---QUOTE PREVIEW MOCK API---//
app.get("/ui-commerce/v1/quote/preview", function (req, res) {
    const { id, isEstimateId } = req.query;

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
        content: {
            "quotePreview":
                {
                    "quoteDetails": {
                        "shipTo": null,
                        "endUser": null,
                        "reseller": [
                            {
                                "id": null,
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
                                "phoneNumber": null
                            }
                        ],
                        "source": {
                            "type": "API Pull",
                            "value": "DD126704948GC"
                        },
                        "notes": null,
                        "items": [
                            {
                                "id": "1.0",
                                "parent": null,
                                "vendorPartNo": "FPR1010-NGFW-K9",
                                "manufacturer": "Cisco",
                                "description": "Cisco Firepower 1010 NGFW Appliance, Desktop",
                                "quantity": 1,
                                "unitPrice": 1199.18,
                                "unitPriceFormatted": "1,199.18",
                                "totalPrice": null,
                                "totalPriceFormatted": "",
                                "msrp": 695.52,
                                "invoice": null,
                                "discounts": [],
                                "shortDescription": "Cisco Firepower 1010 NGFW Appliance, Desktop",
                                "mfrNumber": "FPR1010-NGFW-K9",
                                "tdNumber": "13692884",
                                "upcNumber": null,
                                "unitListPrice": null,
                                "unitListPriceFormatted": "1,199.18",
                                "extendedPrice": "1199.18",
                                "extendedPriceFormatted": "1199.18",
                                "availability": null,
                                "rebateValue": null,
                                "urlProductImage": "http://cdn.cnetcontent.com/bc/d4/bcd4ab4f-3459-479f-b1a6-752b9064a9d6.jpg",
                                "urlProductSpecs": null,
                                "children": [
                                    {
                                        "id": "1.1",
                                        "parent": "87521876046",
                                        "vendorPartNo": "FPR1010T-TMC",
                                        "manufacturer": "Cisco",
                                        "description": "Cisco FPR1010 Threat Defense Threat, Malware and URL License",
                                        "quantity": 1,
                                        "unitPrice": 0.0,
                                        "unitPriceFormatted": "0.00",
                                        "totalPrice": null,
                                        "totalPriceFormatted": "",
                                        "msrp": 0.0,
                                        "invoice": null,
                                        "discounts": [],
                                        "shortDescription": "Cisco FPR1010 Threat Defense Threat, Malware and URL License",
                                        "mfrNumber": "FPR1010T-TMC",
                                        "tdNumber": "14115457",
                                        "upcNumber": null,
                                        "unitListPrice": null,
                                        "unitListPriceFormatted": "0.00",
                                        "extendedPrice": "0.0",
                                        "extendedPriceFormatted": "0.0",
                                        "availability": null,
                                        "rebateValue": null,
                                        "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                                        "urlProductSpecs": null,
                                        "children": null
                                    },
                                    {
                                        "id": "1.1.0.1",
                                        "parent": "87522139030",
                                        "vendorPartNo": "L-FPR1010T-TMC-3Y",
                                        "manufacturer": "Cisco",
                                        "description": null,
                                        "quantity": 1,
                                        "unitPrice": 1725.0,
                                        "unitPriceFormatted": "1,725.00",
                                        "totalPrice": null,
                                        "totalPriceFormatted": "",
                                        "msrp": 1004.00,
                                        "invoice": null,
                                        "discounts": [],
                                        "shortDescription": null,
                                        "mfrNumber": "L-FPR1010T-TMC-3Y",
                                        "tdNumber": "13694647",
                                        "upcNumber": null,
                                        "unitListPrice": null,
                                        "unitListPriceFormatted": "1,725.00",
                                        "extendedPrice": "1725.0",
                                        "extendedPriceFormatted": "1725.0",
                                        "availability": null,
                                        "rebateValue": null,
                                        "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                                        "urlProductSpecs": null,
                                        "children": null
                                    },
                                    {
                                        "id": "1.2",
                                        "parent": "87521876046",
                                        "vendorPartNo": "FPR1K-DT-PWR-AC",
                                        "manufacturer": "Cisco",
                                        "description": "Cisco Firepower 1K Series 150W Power Adapter for FPR-1010",
                                        "quantity": 1,
                                        "unitPrice": 0.0,
                                        "unitPriceFormatted": "0.00",
                                        "totalPrice": null,
                                        "totalPriceFormatted": "",
                                        "msrp": 288.10,
                                        "invoice": null,
                                        "discounts": [],
                                        "shortDescription": "Cisco Firepower 1K Series 150W Power Adapter for FPR-1010",
                                        "mfrNumber": "FPR1K-DT-PWR-AC",
                                        "tdNumber": "14176658",
                                        "upcNumber": null,
                                        "unitListPrice": null,
                                        "unitListPriceFormatted": "0.00",
                                        "extendedPrice": "0.0",
                                        "extendedPriceFormatted": "0.0",
                                        "availability": null,
                                        "rebateValue": null,
                                        "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                                        "urlProductSpecs": null,
                                        "children": null
                                    },
                                    {
                                        "id": "1.3",
                                        "parent": "87521876046",
                                        "vendorPartNo": "CAB-AC-C5",
                                        "manufacturer": "Cisco",
                                        "description": "AC Power Cord, Type C5, US, Canada",
                                        "quantity": 1,
                                        "unitPrice": 0.0,
                                        "unitPriceFormatted": "0.00",
                                        "totalPrice": null,
                                        "totalPriceFormatted": "",
                                        "msrp": 0.00,
                                        "invoice": null,
                                        "discounts": [],
                                        "shortDescription": "AC Power Cord, Type C5, US, Canada",
                                        "mfrNumber": "CAB-AC-C5",
                                        "tdNumber": "14252592",
                                        "upcNumber": null,
                                        "unitListPrice": null,
                                        "unitListPriceFormatted": "0.00",
                                        "extendedPrice": "0.0",
                                        "extendedPriceFormatted": "0.0",
                                        "availability": null,
                                        "rebateValue": null,
                                        "urlProductImage": null,
                                        "urlProductSpecs": null,
                                       "children": null
                                    },
                                    {
                                        "id": "1.4",
                                        "parent": "87521876046",
                                        "vendorPartNo": "SF-F1K-TD6.6-K9",
                                        "manufacturer": "Cisco",
                                        "description": "Cisco Firepower Threat Defense software v6.6 for FPR1000",
                                        "quantity": 1,
                                        "unitPrice": 0.0,
                                        "unitPriceFormatted": "0.00",
                                        "totalPrice": null,
                                        "totalPriceFormatted": "",
                                        "msrp": 0.0,
                                        "invoice": null,
                                        "discounts": [],
                                        "shortDescription": "Cisco Firepower Threat Defense software v6.6 for FPR1000",
                                       "mfrNumber": "SF-F1K-TD6.6-K9",
                                        "tdNumber": "14188046",
                                        "upcNumber": null,
                                        "unitListPrice": null,
                                        "unitListPriceFormatted": "0.00",
                                        "extendedPrice": "0.0",
                                        "extendedPriceFormatted": "0.0",
                                        "availability": null,
                                        "rebateValue": null,
                                        "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                                        "urlProductSpecs": null,
                                        "children": null
                                    },
                                    {
                                        "id": "1.5",
                                        "parent": "87521876046",
                                        "vendorPartNo": "FPR1K-DT-ACY-KIT",
                                        "manufacturer": "Cisco",
                                        "description": "Cisco Firepower 1K Series Accessory Kit for FPR-1010",
                                        "quantity": 1,
                                        "unitPrice": 0.0,
                                        "unitPriceFormatted": "0.00",
                                        "totalPrice": null,
                                        "totalPriceFormatted": "",
                                        "msrp": 29.10,
                                        "invoice": null,
                                        "discounts": [],
                                        "shortDescription": "Cisco Firepower 1K Series Accessory Kit for FPR-1010",
                                        "mfrNumber": "FPR1K-DT-ACY-KIT",
                                        "tdNumber": "13912114",
                                        "upcNumber": null,
                                        "unitListPrice": null,
                                        "unitListPriceFormatted": "0.00",
                                        "extendedPrice": "0.0",
                                        "extendedPriceFormatted": "0.0",
                                        "availability": null,
                                        "rebateValue": null,
                                        "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                                        "urlProductSpecs": null,
                                        "children": null
                                    },
                                    {
                                        "id": "1.6",
                                        "parent": "87521876046",
                                        "vendorPartNo": "FPR1000-ASA",
                                        "manufacturer": "Cisco",
                                        "description": "Cisco Firepower 1000 Standard ASA License",
                                        "quantity": 1,
                                        "unitPrice": 0.0,
                                        "unitPriceFormatted": "0.00",
                                        "totalPrice": null,
                                        "totalPriceFormatted": "",
                                        "msrp": 0.0,
                                        "invoice": null,
                                        "discounts": [],
                                        "shortDescription": "Cisco Firepower 1000 Standard ASA License",
                                        "mfrNumber": "FPR1000-ASA",
                                        "tdNumber": "14115449",
                                        "upcNumber": null,
                                        "unitListPrice": null,
                                        "unitListPriceFormatted": "0.00",
                                        "extendedPrice": "0.0",
                                        "extendedPriceFormatted": "0.0",
                                        "availability": null,
                                        "rebateValue": null,
                                        "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                                        "urlProductSpecs": null,
                                        "children": null
                                    },
                                    {
                                        "id": "1.0.1",
                                        "parent": "87521876046",
                                        "vendorPartNo": "CON-SNT-FPR1010N",
                                        "manufacturer": "Cisco",
                                        "description": null,
                                        "quantity": 1,
                                        "unitPrice": 288.0,
                                        "unitPriceFormatted": "288.00",
                                        "totalPrice": null,
                                        "totalPriceFormatted": "",
                                        "msrp": 81.60,
                                        "invoice": null,
                                        "discounts": [],
                                        "shortDescription": null,
                                        "mfrNumber": "CON-SNT-FPR1010N",
                                        "tdNumber": "13694648",
                                        "upcNumber": null,
                                        "unitListPrice": null,
                                        "unitListPriceFormatted": "288.00",
                                        "extendedPrice": "288.0",
                                        "extendedPriceFormatted": "288.0",
                                        "availability": null,
                                        "rebateValue": null,
                                        "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
                                        "urlProductSpecs": null,
                                        "children": null
                                    }
                                ]
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
                        "subTotal": 3212.18,
                        "subTotalFormatted": "3,212.18",
                        "tier": null,
                        "configurationId": "DD126704948GC",
                        "description": "Estimate_DD126704948GC",
                        "vendor": "CISCO"
                    }
                }
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

//---QUICK QUOTE CONTINUE BTN---//
app.post("/ui-commerce/v1/quote/createFrom", function (req, res) {

    console.log("post submit");
    console.log(req.body);

    if (!req.headers["sessionid"]) return res.status(401);

    res.json({
        content: {
            // some data from respone
        },
        error: {
            code: "",
            message: "",
            isError: false,
        },
    });
});
