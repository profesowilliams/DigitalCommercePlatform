const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const port = 3000;
const { URLSearchParams } = require("url");
const fetch = require("node-fetch");
const encodedParams = new URLSearchParams();
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var dateFormat = require("dateformat");
var now = new Date();
var codeValue = "DYSjfUsN1GIOMnQt-YITfti0w9APbRTDPwcAAABk";
var SESSION_COOKIE = 'session-id';
var isHttpOnlyEnabled = false;

app.use(cookieParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var vendorConnections = { cisco: false, hp: false, dell: false };

var utils = require("./utils");
var mockResponses = require("./responses");
var mockVendors = require("./vendors");
const { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } = require("constants");

function checkCreds(user, pass) {
  return (
    user in { admin: "admin", user: "temp", bru: "temp" } &&
    pass in { admin: "admin", pass: "temp", 123: "temp" }
  );
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  if(isHttpOnlyEnabled){
    res.header('Access-Control-Allow-Credentials',true);
  }
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
  console.log(isHttpOnlyEnabled);

  res.append("custom", "value");
  res.type("application/json");

  if (checkCreds(userid, password)) {
    if(isHttpOnlyEnabled){
      res.cookie(SESSION_COOKIE, "secret-session-id", {expires: new Date(Date.now() + 9999999), httpOnly: true});
    } 
    const queryStringAppend = redirect.indexOf("?") >= 0 ? "&" : "?";
    res.redirect(redirect + queryStringAppend + "code=" + codeValue);
  } else {
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

  let resJsonSuccess = {
    content: {
      user: {
        id: "516514",
        firstName: "DAYNA",
        lastName: "KARAPHILLIS",
        name: "516514",
        email: "daniel.vogt@techdata.com",
        phone: null,
        customers: ["0038048612", "0009000325", "0009000325"],
        roles: null,
        isInternal: true,
        roleList: [
          {
            entitlement: "CanManageOwnProfile",
            accountId: "",
          },
          {
            entitlement: "CanAccessAccount",
            accountId: "0038048612",
          },
          {
            entitlement: "CanAccessDeveloperCenter",
            accountId: "0038048612",
          },
          {
            entitlement: "CanViewCreditStatement",
            accountId: "0038048612",
          },
          {
            entitlement: "CanDownloadPriceFiles",
            accountId: "0038048612",
          },
          {
            entitlement: "CanViewInvoices",
            accountId: "0038048612",
          },
          {
            entitlement: "CanPlaceOrder",
            accountId: "0038048612",
          },
          {
            entitlement: "AdminUser",
            accountId: "0038048612",
          },
          {
            entitlement: "CanViewOrders",
            accountId: "0038048612",
          },
          {
            entitlement: "hasDCPAccess",
            accountId: "",
          },
          {
            entitlement: "hasRenewalsAccess",
            accountId: "",
          },
        ],
        customersV2: [
          {
            number: "0038048612",
            name: "SHI INTERNATIONAL CORP",
            customerNumber: "0038048612",
            customerName: "SHI INTERNATIONAL CORP",
            salesOrg: "0101",
            system: "2",
            dcpAccess: true,
          },
          {
            number: "0009000325",
            name: "SHI INTERNATIONAL CORP.",
            customerNumber: "0009000325",
            customerName: "SHI INTERNATIONAL CORP.",
            salesOrg: "1001",
            system: "3",
            dcpAccess: false,
          },
          {
            number: "0009000325",
            name: null,
            customerNumber: "0009000325",
            customerName: null,
            salesOrg: null,
            system: null,
            dcpAccess: false,
          },
        ],
        activeCustomer: {
          number: "0038048612",
          name: "SHI INTERNATIONAL CORP",
          customerNumber: "0038048612",
          customerName: "SHI INTERNATIONAL CORP",
          salesOrg: "0101",
          system: "2",
          dcpAccess: true,
        },
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

app.post("/ui-account/v1/logout", function (req, res) {
  let code = req.body.code;
  let redirectUrl = req.body.RedirectUri;
  let applicationName = req.body.applicationName;

  console.log("post submit");
  //console.log(errorPage);
  console.log(redirectUrl);
  let resJsonSuccess = {
    content: {
      message: "User logged out successfully",
    },
    error: {
      code: 0,
      messages: [],
      isError: false,
    },
  };

  let resJsonFail = {
    isError: true,
    user: null,
  };

  //res.redirect(redirectUrl);

  res.json(resJsonSuccess);
});

app.post("/logout", function (req, res) {
  let applicationName = req.body.applicationName;

  console.log("logout service post submit");
  console.log(req.body);
  let resJsonSuccess = {
    content: {
      message: "User logged out successfully",
    },
    error: {
      code: 0,
      messages: [],
      isError: false,
    },
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

app.get("/ui-account/v1/topConfigurations/get", function (req, res) {

  const response = {"content":{"summary":{"items":[{"sequence":0,"endUserName":"TY132664080UV","amount":0.0,"currencyCode":"USD","currencySymbol":"$","formattedAmount":"0.00"},{"sequence":0,"endUserName":"XT132668957VR","amount":0.0,"currencyCode":"USD","currencySymbol":"$","formattedAmount":"0.00"},{"sequence":0,"endUserName":"UH132609355NX","amount":0.0,"currencyCode":"USD","currencySymbol":"$","formattedAmount":"0.00"},{"sequence":0,"endUserName":"OO133980169PD","amount":0.0,"currencyCode":"USD","currencySymbol":"$","formattedAmount":"0.00"},{"sequence":0,"endUserName":"GZ132668976IC","amount":0.0,"currencyCode":"USD","currencySymbol":"$","formattedAmount":"0.00"}]}},"error":{"code":0,"messages":[],"isError":false}}

  res.json(response);

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

  if (!validateSession(req, res)) return res.status(401);

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

  if (!validateSession(req, res)) return res.status(401);

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
  if (!validateSession(req, res)) return res.status(401);

  res.json({
    content: {
      quoteId: "121752813",
      confirmationId: "2946606046",
    },
    error: {
      code: 11000,
      messages: ["Invalid Products : 1,2,3,4"],
      isError: false,
    },
  });
});
app.get("/activeCart", function (req, res) {
  if (!validateSession(req, res))
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
  function random(min, max) {
    return Math.trunc(min + Math.random() * (max - min));
  }
  if (!validateSession(req, res))
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
        quoted: random(100, 9999),
        unQuoted: random(100, 9999),
        oldConfigurations: random(100, 9999),
        currencyCode: "USD",
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

app.get("/ui-account/v1/actionItems", function(req, res) {

  const response = {"content":{"summary":{"newOpportunities":2,"ordersBlocked":2085,"expiringDeals":4}},"error":{"code":0,"messages":[],"isError":false}}

  res.json(response);
});
app.get("/dealsSummary", function (req, res) {
  if (!validateSession(req, res))
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
  if(!validateSession(req, res)) return;

  const id = req.query.quoteIdFilter;
  const details = req.query.details || true;
  const pageSize = req.query.PageSize || 25;
  const pageNumber = req.query.PageNumber || 1;
  const sortBy = req.query.SortBy ? req.query.SortBy : 'id';
  const sortDir = req.query.SortDirection ? req.query.SortDirection : 'asc';
  const items = [];
  function getRandom(maxValue) {
    return Math.floor(Math.random() * maxValue);
  }
  const examplesQuoteReference = [
    "CCW QuoteId:4734474647",
    "CCW webapi",
    "Tech Data webapi",
    "ESTIMATE QuoteId:UQ123422927SN",
  ];
  let count = 0;
  for (let i = 0; i < pageSize; i++) {
    if (count === 3) {
      count = 0;
    }

    items.push({
      id: Number(`${pageNumber}${id ? id + 1 : 4009754974 + i}`),
      quoteReference: examplesQuoteReference[count],
      vendor: null,
      created: utils.getRandomDate(),
      expires: utils.getRandomDate(),
      endUserName: null,
      checkoutSystem: i % 2 ? "4.6": "111",
      deals: utils.getRandomArrayWithIds(4),
      status: i % 2 ? "OPEN" : (i % 3 ? "IN_PIPELINE" : "CLOSED"),
      quoteValue: 73002.31 + getRandom(1000),
      formatedQuoteValue: "USD",
      currencySymbol: "$",
      canUpdate: i % 2 ? true : false,
      canCheckOut: i % 3 ? true : false,
    });
    count++;
  }
  items.sort(utils.sortItems(sortBy, sortDir));
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

app.get("/ui-commerce/v1/quotesingle", function (req, res) {
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
  // console.log(req.url);
  const id = req.query.id;
  const response = utils.getQuoteDetailsResponse();
  res.json(response);
});

//---ORDER DETAILS MOCK API---//
app.get("/ui-commerce/v1/orderdetails", function (req, res) {
  // console.log(req.url);
  const id = req.query.id;
  const response = utils.getOrderDetailsResponse();
  res.json(response);
});

app.get("/ui-commerce/v1/order/details", function (req, res) {
  // console.log(req.url);
  const id = req.query.id;
  const errorObject = {
    content: null,
    error: {
      code: 404,
      messages: [
        "UserId : 702318 for TraceId : NA Error connecting to http://app-order/v1. Reported an error: NotFound. http://app-order/v1?id=603068538",
      ],
      isError: true,
    },
  };
  const response =
    id != 603068538 ? utils.getOrderDetailsResponse() : errorObject;
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
  const id = req.query.id;
  const idType = req.query.idType;
  const sortBy = req.query.SortBy ? req.query.SortBy : 'id';
  const sortDir = req.query.SortDirection ? req.query.SortDirection : 'asc';

  const items = [];
  const status = ["Sales Review", "Open", "Shipped", "Cancelled", "In Process"];
  let pageSizeWithParams;
  if (idType && idType == "GENERAL?id=00000") {
    pageSizeWithParams = 1;
  } else if (idType && idType == "GENERAL?id=11111") {
    pageSizeWithParams = 5;
  } else {
    pageSizeWithParams = pageSize;
  }

  const reseller = id;
  const orderReportFlag = req.query.status
    ? req.query.status === "OPEN"
      ? true
      : false
    : false;
  function getRandom(maxValue) {
    return Math.abs(Math.floor(Math.random() * maxValue));
  }

  function getInvoices(noOfInvoices) {
    noOfInvoices = noOfInvoices < 0 ? 1 : noOfInvoices;
    const invoices = [];
    const forcePending = noOfInvoices >= 8;
    if (forcePending) {
      const errorObject = [];
      errorObject.push({
        id: "Pending",
        line: "",
        quantity: 1,
        price: 5041.7,
        created: null,
      });
      return errorObject;
    }
    for (let i = 0; i <= noOfInvoices; i++) {
      const invoice = {
        id: forcePending
          ? "Pending"
          : Number(`${pageNumber}${4009754974 + i + getRandom(10)}`),
        line: i % 2 ? 1 + getRandom(10) : "",
        quantity: 1 + getRandom(100),
        price: 4750.7 + getRandom(1000),
        created: i % 2 ? new Date().toISOString() : null,
      };
      invoices.push(invoice);
    }
    return invoices;
  }
  for (let i = 0; i < pageSizeWithParams; i++) {
    const totalPrice = 73002.31 + getRandom(1000);
    const statusID = getRandom(5);
    const manufacturerExample =
      Math.random().toString(36).substring(2, 5) +
      Math.random().toString(36).substring(2, 6);
    items.push({
      id: Number(`${pageNumber}${id ? id + 1 : 4009754974 + i}`),
      created: new Date().toISOString(),
      reseller: Number(`${pageNumber}${reseller ? reseller + i : 111048 + i}`),
      shipTo: "UPS",
      type: "Manual",
      priceFormatted: 73002.31 + getRandom(1000),
      invoices: getInvoices(getRandom(10) - 1),
      status: status[getRandom(5)],
      trackings:
        i % 2
          ? [
              {
                orderNumber: "6030692072",
                invoiceNumber: null,
                id: null,
                carrier: "PITT-OHIO",
                serviceLevel: "LTL",
                trackingNumber: "7038806680",
                trackingLink:
                  "http://expo.expeditors.com/expo/SQGuest?SearchType=shipmentSearch&TrackingNumber=7038806680",
                type: "JQ",
                description: "Pitt-Ohio Express",
                date: "10-06-2021",
                dNote: "7038806680",
                dNoteLineNumber: "10",
                goodsReceiptNo: null,
              },
              {
                orderNumber: "6030692072",
                invoiceNumber: null,
                id: null,
                carrier: "PITT-OHIO",
                serviceLevel: "LTL",
                trackingNumber: "7038806680",
                trackingLink:
                  "http://expo.expeditors.com/expo/SQGuest?SearchType=shipmentSearch&TrackingNumber=7038806680",
                type: "JQ",
                description: "Pitt-Ohio Express",
                date: "10-06-2021",
                dNote: "7038806680",
                dNoteLineNumber: "10",
                goodsReceiptNo: null,
              },
            ]
          : [
              {
                orderNumber: "6030684674",
                invoiceNumber: null,
                id: null,
                carrier: "FEDEX",
                serviceLevel: "FEDEX GROUND",
                trackingNumber: "486197188378",
                trackingLink:
                  "http://www.fedex.com/Tracking?&cntry_code=us&language=english&tracknumbers=486197188378",
                type: "W0",
                description: "FEDX GRND",
                date: "07-13-2021",
                dNote: "7038811481",
                dNoteLineNumber: "30",
                goodsReceiptNo: null,
              },
            ],
      isReturn: i % 2 ? true : false,
      currency: "USD",
      currencySymbol: "$",
      line: Number(`${pageNumber}${4009754974 + i}`),
      manufacturer: manufacturerExample.toUpperCase(),
      description: "PLTNM TAB PRTNR STOCK $5+ MRC ACTIVATION",
      quantity: getRandom(10),
      serial: i % 2 ? "View" : "n/a",
      unitPrice: totalPrice,
      totalPrice: totalPrice,
      shipDate: i % 2 ? new Date().toISOString() : "Emailed",
    });
  }

  const itemsResponeOrderStatus = items.filter((i) => i.status === "open");
  items.sort(utils.sortItems(sortBy, sortDir));
  const response = {
    content: {
      items: orderReportFlag ? itemsResponeOrderStatus : items,
      totalItems: 2500,
      pageCount: 25,
      pageSize,
    },
    error: {
      code: 0,
      message: [],
      isError: false,
    },
  };
  res.json(response);

  // const response = utils.getOrdersGridResponse();
  // res.json(response);
});

app.get("/browse", function (req, res) {
  if (!validateSession(req, res))
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
  if (!validateSession(req, res) || req.headers["site"] !== "US")
    return res.status(500).json({
      error: {
        code: 0,
        message: [],
        isError: true,
      },
    });

  setTimeout(() => {
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
  }, 2000)
});

app.get("/cart", function (req, res) {
  if (!validateSession(req, res) || req.headers["site"] !== "US")
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

function validateSession(req, res) {
  console.log(req.cookies[SESSION_COOKIE], isHttpOnlyEnabled, !req.headers["sessionid"]);
  console.log(typeof(req.headers["sessionid"]))
  console.log(req.cookies[SESSION_COOKIE])
  if((isHttpOnlyEnabled && !req.cookies[SESSION_COOKIE]) || (!isHttpOnlyEnabled && (!req.headers["sessionid"] || req.headers["sessionid"] == 'null'))){
    res.status(401).json({
      error: {
        code: 401,
        message: [],
        isError: true,
      },
    });
    return false;
  }
  return true;
}

//---QUOTE DETAILS MOCK API---//
app.get("/ui-commerce/v1/quote/details", function (req, res) {
  if(!validateSession(req, res)) return;
  const { id, type } = req.query;
  const errorObject = {
    content: null,
    error: {
      code: 404,
      messages: [
        "UserId : 702318 for TraceId : NA Error connecting to http://app-order/v1. Reported an error: NotFound. http://app-order/v1?id=603068538",
      ],
      isError: true,
    },
  };

  function getItems(amount) {
    let items = [];
    for (let i = 1; i <= amount; i++) {
      const annuity =
        i % 2 === 0
          ? {
              "isAnnuity": false,
              "startDate": null,
              "endDate": null,
              "autoRenewal": false,
              "autoRenewalTerm": null,
              "duration": "",
              "billingFrequency": "",
              "initialTerm": ""
            }
          : {
            "isAnnuity": false,
            "startDate": "03-09-2022",
            "endDate": null,
            "autoRenewal": true,
            "autoRenewalTerm": 0,
            "duration": "36",
            "billingFrequency": "Annual Billing",
            "initialTerm": "36"
          };

      items.push({
        id: i,
        displayLineNumber: i,
        parent: null,
        vendorPartNo: "CON-SNT-C92048PE",
        manufacturer: "MICROSOFT COMPANY",
        description: "MS321DN LASERPR 38PPM USB TAA LV",
        displayName: "MS321DN LASERPR 38PPM USB TAA LV",
        quantity: 30 + i,
        unitPrice: i,
        unitPriceFormatted: "0.00",
        totalPrice: 0,
        totalPriceFormatted: "0.00",
        msrp: "MRSP",
        invoice: null,
        discounts: [{
          type: "Quote",
          value: 42.00013521974678632634404019,
          formattedValue: "42.00"
        }],
        contract: null,
        shortDescription: null,
        mfrNumber: null,
        tdNumber: "000000000013278748",
        upcNumber: null,
        unitListPrice: "0.0",
        unitListPriceFormatted: utils.getRandomValues(100) + ".00",
        extendedPrice: null,
        extendedPriceFormatted: "",
        availability: null,
        rebateValue: null,
        urlProductImage:
          i % 2
            ? "http://cdn.cnetcontent.com/ps/TDUS/130x80/80000404.png"
            : null,
        urlProductSpecs: null,
          children:
              i === 4 ? [] :
              [
          {
            id: i + ".1",
            displayLineNumber: i + ".1",
            parent: i,
            vendorPartNo: "DUO-MFA-FED-DUO-MFA-FED",
            manufacturer: "MICROSOFT COMPANY",
            description: "Cisco Duo MFA edition for Federal customers",
            displayName: "Cisco Duo MFA edition for Federal customers",
            quantity: 20 + i,
            unitPrice: 36,
            unitPriceFormatted: "36.00",
            totalPrice: null,
            totalPriceFormatted: "",
            msrp: null,
            invoice: null,
            discounts: [],
            contract: {
              id: null,
              status: null,
              duration: null,
              renewedDuration: null,
              startDate: "01-01-0001",
              endDate: "01-01-0001",
              newAgreementStartDate: "01-01-0001",
              newAgreementEndDate: "01-01-0001",
              newUsagePeriodStartDate: "01-01-0001",
              newUsagePeriodEndDate: "01-01-0001",
              supportLevel: null,
              serviceLevel: null,
              usagePeriod: "01-01-0001",
              renewalTerm: 0,
            },
            shortDescription: "Cisco Duo MFA edition for Federal customers",
            mfrNumber: "DUO-MFA-FED-DUO-MFA-FED",
            tdNumber: "13817869",
            upcNumber: null,
            unitListPrice: null,
            unitListPriceFormatted: "36.00",
            extendedPrice: "720.0",
            extendedPriceFormatted: "720.0",
            availability: null,
            rebateValue: null,
            urlProductImage:
              i % 2
                ? "http://cdn.cnetcontent.com/ps/TDUS/130x80/80000404.png"
                : null,
            urlProductSpecs: null,
            children: null,
            agreements: null,
            ancillaryChargesWithTitles: null,
            annuity: null,
            isSubLine: false,
            displayLineNumber: "100.1",
          },
          {
            id: i + ".2",
            displayLineNumber: i + ".2",
            parent: i,
            vendorPartNo: "SVS-DUO-FED-SUP-B",
            manufacturer: "CISCO",
            description: "Cisco Duo Basic Support - Federal",
            displayName: "Cisco Duo MFA edition for Federal customers",
            quantity: 1,
            unitPrice: 0,
            unitPriceFormatted: "0.00",
            totalPrice: null,
            totalPriceFormatted: "",
            msrp: null,
            invoice: null,
            discounts: [],
            contract: {
              id: null,
              status: null,
              duration: null,
              renewedDuration: null,
              startDate: "01-01-0001",
              endDate: "01-01-0001",
              newAgreementStartDate: "01-01-0001",
              newAgreementEndDate: "01-01-0001",
              newUsagePeriodStartDate: "01-01-0001",
              newUsagePeriodEndDate: "01-01-0001",
              supportLevel: null,
              serviceLevel: null,
              usagePeriod: "01-01-0001",
              renewalTerm: 0,
            },
            shortDescription: "Cisco Duo Basic Support - Federal",
            mfrNumber: "SVS-DUO-FED-SUP-B",
            tdNumber: null,
            upcNumber: null,
            unitListPrice: null,
            unitListPriceFormatted: utils.getRandomValues(100) + ".00",
            extendedPrice: "0.0",
            extendedPriceFormatted: "0.0",
            availability: null,
            rebateValue: null,
            urlProductImage: null,
            urlProductSpecs: null,
            children: null,
            agreements: null,
            ancillaryChargesWithTitles: null,
            annuity: null,
            isSubLine: false,
            displayLineNumber: "100.2",
          },
        ],
        agreements: [
          {
            id: "4000608",
            version: "1",
            vendorId: "DD19-447562",
            selectionFlag: "E",
          },
          {
            id: "3058624",
            version: "3",
            vendorId: "DD18-350965",
            selectionFlag: "M",
          },
        ],
        ancillaryChargesWithTitles: null,
        annuity,
        isSubLine: false,
        attributes: [
          {
            name: "VENDORQUOTEID",
            value: "4734509146",
          },
          {
            name: "DF_CONFIRMATION_NO",
            value: "1320795298",
          },
          {
            name: "PRICELISTID",
            value: "1109",
          },
          {
            name: "CustomerPoNumber",
            value: "JoseDemoOctober_Deal-B-again",
          },
          {
            name: "VENDOR",
            value: "CISCO",
          },
          {
            name: "DEALIDENTIFIER",
            value: "686450750",
          },
          {
            name: "VENDORQUOTETYPE",
            value: "CCW",
          },
          {
            name: "INTERNAL_COMMENT",
            value: "Can't check UAN with no renewalQuoteId.",
          },
          {
            name: "ShipCompleteType",
            value: "NA",
          },
          {
            name: "TAKEOVER",
            value: "true",
          },
        ],
      });
    }
    console.log(id == 00000 ? errorObject : items);
    return id == 00000 ? errorObject : items;
  }

  const quoteDetailsResponse = {
    content: {
      details: {
        canCheckOut: true,
        status: id === "IN_PIPELINE" || id === "FAILED" ? id : "OPEN",
        shipTo: {
          id: null,
          companyName: "TELOS CORPORATION",
          name: "TELOS CORPORATION",
          line1: "19886 Ashburn Rd",
          line2: " ",
          line3: " ",
          city: "Ashburn",
          state: "VA",
          zip: null,
          postalCode: "20147-2358",
          country: "US",
          email: "accounts.payable@telos.com",
          phoneNumber: "7037243800",
        },
        endUser: {
          id: null,
          companyName: "CLEVER CORP",
          name: "CLEVER CORP",
          line1: "68819 Miami Beach",
          line2: " ",
          line3: " ",
          city: "Miami",
          state: "Florida",
          zip: "56783",
          postalCode: "31258-3469",
          country: "US",
          email: "accounts.payable@clever.com",
          phoneNumber: "8148354911",
        },
        reseller: {
          id: null,
          companyName: "TELOS CORPORATION",
          name: "TELOS CORPORATION",
          line1: null,
          line2: " ",
          line3: " ",
          city: "Ashburn",
          state: "VA",
          zip: null,
          postalCode: "20147-2358",
          country: "US",
          email: "accounts.payable@telos.com",
          phoneNumber: "7037243800",
        },
        source: [
          {
            type: "Vendor Quote",
            value: "4734509146",
          },
          {
            type: "Deal",
            value: "686450750",
          },
          {
            type: "Estimate Id",
            value: "NH114095623CY",
          },
        ],
        notes: null,
        items: getItems(4),
        id: "4009611164",
        orders: [
          {
            id: "6030441624",
            system: "2",
            salesOrg: "0100",
          },
          {
            id: "6030303524",
            system: "2",
            salesOrg: "0100",
          },
        ],
        customerPO: " ",
        endUserPO: " ",
        poDate: null,
        quoteReference: null,
        spaId: null,
        currency: "USD",
        currencySymbol: "$",
        subTotal: 5422.3,
        subTotalFormatted: "5,422.30",
        tier: "Government",
        created: "07/14/20",
        expires: "12/31/21",
        attributes: [
          {
            name: "VENDORQUOTEID",
            value: "4734509146",
          },
          {
            name: "DF_CONFIRMATION_NO",
            value: "1320795298",
          },
          {
            name: "PRICELISTID",
            value: "1109",
          },
          {
            name: "CustomerPoNumber",
            value: "JoseDemoOctober_Deal-B-again",
          },
          {
            name: "VENDOR",
            value: "CISCO",
          },
          {
            name: "DEALIDENTIFIER",
            value: "686450750",
          },
          {
            name: "VENDORQUOTETYPE",
            value: "CCW",
          },
          {
            name: "INTERNAL_COMMENT",
            value: "Can't check UAN with no renewalQuoteId.",
          },
          {
            name: "ShipCompleteType",
            value: "NA",
          },
          {
            name: "TAKEOVER",
            value: "true",
          },
        ],
      },
    },
    error: {
      code: 0,
      messages: [],
      isError: false,
    },
  };

  function getRenewalItems(amount) {
    let items = [];
    for (let i = 0; i <= amount; i++) {
      items.push({
        id: i + 1,
        parent: null,
        vendorPartNo: "CON-3ECMU-LASAV5SD",
        manufacturer: "CISCO",
        description: "SWSS UPG 3YR DISTI ASAV50 EDELIVERY",
        quantity: Math.floor(Math.random() * 11),
        unitPrice: 8037.99,
        unitPriceFormatted: "8,037.99",
        totalPrice: 16075.98,
        totalPriceFormatted: "16,075.98",
        msrp: null,
        invoice: null,
        invoices: null,
        trackings: null,
        discounts: null,
        contract: null,
        shortDescription:
          "Cisco SMARTnet Software Support Service - technical support - for L-ASAV50S-STD - 3 years",
        mfrNumber: "CON-3ECMU-LASAV5SD",
        tdNumber: "13410477",
        upcNumber: null,
        unitListPrice: "11997.0000000",
        unitListPriceFormatted: "11,997.00",
        extendedPrice: null,
        extendedPriceFormatted: "",
        availability: null,
        rebateValue: null,
        urlProductImage: "",
        urlProductSpecs: null,
        children: null,
        agreements: [],
        contract: {
          id: "01734072",
          duration: "3 Years",
          renewedDuration: "3 Years",
          startDate: "2018-12-30T01:00:00Z",
          endDate: "2021-12-29T01:00:00Z",
          newAgreementStartDate: "2021-12-30T01:00:00Z",
          newAgreementEndDate: "2024-12-30T01:00:00Z",
          newUsagePeriodStartDate: null,
          newUsagePeriodEndDate: null,
          supportLevel: null,
          serviceLevel: "Basic",
          usagePeriod: null
        },
        ancillaryChargesWithTitles: null,
        annuity: null,
        isSubLine: false,
        displayLineNumber: null,
        licenseStartDate: null,
        licenseEndDate: null,
        contractStartDate: null,
        contractEndDate: null,
        serviceContractDetails: null,
        contractNo: null,
        contractType: null,
        license: null,
        status: null,
        vendorStatus: null,
        customerPOLine: null,
        supplierQuoteRef: null,
        configID: null,
        locationID: null,
        serials: null,
        paKs: null,
        images: null,
      });
    }
    return items;
  }

  const renewalDetailsResponse = {
    content: {
      details: {
        shipTo: {
          id: null,
          companyName: "SHI INTERNATIONAL CORP",
          name: null,
          line1: "290 Davidson Ave",
          line2: null,
          line3: null,
          city: "Somerset",
          state: "NJ",
          zip: null,
          postalCode: "08873-4145",
          country: "US",
          email: null,
          contactEmail: null,
          phoneNumber: null,
        },
        endUser: {
          id: null,
          companyName: "SELECT MEDICAL HOLDINGS CORPOR",
          name: null,
          line1: "4718 GETTYSBURG RD.",
          line2: "SUITE 109",
          line3: null,
          city: "MECHANICSBURG",
          state: "PA",
          zip: null,
          postalCode: "17055",
          country: "US",
          email: null,
          contactEmail: null,
          phoneNumber: null,
        },
        reseller: {
          id: null,
          companyName: "SHI INTERNATIONAL CORP",
          name: "VINCE.3  CASALEE",
          line1: "290 Davidson Ave",
          line2: " ",
          line3: null,
          city: "Somerset",
          state: "NJ",
          zip: null,
          postalCode: "08873-4145",
          country: "US",
          email: "paul.wonderly@techdata.com",
          contactEmail: null,
          phoneNumber: "7328688854",
        },
        source: [],
        notes: null,
        items: getRenewalItems(6),
        programName: "Pro Partner Program",
        id: "121772377",
        dueDate: "2021-12-29T01:00:00Z",
        orders: [],
        customerPO: null,
        endUserPO: null,
        poDate: null,
        quoteReference: "CCW-R QuoteId:381801212",
        spaId: null,
        currency: "USD",
        currencySymbol: "$",
        subTotal: 16075.98,
        subTotalFormatted: "16,075.98",
        tier: "Commercial",
        created: "2022-01-24T12:36:57.29Z",
        updated: "2022-01-24T12:36:57.29Z",
        expiry: "2021-12-29T01:00:00Z",
        deals: [],
        attributes: [
          {
            name: "ISQUICKQUOTECREATED",
            value: "False",
          },
          {
            name: "VENDORQUOTEID",
            value: "381801212",
          },
          {
            name: "SOURCE",
            value: "1Source",
          },
          {
            name: "VENDOR",
            value: "CISCO",
          },
          {
            name: "VENDORQUOTETYPE",
            value: "CCW-R",
          },
          {
            name: "ShipCompleteType",
            value: "NA",
          },
          {
            name: "TAKEOVER",
            value: "false",
          },
        ],
      },
    },
    error: {
      code: 0,
      messages: [],
      isError: false,
    },
  };

  const response =
    id === "empty"
      ? {
          content: { details: null },
          error: { code: 0, messages: [], isError: false },
        }
      : type
      ? renewalDetailsResponse
      : quoteDetailsResponse;

  setTimeout(() => {
    res.json(id == 00000 ? errorObject : response);
  }, 2000);
});

app.get("/myorders", (req, res) => {
  if(!validateSession(req, res))
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
            percentage: "100%",
          },
          processed: {
            amount: 12700,
            formattedAmount: "12,700.00",
            percentage: "30.211%",
          },
          shipped: {
            amount: 5877,
            formattedAmount: "5,877.00",
            percentage: "13.981%",
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
            percentage: "100%",
          },
          processed: {
            amount: 38100,
            formattedAmount: "38,100.00",
            percentage: "30.018%",
          },
          shipped: {
            amount: 34000,
            formattedAmount: "34,000.00",
            percentage: "26.788%",
          },
        },
      },
      error: {
        code: 0,
        messages: [],
        isError: false,
      },
    });
  }
});

app.get("/getAddress", (req, res) => {
  if(!validateSession(req, res))
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
  if(!validateSession(req, res)) {
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
      items: [
        {
          name: "SHI INTERNATIONAL CORP",
          companies: [
            {
              companyCode: "0100",
              paymentTermsCode: "Z271",
              paymentTermsText: "1.50 % 10 Net 30",
            },
            {
              companyCode: "0101",
              paymentTermsCode: "Z271",
              paymentTermsText: "1.50 % 10 Net 30",
            },
          ],
          addresses: [
            {
              addressNumber: "0001445402",
              addressLine1: "290 Davidson Ave",
              addressLine2: " ",
              addressLine3: " ",
              city: "Somerset",
              state: "NJ",
              country: "US",
              zip: "08873-4145",
              email: null,
              addressType: "CUS",
              phone: "8005276389",
              salesOrganization: "0100",
            },
          //  {
          //    addressNumber: "0001369841",
          //    addressLine1: "4111 Northside Parkway",
          //    addressLine2: " ",
          //    addressLine3: " ",
          //    city: "ATLANTA",
          //    state: "GA",
          //    country: "US",
          //    zip: "30327",
          //    email: null,
          //    addressType: "PAY",
          //    phone: "8005276389",
          //    salesOrganization: "0100",
          //  },
          //  {
          //    addressNumber: "0001369845",
          //    addressLine1: "116 Inverness Dr E",
          //    addressLine2: "Ste 375",
          //    addressLine3: " ",
          //    city: "Englewood",
          //    state: "CO",
          //    country: "US",
          //    zip: "80112-5149",
          //    email: null,
          //    addressType: "PAY",
          //    phone: " ",
          //    salesOrganization: "0100",
          //  },
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

  setTimeout(() => {
    res.json(response);
  }, 2000);
});

app.get("/pricingConditions", (req, res) => {
  if(!validateSession(req, res))
    return res.status(500).json({
      error: {
        code: 0,
        message: [],
        isError: true,
      },
    });
    
  setTimeout(() => {
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
  }, 2000)  
});

app.get("/estimates", function (req, res) {
  if (!validateSession(req, res) || req.headers["site"] !== "US")
    return res.status(500).json({
      error: {
        code: 0,
        message: [],
        isError: true,
      },
    });

  const { PageNumber, PageSize } = req.query;

  var seedResult = {
    content: {
      items: 
      [
        {
          "configId": "DQ132059617BV",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "PD132048062ZI",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "XT132041236WS",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "JV132041230KB",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QD132050959KM",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QD132012093IX",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "KM132042240VJ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "CH132056810IM",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "UU132056799PL",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "XH132047227WX",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "ID132041208IU",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "FH132047213IG",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "OZ132054762NC",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "YM132048034FY",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "GC132066316YE",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "UF132054757YF",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "FZ132038524VU",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "CR132031605KU",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "IJ132056775WH",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "DA132048021JV",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "RS132038519OA",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "CY132056765RL",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "KM132029604NC",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "SP132056760AX",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "XQ132047992LI",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "YD132056742EI",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "EF132050890AI",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "SJ132050889JY",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "RD132054714FJ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "OV132038230PT",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "JD132047979ZR",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "RI132006138PT",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "CZ132012073NN",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "GR132035234YX",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "KO132035231NF",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QD132047971TN",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "OY132050878HP",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "NX132047965ZS",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QJ132050866OR",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "NC132041134SR",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "OB132047959PG",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "DC132047958TW",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "NP132056701TS",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "LJ132038205QE",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "SL132061440KJ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "HB132041129XJ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QA132038197BF",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "HQ132050846PF",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "PB132038181FL",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "PQ132047942HZ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QG132037204PW",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "RF132047103UV",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "OT132061420VJ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "TK132043505YW",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "KO132047098OY",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "PR132047093VO",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "CL132047083KE",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QJ132050807ZZ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "VX132056662YN",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "RZ132037171PQ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "JW132047914VQ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "JD132056650KR",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "OU132047910BE",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "NU132047908MH",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "TX132041101ED",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "ZD132059450AR",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "XW132061393RP",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "PP132041094LA",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "XA132041093AR",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "BF132047887RX",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "YG132047881QN",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "ON132054628NZ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "XN132054626LN",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "FM132044985HS",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "VE132056602JR",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "XW132047016BY",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "MC132050729JW",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "MC132035121RO",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "XN132047849SQ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "UB132056583AS",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "OL132043131SE",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "PZ132006079TI",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "YY132041044DB",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "PY132061318WD",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "EQ132054584RR",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QE132041042MS",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "ZF132054581KU",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "WY132061313BP",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "NP132056555FL",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "RA132041028RI",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "LF132054566KW",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "RO132061298QH",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QZ132054558CN",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "WX132054552CC",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "YK132054549FG",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "AS132059308FE",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "VN132056515FY",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "PA132046925VZ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "NP132047798GX",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "RD132048774AT",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
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
        {
          "configId": "1I112127534ZT",
          "configurationType": "Estimate",
          "vendor": "Cisco"
        },
        {
          "configId": "2C121011624NR",
          "configurationType": "Estimate",
          "vendor": "Cisco"
        },
        {
          "configId": "3I112127534ZT1",
          "configurationType": "Estimate",
          "vendor": "Cisco"
        },
        {
          "configId": "4C121011624NR2",
          "configurationType": "Estimate",
          "vendor": "Cisco"
        },
        {
          "configId": "DQ132059617BV",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "PD132048062ZI",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "XT132041236WS",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "JV132041230KB",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QD132050959KM",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QD132012093IX",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "KM132042240VJ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "CH132056810IM",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "UU132056799PL",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "XH132047227WX",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "ID132041208IU",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "FH132047213IG",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "OZ132054762NC",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "YM132048034FY",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "GC132066316YE",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "UF132054757YF",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "FZ132038524VU",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "CR132031605KU",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "IJ132056775WH",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "DA132048021JV",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "RS132038519OA",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "CY132056765RL",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "KM132029604NC",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "SP132056760AX",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "XQ132047992LI",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "YD132056742EI",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "EF132050890AI",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "SJ132050889JY",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "RD132054714FJ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "OV132038230PT",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "JD132047979ZR",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "RI132006138PT",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "CZ132012073NN",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "GR132035234YX",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "KO132035231NF",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QD132047971TN",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "OY132050878HP",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "NX132047965ZS",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QJ132050866OR",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "NC132041134SR",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "OB132047959PG",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "DC132047958TW",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "NP132056701TS",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "LJ132038205QE",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "SL132061440KJ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "HB132041129XJ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QA132038197BF",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "HQ132050846PF",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "PB132038181FL",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "PQ132047942HZ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QG132037204PW",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "RF132047103UV",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "OT132061420VJ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "TK132043505YW",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "KO132047098OY",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "PR132047093VO",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "CL132047083KE",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QJ132050807ZZ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "VX132056662YN",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "RZ132037171PQ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "JW132047914VQ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "JD132056650KR",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "OU132047910BE",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "NU132047908MH",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "TX132041101ED",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "ZD132059450AR",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "XW132061393RP",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "PP132041094LA",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "XA132041093AR",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "BF132047887RX",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "YG132047881QN",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "ON132054628NZ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "XN132054626LN",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "FM132044985HS",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "VE132056602JR",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "XW132047016BY",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "MC132050729JW",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "MC132035121RO",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "XN132047849SQ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "UB132056583AS",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "OL132043131SE",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "PZ132006079TI",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "YY132041044DB",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "PY132061318WD",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "EQ132054584RR",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QE132041042MS",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "ZF132054581KU",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "WY132061313BP",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "NP132056555FL",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "RA132041028RI",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "LF132054566KW",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "RO132061298QH",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "QZ132054558CN",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "WX132054552CC",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "YK132054549FG",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "AS132059308FE",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "VN132056515FY",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "PA132046925VZ",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "NP132047798GX",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
        {
          "configId": "RD132048774AT",
          "configurationType": "Estimate",
          "vendor": "CISCO"
        },
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
        {
          "configId": "1I112127534ZT",
          "configurationType": "Estimate",
          "vendor": "Cisco"
        },
        {
          "configId": "2C121011624NR",
          "configurationType": "Estimate",
          "vendor": "Cisco"
        },
        {
          "configId": "3I112127534ZT1",
          "configurationType": "Estimate",
          "vendor": "Cisco"
        },
        {
          "configId": "4C121011624NR2",
          "configurationType": "Estimate",
          "vendor": "Cisco"
        }
      ]
    },
    error: {
      code: 0,
      messages: [],
      isError: false,
    },
  };

  var pageNumber = (PageNumber - 1) * PageSize;
  var pageSize = +pageNumber + +PageSize
  seedResult.content.items =  seedResult.content.items.slice(pageNumber, pageSize);

  setTimeout(() => {
    res.json(seedResult);
  }, 2000);
});
app.get("/estimations/validate/:id", function (req, res) {
  const { id } = req.params;
  if (!validateSession(req, res) || !id)
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
  res.json(mockResponses.catalogResponse());
});

app.get(["/vendors", "/vendor/connect"], (req, res) => {
  console.log(req);
  res.json(mockVendors.vendorsJsonData());
});

app.get("/vendorConnect", (req, res) => {
  let { code, vendor, redirectURL } = req.query;
  console.log(req.query);

  vendor = vendor.toLowerCase();
  console.log("vendorConnect");
  console.log(vendor);

  if (vendor in vendorConnections) {
    vendorConnections[vendor] = true;
  }

  console.log(vendorConnections);

  if (redirectURL) {
    res.json(mockVendors.vendorsJsonData());
  } else {
    res.status(400);
  }
  res.json({ error: true });
});

app.get("/ui-account/v1/vendorDisconnect", function (req, res) {
  const { vendor } = req.query;
  vendorConnections[vendor] = false;
  console.log("disconnect triggered");
  console.log(vendor);
  res.json({ isError: false });
});

//---VENDOR CONNECTIONS MOCK API---//
app.get(
  ["/ui-account/v1/getVendorConnections", "/getVendorConnections"],
  function (req, res) {
    const response = {
      content: {
        items: [
          {
            vendor: "cisco",
            isConnected: vendorConnections["cisco"],
            connectionDate: utils.getRandomDate(),
            isValidRefreshToken: utils.getRandomNumber(10) % 2 ? true : false,
            userId: "techdata-xml-ws"
          },
          {
            vendor: "hp",
            isConnected: vendorConnections["hp"],
            connectionDate: utils.getRandomDate(),
            isValidRefreshToken: utils.getRandomNumber(10) % 2 ? true : false,
            userId: "techdata-xml-ws"
          },
          {
            vendor: "dell",
            isConnected: vendorConnections["dell"],
            connectionDate: utils.getRandomDate(),
            isValidRefreshToken: utils.getRandomNumber(10) % 2 ? true : false,
            userId: "techdata-xml-ws"
          },
        ],
      },
      error: {
        code: 0,
        messages: [],
        isError: false,
      },
    };
    setTimeout(() => {
      res.json(response);
    }, 2000);
  }
);

app.get("/ui-commerce/v1/downloadInvoice", function (req, res) {
  const { orderId, downloadAll } = req.query;

  if (!validateSession(req, res) || orderId === "14009754975") {
    return res.status(200).json({
      "content": null,
      "error": {
        "code": 1001,
        "messages": [
          "UserId : 516514 for TraceId : 35345345-Browse Record not found"
        ],
        "isError": true
      }
    });
  }
  if (downloadAll) {
    res.download(`file.zip`);
  }
  return res.download("invoice.pdf");
});

app.get("/ui-config/v1/getdealsFor", function (req, res) {
  const { endUserName, mfrPartNumbers, orderLevel } = req.query;

  console.log(
    "/ui-config/v1/getdealsFor",
    endUserName,
    mfrPartNumbers,
    orderLevel
  );

  if (endUserName === "error") {
    res.status(500).json({
      error: {
        code: 0,
        message: [],
        isError: true,
      },
    });
  } else if (!endUserName) {
    res.json({
      content: {
        items: [
          {
            bid: "3443554545",
            version: "001",
            dealId: "0012",
            endUserName: "The Bank Corp",
            vendor: "CISCO",
            expiryDate: "12/31/2025",
          },
          {
            bid: "212121323",
            version: "002",
            dealId: "0013",
            endUserName: "My EU Company",
            vendor: "CISCO",
            expiryDate: "12/31/2025",
          },
          {
            bid: "76676767",
            version: "004",
            dealId: "0014",
            endUserName: "TestCo Inc",
            vendor: "CISCO",
            expiryDate: "12/31/2025",
          },
        ],
      },
    });
  } else {
    res.json({
      content: {
        items: [
          {
            bid: "3443554545",
            version: "001",
            dealId: "0012",
            endUserName: endUserName,
            vendor: "CISCO",
            expiryDate: "12/31/2025",
          },
          {
            bid: "212121323",
            version: "002",
            dealId: "0013",
            endUserName: endUserName,
            vendor: "CISCO",
            expiryDate: "12/31/2025",
          },
          {
            bid: "76676767",
            version: "004",
            dealId: "0014",
            endUserName: endUserName,
            vendor: "CISCO",
            expiryDate: "12/31/2025",
          },
        ],
      },
    });
  }
});

app.get("/ui-commerce/v1/pricingConditions", function (req, res) {
  res.json({
    content: {
      pricingConditions: {
        items: [
          {
            key: "Commercial (Non-Govt)",
            value: "Commercial",
          },
          {
            key: "Education (Student, Staff)",
            value: "EduStudentStaff",
          },
          {
            key: "Education (Higher)",
            value: "EduHigher",
          },
          {
            key: "Education (K - 12)",
            value: "EduK12",
          },
          {
            key: "Education E-Rate (K - 12)",
            value: "EduErate",
          },
          {
            key: "Federal",
            value: "GovtFederal",
          },
          {
            key: "Federal GSA",
            value: "GovtFederalGSA",
          },
          {
            key: "Local",
            value: "GovtLocal",
          },
          {
            key: "State",
            value: "GovtState",
          },
          {
            key: "Medical",
            value: "Medical",
          },
          {
            key: "SEWP Contract",
            value: "SEWPContract ",
          },
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

app.post("/ui-commerce/v1/downloadQuoteDetails", async function (req, res) {
  const { acceptLanguage, site, consumer, traceId, sessionid, contentType } =
    req.headers;

  if (!validateSession(req, res)) {
    return res.status(500).json({
      error: {
        code: 0,
        message: ["SessionId Error"],
        isError: true,
      },
    });
  }

  try {
    res.download(`response.xlsx`);
  } catch (error) {
    console.log("Error", error);
  }
});

app.post("/ui-export/v1/downloadRenewalQuotePdf", async function (req, res) {
  const { acceptLanguage, site, consumer, traceId, sessionid, contentType } =
    req.headers;

  if (!validateSession(req, res)) {
    return res.status(500).json({
      error: {
        code: 0,
        message: ["SessionId Error"],
        isError: true,
      },
    });
  }

  try {
    res.download(`exportRenewalsPDF.pdf`);
  } catch (error) {
    console.log("Error", error);
  }
});

app.post("/ui-export/v1/downloadRenewalQuoteDetails", async function (req, res) {
  const { acceptLanguage, site, consumer, traceId, sessionid, contentType } =
    req.headers;

  if (!req.headers["sessionid"] && !sessionid) {
    return res.status(500).json({
      error: {
        code: 0,
        message: ["SessionId Error"],
        isError: true,
      },
    });
  }

  try {
    res.download(`response.xlsx`);
  } catch (error) {
    console.log("Error", error);
  }
});

app.post("/ui-commerce/v1/downloadOrderDetails", async function (req, res) {
  const { acceptLanguage, site, consumer, traceId, sessionid, contentType } =
    req.headers;

  if (!validateSession(req, res) && !sessionid) {
    return res.status(500).json({
      error: {
        code: 0,
        message: ["SessionId Error"],
        isError: true,
      },
    });
  }

  try {
    res.download(`exportOrderDetail.xlsx`);
  } catch (error) {
    console.log("Error", error);
  }
});

app.get("/searchbar/orders", function (req, res) {
  const { keyword } = req.query;

  res.json({
    content: {
      items: [
        {
          id: 24009754974,
          created: "2021-11-16T20:51:54.646Z",
          reseller: 2111048,
          shipTo: "UPS",
          type: "Manual",
          priceFormatted: 73398.31,
          invoices: [
            {
              id: "Pending",
              line: "",
              quantity: 94,
              price: 5646.7,
              created: null,
            },
            {
              id: 24009754978,
              line: 7,
              quantity: 38,
              price: 4841.7,
              created: "2021-11-16T20:51:54.646Z",
            },
            {
              id: "Pending",
              line: "",
              quantity: 96,
              price: 4752.7,
              created: null,
            },
            {
              id: 24009754979,
              line: 2,
              quantity: 8,
              price: 4940.7,
              created: "2021-11-16T20:51:54.646Z",
            },
            {
              id: "Pending",
              line: "",
              quantity: 64,
              price: 5332.7,
              created: null,
            },
            {
              id: 24009754984,
              line: 6,
              quantity: 19,
              price: 5317.7,
              created: "2021-11-16T20:51:54.646Z",
            },
            {
              id: "Pending",
              line: "",
              quantity: 90,
              price: 5203.7,
              created: null,
            },
            {
              id: 24009754983,
              line: 5,
              quantity: 40,
              price: 4887.7,
              created: "2021-11-16T20:51:54.646Z",
            },
          ],
          status: "inProcess",
          trackings: [
            {
              orderNumber: "6030684674",
              invoiceNumber: null,
              id: null,
              carrier: "FEDEX",
              serviceLevel: "FEDEX GROUND",
              trackingNumber: "486197188378",
              trackingLink:
                "http://www.fedex.com/Tracking?&cntry_code=us&language=english&tracknumbers=486197188378",
              type: "W0",
              description: "FEDX GRND",
              date: "07-13-2021",
              dNote: "7038811481",
              dNoteLineNumber: "30",
              goodsReceiptNo: null,
            },
          ],
          isReturn: false,
          currency: "USD",
          currencySymbol: "$",
          line: 24009754974,
          manufacturer: "2752GIQ",
          description: "PLTNM TAB PRTNR STOCK $5+ MRC ACTIVATION",
          quantity: 9,
          serial: "n/a",
          unitPrice: 73718.31,
          totalPrice: 73718.31,
          shipDate: "Emailed",
        },
      ],
      totalItems: 2500,
      pageCount: 25,
      pageSize: "25",
    },
    error: {
      code: 0,
      message: [],
      isError: false,
    },
  });
});

app.get("/typeahead", function (req, res) {
  const { keyword } = req.query;

  res.json({
    Request: {
      SearchApplication: "shop",
      Keyword: `${keyword}`,
      MaxResults: 10,
    },
    Suggestions: [
      {
        Keyword: `${keyword}`,
        Refinements: [
          {
            Description: "Desktops & Workstations > Desktops",
            RefinementId: "510010101",
            RefinementType: 0,
          },
        ],
        SuggestionType: 1,
      },
      {
        Keyword: `${keyword} optiplex`,
        Refinements: null,
        SuggestionType: 1,
      },
      {
        Keyword: `${keyword} laptop`,
        Refinements: null,
        SuggestionType: 1,
      },
      {
        Keyword: `${keyword} monitor`,
        Refinements: [
          {
            Description: "Desktops & Workstations > Desktops",
            RefinementId: "510010101",
            RefinementType: 0,
          },
        ],
        SuggestionType: 1,
      },
      {
        Keyword: `${keyword} optiplex 3060`,
        Refinements: null,
        SuggestionType: 1,
      },
      {
        Keyword: `${keyword} precision`,
        Refinements: null,
        SuggestionType: 1,
      },
      {
        Keyword: `${keyword} xps`,
        Refinements: [
          {
            Description: "Desktops & Workstations > Desktops",
            RefinementId: "510010101",
            RefinementType: 0,
          },
        ],
        SuggestionType: 1,
      },
      {
        Keyword: `${keyword} inspiron`,
        Refinements: null,
        SuggestionType: 1,
      },
    ],
  });
});

app.get("/ui-config/v1/configurations", function (req, res) {
  if(!validateSession(req, res)) return;

  /**@type {string} */
  const url = req.url;
  const flag = url.includes("ConfigurationType=Deal"); // emulating filter errio like in SIT and UAT
  const flagVendor = url.includes("ConfigurationType=VendorQuote"); // emulating filter errio like in SIT and UAT
  const sortBy = req.query.SortBy ? req.query.SortBy : 'id';
  const sortDir = req.query.SortDirection ? req.query.SortDirection : 'asc';

  if (flagVendor) {
    res.json({
      content: {
        pageNumber: 1,
        pageSize: 25,
        totalItems: 25,
        items: [], // empty response
      },
      error: {
        code: 0,
        messages: [],
        isError: false,
      },
    });

    return;
  }

  if (flag) {
    res.status(400).send({
      errors: {
        ConfigurationType: [
          "The value 'Deal' is not valid for ConfigurationType.",
        ],
      },
      type: "https://tools.ietf.org/html/rfc7231#section-6.5.1",
      title: "One or more validation errors occurred.",
      status: 400,
      traceId: "00-639eecd6bcc0504389ca76e3f667e295-8581b2077de66248-00",
    });
  } else {
    const response = utils.getConfigGridResponse(sortBy, sortDir);
    res.json(response);
  }
});

app.get("/ui-config/v1/estimations/validate/", function (req, res) {
  const { id } = req.query;
  if (!validateSession(req, res)) {
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

app.post("/ui-renewal/v1/Search", (req, res) => { 
  
  const response = {"content":{"totalItems":2710,"pageCount":109,"pageNumber":1,"pageSize":25,"items":[{"source":{"system":"RQ","type":"Renewal","id":"U100000005420"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Dell Technologies United States","vendorAccountNumber":"2752413","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Round Rock","state":null,"postalCode":"78664","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"ELECTRO DESIGN ENGINEERING INC","nameUpper":"ELECTRO DESIGN ENGINEERING INC","contact":{"salutation":null,"firstName":"DONALD","lastName":"STEELE","initial":null,"emailAddress":"DONALD.STEELE@EDEUSA.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"RIVERVIEW","state":"FL","postalCode":"33578","country":null,"county":"HILLSBOROUGH","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:18.838Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-07-28T00:00:00Z","dueDays":-364,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"375094229","support":"Production","options":[{"id":"U100000005420","agreementNumber":"375094229","quoteID":"375094229-R:18JUN22 08:40:14","contractDuration":"2 Years 2 Months 15 Days","support":"Production","total":5416.64,"currency":"USD","save":0.0,"expiryDate":"2022-10-10T00:00:00Z","quoteCurrent":true},{"id":"U100000005421","agreementNumber":"375094229","quoteID":"375094229-R:18JUN22 08:40:41","contractDuration":"4 Years 2 Months 15 Days","support":"Production","total":11944.23,"currency":"USD","save":0.0,"expiryDate":"2022-10-10T00:00:00Z","quoteCurrent":false}],"renewal":{"total":5416.64,"currency":"USD","save":0.0,"expiryDate":"2022-10-10T00:00:00Z"},"resellerPO":"375094229-R:18JUN22 08:40:14","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:18.838Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003464"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"CDW","vendorAccountNumber":"2709981","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Etobicoke","state":null,"postalCode":"M9W 6L2","country":"Canada","county":null,"countryCode":"CA"}},"endUser":{"id":null,"name":"Unilever Covington","nameUpper":"UNILEVER COVINGTON","contact":{"salutation":null,"firstName":"Cybertrol","lastName":"Licensing","initial":null,"emailAddress":"licensing@cybertrol.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"COVINGTON","state":"TN","postalCode":"38019","country":null,"county":"TIPTON","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-09-01T00:00:00Z","dueDays":-329,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"376349532","support":"Production","options":[],"renewal":{"total":779.17,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"376349532-R:01JUL22 11:40:19","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003447"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"CDW","vendorAccountNumber":"2709981","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Etobicoke","state":null,"postalCode":"M9W 6L2","country":"Canada","county":null,"countryCode":"CA"}},"endUser":{"id":null,"name":"Unilever Covington","nameUpper":"UNILEVER COVINGTON","contact":{"salutation":null,"firstName":"Cybertrol","lastName":"Licensing","initial":null,"emailAddress":"licensing@cybertrol.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"COVINGTON","state":"TN","postalCode":"38019","country":null,"county":"TIPTON","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-10-07T00:00:00Z","dueDays":-293,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"350554067","support":"Production","options":[{"id":"U100000003447","agreementNumber":"350554067","quoteID":"350554067-R:01JUL22 11:36:29","contractDuration":"1 Year 8 Months 24 Days","support":"Production","total":17524.68,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":true},{"id":"U100000003448","agreementNumber":"350554067","quoteID":"350554067-R:01JUL22 11:36:50","contractDuration":"3 Years 8 Months 25 Days","support":"Production","total":29374.32,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":false}],"renewal":{"total":17524.68,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"350554067-R:01JUL22 11:36:29","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000005417"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"SHI International Corp","vendorAccountNumber":"2713676","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Somerset","state":null,"postalCode":"8873","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Outrigger Hotels","nameUpper":"OUTRIGGER HOTELS","contact":{"salutation":null,"firstName":"Jacky","lastName":"Lee","initial":null,"emailAddress":"JACKY.LEE@OUTRIGGER.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"HONOLULU","state":"HI","postalCode":"96815","country":null,"county":"HONOLULU","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:18.838Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-12-18T00:00:00Z","dueDays":-221,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"353231757","support":"Production","options":[{"id":"U100000005417","agreementNumber":"353231757","quoteID":"353231757-R:18JUN22 08:39:10","contractDuration":"1 Year 9 Months 26 Days","support":"Production","total":9947.36,"currency":"USD","save":0.0,"expiryDate":"2022-10-13T00:00:00Z","quoteCurrent":true},{"id":"U100000005418","agreementNumber":"353231757","quoteID":"353231757-R:18JUN22 08:39:51","contractDuration":"3 Years 9 Months 27 Days","support":"Production","total":16530.76,"currency":"USD","save":0.0,"expiryDate":"2022-10-13T00:00:00Z","quoteCurrent":false}],"renewal":{"total":9947.36,"currency":"USD","save":0.0,"expiryDate":"2022-10-13T00:00:00Z"},"resellerPO":"353231757-R:18JUN22 08:39:10","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:18.838Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000004146"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Skyward","vendorAccountNumber":"2731277","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Stevens Point","state":null,"postalCode":"54481","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Emmons School District 33","nameUpper":"EMMONS SCHOOL DISTRICT 33","contact":{"salutation":null,"firstName":"Joe","lastName":"Nowak","initial":null,"emailAddress":"jnowak@emmons33.org","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Antioch","state":"IL","postalCode":"60002-2234","country":null,"county":"LAKE","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:19.051Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-01-11T00:00:00Z","dueDays":-197,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"381132562","support":"Production","options":[{"id":"U100000004146","agreementNumber":"381132562","quoteID":"381132562-R:28JUN22 07:52:44","contractDuration":"1 Year 5 Months 17 Days","support":"Production","total":77.2,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":true},{"id":"U100000004147","agreementNumber":"381132562","quoteID":"381132562-R:28JUN22 07:53:14","contractDuration":"3 Years 5 Months 18 Days","support":"Production","total":139.11,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":false}],"renewal":{"total":77.2,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"381132562-R:28JUN22 07:52:44","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:19.051Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003418"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"CDW","vendorAccountNumber":"2709981","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Etobicoke","state":null,"postalCode":"M9W 6L2","country":"Canada","county":null,"countryCode":"CA"}},"endUser":{"id":null,"name":"Josselyn Center","nameUpper":"JOSSELYN CENTER","contact":{"salutation":null,"firstName":"HELP","lastName":"DESK","initial":null,"emailAddress":"helpdesk@josselyn.org","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"NORTHFIELD","state":"IL","postalCode":"60093-3097","country":null,"county":"COOK","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-01-30T00:00:00Z","dueDays":-178,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"31727180","support":"Basic","options":[],"renewal":{"total":465.94,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"31727180-R:01JUL22 13:26:58","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003729"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Carousel Industries","vendorAccountNumber":"3462510","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Exeter","state":null,"postalCode":"2822","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Mexichem Specialty Compounds","nameUpper":"MEXICHEM SPECIALTY COMPOUNDS","contact":{"salutation":null,"firstName":"Michael","lastName":"Funderburg","initial":null,"emailAddress":"mfunderburg@alphagary.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"PINEVILLE","state":"NC","postalCode":"28134","country":null,"county":"MECKLENBURG","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-27T00:00:00Z","dueDays":-150,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"343393456","support":"Basic","options":[{"id":"U100000003729","agreementNumber":"343393456","quoteID":"343393456-R:28JUN22 13:51:22","contractDuration":"1 Year 4 Months 1 Day","support":"Basic","total":117.31,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":true},{"id":"U100000003730","agreementNumber":"343393456","quoteID":"343393456-R:28JUN22 13:51:50","contractDuration":"3 Years 4 Months 2 Days","support":"Basic","total":220.47,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":false},{"id":"U100000003731","agreementNumber":"343393456","quoteID":"343393456-R:29JUN22 12:52:27","contractDuration":"1 Year 9 Months 3 Days","support":"Basic","total":144.11,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":false}],"renewal":{"total":117.31,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"343393456-R:28JUN22 13:51:22","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000008245"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Insight Direct","vendorAccountNumber":"2710633","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Uxbridge","state":null,"postalCode":"UB8 1JG","country":"United Kingdom","county":null,"countryCode":"GB"}},"endUser":{"id":null,"name":"Bloomberg Finance L.P","nameUpper":"BLOOMBERG FINANCE L.P","contact":{"salutation":null,"firstName":"william","lastName":"stevens","initial":null,"emailAddress":"wstevens11@bloomberg.net","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"LONDON","state":"0","postalCode":"E16 4ES","country":null,"county":null,"countryCode":"GB"}},"shipTo":null,"published":"2022-07-21T07:47:22.584Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-03-23T00:00:00Z","dueDays":-126,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"4121252753","support":"Production","options":[],"renewal":{"total":169.30,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"4121252753-R:03JUL22 21:36:59","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:22.584Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003735"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Computer Resources of America","vendorAccountNumber":"2717901","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":null,"postalCode":"10036","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Ruchelman P.l.l.c","nameUpper":"RUCHELMAN P.L.L.C","contact":{"salutation":null,"firstName":"Francesca","lastName":"York","initial":null,"emailAddress":"crany@ruchelaw.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":"NY","postalCode":"10155-0002","country":null,"county":"NEW YORK","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-04-16T00:00:00Z","dueDays":-102,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"344068841","support":"Basic","options":[],"renewal":{"total":62.93,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"344068841-R:30JUN22 12:51:58","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003580"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Insight Enterprises","vendorAccountNumber":"2709987","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"TEMPE","state":null,"postalCode":"85283-4318","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Bloomberg LP","nameUpper":"BLOOMBERG LP","contact":{"salutation":null,"firstName":"Steve","lastName":"Fenster","initial":null,"emailAddress":"SFENSTER@BLOOMBERG.NET","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"NEW YORK","state":"NY","postalCode":"10022","country":null,"county":"NEW YORK","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-04-20T00:00:00Z","dueDays":-98,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"384501795","support":"Production","options":[],"renewal":{"total":209.48,"currency":"USD","save":0.0,"expiryDate":"2022-07-30T00:00:00Z"},"resellerPO":"384501795-R:30JUN22 20:58:47","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000004643"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Zones","vendorAccountNumber":"5214","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"AUBURN","state":null,"postalCode":"98001-6524","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Waianae Coast Comprehensive Health Center","nameUpper":"WAIANAE COAST COMPREHENSIVE HEALTH CENTER","contact":{"salutation":null,"firstName":"JOHN","lastName":"WILLIAMS","initial":null,"emailAddress":"jwilliams@wcchc.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"WAIANAE","state":"HI","postalCode":"96792-3128","country":null,"county":"HONOLULU","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:19.051Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-05-14T00:00:00Z","dueDays":-74,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"30231894","support":"Mixed","options":[{"id":"U100000004906","agreementNumber":"30231894","quoteID":"30231894-R:22JUN22 04:30:24","contractDuration":"1 Year 5 Months 24 Days","support":"Mixed","total":34242.07,"currency":"USD","save":0.0,"expiryDate":"2022-07-22T00:00:00Z","quoteCurrent":false},{"id":"U100000004642","agreementNumber":"30231894","quoteID":"30231894-R:22JUN22 11:38:48","contractDuration":"1 Year 5 Months 24 Days","support":"Mixed","total":33292.50,"currency":"USD","save":0.0,"expiryDate":"2022-07-23T00:00:00Z","quoteCurrent":false},{"id":"U100000004643","agreementNumber":"30231894","quoteID":"30231894-R:24JUN22 01:58:33","contractDuration":"1 Year  7 Days","support":"Mixed","total":25866.75,"currency":"USD","save":0.0,"expiryDate":"2022-07-24T00:00:00Z","quoteCurrent":true}],"renewal":{"total":25866.75,"currency":"USD","save":0.0,"expiryDate":"2022-07-24T00:00:00Z"},"resellerPO":"30231894-R:24JUN22 01:58:33","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:19.051Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000004376"},"canPlaceOrder":true,"reseller":{"vendorAccountName":null,"vendorAccountNumber":null,"id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":null,"state":null,"postalCode":null,"country":null,"county":null,"countryCode":null}},"endUser":{"id":null,"name":"STONE WARD","nameUpper":"STONE WARD","contact":{"salutation":null,"firstName":"John","lastName":"Rogers","initial":null,"emailAddress":"jrogers@stoneward.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"LITTLE ROCK","state":"AR","postalCode":"72201","country":null,"county":"PULASKI","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:19.051Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-05-21T00:00:00Z","dueDays":-67,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"345372664","support":"Basic","options":[{"id":"U100000004376","agreementNumber":"345372664","quoteID":"345372664-R:27JUN22 08:52:08","contractDuration":"1 Year 1 Month 6 Days","support":"Basic","total":97.04,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":true},{"id":"U100000004367","agreementNumber":"345372664","quoteID":"345372664-R:27JUN22 08:52:35","contractDuration":"3 Years 1 Month 7 Days","support":"Basic","total":200.21,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":false}],"renewal":{"total":97.04,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"345372664-R:27JUN22 08:52:08","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:19.051Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000008173"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"World Wide Technology Inc","vendorAccountNumber":"2715741","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Saint Louis","state":null,"postalCode":"63146","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Cisco Systems","nameUpper":"CISCO SYSTEMS","contact":{"salutation":null,"firstName":"Alex","lastName":"Fitzpatrick","initial":null,"emailAddress":"ALEXFITZ@CISCO.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"SAN JOSE","state":"CA","postalCode":"95134-1405","country":null,"county":"SANTA CLARA","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:22.584Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-05-27T00:00:00Z","dueDays":-61,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"386057412","support":"Production","options":[{"id":"U100000008173","agreementNumber":"386057412","quoteID":"386057412-R:04JUL22 04:15:06","contractDuration":"1 Year 1 Month 7 Days","support":"Production","total":38450.90,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":true},{"id":"U100000008174","agreementNumber":"386057412","quoteID":"386057412-R:04JUL22 04:32:05","contractDuration":"3 Years 1 Month 8 Days","support":"Production","total":79955.98,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":false}],"renewal":{"total":38450.90,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"386057412-R:04JUL22 04:15:06","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:22.584Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000004087"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Cornerstone Information Systems","vendorAccountNumber":"3723834","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Hopkinsville","state":null,"postalCode":"42240-2112","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Duck River EMC","nameUpper":"DUCK RIVER EMC","contact":{"salutation":null,"firstName":"BJ","lastName":"Bernard","initial":null,"emailAddress":"BBERNARD@DREMC.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"SHELBYVILLE","state":"TN","postalCode":"37160-3629","country":null,"county":"BEDFORD","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:19.051Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-05-29T00:00:00Z","dueDays":-59,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"30748911","support":"Basic","options":[{"id":"U100000004087","agreementNumber":"30748911","quoteID":"30748911-R:27JUN22 22:09:34","contractDuration":"1 Year  29 Days","support":"Basic","total":11276.36,"currency":"USD","save":0.0,"expiryDate":"2022-07-27T00:00:00Z","quoteCurrent":true},{"id":"U100000004088","agreementNumber":"30748911","quoteID":"30748911-R:27JUN22 22:16:25","contractDuration":"3 Years  30 Day","support":"Basic","total":23508.16,"currency":"USD","save":0.0,"expiryDate":"2022-07-27T00:00:00Z","quoteCurrent":false}],"renewal":{"total":11276.36,"currency":"USD","save":0.0,"expiryDate":"2022-07-27T00:00:00Z"},"resellerPO":"30748911-R:27JUN22 22:09:34","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:19.051Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000005424"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Insight Enterprises","vendorAccountNumber":"2709987","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"TEMPE","state":null,"postalCode":"85283-4318","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"REYNOLDS SMITH & HILLS","nameUpper":"REYNOLDS SMITH & HILLS","contact":{"salutation":null,"firstName":"DANIEL","lastName":"SCHOENING","initial":null,"emailAddress":"DANIEL.SCHOENING@RSANDH.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"JACKSONVILLE","state":"FL","postalCode":"32256","country":null,"county":"DUVAL","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:18.838Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-06-01T00:00:00Z","dueDays":-56,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"386236632","support":"Production","options":[{"id":"U100000005424","agreementNumber":"386236632","quoteID":"386236632-R:18JUN22 08:40:55","contractDuration":"1 Year 4 Months 15 Days","support":"Production","total":1948.18,"currency":"USD","save":0.0,"expiryDate":"2022-10-14T00:00:00Z","quoteCurrent":true},{"id":"U100000005425","agreementNumber":"386236632","quoteID":"386236632-R:18JUN22 08:41:19","contractDuration":"3 Years 4 Months 16 Days","support":"Production","total":3691.62,"currency":"USD","save":0.0,"expiryDate":"2022-10-14T00:00:00Z","quoteCurrent":false}],"renewal":{"total":1948.18,"currency":"USD","save":0.0,"expiryDate":"2022-10-14T00:00:00Z"},"resellerPO":"386236632-R:18JUN22 08:40:55","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:18.838Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003700"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"IS Consulting Services LLC","vendorAccountNumber":"14021837","id":"38004069","name":"IS CONSULTING SVCS, LLC","nameUpper":"IS CONSULTING SVCS, LLC","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":"3127559100","role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Chicago","state":"IL","postalCode":"60604","country":"US","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Novuslaw","nameUpper":"NOVUSLAW","contact":{"salutation":null,"firstName":"JIM","lastName":"BYRON","initial":null,"emailAddress":"bniles@novuslaw.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Chicago","state":"IL","postalCode":"60631-3564","country":null,"county":"DUPAGE","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-06-17T00:00:00Z","dueDays":-40,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"31422703","support":"Basic","options":[{"id":"U100000003700","agreementNumber":"31422703","quoteID":"31422703-R:29JUN22 08:37:06","contractDuration":"1 Year  12 Days","support":"Basic","total":9306.58,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":true},{"id":"U100000003789","agreementNumber":"31422703","quoteID":"31422703-R:29JUN22 08:37:35","contractDuration":"3 Years  13 Days","support":"Basic","total":19857.04,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":false}],"renewal":{"total":9306.58,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"31422703-R:29JUN22 08:37:06","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003805"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Dataworks Consulting","vendorAccountNumber":"4631754","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Newcastle","state":null,"postalCode":"98056-1412","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"First Sound Bank","nameUpper":"FIRST SOUND BANK","contact":{"salutation":null,"firstName":"BRAD","lastName":"DETRICK","initial":null,"emailAddress":"BDETRICK@FIRSTSOUNDBANK.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"SEATTLE","state":"WA","postalCode":"98104-0000","country":null,"county":"KING","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-06-18T00:00:00Z","dueDays":-39,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"346430054","support":"Production","options":[],"renewal":{"total":1562.73,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"346430054-R:28JUN22 14:08:22","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000004123"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Trusted Tech Team","vendorAccountNumber":"20489354","id":"38080504","name":"Trusted Tech Team","nameUpper":"TRUSTED TECH TEAM","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":"714-949-0587","role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Irvine","state":"CA","postalCode":"92612-1484","country":"US","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"St. Clair Shores Ob/Gyn","nameUpper":"ST. CLAIR SHORES OB/GYN","contact":{"salutation":null,"firstName":"Aspa","lastName":"Raphtis","initial":null,"emailAddress":"araphtis@gmail.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Saint Clair Shores","state":"MI","postalCode":"48080-1064","country":null,"county":"MACOMB","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:19.051Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-06-19T00:00:00Z","dueDays":-38,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"360078484","support":"Basic","options":[{"id":"U100000004123","agreementNumber":"360078484","quoteID":"360078484-R:28JUN22 09:36:30","contractDuration":"1 Year  9 Days","support":"Basic","total":90.37,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":true},{"id":"U100000004124","agreementNumber":"360078484","quoteID":"360078484-R:28JUN22 09:36:54","contractDuration":"3 Years  10 Day","support":"Basic","total":193.64,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":false}],"renewal":{"total":90.37,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"360078484-R:28JUN22 09:36:30","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:19.051Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003745"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Trusted Tech Team","vendorAccountNumber":"20489354","id":"38080504","name":"Trusted Tech Team","nameUpper":"TRUSTED TECH TEAM","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":"714-949-0587","role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Irvine","state":"CA","postalCode":"92612-1484","country":"US","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"St. Clair Shores Ob/Gyn","nameUpper":"ST. CLAIR SHORES OB/GYN","contact":{"salutation":null,"firstName":"Aspa","lastName":"Raphtis","initial":null,"emailAddress":"araphtis@gmail.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Saint Clair Shores","state":"MI","postalCode":"48080-1064","country":null,"county":"MACOMB","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":null,"dueDate":"2022-06-19T00:00:00Z","dueDays":-38,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"360078484","support":"Basic","options":[],"renewal":{"total":90.37,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"360078484-R:28JUN22 12:51:22","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003928"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Zones","vendorAccountNumber":"5214","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"AUBURN","state":null,"postalCode":"98001-6524","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Cisco Systems","nameUpper":"CISCO SYSTEMS","contact":{"salutation":null,"firstName":"Alex","lastName":"Fitzpatrick","initial":null,"emailAddress":"ALEXFITZ@CISCO.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"CORDOVA","state":"TN","postalCode":"38018","country":null,"county":"SHELBY","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-06-19T00:00:00Z","dueDays":-38,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"386882191","support":"Production","options":[{"id":"U100000003928","agreementNumber":"386882191","quoteID":"386882191-R:28JUN22 20:58:19","contractDuration":"1 Year 1 Month 16 Days","support":"Production","total":4203.84,"currency":"USD","save":0.0,"expiryDate":"2022-07-28T00:00:00Z","quoteCurrent":true},{"id":"U100000003929","agreementNumber":"386882191","quoteID":"386882191-R:28JUN22 21:05:51","contractDuration":"3 Years 1 Month 17 Days","support":"Production","total":10339.64,"currency":"USD","save":0.0,"expiryDate":"2022-07-28T00:00:00Z","quoteCurrent":false}],"renewal":{"total":4203.84,"currency":"USD","save":0.0,"expiryDate":"2022-07-28T00:00:00Z"},"resellerPO":"386882191-R:28JUN22 20:58:19","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003041"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Dell Technologies United States","vendorAccountNumber":"2752413","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Round Rock","state":null,"postalCode":"78664","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Ecfmg","nameUpper":"ECFMG","contact":{"salutation":null,"firstName":"Tyrone","lastName":"McCloud","initial":null,"emailAddress":"TMCCLOUD@ECFMG.ORG","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Philadelphia","state":"PA","postalCode":"19104-2614","country":null,"county":"PHILADELPHIA","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":null,"dueDate":"2022-06-22T00:00:00Z","dueDays":-35,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"343408094","support":"Production","options":[],"renewal":{"total":100259.86,"currency":"USD","save":0.0,"expiryDate":"2022-07-24T00:00:00Z"},"resellerPO":"343408094-R:24JUN22 13:22:35","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000004386"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Mainmicro Technologies Corporation","vendorAccountNumber":"17099481","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":null,"postalCode":"10001","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"YAI National Institute For Disabilities","nameUpper":"YAI NATIONAL INSTITUTE FOR DISABILITIES","contact":{"salutation":null,"firstName":"Richard","lastName":"Leite","initial":null,"emailAddress":"richard.leite@yai.org","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":"NY","postalCode":"10017-5832","country":null,"county":"NEW YORK","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:19.051Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-06-23T00:00:00Z","dueDays":-34,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"360228078","support":"Production","options":[],"renewal":{"total":11620.63,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"360228078-R:27JUN22 07:52:16","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:19.051Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003811"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Mainmicro Technologies Corporation","vendorAccountNumber":"17099481","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":null,"postalCode":"10001","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"YAI National Institute For Disabilities","nameUpper":"YAI NATIONAL INSTITUTE FOR DISABILITIES","contact":{"salutation":null,"firstName":"Richard","lastName":"Leite","initial":null,"emailAddress":"richard.leite@yai.org","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":"NY","postalCode":"10017-5832","country":null,"county":"NEW YORK","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":null,"dueDate":"2022-06-23T00:00:00Z","dueDays":-34,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"360228078","support":"Production","options":[],"renewal":{"total":25111.78,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"360228078-R:28JUN22 14:25:03","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003810"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Mainmicro Technologies Corporation","vendorAccountNumber":"17099481","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":null,"postalCode":"10001","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"YAI National Institute For Disabilities","nameUpper":"YAI NATIONAL INSTITUTE FOR DISABILITIES","contact":{"salutation":null,"firstName":"Richard","lastName":"Leite","initial":null,"emailAddress":"richard.leite@yai.org","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":"NY","postalCode":"10017-5832","country":null,"county":"NEW YORK","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":null,"dueDate":"2022-06-23T00:00:00Z","dueDays":-34,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"360228078","support":"Production","options":[],"renewal":{"total":11652.21,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"360228078-R:28JUN22 14:24:37","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000006211"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Zones","vendorAccountNumber":"5214","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"AUBURN","state":null,"postalCode":"98001-6524","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"UNISYS CORPORATION","nameUpper":"UNISYS CORPORATION","contact":{"salutation":null,"firstName":"RASHMI","lastName":"KUNDAPUR","initial":null,"emailAddress":"rashmi.kundapur@in.unisys.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Saint Paul","state":"MN","postalCode":"55121-1328","country":null,"county":"RAMSEY","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:20.85Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-06-24T00:00:00Z","dueDays":-33,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"387058074","support":"Production","options":[{"id":"U100000006211","agreementNumber":"387058074","quoteID":"387058074-R:13JUN22 08:51:40","contractDuration":"1 Year 1 Month 15 Days","support":"Production","total":118.82,"currency":"USD","save":0.0,"expiryDate":"2022-07-24T00:00:00Z","quoteCurrent":true},{"id":"U100000006212","agreementNumber":"387058074","quoteID":"387058074-R:13JUN22 08:53:20","contractDuration":"1 Year 1 Month 15 Days","support":"Production","total":99.91,"currency":"USD","save":0.0,"expiryDate":"2022-06-24T00:00:00Z","quoteCurrent":false}],"renewal":{"total":118.82,"currency":"USD","save":0.0,"expiryDate":"2022-07-24T00:00:00Z"},"resellerPO":"387058074-R:13JUN22 08:51:40","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:20.85Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0}],"refinementGroups":{"group":"RenewalAttributes","refinements":[{"id":null,"name":"Vendors and programs","options":[{"id":null,"text":"Veeam","searchKey":"VendorName","selected":null,"subOptions":[{"id":null,"text":"Pro Partner Program","searchKey":"ProgramName","selected":null}]},{"id":null,"text":"VMware","searchKey":"VendorName","selected":null,"subOptions":[{"id":null,"text":"Standard","searchKey":"ProgramName","selected":null}]}]},{"id":null,"name":"End user type","searchKey":"EndUserType","options":[{"id":null,"text":"Academic","selected":null,"subOptions":null},{"id":null,"text":"Commercial","selected":null,"subOptions":null}]},{"id":null,"name":"Renewal type","searchKey":"Type","options":[{"id":null,"text":"Renewal","selected":null,"subOptions":null}]}]}},"error":{"code":0,"messages":[],"isError":false}};
  // const response = [];
  // {ProgramName: [],endUserType: []}
  const payload = req.body; 

  const formatValue = (name) => name.replace(/\s/g, "").toLowerCase();
  let responseItemList = response.content.items;
  if (payload?.ProgramName)
    responseItemList = responseItemList.filter(({ programName }) =>
      payload.ProgramName.map((i) => formatValue(i)).includes(
        formatValue(programName)
      )
    );
  if (payload?.EndUserType)
    responseItemList = responseItemList.filter(({ endUserType }) =>
      payload.EndUserType.includes(formatValue(endUserType.toLowerCase()))
    );
  
  if (payload?.DueDateFrom){
    responseItemList = responseItemList.filter(({dueDate}) => 
       new Date(dueDate).getTime() >= new Date(payload.DueDateFrom).getTime()
    )
  }
  if (payload?.DueDateFrom && payload?.DueDateTo){
    responseItemList = responseItemList.filter(({dueDate}) => 
       new Date(dueDate).getTime() >= new Date(payload.DueDateFrom).getTime() &&
       new Date(dueDate).getTime() <= new Date(payload.DueDateTo).getTime() 
    )
  }
  if(payload?.PageNumber){
    response.content.pageNumber = parseInt(payload?.PageNumber)
  }
  
  response.content.items = responseItemList;
  res.json(response);
});

app.get("/ui-renewal/v1/Search", function (req, res) {  
  const response = {"content":{"totalItems":2710,"pageCount":109,"pageNumber":1,"pageSize":25,"items":[{"source":{"system":"RQ","type":"Renewal","id":"U100000005420"},"canPlaceOrder":false,"reseller":{"vendorAccountName":"Dell Technologies United States","vendorAccountNumber":"2752413","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Round Rock","state":null,"postalCode":"78664","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"ELECTRO DESIGN ENGINEERING INC","nameUpper":"ELECTRO DESIGN ENGINEERING INC","contact":{"salutation":null,"firstName":"DONALD","lastName":"STEELE","initial":null,"emailAddress":"DONALD.STEELE@EDEUSA.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"RIVERVIEW","state":"FL","postalCode":"33578","country":null,"county":"HILLSBOROUGH","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:18.838Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-07-28T00:00:00Z","dueDays":-364,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"375094229","support":"Production","options":[{"id":"U100000005420","agreementNumber":"375094229","quoteID":"375094229-R:18JUN22 08:40:14","contractDuration":"2 Years 2 Months 15 Days","support":"Production","total":5416.64,"currency":"USD","save":0.0,"expiryDate":"2022-10-10T00:00:00Z","quoteCurrent":true},{"id":"U100000005421","agreementNumber":"375094229","quoteID":"375094229-R:18JUN22 08:40:41","contractDuration":"4 Years 2 Months 15 Days","support":"Production","total":11944.23,"currency":"USD","save":0.0,"expiryDate":"2022-10-10T00:00:00Z","quoteCurrent":false}],"renewal":{"total":5416.64,"currency":"USD","save":0.0,"expiryDate":"2022-10-10T00:00:00Z"},"resellerPO":"375094229-R:18JUN22 08:40:14","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:18.838Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003464"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"CDW","vendorAccountNumber":"2709981","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Etobicoke","state":null,"postalCode":"M9W 6L2","country":"Canada","county":null,"countryCode":"CA"}},"endUser":{"id":null,"name":"Unilever Covington","nameUpper":"UNILEVER COVINGTON","contact":{"salutation":null,"firstName":"Cybertrol","lastName":"Licensing","initial":null,"emailAddress":"licensing@cybertrol.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"COVINGTON","state":"TN","postalCode":"38019","country":null,"county":"TIPTON","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-09-01T00:00:00Z","dueDays":-329,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"376349532","support":"Production","options":[],"renewal":{"total":779.17,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"376349532-R:01JUL22 11:40:19","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003447"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"CDW","vendorAccountNumber":"2709981","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Etobicoke","state":null,"postalCode":"M9W 6L2","country":"Canada","county":null,"countryCode":"CA"}},"endUser":{"id":null,"name":"Unilever Covington","nameUpper":"UNILEVER COVINGTON","contact":{"salutation":null,"firstName":"Cybertrol","lastName":"Licensing","initial":null,"emailAddress":"licensing@cybertrol.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"COVINGTON","state":"TN","postalCode":"38019","country":null,"county":"TIPTON","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-10-07T00:00:00Z","dueDays":-293,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"350554067","support":"Production","options":[{"id":"U100000003447","agreementNumber":"350554067","quoteID":"350554067-R:01JUL22 11:36:29","contractDuration":"1 Year 8 Months 24 Days","support":"Production","total":17524.68,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":true},{"id":"U100000003448","agreementNumber":"350554067","quoteID":"350554067-R:01JUL22 11:36:50","contractDuration":"3 Years 8 Months 25 Days","support":"Production","total":29374.32,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":false}],"renewal":{"total":17524.68,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"350554067-R:01JUL22 11:36:29","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000005417"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"SHI International Corp","vendorAccountNumber":"2713676","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Somerset","state":null,"postalCode":"8873","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Outrigger Hotels","nameUpper":"OUTRIGGER HOTELS","contact":{"salutation":null,"firstName":"Jacky","lastName":"Lee","initial":null,"emailAddress":"JACKY.LEE@OUTRIGGER.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"HONOLULU","state":"HI","postalCode":"96815","country":null,"county":"HONOLULU","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:18.838Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-12-18T00:00:00Z","dueDays":-221,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"353231757","support":"Production","options":[{"id":"U100000005417","agreementNumber":"353231757","quoteID":"353231757-R:18JUN22 08:39:10","contractDuration":"1 Year 9 Months 26 Days","support":"Production","total":9947.36,"currency":"USD","save":0.0,"expiryDate":"2022-10-13T00:00:00Z","quoteCurrent":true},{"id":"U100000005418","agreementNumber":"353231757","quoteID":"353231757-R:18JUN22 08:39:51","contractDuration":"3 Years 9 Months 27 Days","support":"Production","total":16530.76,"currency":"USD","save":0.0,"expiryDate":"2022-10-13T00:00:00Z","quoteCurrent":false}],"renewal":{"total":9947.36,"currency":"USD","save":0.0,"expiryDate":"2022-10-13T00:00:00Z"},"resellerPO":"353231757-R:18JUN22 08:39:10","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:18.838Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000004146"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Skyward","vendorAccountNumber":"2731277","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Stevens Point","state":null,"postalCode":"54481","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Emmons School District 33","nameUpper":"EMMONS SCHOOL DISTRICT 33","contact":{"salutation":null,"firstName":"Joe","lastName":"Nowak","initial":null,"emailAddress":"jnowak@emmons33.org","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Antioch","state":"IL","postalCode":"60002-2234","country":null,"county":"LAKE","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:19.051Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-01-11T00:00:00Z","dueDays":-197,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"381132562","support":"Production","options":[{"id":"U100000004146","agreementNumber":"381132562","quoteID":"381132562-R:28JUN22 07:52:44","contractDuration":"1 Year 5 Months 17 Days","support":"Production","total":77.2,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":true},{"id":"U100000004147","agreementNumber":"381132562","quoteID":"381132562-R:28JUN22 07:53:14","contractDuration":"3 Years 5 Months 18 Days","support":"Production","total":139.11,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":false}],"renewal":{"total":77.2,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"381132562-R:28JUN22 07:52:44","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:19.051Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003418"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"CDW","vendorAccountNumber":"2709981","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Etobicoke","state":null,"postalCode":"M9W 6L2","country":"Canada","county":null,"countryCode":"CA"}},"endUser":{"id":null,"name":"Josselyn Center","nameUpper":"JOSSELYN CENTER","contact":{"salutation":null,"firstName":"HELP","lastName":"DESK","initial":null,"emailAddress":"helpdesk@josselyn.org","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"NORTHFIELD","state":"IL","postalCode":"60093-3097","country":null,"county":"COOK","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-01-30T00:00:00Z","dueDays":-178,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"31727180","support":"Basic","options":[],"renewal":{"total":465.94,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"31727180-R:01JUL22 13:26:58","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003729"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Carousel Industries","vendorAccountNumber":"3462510","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Exeter","state":null,"postalCode":"2822","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Mexichem Specialty Compounds","nameUpper":"MEXICHEM SPECIALTY COMPOUNDS","contact":{"salutation":null,"firstName":"Michael","lastName":"Funderburg","initial":null,"emailAddress":"mfunderburg@alphagary.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"PINEVILLE","state":"NC","postalCode":"28134","country":null,"county":"MECKLENBURG","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-27T00:00:00Z","dueDays":-150,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"343393456","support":"Basic","options":[{"id":"U100000003729","agreementNumber":"343393456","quoteID":"343393456-R:28JUN22 13:51:22","contractDuration":"1 Year 4 Months 1 Day","support":"Basic","total":117.31,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":true},{"id":"U100000003730","agreementNumber":"343393456","quoteID":"343393456-R:28JUN22 13:51:50","contractDuration":"3 Years 4 Months 2 Days","support":"Basic","total":220.47,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":false},{"id":"U100000003731","agreementNumber":"343393456","quoteID":"343393456-R:29JUN22 12:52:27","contractDuration":"1 Year 9 Months 3 Days","support":"Basic","total":144.11,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":false}],"renewal":{"total":117.31,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"343393456-R:28JUN22 13:51:22","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000008245"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Insight Direct","vendorAccountNumber":"2710633","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Uxbridge","state":null,"postalCode":"UB8 1JG","country":"United Kingdom","county":null,"countryCode":"GB"}},"endUser":{"id":null,"name":"Bloomberg Finance L.P","nameUpper":"BLOOMBERG FINANCE L.P","contact":{"salutation":null,"firstName":"william","lastName":"stevens","initial":null,"emailAddress":"wstevens11@bloomberg.net","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"LONDON","state":"0","postalCode":"E16 4ES","country":null,"county":null,"countryCode":"GB"}},"shipTo":null,"published":"2022-07-21T07:47:22.584Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-03-23T00:00:00Z","dueDays":-126,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"4121252753","support":"Production","options":[],"renewal":{"total":169.30,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"4121252753-R:03JUL22 21:36:59","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:22.584Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003735"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Computer Resources of America","vendorAccountNumber":"2717901","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":null,"postalCode":"10036","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Ruchelman P.l.l.c","nameUpper":"RUCHELMAN P.L.L.C","contact":{"salutation":null,"firstName":"Francesca","lastName":"York","initial":null,"emailAddress":"crany@ruchelaw.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":"NY","postalCode":"10155-0002","country":null,"county":"NEW YORK","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-04-16T00:00:00Z","dueDays":-102,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"344068841","support":"Basic","options":[],"renewal":{"total":62.93,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"344068841-R:30JUN22 12:51:58","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003580"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Insight Enterprises","vendorAccountNumber":"2709987","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"TEMPE","state":null,"postalCode":"85283-4318","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Bloomberg LP","nameUpper":"BLOOMBERG LP","contact":{"salutation":null,"firstName":"Steve","lastName":"Fenster","initial":null,"emailAddress":"SFENSTER@BLOOMBERG.NET","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"NEW YORK","state":"NY","postalCode":"10022","country":null,"county":"NEW YORK","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-04-20T00:00:00Z","dueDays":-98,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"384501795","support":"Production","options":[],"renewal":{"total":209.48,"currency":"USD","save":0.0,"expiryDate":"2022-07-30T00:00:00Z"},"resellerPO":"384501795-R:30JUN22 20:58:47","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000004643"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Zones","vendorAccountNumber":"5214","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"AUBURN","state":null,"postalCode":"98001-6524","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Waianae Coast Comprehensive Health Center","nameUpper":"WAIANAE COAST COMPREHENSIVE HEALTH CENTER","contact":{"salutation":null,"firstName":"JOHN","lastName":"WILLIAMS","initial":null,"emailAddress":"jwilliams@wcchc.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"WAIANAE","state":"HI","postalCode":"96792-3128","country":null,"county":"HONOLULU","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:19.051Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-05-14T00:00:00Z","dueDays":-74,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"30231894","support":"Mixed","options":[{"id":"U100000004906","agreementNumber":"30231894","quoteID":"30231894-R:22JUN22 04:30:24","contractDuration":"1 Year 5 Months 24 Days","support":"Mixed","total":34242.07,"currency":"USD","save":0.0,"expiryDate":"2022-07-22T00:00:00Z","quoteCurrent":false},{"id":"U100000004642","agreementNumber":"30231894","quoteID":"30231894-R:22JUN22 11:38:48","contractDuration":"1 Year 5 Months 24 Days","support":"Mixed","total":33292.50,"currency":"USD","save":0.0,"expiryDate":"2022-07-23T00:00:00Z","quoteCurrent":false},{"id":"U100000004643","agreementNumber":"30231894","quoteID":"30231894-R:24JUN22 01:58:33","contractDuration":"1 Year  7 Days","support":"Mixed","total":25866.75,"currency":"USD","save":0.0,"expiryDate":"2022-07-24T00:00:00Z","quoteCurrent":true}],"renewal":{"total":25866.75,"currency":"USD","save":0.0,"expiryDate":"2022-07-24T00:00:00Z"},"resellerPO":"30231894-R:24JUN22 01:58:33","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:19.051Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000004376"},"canPlaceOrder":true,"reseller":{"vendorAccountName":null,"vendorAccountNumber":null,"id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":null,"state":null,"postalCode":null,"country":null,"county":null,"countryCode":null}},"endUser":{"id":null,"name":"STONE WARD","nameUpper":"STONE WARD","contact":{"salutation":null,"firstName":"John","lastName":"Rogers","initial":null,"emailAddress":"jrogers@stoneward.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"LITTLE ROCK","state":"AR","postalCode":"72201","country":null,"county":"PULASKI","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:19.051Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-05-21T00:00:00Z","dueDays":-67,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"345372664","support":"Basic","options":[{"id":"U100000004376","agreementNumber":"345372664","quoteID":"345372664-R:27JUN22 08:52:08","contractDuration":"1 Year 1 Month 6 Days","support":"Basic","total":97.04,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":true},{"id":"U100000004367","agreementNumber":"345372664","quoteID":"345372664-R:27JUN22 08:52:35","contractDuration":"3 Years 1 Month 7 Days","support":"Basic","total":200.21,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":false}],"renewal":{"total":97.04,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"345372664-R:27JUN22 08:52:08","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:19.051Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000008173"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"World Wide Technology Inc","vendorAccountNumber":"2715741","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Saint Louis","state":null,"postalCode":"63146","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Cisco Systems","nameUpper":"CISCO SYSTEMS","contact":{"salutation":null,"firstName":"Alex","lastName":"Fitzpatrick","initial":null,"emailAddress":"ALEXFITZ@CISCO.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"SAN JOSE","state":"CA","postalCode":"95134-1405","country":null,"county":"SANTA CLARA","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:22.584Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-05-27T00:00:00Z","dueDays":-61,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"386057412","support":"Production","options":[{"id":"U100000008173","agreementNumber":"386057412","quoteID":"386057412-R:04JUL22 04:15:06","contractDuration":"1 Year 1 Month 7 Days","support":"Production","total":38450.90,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":true},{"id":"U100000008174","agreementNumber":"386057412","quoteID":"386057412-R:04JUL22 04:32:05","contractDuration":"3 Years 1 Month 8 Days","support":"Production","total":79955.98,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":false}],"renewal":{"total":38450.90,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"386057412-R:04JUL22 04:15:06","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:22.584Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000004087"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Cornerstone Information Systems","vendorAccountNumber":"3723834","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Hopkinsville","state":null,"postalCode":"42240-2112","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Duck River EMC","nameUpper":"DUCK RIVER EMC","contact":{"salutation":null,"firstName":"BJ","lastName":"Bernard","initial":null,"emailAddress":"BBERNARD@DREMC.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"SHELBYVILLE","state":"TN","postalCode":"37160-3629","country":null,"county":"BEDFORD","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:19.051Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-05-29T00:00:00Z","dueDays":-59,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"30748911","support":"Basic","options":[{"id":"U100000004087","agreementNumber":"30748911","quoteID":"30748911-R:27JUN22 22:09:34","contractDuration":"1 Year  29 Days","support":"Basic","total":11276.36,"currency":"USD","save":0.0,"expiryDate":"2022-07-27T00:00:00Z","quoteCurrent":true},{"id":"U100000004088","agreementNumber":"30748911","quoteID":"30748911-R:27JUN22 22:16:25","contractDuration":"3 Years  30 Day","support":"Basic","total":23508.16,"currency":"USD","save":0.0,"expiryDate":"2022-07-27T00:00:00Z","quoteCurrent":false}],"renewal":{"total":11276.36,"currency":"USD","save":0.0,"expiryDate":"2022-07-27T00:00:00Z"},"resellerPO":"30748911-R:27JUN22 22:09:34","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:19.051Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000005424"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Insight Enterprises","vendorAccountNumber":"2709987","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"TEMPE","state":null,"postalCode":"85283-4318","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"REYNOLDS SMITH & HILLS","nameUpper":"REYNOLDS SMITH & HILLS","contact":{"salutation":null,"firstName":"DANIEL","lastName":"SCHOENING","initial":null,"emailAddress":"DANIEL.SCHOENING@RSANDH.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"JACKSONVILLE","state":"FL","postalCode":"32256","country":null,"county":"DUVAL","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:18.838Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-06-01T00:00:00Z","dueDays":-56,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"386236632","support":"Production","options":[{"id":"U100000005424","agreementNumber":"386236632","quoteID":"386236632-R:18JUN22 08:40:55","contractDuration":"1 Year 4 Months 15 Days","support":"Production","total":1948.18,"currency":"USD","save":0.0,"expiryDate":"2022-10-14T00:00:00Z","quoteCurrent":true},{"id":"U100000005425","agreementNumber":"386236632","quoteID":"386236632-R:18JUN22 08:41:19","contractDuration":"3 Years 4 Months 16 Days","support":"Production","total":3691.62,"currency":"USD","save":0.0,"expiryDate":"2022-10-14T00:00:00Z","quoteCurrent":false}],"renewal":{"total":1948.18,"currency":"USD","save":0.0,"expiryDate":"2022-10-14T00:00:00Z"},"resellerPO":"386236632-R:18JUN22 08:40:55","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:18.838Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003700"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"IS Consulting Services LLC","vendorAccountNumber":"14021837","id":"38004069","name":"IS CONSULTING SVCS, LLC","nameUpper":"IS CONSULTING SVCS, LLC","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":"3127559100","role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Chicago","state":"IL","postalCode":"60604","country":"US","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Novuslaw","nameUpper":"NOVUSLAW","contact":{"salutation":null,"firstName":"JIM","lastName":"BYRON","initial":null,"emailAddress":"bniles@novuslaw.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Chicago","state":"IL","postalCode":"60631-3564","country":null,"county":"DUPAGE","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-06-17T00:00:00Z","dueDays":-40,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"31422703","support":"Basic","options":[{"id":"U100000003700","agreementNumber":"31422703","quoteID":"31422703-R:29JUN22 08:37:06","contractDuration":"1 Year  12 Days","support":"Basic","total":9306.58,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":true},{"id":"U100000003789","agreementNumber":"31422703","quoteID":"31422703-R:29JUN22 08:37:35","contractDuration":"3 Years  13 Days","support":"Basic","total":19857.04,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":false}],"renewal":{"total":9306.58,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"31422703-R:29JUN22 08:37:06","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003805"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Dataworks Consulting","vendorAccountNumber":"4631754","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Newcastle","state":null,"postalCode":"98056-1412","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"First Sound Bank","nameUpper":"FIRST SOUND BANK","contact":{"salutation":null,"firstName":"BRAD","lastName":"DETRICK","initial":null,"emailAddress":"BDETRICK@FIRSTSOUNDBANK.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"SEATTLE","state":"WA","postalCode":"98104-0000","country":null,"county":"KING","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-06-18T00:00:00Z","dueDays":-39,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"346430054","support":"Production","options":[],"renewal":{"total":1562.73,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"346430054-R:28JUN22 14:08:22","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000004123"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Trusted Tech Team","vendorAccountNumber":"20489354","id":"38080504","name":"Trusted Tech Team","nameUpper":"TRUSTED TECH TEAM","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":"714-949-0587","role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Irvine","state":"CA","postalCode":"92612-1484","country":"US","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"St. Clair Shores Ob/Gyn","nameUpper":"ST. CLAIR SHORES OB/GYN","contact":{"salutation":null,"firstName":"Aspa","lastName":"Raphtis","initial":null,"emailAddress":"araphtis@gmail.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Saint Clair Shores","state":"MI","postalCode":"48080-1064","country":null,"county":"MACOMB","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:19.051Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-06-19T00:00:00Z","dueDays":-38,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"360078484","support":"Basic","options":[{"id":"U100000004123","agreementNumber":"360078484","quoteID":"360078484-R:28JUN22 09:36:30","contractDuration":"1 Year  9 Days","support":"Basic","total":90.37,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":true},{"id":"U100000004124","agreementNumber":"360078484","quoteID":"360078484-R:28JUN22 09:36:54","contractDuration":"3 Years  10 Day","support":"Basic","total":193.64,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z","quoteCurrent":false}],"renewal":{"total":90.37,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"360078484-R:28JUN22 09:36:30","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:19.051Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003745"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Trusted Tech Team","vendorAccountNumber":"20489354","id":"38080504","name":"Trusted Tech Team","nameUpper":"TRUSTED TECH TEAM","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":"714-949-0587","role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Irvine","state":"CA","postalCode":"92612-1484","country":"US","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"St. Clair Shores Ob/Gyn","nameUpper":"ST. CLAIR SHORES OB/GYN","contact":{"salutation":null,"firstName":"Aspa","lastName":"Raphtis","initial":null,"emailAddress":"araphtis@gmail.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Saint Clair Shores","state":"MI","postalCode":"48080-1064","country":null,"county":"MACOMB","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":null,"dueDate":"2022-06-19T00:00:00Z","dueDays":-38,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"360078484","support":"Basic","options":[],"renewal":{"total":90.37,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"360078484-R:28JUN22 12:51:22","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003928"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Zones","vendorAccountNumber":"5214","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"AUBURN","state":null,"postalCode":"98001-6524","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Cisco Systems","nameUpper":"CISCO SYSTEMS","contact":{"salutation":null,"firstName":"Alex","lastName":"Fitzpatrick","initial":null,"emailAddress":"ALEXFITZ@CISCO.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"CORDOVA","state":"TN","postalCode":"38018","country":null,"county":"SHELBY","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-06-19T00:00:00Z","dueDays":-38,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"386882191","support":"Production","options":[{"id":"U100000003928","agreementNumber":"386882191","quoteID":"386882191-R:28JUN22 20:58:19","contractDuration":"1 Year 1 Month 16 Days","support":"Production","total":4203.84,"currency":"USD","save":0.0,"expiryDate":"2022-07-28T00:00:00Z","quoteCurrent":true},{"id":"U100000003929","agreementNumber":"386882191","quoteID":"386882191-R:28JUN22 21:05:51","contractDuration":"3 Years 1 Month 17 Days","support":"Production","total":10339.64,"currency":"USD","save":0.0,"expiryDate":"2022-07-28T00:00:00Z","quoteCurrent":false}],"renewal":{"total":4203.84,"currency":"USD","save":0.0,"expiryDate":"2022-07-28T00:00:00Z"},"resellerPO":"386882191-R:28JUN22 20:58:19","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003041"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Dell Technologies United States","vendorAccountNumber":"2752413","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Round Rock","state":null,"postalCode":"78664","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"Ecfmg","nameUpper":"ECFMG","contact":{"salutation":null,"firstName":"Tyrone","lastName":"McCloud","initial":null,"emailAddress":"TMCCLOUD@ECFMG.ORG","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Philadelphia","state":"PA","postalCode":"19104-2614","country":null,"county":"PHILADELPHIA","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":null,"dueDate":"2022-06-22T00:00:00Z","dueDays":-35,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"343408094","support":"Production","options":[],"renewal":{"total":100259.86,"currency":"USD","save":0.0,"expiryDate":"2022-07-24T00:00:00Z"},"resellerPO":"343408094-R:24JUN22 13:22:35","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000004386"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Mainmicro Technologies Corporation","vendorAccountNumber":"17099481","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":null,"postalCode":"10001","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"YAI National Institute For Disabilities","nameUpper":"YAI NATIONAL INSTITUTE FOR DISABILITIES","contact":{"salutation":null,"firstName":"Richard","lastName":"Leite","initial":null,"emailAddress":"richard.leite@yai.org","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":"NY","postalCode":"10017-5832","country":null,"county":"NEW YORK","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:19.051Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-06-23T00:00:00Z","dueDays":-34,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"360228078","support":"Production","options":[],"renewal":{"total":11620.63,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"360228078-R:27JUN22 07:52:16","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:19.051Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003811"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Mainmicro Technologies Corporation","vendorAccountNumber":"17099481","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":null,"postalCode":"10001","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"YAI National Institute For Disabilities","nameUpper":"YAI NATIONAL INSTITUTE FOR DISABILITIES","contact":{"salutation":null,"firstName":"Richard","lastName":"Leite","initial":null,"emailAddress":"richard.leite@yai.org","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":"NY","postalCode":"10017-5832","country":null,"county":"NEW YORK","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":null,"dueDate":"2022-06-23T00:00:00Z","dueDays":-34,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"360228078","support":"Production","options":[],"renewal":{"total":25111.78,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"360228078-R:28JUN22 14:25:03","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000003810"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Mainmicro Technologies Corporation","vendorAccountNumber":"17099481","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":null,"postalCode":"10001","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"YAI National Institute For Disabilities","nameUpper":"YAI NATIONAL INSTITUTE FOR DISABILITIES","contact":{"salutation":null,"firstName":"Richard","lastName":"Leite","initial":null,"emailAddress":"richard.leite@yai.org","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":"NY","postalCode":"10017-5832","country":null,"county":"NEW YORK","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:17.445Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":null,"dueDate":"2022-06-23T00:00:00Z","dueDays":-34,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"360228078","support":"Production","options":[],"renewal":{"total":11652.21,"currency":"USD","save":0.0,"expiryDate":"2022-07-29T00:00:00Z"},"resellerPO":"360228078-R:28JUN22 14:24:37","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:17.445Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000006211"},"canPlaceOrder":true,"reseller":{"vendorAccountName":"Zones","vendorAccountNumber":"5214","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"AUBURN","state":null,"postalCode":"98001-6524","country":"United States","county":null,"countryCode":"US"}},"endUser":{"id":null,"name":"UNISYS CORPORATION","nameUpper":"UNISYS CORPORATION","contact":{"salutation":null,"firstName":"RASHMI","lastName":"KUNDAPUR","initial":null,"emailAddress":"rashmi.kundapur@in.unisys.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Saint Paul","state":"MN","postalCode":"55121-1328","country":null,"county":"RAMSEY","countryCode":"US"}},"shipTo":null,"published":"2022-07-21T07:47:20.85Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-06-24T00:00:00Z","dueDays":-33,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMware","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"387058074","support":"Production","options":[{"id":"U100000006211","agreementNumber":"387058074","quoteID":"387058074-R:13JUN22 08:51:40","contractDuration":"1 Year 1 Month 15 Days","support":"Production","total":118.82,"currency":"USD","save":0.0,"expiryDate":"2022-07-24T00:00:00Z","quoteCurrent":true},{"id":"U100000006212","agreementNumber":"387058074","quoteID":"387058074-R:13JUN22 08:53:20","contractDuration":"1 Year 1 Month 15 Days","support":"Production","total":99.91,"currency":"USD","save":0.0,"expiryDate":"2022-06-24T00:00:00Z","quoteCurrent":false}],"renewal":{"total":118.82,"currency":"USD","save":0.0,"expiryDate":"2022-07-24T00:00:00Z"},"resellerPO":"387058074-R:13JUN22 08:51:40","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-07-21T07:43:15.162Z","updated":"2022-07-21T07:47:20.85Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0}],"refinementGroups":{"group":"RenewalAttributes","refinements":[{"id":null,"name":"Vendors and programs","options":[{"id":null,"text":"Veeam","searchKey":"VendorName","selected":null,"subOptions":[{"id":null,"text":"Pro Partner Program","searchKey":"ProgramName","selected":null}]},{"id":null,"text":"VMware","searchKey":"VendorName","selected":null,"subOptions":[{"id":null,"text":"Standard","searchKey":"ProgramName","selected":null}]}]},{"id":null,"name":"End user type","searchKey":"EndUserType","options":[{"id":null,"text":"Academic","selected":null,"subOptions":null},{"id":null,"text":"Commercial","selected":null,"subOptions":null}]},{"id":null,"name":"Renewal type","searchKey":"Type","options":[{"id":null,"text":"Renewal","selected":null,"subOptions":null}]}]}},"error":{"code":0,"messages":[],"isError":false}}
  // const response = [];
  const query = req.query;
  const formatValue = (name) => name.replace(/\s/g, "").toLowerCase();
  let responseItemList = response.content?.items;
  // if (query.VendorQuoteID){
  //   return res.status(500).json();
  // }
  // if (query.SortBy.toLowerCase() === 'duedays'){
  //   return res.status(204).json();
  // }
  if (query.ContractID)
    responseItemList = responseItemList.filter(({ agreementNumber }) =>
      formatValue(query.ContractID) === formatValue(agreementNumber)
    );
  if (query.endUserType)
    responseItemList = responseItemList.filter(({ endUser }) =>
      query.endUserType.includes(formatValue(endUser.name))
    );

  // sortRenewalObjects(responseItemList, query);

  var pageNumber = (query.PageNumber - 1) * query.PageSize;
  var pageSize = +pageNumber + +query.PageSize;
  // response.content.items = responseItemList && responseItemList.length > 0 ? responseItemList.slice(pageNumber, pageSize) : [];

  var pageNumber = (query.PageNumber - 1) * query.PageSize;
  var pageSize = +pageNumber + +query.PageSize
  // response.content.items = responseItemList.slice(pageNumber, pageSize);
  if (query.PageNumber){
    console.log("🚀 ~ file: app.js ~ line 3529 ~ query.PageNumber", query.PageNumber)
    response.content.pageNumber = parseInt(query.PageNumber)
  }
  res.json(response);
});

function sortRenewalObjects(objArray, query) {
  query.SortBy = Array.isArray(query.SortBy) ? query.SortBy : query.SortBy.split('&');
  query.SortBy = query.SortBy.map(prop => {
    var columnDef = prop.trim().split(':');
    if ((columnDef.length === 1) || (columnDef.length === 2 && columnDef[1].toLowerCase() === 'asc')) {
      columnDef = [columnDef, "asc"];
    } else {
      columnDef = [columnDef, "desc"];
    }

    if (columnDef[1] === "desc") {
      columnDef[1] = -1;
    } else {
      columnDef[1] = 1;
    }
    return columnDef;
  });

  function valueCmp(x, y) {
    return x > y ? 1 : x < y ? -1 : 0;
  }

  function arrayCmp(a, b) {
    var arr1 = [],
      arr2 = [];
    query.SortBy.forEach(function (prop) {   
      switch (prop[0][0].toLowerCase()) {
        case 'id':
          prop[0] = 'source.id';
          break;
        case 'type':
          prop[0] = prop[0] = 'source';
          break;
        case 'vendor':
          prop[0] = 'vendor.name';
          break;
        case 'name':
          prop[0] = 'nameUpper';
          break;
        case 'enduser':
          prop[0] = 'endUser.nameUpper';
          break;
        case 'resellername':
          prop[0] = 'reseller.nameUpper';
          break;
        case 'totallistprice':
          prop[0] = 'totalListPrice';
          break;
        case 'total':
          prop[0] = 'renewal.total';
          break;
        case 'programname':
          prop[0] = 'programName';
          break;
        case 'renewedduration':
          prop[0] = 'renewDuration';
          break;
        case 'duedate':
          prop[0] = 'dueDate';
          break;
        case 'duedays':
          prop[0] = 'dueDate';
          break;
        case 'support':
          prop[0] = 'items.contract.supportLevel';
          break;
        case 'agreementnumber':
          prop[0] = 'items.contract.id';
          break;
        default:
          break;
      }
      
      var aValue = field(a, prop),
          bValue = field(b, prop);
      arr1.push(prop[1] * valueCmp(aValue, bValue));
      arr2.push(prop[1] * valueCmp(bValue, aValue));
    });
    return arr1 < arr2 ? -1 : 1;
  }

  function field(arr, prop) {
    const col = prop[0].toString().split(".");
    if (!col[1]) {
      return arr ? arr[prop[0]] : 0;
    }
    return field(
      arr[prop[0].toString().split(".").splice(0, 1)],
      prop[0].toString().split(".").splice(1)
    );
  }

  return objArray && objArray.length > 0 ? objArray.sort(function (a, b) {
    return arrayCmp(a, b);
  }) : [];
}

//---QUOTE PREVIEW MOCK API---//
app.get("/ui-commerce/v1/quote/preview", function (req, res) {
  if(!validateSession(req, res)) return;
  const { id, configurationType, vendor } = req.query;

  if (!configurationType) {
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
      quotePreview: {
        quoteDetails: {
          isExclusive: configurationType === "Estimate" && vendor === 'CISCO' ? false : true,
          shipTo: null,
          buyMethod: "sap46",
          endUser: [null
            //{
            //  id: null,
            //  companyName: "MyEndUser Co",
            //  name: "Joe ",
            //  line1: "2 BANK OF AMERICA PLZ",
            //  line2: "BANK OF OMNI",
            //  line3: null,
            //  city: "CHARLOTTE",
            //  state: "NC",
            //  zip: null,
            //  postalCode: "28280",
            //  country: "US",
            //  email: null,
            //  contactEmail: null,
            //  phoneNumber: null,
            //},
          ],
          reseller: [{
            id: "38048612",
            companyName: null,
            name: null,
            line1: null,
            line2: null,
            line3: null,
            city: null,
            state: null,
            zip: null,
            postalCode: null,
            country: null,
            email: null,
            contactEmail: null,
            phoneNumber: null
          }],
          configID: "WC121011624NR",
          source: {
            type: configurationType,
            value: "QJ128146301OP",
          },
          notes: null,
          "items": [{
            "id": "1.0",
            "setupReuired": false,
            "attachmentRequired": false,
            "parent": null,
            "vendorPartNo": "LIC-ENT-1YR",
            "manufacturer": "CISCO",
            "description": "Meraki MR Enterprise License, 1YR",
            "quantity": 1,
            "unitPrice": null,
            "unitPriceFormatted": "",
            "totalPrice": null,
            "totalPriceFormatted": "",
            "msrp": null,
            "invoice": null,
            "shipDates": null,
            "invoices": null,
            "trackings": null,
            "discounts": [],
            "contract": null,
            "shortDescription": "Cisco Meraki Enterprise Cloud Controller - subscription license (1 year) - 1 access point",
            "mfrNumber": "LIC-ENT-1YR",
            "tdNumber": "11430038",
            "upcNumber": null,
            "unitPriceCurrency": null,
            "unitCost": 0.0,
            "unitCostCurrency": null,
            "unitListPrice": 161.06,
            "unitListPriceCurrency": null,
            "extendedListPrice": 0.0,
            "unitListPriceFormatted": "161.06",
            "extendedPrice": "161.06",
            "extendedPriceFormatted": "161.06",
            "availability": null,
            "rebateValue": null,
            "urlProductImage": "http://cdn.cnetcontent.com/5a/70/5a7063ab-3ef6-4162-985a-a7e03643476a.jpg",
            "urlProductSpecs": null,
            "children": [{
              "id": "1.1",
              "setupReuired": false,
              "attachmentRequired": false,
              "parent": "1.0",
              "vendorPartNo": "C9200L-NW-1A-24",
              "manufacturer": "CISCO",
              "description": "C9200L Network Advantage, 24-port license, 1yr offer",
              "quantity": 14,
              "unitPrice": null,
              "unitPriceFormatted": "",
              "totalPrice": null,
              "totalPriceFormatted": "",
              "msrp": null,
              "invoice": null,
              "shipDates": null,
              "invoices": null,
              "trackings": null,
              "discounts": [],
              "contract": {
                "id": null,
                "status": null,
                "duration": null,
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
              "shortDescription": "Cisco Network Advantage - Term License (1 year) - 24 ports",
              "mfrNumber": "C9200L-NW-1A-24",
              "tdNumber": "13754850",
              "upcNumber": null,
              "unitPriceCurrency": null,
              "unitCost": 0.0,
              "unitCostCurrency": null,
              "unitListPrice": 1010.83,
              "unitListPriceCurrency": null,
              "extendedListPrice": 0.0,
              "unitListPriceFormatted": "1,010.83",
              "extendedPrice": "14151.62",
              "extendedPriceFormatted": "14151.62",
              "availability": null,
              "rebateValue": null,
              "urlProductImage": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg",
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
              "images": {},
              "logos": {
                "200x150": [{
                  "id": "e7ea6e83-4b75-4b7f-b385-6a497622323f",
                  "url": "http://cdn.cnetcontent.com/e7/ea/e7ea6e83-4b75-4b7f-b385-6a497622323f.jpg"
                }],
                "400x300": [{
                  "id": "d2de6a78-ca77-4d75-8508-02326319f617",
                  "url": "http://cdn.cnetcontent.com/d2/de/d2de6a78-ca77-4d75-8508-02326319f617.jpg"
                }],
                "75x75": [{
                  "id": "c50819db-6344-452e-a701-da44b7795b61",
                  "url": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg"
                }]
              },
              "displayName": "Cisco Network Advantage - Term License (1 year) - 24 ports",
              "authorization": {
                "canOrder": false,
                "canViewPrice": false,
                "customerCanView": false
              }
            }, {
              "id": "1.2",
              "setupReuired": true,
              "attachmentRequired": false,
              "parent": "1.0",
              "vendorPartNo": "CAB-TA-NA",
              "manufacturer": "CISCO",
              "description": "North America AC Type A Power Cable",
              "quantity": 14,
              "unitPrice": null,
              "unitPriceFormatted": "",
              "totalPrice": null,
              "totalPriceFormatted": "",
              "msrp": null,
              "invoice": null,
              "shipDates": null,
              "invoices": null,
              "trackings": null,
              "discounts": [],
              "contract": {
                "id": null,
                "status": null,
                "duration": null,
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
              "mfrNumber": "CAB-TA-NA",
              "tdNumber": "11232867",
              "upcNumber": null,
              "unitPriceCurrency": null,
              "unitCost": 0.0,
              "unitCostCurrency": null,
              "unitListPrice": 20.0,
              "unitListPriceCurrency": null,
              "extendedListPrice": 0.0,
              "unitListPriceFormatted": "20.00",
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
              "images": {},
              "logos": {
                "200x150": [{
                  "id": "e7ea6e83-4b75-4b7f-b385-6a497622323f",
                  "url": "http://cdn.cnetcontent.com/e7/ea/e7ea6e83-4b75-4b7f-b385-6a497622323f.jpg"
                }],
                "400x300": [{
                  "id": "d2de6a78-ca77-4d75-8508-02326319f617",
                  "url": "http://cdn.cnetcontent.com/d2/de/d2de6a78-ca77-4d75-8508-02326319f617.jpg"
                }],
                "75x75": [{
                  "id": "c50819db-6344-452e-a701-da44b7795b61",
                  "url": "http://cdn.cnetcontent.com/c5/08/c50819db-6344-452e-a701-da44b7795b61.jpg"
                }]
              },
              "displayName": "Cisco power cable - 8 ft",
              "authorization": {
                "canOrder": false,
                "canViewPrice": false,
                "customerCanView": false
              }
            }],
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
              "200x150": [{
                "id": "9dad9442-68ee-41b0-9240-01b665f6b214",
                "url": "http://cdn.cnetcontent.com/9d/ad/9dad9442-68ee-41b0-9240-01b665f6b214.jpg",
                "type": "Licensing logo",
                "angle": "Front"
              }],
              "75x75": [{
                "id": "5a7063ab-3ef6-4162-985a-a7e03643476a",
                "url": "http://cdn.cnetcontent.com/5a/70/5a7063ab-3ef6-4162-985a-a7e03643476a.jpg",
                "type": "Licensing logo",
                "angle": "Front"
              }],
              "400x300": [{
                "id": "4d3c7b64-f7ec-4f93-8e52-cab0c1d22786",
                "url": "http://cdn.cnetcontent.com/4d/3c/4d3c7b64-f7ec-4f93-8e52-cab0c1d22786.jpg",
                "type": "Licensing logo",
                "angle": "Front"
              }]
            },
            "logos": {
              "200x150": [{
                "id": "ea28c96a-9d0a-44d9-a6de-965d609bcbb6",
                "url": "http://cdn.cnetcontent.com/ea/28/ea28c96a-9d0a-44d9-a6de-965d609bcbb6.jpg"
              }],
              "400x300": [{
                "id": "a48ef3a7-de25-414e-9846-72edc96610d5",
                "url": "http://cdn.cnetcontent.com/a4/8e/a48ef3a7-de25-414e-9846-72edc96610d5.jpg"
              }],
              "75x75": [{
                "id": "cf5a8105-0f58-434c-a25d-bc6db71899c3",
                "url": "http://cdn.cnetcontent.com/cf/5a/cf5a8105-0f58-434c-a25d-bc6db71899c3.jpg"
              }]
            },
            "displayName": "Cisco Meraki Enterprise Cloud Controller - subscription license (1 year) - 1 access point",
            "authorization": {
              "canOrder": false,
              "canViewPrice": false,
              "customerCanView": false
            }
          }, {
            "id": "2.0",
            "parent": null,
            "vendorPartNo": "LIC-MS225-48FP-1YR",
            "manufacturer": "CISCO",
            "description": "Meraki MS225-48FP Enterprise License and Support, 1YR",
            "quantity": 1,
            "unitPrice": null,
            "unitPriceFormatted": "",
            "totalPrice": null,
            "totalPriceFormatted": "",
            "msrp": null,
            "invoice": null,
            "shipDates": null,
            "invoices": null,
            "trackings": null,
            "discounts": [],
            "contract": null,
            "setupReuired": false,
            "attachmentRequired": false,
            "shortDescription": "Cisco Meraki Enterprise - subscription license (1 year) + 1 Year Enterprise Support - 1 switch",
            "mfrNumber": "LIC-MS225-48FP-1YR",
            "tdNumber": "12375820",
            "upcNumber": null,
            "unitPriceCurrency": null,
            "unitCost": 0.0,
            "unitCostCurrency": null,
            "unitListPrice": 499.29,
            "unitListPriceCurrency": null,
            "extendedListPrice": 0.0,
            "unitListPriceFormatted": "499.29",
            "extendedPrice": "499.29",
            "extendedPriceFormatted": "499.29",
            "availability": null,
            "rebateValue": null,
            "urlProductImage": "http://cdn.cnetcontent.com/06/58/0658e36e-b49f-490e-a331-0165ab197e41.jpg",
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
              "75x75": [{
                "id": "0658e36e-b49f-490e-a331-0165ab197e41",
                "url": "http://cdn.cnetcontent.com/06/58/0658e36e-b49f-490e-a331-0165ab197e41.jpg",
                "type": "Licensing logo",
                "angle": "Front"
              }],
              "400x300": [{
                "id": "bb5f4cc3-b0bd-4519-86b7-1c9244c91b7a",
                "url": "http://cdn.cnetcontent.com/bb/5f/bb5f4cc3-b0bd-4519-86b7-1c9244c91b7a.jpg",
                "type": "Licensing logo",
                "angle": "Front"
              }],
              "200x150": [{
                "id": "b9a1f5bd-4e20-447c-b4c3-6b01fe7d55b1",
                "url": "http://cdn.cnetcontent.com/b9/a1/b9a1f5bd-4e20-447c-b4c3-6b01fe7d55b1.jpg",
                "type": "Licensing logo",
                "angle": "Front"
              }]
            },
            "logos": {
              "200x150": [{
                "id": "ea28c96a-9d0a-44d9-a6de-965d609bcbb6",
                "url": "http://cdn.cnetcontent.com/ea/28/ea28c96a-9d0a-44d9-a6de-965d609bcbb6.jpg"
              }],
              "400x300": [{
                "id": "a48ef3a7-de25-414e-9846-72edc96610d5",
                "url": "http://cdn.cnetcontent.com/a4/8e/a48ef3a7-de25-414e-9846-72edc96610d5.jpg"
              }],
              "75x75": [{
                "id": "cf5a8105-0f58-434c-a25d-bc6db71899c3",
                "url": "http://cdn.cnetcontent.com/cf/5a/cf5a8105-0f58-434c-a25d-bc6db71899c3.jpg"
              }]
            },
            "displayName": "Cisco Meraki Enterprise - subscription license (1 year) + 1 Year Enterprise Support - 1 switch",
            "authorization": {
              "canOrder": false,
              "canViewPrice": false,
              "customerCanView": false
            }
          }],
          id: null,
          orders: null,
          customerPO: null,
          endUserPO: null,
          poDate: null,
          quoteReference: null,
          spaId: null,
          currency: "USD",
          currencySymbol: "$",
          subTotal: 96957.48,
          subTotalFormatted: "96,957.48",
          tier: configurationType === "Estimate" ? null : 'Commercial',
          configurationId: "QJ128146301OP",
          description: "Deal ID 52296358",
          vendor: vendor || "CISCO",
          distiBuyMethod: vendor ==='CISCO' ?
                            configurationType === "Estimate" ? 'AVT Technology Solutions LLC' : 'TECH DATA' 
                          : '',
          customerBuyMethod: 'TDANDAVT'
        },
      },
    },
    error: {
      code: 0,
      messages: [],
      isError: false,
    },
  };
  setTimeout(() => {
    res.json(response);
    // res.json(utils.getQuotePreviewResponse())
  }, 2000);
});

//Replace cart id//
app.put("/ui-content/v1/replaceCart", function (req, res) {
  if (!validateSession(req, res)) return res.status(401);

  return res.json({
    content: {
      isSuccess: false,
    },
    error: {
      code: 0,
      messages: [],
      isError: false,
    },
  });
});

//---QUICK QUOTE CONTINUE BTN---//
app.post("/ui-commerce/v1/quote/create", function (req, res) {
  if (!validateSession(req, res)) return;

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
  function getRandom(maxValue) {
    return Math.floor(Math.random() * maxValue);
  }
  const randonNum = getRandom(99999999);
  const quotePreviewURLocal = 'http://localhost:8080/quote-preview?id=' + randonNum + '&type=Estimate&vendor=CISCO';
  if (!validateSession(req, res)) return res.status(401);

  res.json({
    content: {
      url: "https://apps.cisco.com/eb2b/tnxshop/U2hcServlet?P1=081940553-4009d55f-17ba623a67f-c99417e13b6c4681f7d4d16d678eaa5e&P2=https%3A%2F%2Fapps.cisco.com%2Fccw%2Fcpc%2Fhome&P4=CREATE&P6=N",
      // url: quotePreviewURLocal,
    },
    error: {
      code: 0,
      messages: [],
      isError: false,
    },
  });
});

//---QUICK QUOTE CONTINUE BTN---//
app.post("/ui-commerce/v1/quote/createFrom", function (req, res) {
  console.log("post submit");
  console.log(req.body);

  if (!validateSession(req, res)) return res.status(401);

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
  if (!validateSession(req, res)) {
    return res.status(500).json({
      error: {
        code: 0,
        message: ["No SessionId"],
        isError: true,
      },
    });
  }
  const response = {
    content: {
      summary: {
        newOpportunities: getRandom(20),
        ordersBlocked: getRandom(20),
        expiringDeals: getRandom(20),
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
app.get("/ui-renewal/v1/Details", function (req, res) {
  const response = {
    content: {
      details: [
        {
          source: {
            salesOrg: "0100",
            targetSystem: "R3",
            key: "U100000000274",
            system: "RQ",
            type: null,
            id: "U100000000274",
          },
          published: "2022-03-14T13:52:52.921Z",
          reseller: {
            vendorAccountName: "The Network Support Co., LLC",
            vendorAccountNumber: "2927369",
            id: "38054253",
            name: "TECH DATA CORPORATION",
            nameUpper: "TECH DATA CORPORATION",
            contact: [{ name: " ", email: null, phone: null }],
            address: null,
          },
          endUser: {
            id: null,
            name: "Coastal Dealerships",
            nameUpper: "COASTAL DEALERSHIPS",
            contact: [
              {
                name: "Tom Norton",
                email: "ADMINISTRATOR@COASTALDEALERSHIPS.COM",
                phone: null,
              },
            ],
            address: {
              id: null,
              line1: "109 Accord Park Dr",
              line2: null,
              line3: null,
              city: "Norwell",
              state: null,
              postalCode: "02061-1605",
              country: null,
              county: "PLYMOUTH",
              countryCode: "US",
            },
          },
          shipTo: null,
          alternateIdentifier: null,
          vendorSalesRep: null,
          vendorSalesAssociate: null,
          items: [
            {
              id: "1.0",
              group: null,
              solution: null,
              parent: null,
              product: [
                {
                  type: "TECHDATA",
                  id: "11670274",
                  name: null,
                  manufacturer: null,
                  manufacturerId: null,
                  localManufacturer: null,
                  classification: null,
                  family: "VI6-VSPHERE - LARGER THAN LIFE FAMILY NAME",
                },
                {
                  type: "MANUFACTURER",
                  id: "VS6-ESSL-SUB-C",
                  name: "VMware Support and Subscription Production - Technical support - for VMware vSphere Enterprise Plus Edition (v. 7) - 1 processor - emergency phone consulting - 1 year - 24x7 - response time: 30 min",
                  manufacturer: "VMWARE",
                  manufacturerId: "21",
                  localManufacturer: null,
                  classification: null,
                  family: null,
                },
              ],
              quantity: 1.0,
              confirmedQuantity: 0.0,
              contractNumber: null,
              contractType: null,
              license: null,
              references: [],
              status: null,
              statusNotes: null,
              updated: "0001-01-01T00:00:00",
              unitPrice: 1562.93,
              unitCost: 0.0,
              totalPrice: 1562.93,
              unitListPrice: 0.0,
              unitPriceCurrency: "0",
              unitCostCurrency: null,
              unitListPriceCurrency: null,
              extendedListPrice: 0.0,
              requested: "0001-01-01T00:00:00",
              shippingCondition: null,
              shippingFrom: null,
              businessManager: null,
              divisionManager: null,
              director: null,
              rejectionCode: null,
              rejectionDescription: null,
              femAmount: 0.0,
              pomAmount: 0.0,
              samAmount: 0.0,
              nsmAmount: 0.0,
              femPercentage: 0.0,
              pomPercentage: 0.0,
              samPercentage: 0.0,
              nsmPercentage: 0.0,
              agreements: [],
              attributes: [],
              dealRegNumber: null,
              reinstatementFeeCost: null,
              reinstatementFeeSell: null,
              serialNumbers: ["12345", "6789"],
              instance: "175532113",
              discounts: [{ type: "Standard", value: "6.014" }],
              contract: {
                id: "350872811",
                duration: null,
                renewedDuration: "3 Years 4 Months ",
                startDate: "2020-10-16T00:00:00Z",
                endDate: "2021-10-16T00:00:00Z",
                newAgreementStartDate: "2021-10-17T00:00:00Z",
                newAgreementEndDate: null,
                newUsagePeriodStartDate: null,
                newUsagePeriodEndDate: null,
                supportLevel: null,
                serviceLevel: "Basic",
                usagePeriod: null,
              },
              tdNumber: null,
              mfrNumber: null,
              shortDescription: null,
              manufacturer: "",
              vendorPartNo: "",
            },
          ],
          attributes: [],
          programName: "Standard",
          quoteCurrent: true,
          firstAvailableOrderDate: "2022-03-14T00:00:00Z",
          lastOrderDate: "2022-03-20T00:00:00Z",
          statusText: null,
          amountSaved: 0.0,
          linkedRenewals: [],
          renewalGroupId: "null",
          dueDate: "2021-10-16T00:00:00Z",
          incumbent: null,
          totalReinstatementFeeCost: null,
          totalReinstatementFeeSell: null,
          endUserType: "Commercial",
          vendorLogo:
            "https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg",
          revision: 1.0,
          subRevision: 0.0,
          description: null,
          activeFlag: "Y",
          request: null,
          endUserPO: null,
          customerPO: "350872811-R:15FEB22 15:38:24",
          price: 1562.93,
          currency: "USD",
          documentType: null,
          quoteType: "Renewal",
          type: null,
          level: null,
          creator: null,
          created: "2022-03-14T13:52:52.921Z",
          updated: "2022-03-14T13:52:52.921Z",
          expiry: "2022-03-17T00:00:00Z",
          status: "Active",
          statusNotes: null,
          accountOwner: null,
          orders: [],
          vendorReference: [],
          salesTeam: null,
          salesArea: null,
          superSalesArea: null,
          lastUpdatedBy: null,
          femAmount: 0.0,
          pomAmount: 0.0,
          samAmount: 0.0,
          nsmAmount: 0.0,
          femPercentage: 0.0,
          pomPercentage: 0.0,
          samPercentage: 0.0,
          nsmPercentage: 0.0,
          canEditLines: true,
        },
      ],
    },
    error: { code: 0, messages: [], isError: false },
  };
  res.json(response);
});

app.get("/libs/cq/i18n/dictionary", function (req, res) {
  res.json(
    {
      "techdata.buttons.label.save": "Save",
      "techdata.buttons.label.cancel": "Cancel",
      "techdata.buttons.label.edit": "Edit",
      "techdata.quotes.placeholder.createfrom": "Create From",
      "techdata.quotes.placeholder.selectpricingtype": "Select pricing type",
      "techdata.grids.message.noRows": "So Lonely - No rows found From i18n",
      "techdata.grids.message.error.401": "It Wasn't Me - 401 From i18n",
      "techdata.grids.message.error.403": "Lie About Us - 403 From i18n",
      "techdata.grids.message.error.404": "Still haven't found what i'm looking for - 404 From i18n",
      "techdata.grids.message.error.408": "Yesterday - 408 From i18n",
      "techdata.grids.message.error.500": "Into the unknown - 500 From i18n",
      "techdata.quotes.message.uanError": "You have reached your qty limit on the below products. Please contact your Cisco Sales Rep for further assistance.",
    }
  );
});

app.get("/ui-account/v1/refreshData", function(req, res) {
  const response = {
    content: {
      refreshed: true
    },
    error: {
      code: 0,
      messages: [],
      isError: false
    }
  }
  res.json(response);
});

app.get("/ui-commerce/v1/quote/canConvertToOrder", function (req, res) {
  const success = {
    "content": {
      "canCheckout": true,
      "lineNumbers": []
    },
    "error": {
      "code": 0,
      "messages": [],
      "isError": false
    }
  };

  const fail = {
    "content": {
      "canCheckout": false,
      "lineNumbers": [
        "CON-PSRU-SMS-1",
        "DUO-MFA-FED"
      ]
    },
    "error": {
      "code": 0,
      "messages": [],
      "isError": false
    }
  };
  console.log(`Verifying UAN Qty for Quote #${req.query.id}`);
  req.query.s === "1" ? res.json(success) : res.json(fail);
});

app.put("/ui-renewal/v1/Update", function (req, res){
  const fail = {
    "content": {
      "salesContentEmail":"emailFromBackend@myvendormail.com"
    },
    "error": {
      "code": 400,
      "messages": [
        "Renewals Quote Update failed"
      ],
      "isError": true
    }
  };
  return res.status(200).json({});
} )

app.get("/ui-renewal/v1/getStatus/:id", function (req, res){
  const { id } = req.params;
  const success = {
    "content": {
      "sattus":"Active"
    },
    "error": {
      "code": 0,
      "messages": [],
      "isError": false
    }
  };
  return res.status(200).json({});
} )

app.get("/ui-renewal/v1/getStatus/:id", function (req, res){
  const { id } = req.params;
  const success = {
    "content": {
      "sattus":"Active"
    },
    "error": {
      "code": 0,
      "messages": [],
      "isError": false
    }
  };
  return res.status(200).json({});
} )


app.post("/ui-renewal/v1/order", function (req, res){
  const { id } = req.params;
  const success = {
    "content": {
      "confirmationNumber":"1234566"
    },
    "error": {
      "code": 0,
      "messages": [],
      "isError": false
    }
  };

  const fail = {
    "content": {
      "salesContentEmail":"emailFromBackend@myvendormail.com"
    },
    "error": {
      "code": 400,
      "messages": [
        "Renewals Quote Update failed"
      ],
      "isError": true
    }
  };
  return res.status(200).json(success);
} )