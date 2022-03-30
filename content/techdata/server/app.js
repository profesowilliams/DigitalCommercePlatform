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
    res.redirect(redirect + "?code=" + codeValue);    
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

  console.log("post submit");
  console.log(req.body);
  console.log(code);
  console.log(redirectUrl);
  console.log(applicationName);

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

app.post("/logoutservice", function (req, res) {
  let code = req.body.code;
  let redirectUrl = req.body.RedirectUri;
  let applicationName = req.body.applicationName;

  console.log("post submit");
  console.log(errorPage);
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

  res.redirect(redirectUrl);
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
  if((isHttpOnlyEnabled && !req.cookies[SESSION_COOKIE]) || (!isHttpOnlyEnabled && !req.headers["sessionid"])){
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
    for (let i = 0; i <= amount; i++) {
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
        children: [
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
        displayLineNumber: i,
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
        canCheckOut: false,
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
              phone: "8005276389",
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
    return res.status(500).json({
      error: {
        code: 0,
        message: [],
        isError: true,
      },
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

  if (endUserName == "error") {
    res.status(500).json({
      error: {
        code: 0,
        message: [],
        isError: true,
      },
    });
  } else if (endUserName == "empty") {
    res.json({
      content: {
        items: [],
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
            vendor: "Red Hat Inc",
            expiryDate: "12/31/2025",
          },
          {
            bid: "212121323",
            version: "002",
            dealId: "0013",
            endUserName: endUserName,
            vendor: "Cisco",
            expiryDate: "12/31/2025",
          },
          {
            bid: "76676767",
            version: "004",
            dealId: "0014",
            endUserName: endUserName,
            vendor: "AMD",
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
  
  const response = {"content":{"totalItems":314,"pageCount":13,"pageNumber":1,"pageSize":25,"items":[{"source":{"system":"RQ","type":"Renewal","id":"U100000000224"},"reseller":{"vendorAccountName":"Connekted, inc","vendorAccountNumber":"5184650","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastNeame":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"warwick","state":null,"postalCode":"02886","country":null,"county":"RI","countryCode":"United States"}},"endUser":{"id":null,"name":"Grace Christian Academy","nameUpper":"GRACE CHRISTIAN ACADEMY","contact":{"salutation":null,"firstName":"Carlo","lastName":"Giannotta","initial":"C","emailAddress":"aqueity.support@gcachicago.org","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Chicago","state":"DUPAGE","postalCode":"60623-4358","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2020-09-26T00:00:00Z","dueDays":-545,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"343450072","support":"Basic","options":[],"renewal":{"total":37.76,"currency":"USD","save":0.0,"expiryDate":"2022-03-18T00:00:00Z"},"resellerPO":"343450072-R:16FEB22 11:52:36","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000591"},"reseller":{"vendorAccountName":"SHI International Corp","vendorAccountNumber":"2713676","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Somerset","state":null,"postalCode":"08873","country":null,"county":"NJ","countryCode":"United States"}},"endUser":{"id":null,"name":"Exelead Inc","nameUpper":"EXELEAD INC","contact":{"salutation":null,"firstName":"GREGORY","lastName":"GRAHAM","initial":"G","emailAddress":"GREGORY.GRAHAM@SIGMATAU.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Indianapolis","state":"MARION","postalCode":"46268-2582","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-06-11T00:00:00Z","dueDays":-287,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"38772384","support":"Production","options":[],"renewal":{"total":35.72,"currency":"USD","save":0.0,"expiryDate":"2022-03-19T00:00:00Z"},"resellerPO":"38772384-R:11FEB22 12:26:23","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000274"},"reseller":{"vendorAccountName":"The Network Support Co., LLC","vendorAccountNumber":"2927369","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Danbury","state":null,"postalCode":"06810","country":null,"county":"CT","countryCode":"United States"}},"endUser":{"id":null,"name":"Coastal Dealerships","nameUpper":"COASTAL DEALERSHIPS","contact":{"salutation":null,"firstName":"Tom","lastName":"Norton","initial":"T","emailAddress":"ADMINISTRATOR@COASTALDEALERSHIPS.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Norwell","state":"PLYMOUTH","postalCode":"02061-1605","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-10-16T00:00:00Z","dueDays":-160,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"350872811","support":"Basic","options":[],"renewal":{"total":62.93,"currency":"USD","save":0.0,"expiryDate":"2022-03-17T00:00:00Z"},"resellerPO":"350872811-R:15FEB22 15:38:24","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000275"},"reseller":{"vendorAccountName":"Barry-Wehmiller International Resources","vendorAccountNumber":"15343058","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"East Syracuse","state":null,"postalCode":"13057","country":null,"county":"NY","countryCode":"United States"}},"endUser":{"id":null,"name":"Jarvis Products Corp","nameUpper":"JARVIS PRODUCTS CORP","contact":{"salutation":null,"firstName":"Giuseppe","lastName":"Pugliares","initial":"G","emailAddress":"Jarvis.products.corp@snet.net","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"MIDDLETOWN","state":"MIDDLESEX","postalCode":"06457","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-11-12T00:00:00Z","dueDays":-133,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"351894102","support":"Production","options":[],"renewal":{"total":607.14,"currency":"USD","save":0.0,"expiryDate":"2022-03-18T00:00:00Z"},"resellerPO":"351894102-R:15FEB22 23:09:17","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000157"},"reseller":{"vendorAccountName":"It1Source","vendorAccountNumber":"2714667","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Tempe","state":null,"postalCode":"85281","country":null,"county":"AZ","countryCode":"United States"}},"endUser":{"id":null,"name":"Datepac LLC","nameUpper":"DATEPAC LLC","contact":{"salutation":null,"firstName":"Josh","lastName":"Helmuth","initial":"J","emailAddress":"JOSHH@DATEPAC.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Yuma","state":"YUMA","postalCode":"85365-2556","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-11-21T00:00:00Z","dueDays":-124,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"32507307","support":"Production","options":[{"id":"U100000000157","agreementNumber":"32507307","quoteID":"32507307-R:14FEB22 11:38:04","contractDuration":"1 Year 2 Months ","support":"Production","total":1088.35,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z","quoteCurrent":true},{"id":"U100000000158","agreementNumber":"32507307","quoteID":"32507307-R:14FEB22 11:38:21","contractDuration":"3 Years","support":"Production","total":1088.35,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z","quoteCurrent":false}],"renewal":{"total":1088.35,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"32507307-R:14FEB22 11:38:04","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000198"},"reseller":{"vendorAccountName":"Zones","vendorAccountNumber":"5214","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"AUBURN","state":null,"postalCode":"98001-6524","country":null,"county":"WA","countryCode":"United States"}},"endUser":{"id":null,"name":"PACIFIC PLUMBING SUPPLY C","nameUpper":"PACIFIC PLUMBING SUPPLY C","contact":{"salutation":null,"firstName":"Carl","lastName":"Jones","initial":"C","emailAddress":"carlj@pacificplumbing.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"SEATTLE","state":"KING","postalCode":"98106","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-12-22T00:00:00Z","dueDays":-93,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"342010840","support":"Production","options":[{"id":"U100000000198","agreementNumber":"342010840","quoteID":"342010840-R:16FEB22 11:27:22","contractDuration":"1 Year 3 Months ","support":"Production","total":2732.13,"currency":"USD","save":0.0,"expiryDate":"2022-03-26T00:00:00Z","quoteCurrent":true},{"id":"U100000000199","agreementNumber":"342010840","quoteID":"342010840-R:16FEB22 11:27:52","contractDuration":"3 Years 3 Months ","support":"Production","total":2732.13,"currency":"USD","save":0.0,"expiryDate":"2022-03-26T00:00:00Z","quoteCurrent":false}],"renewal":{"total":2732.13,"currency":"USD","save":0.0,"expiryDate":"2022-03-26T00:00:00Z"},"resellerPO":"342010840-R:16FEB22 11:27:22","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000064"},"reseller":{"vendorAccountName":"Carousel Industries","vendorAccountNumber":"3462510","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Exeter","state":null,"postalCode":"02822","country":null,"county":"RI","countryCode":"United States"}},"endUser":{"id":null,"name":"Portland Public Schools","nameUpper":"PORTLAND PUBLIC SCHOOLS","contact":{"salutation":null,"firstName":"MOSTAFA","lastName":"ROSTAMPOU","initial":"M","emailAddress":"ROSTAM@PORTLANDSCHOOLS.ORG","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"PORTLAND","state":"CUMBERLAND","postalCode":"04101-2957","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-01-07T00:00:00Z","dueDays":-77,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"30870285","support":"Production","options":[{"id":"U100000000064","agreementNumber":"30870285","quoteID":"30870285-R:14FEB22 06:43:16","contractDuration":"1 Year 1 Months ","support":"Production","total":24669.21,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z","quoteCurrent":true},{"id":"U100000000065","agreementNumber":"30870285","quoteID":"30870285-R:14FEB22 06:43:43","contractDuration":"3 Years 1 Months ","support":"Production","total":11839.31,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z","quoteCurrent":false}],"renewal":{"total":24669.21,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"30870285-R:14FEB22 06:43:16","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000236"},"reseller":{"vendorAccountName":"Carousel Industries","vendorAccountNumber":"3462510","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Exeter","state":null,"postalCode":"02822","country":null,"county":"RI","countryCode":"United States"}},"endUser":{"id":null,"name":"Strafford County","nameUpper":"STRAFFORD COUNTY","contact":{"salutation":null,"firstName":"Paul","lastName":"Kopreski","initial":"P","emailAddress":"PKOPRESKI@CO.STRAFFORD.NH.US","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Dover","state":"STRAFFORD","postalCode":"03820-6025","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-01-16T00:00:00Z","dueDays":-68,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"34523906","support":"Production","options":[],"renewal":{"total":6050.76,"currency":"USD","save":0.0,"expiryDate":"2022-03-19T00:00:00Z"},"resellerPO":"34523906-R:17FEB22 01:23:15","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000349"},"reseller":{"vendorAccountName":"Stored Technology Solutions Inc","vendorAccountNumber":"5603872","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Queensbury","state":null,"postalCode":"12804-7629","country":null,"county":"NY","countryCode":"United States"}},"endUser":{"id":null,"name":"My Saratoga Dentist Pllc","nameUpper":"MY SARATOGA DENTIST PLLC","contact":{"salutation":null,"firstName":"Dr.","lastName":"Ryan Osinski","initial":"D","emailAddress":"mysaratogadentist@gmail.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Saratoga Springs","state":"SARATOGA","postalCode":"12866-1646","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-01-16T00:00:00Z","dueDays":-68,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"367989851","support":"Basic","options":[],"renewal":{"total":62.93,"currency":"USD","save":0.0,"expiryDate":"2022-03-17T00:00:00Z"},"resellerPO":"367989851-R:15FEB22 08:08:28","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000278"},"reseller":{"vendorAccountName":"Advizex Technologies LLC","vendorAccountNumber":"2710473","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Independence","state":null,"postalCode":"44131","country":null,"county":"OH","countryCode":"United States"}},"endUser":{"id":null,"name":"Wilson Bank & Trust","nameUpper":"WILSON BANK & TRUST","contact":{"salutation":null,"firstName":"STEPHEN","lastName":"JAQUISH","initial":"S","emailAddress":"SJAQUISH@WILSONBANK.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"LEBANON","state":"WILSON","postalCode":"37087","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-01-28T00:00:00Z","dueDays":-56,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"354882401","support":"Production","options":[{"id":"U100000000278","agreementNumber":"354882401","quoteID":"354882401-R:15FEB22 07:51:49","contractDuration":"1 Year","support":"Production","total":7240.56,"currency":"USD","save":0.0,"expiryDate":"2022-03-17T00:00:00Z","quoteCurrent":true},{"id":"U100000000279","agreementNumber":"354882401","quoteID":"354882401-R:15FEB22 07:52:21","contractDuration":"3 Years","support":"Production","total":7240.56,"currency":"USD","save":0.0,"expiryDate":"2022-03-17T00:00:00Z","quoteCurrent":false}],"renewal":{"total":7240.56,"currency":"USD","save":0.0,"expiryDate":"2022-03-17T00:00:00Z"},"resellerPO":"354882401-R:15FEB22 07:51:49","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000004"},"reseller":{"vendorAccountName":"It1Source","vendorAccountNumber":"2714667","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Tempe","state":null,"postalCode":"85281","country":null,"county":"AZ","countryCode":"United States"}},"endUser":{"id":null,"name":"Schooloutfitters : OH","nameUpper":"SCHOOLOUTFITTERS : OH","contact":{"salutation":null,"firstName":"Ryan","lastName":"Sackenheim","initial":"R","emailAddress":"ryan.sackenheim@schooloutfitters.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"CINCINNATI","state":"HAMILTON","postalCode":"45212-0000","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-03T00:00:00Z","dueDays":-50,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"30076186","support":"Production","options":[],"renewal":{"total":910.71,"currency":"USD","save":0.0,"expiryDate":"2022-03-17T00:00:00Z"},"resellerPO":"30076186-R:15FEB22 09:10:01","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000213"},"reseller":{"vendorAccountName":"CompuNet, Inc.","vendorAccountNumber":"2717739","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Meridian","state":null,"postalCode":"83642","country":null,"county":"ID","countryCode":"United States"}},"endUser":{"id":null,"name":"Stevens County Information Services","nameUpper":"STEVENS COUNTY INFORMATION SERVICES","contact":{"salutation":null,"firstName":"Trevor","lastName":"Sellars","initial":"T","emailAddress":"tsellars@stevenscountywa.gov","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"COLVILLE","state":"STEVENS","postalCode":"99114","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-06T00:00:00Z","dueDays":-47,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"343408608","support":"Mixed","options":[],"renewal":{"total":188.79,"currency":"USD","save":0.0,"expiryDate":"2022-03-15T00:00:00Z"},"resellerPO":"343408608-R:13FEB22 19:20:46","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000202"},"reseller":{"vendorAccountName":"Logicalis Inc","vendorAccountNumber":"2711479","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":null,"postalCode":"10119","country":null,"county":"NY","countryCode":"United States"}},"endUser":{"id":null,"name":"Avondale School District","nameUpper":"AVONDALE SCHOOL DISTRICT","contact":{"salutation":null,"firstName":"JOHN","lastName":"PAGEL","initial":"J","emailAddress":"JOHN.PAGEL@AVONDALE.K12.MI.US","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Auburn Hills","state":"OAKLAND","postalCode":"48326-3264","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-07T00:00:00Z","dueDays":-46,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"343390723","support":"Production","options":[],"renewal":{"total":1214.28,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"343390723-R:14FEB22 07:36:24","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000280"},"reseller":{"vendorAccountName":"Averill Consulting Group Inc.","vendorAccountNumber":"6670965","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Sparks","state":null,"postalCode":"89436","country":null,"county":"NV","countryCode":"United States"}},"endUser":{"id":null,"name":"Candor-Ags","nameUpper":"CANDOR-AGS","contact":{"salutation":null,"firstName":"Manny","lastName":"Sanchez","initial":"M","emailAddress":"manuel.sanchez@caro-nut.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Fresno","state":"FRESNO","postalCode":"93725-1939","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-07T00:00:00Z","dueDays":-46,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"355129140","support":"Basic","options":[],"renewal":{"total":125.86,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"355129140-R:14FEB22 07:38:52","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000214"},"reseller":{"vendorAccountName":"Logicalis Inc","vendorAccountNumber":"2711479","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":null,"postalCode":"10119","country":null,"county":"NY","countryCode":"United States"}},"endUser":{"id":null,"name":"Avondale School District","nameUpper":"AVONDALE SCHOOL DISTRICT","contact":{"salutation":null,"firstName":"JOHN","lastName":"PAGEL","initial":"J","emailAddress":"JOHN.PAGEL@AVONDALE.K12.MI.US","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Auburn Hills","state":"OAKLAND","postalCode":"48326-3264","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-07T00:00:00Z","dueDays":-46,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"343411774","support":"Production","options":[],"renewal":{"total":607.14,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"343411774-R:14FEB22 07:39:33","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000164"},"reseller":{"vendorAccountName":"Focus Technology Solutions Inc","vendorAccountNumber":"2715823","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Seabrook","state":null,"postalCode":"03874","country":null,"county":"NH","countryCode":"United States"}},"endUser":{"id":null,"name":"IDEA-POINT INC","nameUpper":"IDEA-POINT INC","contact":{"salutation":null,"firstName":"LY,","lastName":"TIM","initial":"L","emailAddress":"TLY@IDEA-POINT.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Boston","state":"SUFFOLK","postalCode":"02119-3217","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-08T00:00:00Z","dueDays":-45,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"330564599","support":"Mixed","options":[],"renewal":{"total":188.79,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"330564599-R:14FEB22 07:51:31","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000276"},"reseller":{"vendorAccountName":"Marcum Technology LLC","vendorAccountNumber":"5735163","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Melville","state":null,"postalCode":"11747","country":null,"county":"NY","countryCode":"United States"}},"endUser":{"id":null,"name":"Carco Group, Inc : NY","nameUpper":"CARCO GROUP, INC : NY","contact":{"salutation":null,"firstName":"Eric","lastName":"Vanek","initial":"E","emailAddress":"evanek@carcogroup.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"HOLTSVILLE","state":"SUFFOLK","postalCode":"11742","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-08T00:00:00Z","dueDays":-45,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"354533691","support":"Production","options":[{"id":"U100000000276","agreementNumber":"354533691","quoteID":"354533691-R:14FEB22 15:54:08","contractDuration":"1 Year","support":"Production","total":4353.39,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z","quoteCurrent":true},{"id":"U100000000277","agreementNumber":"354533691","quoteID":"354533691-R:14FEB22 15:54:37","contractDuration":"3 Years","support":"Production","total":4353.39,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z","quoteCurrent":false}],"renewal":{"total":4353.39,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"354533691-R:14FEB22 15:54:08","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000388"},"reseller":{"vendorAccountName":"Daymark Solutions, Inc.","vendorAccountNumber":"2714784","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Littleton","state":null,"postalCode":"01460","country":null,"county":"MA","countryCode":"United States"}},"endUser":{"id":null,"name":"THE BROAD INST","nameUpper":"THE BROAD INST","contact":{"salutation":null,"firstName":"VMware","lastName":"Account","initial":"V","emailAddress":"VMWARE@BROADINSTITUTE.ORG","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"CAMBRIDGE","state":"MIDDLESEX","postalCode":"02142","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-08T00:00:00Z","dueDays":-45,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"382170159","support":"Production","options":[{"id":"U100000000388","agreementNumber":"382170159","quoteID":"382170159-R:14FEB22 07:53:07","contractDuration":"1 Year","support":"Production","total":1451.13,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z","quoteCurrent":true},{"id":"U100000000389","agreementNumber":"382170159","quoteID":"382170159-R:14FEB22 08:06:21","contractDuration":"1 Year 1 Months ","support":"Production","total":49005.36,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z","quoteCurrent":false}],"renewal":{"total":1451.13,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"382170159-R:14FEB22 07:53:07","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000009"},"reseller":{"vendorAccountName":"Cornerstone Technologies LLC","vendorAccountNumber":"2724923","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"San Jose","state":null,"postalCode":"95112","country":null,"county":"CA","countryCode":"United States"}},"endUser":{"id":null,"name":"ROBBJACK CORPORATION","nameUpper":"ROBBJACK CORPORATION","contact":{"salutation":null,"firstName":"Jon","lastName":"Kantola","initial":"J","emailAddress":"jon@robbjack.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"LINCOLN","state":"PLACER","postalCode":"95648","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-10T00:00:00Z","dueDays":-43,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"30152256","support":"Production","options":[],"renewal":{"total":724.62,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"30152256-R:14FEB22 08:22:39","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000346"},"reseller":{"vendorAccountName":"Nuvodia LLC","vendorAccountNumber":"15074978","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Spokane","state":null,"postalCode":"99204","country":null,"county":"WA","countryCode":"United States"}},"endUser":{"id":null,"name":"Cancer Care Northwest","nameUpper":"CANCER CARE NORTHWEST","contact":{"salutation":null,"firstName":"Danny","lastName":"O'Neill","initial":"D","emailAddress":"DONEILL@NUVODIA.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Spokane","state":"SPOKANE","postalCode":"99216-1020","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-11T00:00:00Z","dueDays":-42,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"36348528","support":"Production","options":[],"renewal":{"total":5160.69,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"36348528-R:14FEB22 16:21:23","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000035"},"reseller":{"vendorAccountName":"Aqueduct Technologies","vendorAccountNumber":"12609691","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Waltham","state":null,"postalCode":"02451","country":null,"county":"MA","countryCode":"United States"}},"endUser":{"id":null,"name":"Dunkin Brands, Inc","nameUpper":"DUNKIN BRANDS, INC","contact":{"salutation":null,"firstName":"Rajesh","lastName":"Potru","initial":"R","emailAddress":"RAJESH.POTRU@DUNKINBRANDS.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Canton","state":"NORFOLK","postalCode":"02021-1010","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-12T00:00:00Z","dueDays":-41,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"30712367","support":"Production","options":[{"id":"U100000000034","agreementNumber":"30712367","quoteID":"30712367-R:16FEB22 06:06:47","contractDuration":"3 Years","support":"Production","total":42246.00,"currency":"USD","save":0.0,"expiryDate":"2022-03-18T00:00:00Z","quoteCurrent":false},{"id":"U100000000035","agreementNumber":"30712367","quoteID":"30712367-R:16FEB22 06:08:20","contractDuration":"1 Year","support":"Production","total":42246.00,"currency":"USD","save":0.0,"expiryDate":"2022-03-18T00:00:00Z","quoteCurrent":true}],"renewal":{"total":42246.00,"currency":"USD","save":0.0,"expiryDate":"2022-03-18T00:00:00Z"},"resellerPO":"30712367-R:16FEB22 06:08:20","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000292"},"reseller":{"vendorAccountName":"BerganKDV, LTD.","vendorAccountNumber":"24251589","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Waterloo","state":null,"postalCode":"50703","country":null,"county":"IA","countryCode":"United States"}},"endUser":{"id":null,"name":"Bhfo","nameUpper":"BHFO","contact":{"salutation":null,"firstName":"JON","lastName":"SEFTON","initial":"J","emailAddress":"JON@BHFO.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Cedar Rapids","state":"LINN","postalCode":"52404-6710","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-12T00:00:00Z","dueDays":-41,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"35743524","support":"Production","options":[{"id":"U100000000292","agreementNumber":"35743524","quoteID":"35743524-R:16FEB22 09:22:59","contractDuration":"1 Year","support":"Production","total":1088.35,"currency":"USD","save":0.0,"expiryDate":"2022-03-18T00:00:00Z","quoteCurrent":true},{"id":"U100000000293","agreementNumber":"35743524","quoteID":"35743524-R:16FEB22 09:23:16","contractDuration":"3 Years","support":"Production","total":1088.35,"currency":"USD","save":0.0,"expiryDate":"2022-03-18T00:00:00Z","quoteCurrent":false}],"renewal":{"total":1088.35,"currency":"USD","save":0.0,"expiryDate":"2022-03-18T00:00:00Z"},"resellerPO":"35743524-R:16FEB22 09:22:59","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000045"},"reseller":{"vendorAccountName":"Piedmont Triad Computer Consulting Inc","vendorAccountNumber":"2737274","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Clemmons","state":null,"postalCode":"27012","country":null,"county":"NC","countryCode":"United States"}},"endUser":{"id":null,"name":"Orrells Food Service LLC","nameUpper":"ORRELLS FOOD SERVICE LLC","contact":{"salutation":null,"firstName":"LORI,","lastName":"WILLIAMS","initial":"L","emailAddress":"LWILLIAMS@ORRELLSFOODSERVICE.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Linwood","state":"DAVIDSON","postalCode":"27299-9461","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-13T00:00:00Z","dueDays":-40,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"30734387","support":"Production","options":[],"renewal":{"total":846.08,"currency":"USD","save":0.0,"expiryDate":"2022-03-17T00:00:00Z"},"resellerPO":"30734387-R:15FEB22 16:22:12","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000281"},"reseller":{"vendorAccountName":"Dynamix Group Inc","vendorAccountNumber":"2723320","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Roswell","state":null,"postalCode":"30075-5625","country":null,"county":"GA","countryCode":"United States"}},"endUser":{"id":null,"name":"Prisma Health","nameUpper":"PRISMA HEALTH","contact":{"salutation":null,"firstName":"Wes","lastName":"Wimpey","initial":"W","emailAddress":"wes.wimpey@prismahealth.org","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"COLUMBIA","state":"LEXINGTON","postalCode":"29223","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-13T00:00:00Z","dueDays":-40,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"355356904","support":"Production","options":[],"renewal":{"total":1689.84,"currency":"USD","save":0.0,"expiryDate":"2022-03-15T00:00:00Z"},"resellerPO":"355356904-R:14FEB22 08:21:35","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000203"},"reseller":{"vendorAccountName":"Network Consulting Services Inc","vendorAccountNumber":"2714743","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Bountiful","state":null,"postalCode":"84010","country":null,"county":"UT","countryCode":"United States"}},"endUser":{"id":null,"name":"City Of Salt Lake City Department Of Airports","nameUpper":"CITY OF SALT LAKE CITY DEPARTMENT OF AIRPORTS","contact":{"salutation":null,"firstName":"DEAN","lastName":"WARNER","initial":"D","emailAddress":"dean.warner@slcgov.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Salt Lake City","state":"SALT LAKE","postalCode":"84122-7003","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-13T00:00:00Z","dueDays":-40,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"343391574","support":"Basic","options":[],"renewal":{"total":62.93,"currency":"USD","save":0.0,"expiryDate":"2022-03-17T00:00:00Z"},"resellerPO":"343391574-R:15FEB22 06:52:53","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0}],"refinementGroups":{"group":"RenewalAttributes","refinements":[{"id":null,"name":"Vendors and Programs","options":[{"id":null,"text":"VMWARE","searchKey":"VendorName","selected":null,"subOptions":[{"id":null,"text":"Standard","searchKey":"ProgramName","selected":null}]}]},{"id":null,"name":"End user type","searchKey":"EndUserType","options":[{"id":null,"text":"Academic","selected":null,"subOptions":null},{"id":null,"text":"Commercial","selected":null,"subOptions":null}]},{"id":null,"name":"Renewal Type","searchKey":"Type","options":[{"id":null,"text":"Renewal","selected":null,"subOptions":null}]}]}},"error":{"code":0,"messages":[],"isError":false}};
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
  const response = {"content":{"totalItems":314,"pageCount":13,"pageNumber":1,"pageSize":25,"items":[{"source":{"system":"RQ","type":"Renewal","id":"U100000000224"},"reseller":{"vendorAccountName":"Connekted, inc","vendorAccountNumber":"5184650","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"warwick","state":null,"postalCode":"02886","country":null,"county":"RI","countryCode":"United States"}},"endUser":{"id":null,"name":"Grace Christian Academy","nameUpper":"GRACE CHRISTIAN ACADEMY","contact":{"salutation":null,"firstName":"Carlo","lastName":"Giannotta","initial":"C","emailAddress":"aqueity.support@gcachicago.org","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Chicago","state":"DUPAGE","postalCode":"60623-4358","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2020-09-26T00:00:00Z","dueDays":-545,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"343450072","support":"Basic","options":[],"renewal":{"total":37.76,"currency":"USD","save":0.0,"expiryDate":"2022-03-18T00:00:00Z"},"resellerPO":"343450072-R:16FEB22 11:52:36","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000591"},"reseller":{"vendorAccountName":"SHI International Corp","vendorAccountNumber":"2713676","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Somerset","state":null,"postalCode":"08873","country":null,"county":"NJ","countryCode":"United States"}},"endUser":{"id":null,"name":"Exelead Inc","nameUpper":"EXELEAD INC","contact":{"salutation":null,"firstName":"GREGORY","lastName":"GRAHAM","initial":"G","emailAddress":"GREGORY.GRAHAM@SIGMATAU.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Indianapolis","state":"MARION","postalCode":"46268-2582","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-06-11T00:00:00Z","dueDays":-287,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"38772384","support":"Production","options":[],"renewal":{"total":35.72,"currency":"USD","save":0.0,"expiryDate":"2022-03-19T00:00:00Z"},"resellerPO":"38772384-R:11FEB22 12:26:23","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000274"},"reseller":{"vendorAccountName":"The Network Support Co., LLC","vendorAccountNumber":"2927369","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Danbury","state":null,"postalCode":"06810","country":null,"county":"CT","countryCode":"United States"}},"endUser":{"id":null,"name":"Coastal Dealerships","nameUpper":"COASTAL DEALERSHIPS","contact":{"salutation":null,"firstName":"Tom","lastName":"Norton","initial":"T","emailAddress":"ADMINISTRATOR@COASTALDEALERSHIPS.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Norwell","state":"PLYMOUTH","postalCode":"02061-1605","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-10-16T00:00:00Z","dueDays":-160,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"350872811","support":"Basic","options":[],"renewal":{"total":62.93,"currency":"USD","save":0.0,"expiryDate":"2022-03-17T00:00:00Z"},"resellerPO":"350872811-R:15FEB22 15:38:24","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000275"},"reseller":{"vendorAccountName":"Barry-Wehmiller International Resources","vendorAccountNumber":"15343058","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"East Syracuse","state":null,"postalCode":"13057","country":null,"county":"NY","countryCode":"United States"}},"endUser":{"id":null,"name":"Jarvis Products Corp","nameUpper":"JARVIS PRODUCTS CORP","contact":{"salutation":null,"firstName":"Giuseppe","lastName":"Pugliares","initial":"G","emailAddress":"Jarvis.products.corp@snet.net","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"MIDDLETOWN","state":"MIDDLESEX","postalCode":"06457","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-11-12T00:00:00Z","dueDays":-133,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"351894102","support":"Production","options":[],"renewal":{"total":607.14,"currency":"USD","save":0.0,"expiryDate":"2022-03-18T00:00:00Z"},"resellerPO":"351894102-R:15FEB22 23:09:17","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000157"},"reseller":{"vendorAccountName":"It1Source","vendorAccountNumber":"2714667","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Tempe","state":null,"postalCode":"85281","country":null,"county":"AZ","countryCode":"United States"}},"endUser":{"id":null,"name":"Datepac LLC","nameUpper":"DATEPAC LLC","contact":{"salutation":null,"firstName":"Josh","lastName":"Helmuth","initial":"J","emailAddress":"JOSHH@DATEPAC.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Yuma","state":"YUMA","postalCode":"85365-2556","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-11-21T00:00:00Z","dueDays":-124,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"32507307","support":"Production","options":[{"id":"U100000000157","agreementNumber":"32507307","quoteID":"32507307-R:14FEB22 11:38:04","contractDuration":"1 Year 2 Months ","support":"Production","total":1088.35,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z","quoteCurrent":true},{"id":"U100000000158","agreementNumber":"32507307","quoteID":"32507307-R:14FEB22 11:38:21","contractDuration":"3 Years","support":"Production","total":1088.35,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z","quoteCurrent":false}],"renewal":{"total":1088.35,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"32507307-R:14FEB22 11:38:04","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000198"},"reseller":{"vendorAccountName":"Zones","vendorAccountNumber":"5214","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"AUBURN","state":null,"postalCode":"98001-6524","country":null,"county":"WA","countryCode":"United States"}},"endUser":{"id":null,"name":"PACIFIC PLUMBING SUPPLY C","nameUpper":"PACIFIC PLUMBING SUPPLY C","contact":{"salutation":null,"firstName":"Carl","lastName":"Jones","initial":"C","emailAddress":"carlj@pacificplumbing.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"SEATTLE","state":"KING","postalCode":"98106","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-12-22T00:00:00Z","dueDays":-93,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"342010840","support":"Production","options":[{"id":"U100000000198","agreementNumber":"342010840","quoteID":"342010840-R:16FEB22 11:27:22","contractDuration":"1 Year 3 Months ","support":"Production","total":2732.13,"currency":"USD","save":0.0,"expiryDate":"2022-03-26T00:00:00Z","quoteCurrent":true},{"id":"U100000000199","agreementNumber":"342010840","quoteID":"342010840-R:16FEB22 11:27:52","contractDuration":"3 Years 3 Months ","support":"Production","total":2732.13,"currency":"USD","save":0.0,"expiryDate":"2022-03-26T00:00:00Z","quoteCurrent":false}],"renewal":{"total":2732.13,"currency":"USD","save":0.0,"expiryDate":"2022-03-26T00:00:00Z"},"resellerPO":"342010840-R:16FEB22 11:27:22","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000064"},"reseller":{"vendorAccountName":"Carousel Industries","vendorAccountNumber":"3462510","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Exeter","state":null,"postalCode":"02822","country":null,"county":"RI","countryCode":"United States"}},"endUser":{"id":null,"name":"Portland Public Schools","nameUpper":"PORTLAND PUBLIC SCHOOLS","contact":{"salutation":null,"firstName":"MOSTAFA","lastName":"ROSTAMPOU","initial":"M","emailAddress":"ROSTAM@PORTLANDSCHOOLS.ORG","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"PORTLAND","state":"CUMBERLAND","postalCode":"04101-2957","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-01-07T00:00:00Z","dueDays":-77,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"30870285","support":"Production","options":[{"id":"U100000000064","agreementNumber":"30870285","quoteID":"30870285-R:14FEB22 06:43:16","contractDuration":"1 Year 1 Months ","support":"Production","total":24669.21,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z","quoteCurrent":true},{"id":"U100000000065","agreementNumber":"30870285","quoteID":"30870285-R:14FEB22 06:43:43","contractDuration":"3 Years 1 Months ","support":"Production","total":11839.31,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z","quoteCurrent":false}],"renewal":{"total":24669.21,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"30870285-R:14FEB22 06:43:16","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000236"},"reseller":{"vendorAccountName":"Carousel Industries","vendorAccountNumber":"3462510","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Exeter","state":null,"postalCode":"02822","country":null,"county":"RI","countryCode":"United States"}},"endUser":{"id":null,"name":"Strafford County","nameUpper":"STRAFFORD COUNTY","contact":{"salutation":null,"firstName":"Paul","lastName":"Kopreski","initial":"P","emailAddress":"PKOPRESKI@CO.STRAFFORD.NH.US","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Dover","state":"STRAFFORD","postalCode":"03820-6025","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-01-16T00:00:00Z","dueDays":-68,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"34523906","support":"Production","options":[],"renewal":{"total":6050.76,"currency":"USD","save":0.0,"expiryDate":"2022-03-19T00:00:00Z"},"resellerPO":"34523906-R:17FEB22 01:23:15","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000349"},"reseller":{"vendorAccountName":"Stored Technology Solutions Inc","vendorAccountNumber":"5603872","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Queensbury","state":null,"postalCode":"12804-7629","country":null,"county":"NY","countryCode":"United States"}},"endUser":{"id":null,"name":"My Saratoga Dentist Pllc","nameUpper":"MY SARATOGA DENTIST PLLC","contact":{"salutation":null,"firstName":"Dr.","lastName":"Ryan Osinski","initial":"D","emailAddress":"mysaratogadentist@gmail.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Saratoga Springs","state":"SARATOGA","postalCode":"12866-1646","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-01-16T00:00:00Z","dueDays":-68,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"367989851","support":"Basic","options":[],"renewal":{"total":62.93,"currency":"USD","save":0.0,"expiryDate":"2022-03-17T00:00:00Z"},"resellerPO":"367989851-R:15FEB22 08:08:28","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000278"},"reseller":{"vendorAccountName":"Advizex Technologies LLC","vendorAccountNumber":"2710473","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Independence","state":null,"postalCode":"44131","country":null,"county":"OH","countryCode":"United States"}},"endUser":{"id":null,"name":"Wilson Bank & Trust","nameUpper":"WILSON BANK & TRUST","contact":{"salutation":null,"firstName":"STEPHEN","lastName":"JAQUISH","initial":"S","emailAddress":"SJAQUISH@WILSONBANK.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"LEBANON","state":"WILSON","postalCode":"37087","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-01-28T00:00:00Z","dueDays":-56,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"354882401","support":"Production","options":[{"id":"U100000000278","agreementNumber":"354882401","quoteID":"354882401-R:15FEB22 07:51:49","contractDuration":"1 Year","support":"Production","total":7240.56,"currency":"USD","save":0.0,"expiryDate":"2022-03-17T00:00:00Z","quoteCurrent":true},{"id":"U100000000279","agreementNumber":"354882401","quoteID":"354882401-R:15FEB22 07:52:21","contractDuration":"3 Years","support":"Production","total":7240.56,"currency":"USD","save":0.0,"expiryDate":"2022-03-17T00:00:00Z","quoteCurrent":false}],"renewal":{"total":7240.56,"currency":"USD","save":0.0,"expiryDate":"2022-03-17T00:00:00Z"},"resellerPO":"354882401-R:15FEB22 07:51:49","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000004"},"reseller":{"vendorAccountName":"It1Source","vendorAccountNumber":"2714667","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Tempe","state":null,"postalCode":"85281","country":null,"county":"AZ","countryCode":"United States"}},"endUser":{"id":null,"name":"Schooloutfitters : OH","nameUpper":"SCHOOLOUTFITTERS : OH","contact":{"salutation":null,"firstName":"Ryan","lastName":"Sackenheim","initial":"R","emailAddress":"ryan.sackenheim@schooloutfitters.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"CINCINNATI","state":"HAMILTON","postalCode":"45212-0000","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-03T00:00:00Z","dueDays":-50,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"30076186","support":"Production","options":[],"renewal":{"total":910.71,"currency":"USD","save":0.0,"expiryDate":"2022-03-17T00:00:00Z"},"resellerPO":"30076186-R:15FEB22 09:10:01","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000213"},"reseller":{"vendorAccountName":"CompuNet, Inc.","vendorAccountNumber":"2717739","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Meridian","state":null,"postalCode":"83642","country":null,"county":"ID","countryCode":"United States"}},"endUser":{"id":null,"name":"Stevens County Information Services","nameUpper":"STEVENS COUNTY INFORMATION SERVICES","contact":{"salutation":null,"firstName":"Trevor","lastName":"Sellars","initial":"T","emailAddress":"tsellars@stevenscountywa.gov","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"COLVILLE","state":"STEVENS","postalCode":"99114","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-06T00:00:00Z","dueDays":-47,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"343408608","support":"Mixed","options":[],"renewal":{"total":188.79,"currency":"USD","save":0.0,"expiryDate":"2022-03-15T00:00:00Z"},"resellerPO":"343408608-R:13FEB22 19:20:46","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000202"},"reseller":{"vendorAccountName":"Logicalis Inc","vendorAccountNumber":"2711479","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":null,"postalCode":"10119","country":null,"county":"NY","countryCode":"United States"}},"endUser":{"id":null,"name":"Avondale School District","nameUpper":"AVONDALE SCHOOL DISTRICT","contact":{"salutation":null,"firstName":"JOHN","lastName":"PAGEL","initial":"J","emailAddress":"JOHN.PAGEL@AVONDALE.K12.MI.US","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Auburn Hills","state":"OAKLAND","postalCode":"48326-3264","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-07T00:00:00Z","dueDays":-46,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"343390723","support":"Production","options":[],"renewal":{"total":1214.28,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"343390723-R:14FEB22 07:36:24","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000280"},"reseller":{"vendorAccountName":"Averill Consulting Group Inc.","vendorAccountNumber":"6670965","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Sparks","state":null,"postalCode":"89436","country":null,"county":"NV","countryCode":"United States"}},"endUser":{"id":null,"name":"Candor-Ags","nameUpper":"CANDOR-AGS","contact":{"salutation":null,"firstName":"Manny","lastName":"Sanchez","initial":"M","emailAddress":"manuel.sanchez@caro-nut.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Fresno","state":"FRESNO","postalCode":"93725-1939","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-07T00:00:00Z","dueDays":-46,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"355129140","support":"Basic","options":[],"renewal":{"total":125.86,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"355129140-R:14FEB22 07:38:52","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000214"},"reseller":{"vendorAccountName":"Logicalis Inc","vendorAccountNumber":"2711479","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"New York","state":null,"postalCode":"10119","country":null,"county":"NY","countryCode":"United States"}},"endUser":{"id":null,"name":"Avondale School District","nameUpper":"AVONDALE SCHOOL DISTRICT","contact":{"salutation":null,"firstName":"JOHN","lastName":"PAGEL","initial":"J","emailAddress":"JOHN.PAGEL@AVONDALE.K12.MI.US","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Auburn Hills","state":"OAKLAND","postalCode":"48326-3264","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-07T00:00:00Z","dueDays":-46,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"343411774","support":"Production","options":[],"renewal":{"total":607.14,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"343411774-R:14FEB22 07:39:33","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000164"},"reseller":{"vendorAccountName":"Focus Technology Solutions Inc","vendorAccountNumber":"2715823","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Seabrook","state":null,"postalCode":"03874","country":null,"county":"NH","countryCode":"United States"}},"endUser":{"id":null,"name":"IDEA-POINT INC","nameUpper":"IDEA-POINT INC","contact":{"salutation":null,"firstName":"LY,","lastName":"TIM","initial":"L","emailAddress":"TLY@IDEA-POINT.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Boston","state":"SUFFOLK","postalCode":"02119-3217","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-08T00:00:00Z","dueDays":-45,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"330564599","support":"Mixed","options":[],"renewal":{"total":188.79,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"330564599-R:14FEB22 07:51:31","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000276"},"reseller":{"vendorAccountName":"Marcum Technology LLC","vendorAccountNumber":"5735163","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Melville","state":null,"postalCode":"11747","country":null,"county":"NY","countryCode":"United States"}},"endUser":{"id":null,"name":"Carco Group, Inc : NY","nameUpper":"CARCO GROUP, INC : NY","contact":{"salutation":null,"firstName":"Eric","lastName":"Vanek","initial":"E","emailAddress":"evanek@carcogroup.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"HOLTSVILLE","state":"SUFFOLK","postalCode":"11742","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-08T00:00:00Z","dueDays":-45,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"354533691","support":"Production","options":[{"id":"U100000000276","agreementNumber":"354533691","quoteID":"354533691-R:14FEB22 15:54:08","contractDuration":"1 Year","support":"Production","total":4353.39,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z","quoteCurrent":true},{"id":"U100000000277","agreementNumber":"354533691","quoteID":"354533691-R:14FEB22 15:54:37","contractDuration":"3 Years","support":"Production","total":4353.39,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z","quoteCurrent":false}],"renewal":{"total":4353.39,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"354533691-R:14FEB22 15:54:08","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000388"},"reseller":{"vendorAccountName":"Daymark Solutions, Inc.","vendorAccountNumber":"2714784","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Littleton","state":null,"postalCode":"01460","country":null,"county":"MA","countryCode":"United States"}},"endUser":{"id":null,"name":"THE BROAD INST","nameUpper":"THE BROAD INST","contact":{"salutation":null,"firstName":"VMware","lastName":"Account","initial":"V","emailAddress":"VMWARE@BROADINSTITUTE.ORG","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"CAMBRIDGE","state":"MIDDLESEX","postalCode":"02142","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-08T00:00:00Z","dueDays":-45,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Academic","renewedDuration":null,"agreementNumber":"382170159","support":"Production","options":[{"id":"U100000000388","agreementNumber":"382170159","quoteID":"382170159-R:14FEB22 07:53:07","contractDuration":"1 Year","support":"Production","total":1451.13,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z","quoteCurrent":true},{"id":"U100000000389","agreementNumber":"382170159","quoteID":"382170159-R:14FEB22 08:06:21","contractDuration":"1 Year 1 Months ","support":"Production","total":49005.36,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z","quoteCurrent":false}],"renewal":{"total":1451.13,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"382170159-R:14FEB22 07:53:07","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000009"},"reseller":{"vendorAccountName":"Cornerstone Technologies LLC","vendorAccountNumber":"2724923","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"San Jose","state":null,"postalCode":"95112","country":null,"county":"CA","countryCode":"United States"}},"endUser":{"id":null,"name":"ROBBJACK CORPORATION","nameUpper":"ROBBJACK CORPORATION","contact":{"salutation":null,"firstName":"Jon","lastName":"Kantola","initial":"J","emailAddress":"jon@robbjack.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"LINCOLN","state":"PLACER","postalCode":"95648","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-10T00:00:00Z","dueDays":-43,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"30152256","support":"Production","options":[],"renewal":{"total":724.62,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"30152256-R:14FEB22 08:22:39","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000346"},"reseller":{"vendorAccountName":"Nuvodia LLC","vendorAccountNumber":"15074978","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Spokane","state":null,"postalCode":"99204","country":null,"county":"WA","countryCode":"United States"}},"endUser":{"id":null,"name":"Cancer Care Northwest","nameUpper":"CANCER CARE NORTHWEST","contact":{"salutation":null,"firstName":"Danny","lastName":"O'Neill","initial":"D","emailAddress":"DONEILL@NUVODIA.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Spokane","state":"SPOKANE","postalCode":"99216-1020","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-11T00:00:00Z","dueDays":-42,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"36348528","support":"Production","options":[],"renewal":{"total":5160.69,"currency":"USD","save":0.0,"expiryDate":"2022-03-16T00:00:00Z"},"resellerPO":"36348528-R:14FEB22 16:21:23","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000035"},"reseller":{"vendorAccountName":"Aqueduct Technologies","vendorAccountNumber":"12609691","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Waltham","state":null,"postalCode":"02451","country":null,"county":"MA","countryCode":"United States"}},"endUser":{"id":null,"name":"Dunkin Brands, Inc","nameUpper":"DUNKIN BRANDS, INC","contact":{"salutation":null,"firstName":"Rajesh","lastName":"Potru","initial":"R","emailAddress":"RAJESH.POTRU@DUNKINBRANDS.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Canton","state":"NORFOLK","postalCode":"02021-1010","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-12T00:00:00Z","dueDays":-41,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"30712367","support":"Production","options":[{"id":"U100000000034","agreementNumber":"30712367","quoteID":"30712367-R:16FEB22 06:06:47","contractDuration":"3 Years","support":"Production","total":42246.00,"currency":"USD","save":0.0,"expiryDate":"2022-03-18T00:00:00Z","quoteCurrent":false},{"id":"U100000000035","agreementNumber":"30712367","quoteID":"30712367-R:16FEB22 06:08:20","contractDuration":"1 Year","support":"Production","total":42246.00,"currency":"USD","save":0.0,"expiryDate":"2022-03-18T00:00:00Z","quoteCurrent":true}],"renewal":{"total":42246.00,"currency":"USD","save":0.0,"expiryDate":"2022-03-18T00:00:00Z"},"resellerPO":"30712367-R:16FEB22 06:08:20","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000292"},"reseller":{"vendorAccountName":"BerganKDV, LTD.","vendorAccountNumber":"24251589","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Waterloo","state":null,"postalCode":"50703","country":null,"county":"IA","countryCode":"United States"}},"endUser":{"id":null,"name":"Bhfo","nameUpper":"BHFO","contact":{"salutation":null,"firstName":"JON","lastName":"SEFTON","initial":"J","emailAddress":"JON@BHFO.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Cedar Rapids","state":"LINN","postalCode":"52404-6710","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-12T00:00:00Z","dueDays":-41,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"35743524","support":"Production","options":[{"id":"U100000000292","agreementNumber":"35743524","quoteID":"35743524-R:16FEB22 09:22:59","contractDuration":"1 Year","support":"Production","total":1088.35,"currency":"USD","save":0.0,"expiryDate":"2022-03-18T00:00:00Z","quoteCurrent":true},{"id":"U100000000293","agreementNumber":"35743524","quoteID":"35743524-R:16FEB22 09:23:16","contractDuration":"3 Years","support":"Production","total":1088.35,"currency":"USD","save":0.0,"expiryDate":"2022-03-18T00:00:00Z","quoteCurrent":false}],"renewal":{"total":1088.35,"currency":"USD","save":0.0,"expiryDate":"2022-03-18T00:00:00Z"},"resellerPO":"35743524-R:16FEB22 09:22:59","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000045"},"reseller":{"vendorAccountName":"Piedmont Triad Computer Consulting Inc","vendorAccountNumber":"2737274","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Clemmons","state":null,"postalCode":"27012","country":null,"county":"NC","countryCode":"United States"}},"endUser":{"id":null,"name":"Orrells Food Service LLC","nameUpper":"ORRELLS FOOD SERVICE LLC","contact":{"salutation":null,"firstName":"LORI,","lastName":"WILLIAMS","initial":"L","emailAddress":"LWILLIAMS@ORRELLSFOODSERVICE.COM","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Linwood","state":"DAVIDSON","postalCode":"27299-9461","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-13T00:00:00Z","dueDays":-40,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"30734387","support":"Production","options":[],"renewal":{"total":846.08,"currency":"USD","save":0.0,"expiryDate":"2022-03-17T00:00:00Z"},"resellerPO":"30734387-R:15FEB22 16:22:12","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000281"},"reseller":{"vendorAccountName":"Dynamix Group Inc","vendorAccountNumber":"2723320","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Roswell","state":null,"postalCode":"30075-5625","country":null,"county":"GA","countryCode":"United States"}},"endUser":{"id":null,"name":"Prisma Health","nameUpper":"PRISMA HEALTH","contact":{"salutation":null,"firstName":"Wes","lastName":"Wimpey","initial":"W","emailAddress":"wes.wimpey@prismahealth.org","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"COLUMBIA","state":"LEXINGTON","postalCode":"29223","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-13T00:00:00Z","dueDays":-40,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"355356904","support":"Production","options":[],"renewal":{"total":1689.84,"currency":"USD","save":0.0,"expiryDate":"2022-03-15T00:00:00Z"},"resellerPO":"355356904-R:14FEB22 08:21:35","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0},{"source":{"system":"RQ","type":"Renewal","id":"U100000000203"},"reseller":{"vendorAccountName":"Network Consulting Services Inc","vendorAccountNumber":"2714743","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":{"salutation":null,"firstName":null,"lastName":null,"initial":null,"emailAddress":null,"phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Bountiful","state":null,"postalCode":"84010","country":null,"county":"UT","countryCode":"United States"}},"endUser":{"id":null,"name":"City Of Salt Lake City Department Of Airports","nameUpper":"CITY OF SALT LAKE CITY DEPARTMENT OF AIRPORTS","contact":{"salutation":null,"firstName":"DEAN","lastName":"WARNER","initial":"D","emailAddress":"dean.warner@slcgov.com","phoneNumber":null,"role":null},"address":{"id":null,"line1":null,"line2":null,"line3":null,"city":"Salt Lake City","state":"SALT LAKE","postalCode":"84122-7003","country":null,"county":null,"countryCode":"US"}},"shipTo":null,"published":"2022-03-23T10:32:37.745Z","alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"attributes":[],"programName":"Standard","statusText":null,"amountSaved":null,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2022-02-13T00:00:00Z","dueDays":-40,"incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"vendor":{"id":"21","name":"VMWARE","vendorsTDName":null,"vendorsTDNumber":null},"endUserType":"Commercial","renewedDuration":null,"agreementNumber":"343391574","support":"Basic","options":[],"renewal":{"total":62.93,"currency":"USD","save":0.0,"expiryDate":"2022-03-17T00:00:00Z"},"resellerPO":"343391574-R:15FEB22 06:52:53","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":0.0,"subRevision":0.0,"description":null,"activeFlag":null,"request":null,"endUserPO":null,"customerPO":null,"price":0.0,"currency":null,"documentType":null,"quoteType":null,"type":null,"level":null,"creator":null,"created":"2022-03-23T10:32:30.455Z","updated":"2022-03-23T10:32:37.745Z","expiry":"0001-01-01T00:00:00","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0}],"refinementGroups":{"group":"RenewalAttributes","refinements":[{"id":null,"name":"Vendors and Programs","options":[{"id":null,"text":"VMWARE","searchKey":"VendorName","selected":null,"subOptions":[{"id":null,"text":"Standard","searchKey":"ProgramName","selected":null}]}]},{"id":null,"name":"End user type","searchKey":"EndUserType","options":[{"id":null,"text":"Academic","selected":null,"subOptions":null},{"id":null,"text":"Commercial","selected":null,"subOptions":null}]},{"id":null,"name":"Renewal Type","searchKey":"Type","options":[{"id":null,"text":"Renewal","selected":null,"subOptions":null}]}]}},"error":{"code":0,"messages":[],"isError":false}};
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

  sortRenewalObjects(responseItemList, query);

  var pageNumber = (query.PageNumber - 1) * query.PageSize;
  var pageSize = +pageNumber + +query.PageSize;
  response.content.items = responseItemList && responseItemList.length > 0 ? responseItemList.slice(pageNumber, pageSize) : [];

  // var pageNumber = (query.PageNumber - 1) * query.PageSize;
  // var pageSize = +pageNumber + +query.PageSize
  // response.content.items = responseItemList.slice(pageNumber, pageSize);
  if (query.PageNumber){
    console.log("🚀 ~ file: app.js ~ line 3529 ~ query.PageNumber", query.PageNumber)
    response.content.pageNumber = parseInt(query.PageNumber)
  }
  res.json(response);
});

function sortRenewalObjects(objArray, query) {
  query.SortBy = query.SortBy.trim().split(',').map(prop => {
    var columnDef = prop.trim().split(' ');
    if ((columnDef.length === 1 && query.SortDirection.toLowerCase() === 'asc') || (columnDef.length === 2 && columnDef[1].toLowerCase() === 'asc')) {
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
          isExclusive: configurationType === "Estimate" && vendor ==='CISCO' ? false : true,
          shipTo: null,
          buyMethod: "sap46",
          endUser: [
            {
              id: null,
              companyName: null,
              name: " ",
              line1: "2 BANK OF AMERICA PLZ",
              line2: "BANK OF OMNI",
              line3: null,
              city: null,
              state: "CHARLOTTE",
              zip: null,
              postalCode: "28280",
              country: "US",
              email: null,
              contactEmail: null,
              phoneNumber: null,
            },
          ],
          reseller: null,
          configID: "WC121011624NR",
          source: {
            type: configurationType,
            value: "QJ128146301OP",
          },
          notes: null,
          "items": [{
            "id": "1.0",
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
  console.log(req.body);

  if (!validateSession(req, res)) return res.status(401);

  res.json({
    content: {
      url: "https://apps.cisco.com/eb2b/tnxshop/U2hcServlet?P1=081940553-4009d55f-17ba623a67f-c99417e13b6c4681f7d4d16d678eaa5e&P2=https%3A%2F%2Fapps.cisco.com%2Fccw%2Fcpc%2Fhome&P4=CREATE&P6=N",
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
  const response = {"content":{"details":[{"source":{"salesOrg":"0100","targetSystem":"R3","key":"U100000000274","system":"RQ","type":null,"id":"U100000000274"},"published":"2022-03-14T13:52:52.921Z","reseller":{"vendorAccountName":"The Network Support Co., LLC","vendorAccountNumber":"2927369","id":"38054253","name":"TECH DATA CORPORATION","nameUpper":"TECH DATA CORPORATION","contact":[{"name":" ","email":null,"phone":null}],"address":null},"endUser":{"id":null,"name":"Coastal Dealerships","nameUpper":"COASTAL DEALERSHIPS","contact":[{"name":"Tom Norton","email":"ADMINISTRATOR@COASTALDEALERSHIPS.COM","phone":null}],"address":{"id":null,"line1":"109 Accord Park Dr","line2":null,"line3":null,"city":"Norwell","state":null,"postalCode":"02061-1605","country":null,"county":"PLYMOUTH","countryCode":"US"}},"shipTo":null,"alternateIdentifier":null,"vendorSalesRep":null,"vendorSalesAssociate":null,"items":[{"id":"1.0","group":null,"solution":null,"parent":null,"product":[{"type":"TECHDATA","id":"11670274","name":null,"manufacturer":null,"manufacturerId":null,"localManufacturer":null,"classification":null,"family":"VI6-VSPHERE"},{"type":"MANUFACTURER","id":"VS6-ESSL-SUB-C","name":"VMware vSphere Essentials Kit - (v. 6) - subscription (1 year)","manufacturer":"VMWARE","manufacturerId":"21","localManufacturer":null,"classification":null,"family":null}],"quantity":1.0,"confirmedQuantity":0.0,"contractNumber":null,"contractType":null,"license":null,"references":[],"status":null,"statusNotes":null,"updated":"0001-01-01T00:00:00","unitPrice":62.93,"unitCost":0.0,"totalPrice":62.93,"unitListPrice":0.0,"unitPriceCurrency":"0","unitCostCurrency":null,"unitListPriceCurrency":null,"extendedListPrice":0.0,"requested":"0001-01-01T00:00:00","shippingCondition":null,"shippingFrom":null,"businessManager":null,"divisionManager":null,"director":null,"rejectionCode":null,"rejectionDescription":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0,"agreements":[],"attributes":[],"dealRegNumber":null,"reinstatementFeeCost":null,"reinstatementFeeSell":null,"serialNumbers":[],"instance":"175532113","discounts":[],"contract":{"id":"350872811","duration":null,"renewedDuration":"3 Years 4 Months ","startDate":"2020-10-16T00:00:00Z","endDate":"2021-10-16T00:00:00Z","newAgreementStartDate":"2021-10-17T00:00:00Z","newAgreementEndDate":null,"newUsagePeriodStartDate":null,"newUsagePeriodEndDate":null,"supportLevel":null,"serviceLevel":"Basic","usagePeriod":null},"tdNumber":null,"mfrNumber":null,"shortDescription":null,"manufacturer":"","vendorPartNo":""}],"attributes":[],"programName":"Standard","quoteCurrent":true,"firstAvailableOrderDate":"2022-03-14T00:00:00Z","lastOrderDate":"2022-03-20T00:00:00Z","statusText":null,"amountSaved":0.0,"linkedRenewals":[],"renewalGroupId":"null","dueDate":"2021-10-16T00:00:00Z","incumbent":null,"totalReinstatementFeeCost":null,"totalReinstatementFeeSell":null,"endUserType":"Commercial","vendorLogo":"https://sit.dc.tdebusiness.cloud/content/dam/techdata/shared/vendors-logos/logo-vmware.svg","revision":1.0,"subRevision":0.0,"description":null,"activeFlag":"Y","request":null,"endUserPO":null,"customerPO":"350872811-R:15FEB22 15:38:24","price":62.93,"currency":"USD","documentType":null,"quoteType":"Renewal","type":null,"level":null,"creator":null,"created":"2022-03-14T13:52:52.921Z","updated":"2022-03-14T13:52:52.921Z","expiry":"2022-03-17T00:00:00Z","status":"Active","statusNotes":null,"accountOwner":null,"orders":[],"vendorReference":[],"salesTeam":null,"salesArea":null,"superSalesArea":null,"lastUpdatedBy":null,"femAmount":0.0,"pomAmount":0.0,"samAmount":0.0,"nsmAmount":0.0,"femPercentage":0.0,"pomPercentage":0.0,"samPercentage":0.0,"nsmPercentage":0.0}]},"error":{"code":0,"messages":[],"isError":false}}
  res.json(response);
});

app.get("/libs/cq/i18n/dictionary", function (req, res) {
  res.json(
    {
      "techdata.quotes.placeholder.createfrom": "Create From",
      "techdata.quotes.placeholder.selectpricingtype": "Select pricing type",
      "techdata.grids.message.noRows": "So Lonely - No rows found From i18n",
      "techdata.grids.message.error.401": "It Wasn't Me - 401 From i18n",
      "techdata.grids.message.error.403": "Lie About Us - 403 From i18n",
      "techdata.grids.message.error.404": "Still haven't found what i'm looking for - 404 From i18n",
      "techdata.grids.message.error.408": "Yesterday - 408 From i18n",
      "techdata.grids.message.error.500": "Into the unknown - 500 From i18n",
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

//---SEARCH RESULTS---//
app.get('/ui-localize/v1/', (req, res) => {
  const id = req.query.id;
  if (!validateSession(req, res)) {
    return res.status(500).json({
      error: {
        code: 0,
        message: [],
        isError: true,
      },
    });
  }
  return res.status(200).json(getLocalizationJson(id));
});

function getLocalizationJson(id) {
  let jsonString;
  switch (id) {
    case 'Search.Web.Filters':
      jsonString = {
        FilterProducts: 'Filter',
        AdvancedSearch: 'Advanced Search',
        ViewMore: 'View More',
        Of: 'Of',
        From: 'From',
        To: 'To',
      };
      break;
    case 'Search.Web.SearchResults':
      jsonString = {
        Of: 'of',
        ItemsPerPage: 'Items Per Page',
        From: 'od',
        To: 'do',
        SearchResultsStats: 'Displaying $$pages Pages From $$total Results For',
        AddToCart: 'Add To Cart',
        Compare: 'Compare',
        Favorite: 'Favorite',
        Page: 'Page',
        Products: 'products',
        PromoSlim: 'Valid Until $$validDate',
        WebOnlyPrice: 'WEB ONLY PRICE',
      };
      break;
    default:
      jsonString = {};
  }
  return jsonString;
}

app.post('/ui-search/v1/product/getadvancedrefinements', (req, res) => {
  const response = [
    {
      group: 'Header',
      refinements: [
        {
          id: 'A05799',
          name: 'Edition',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K390157',
              text: 'Education Edition',
              selected: false,
              count: 2,
            },
            {
              id: 'K983065',
              text: 'For Dell Devices',
              selected: false,
              count: 1,
            },
            {
              id: 'K380237',
              text: 'Healthcare',
              selected: false,
              count: 1,
            },
            {
              id: 'K508095',
              text: 'Large',
              selected: false,
              count: 1,
            },
            {
              id: 'K354029',
              text: 'Limited Edition',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A05800',
          name: 'Kit',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K860212',
              text: 'Customer Kit',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00604',
          name: 'Localization',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K81243',
              text: 'English',
              selected: false,
              count: 133,
            },
            {
              id: 'K81245',
              text: 'French',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00605',
          name: 'Country Kits',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K09412',
              text: 'Argentina',
              selected: false,
              count: 1,
            },
            {
              id: 'K81224',
              text: 'Brazil',
              selected: false,
              count: 1,
            },
            {
              id: 'K09542',
              text: 'Canada',
              selected: false,
              count: 10,
            },
            {
              id: 'K09420',
              text: 'Colombia',
              selected: false,
              count: 3,
            },
            {
              id: 'K12072',
              text: 'Ecuador',
              selected: false,
              count: 3,
            },
            {
              id: 'K09427',
              text: 'Japan',
              selected: false,
              count: 1,
            },
            {
              id: 'K28714',
              text: 'Latin America',
              selected: false,
              count: 1,
            },
            {
              id: 'K09550',
              text: 'Mexico',
              selected: false,
              count: 7,
            },
            {
              id: 'K57094',
              text: 'North America',
              selected: false,
              count: 3,
            },
            {
              id: 'K12106',
              text: 'Panama',
              selected: false,
              count: 3,
            },
            {
              id: 'K12070',
              text: 'Peru',
              selected: false,
              count: 3,
            },
            {
              id: 'K81238',
              text: 'United Kingdom',
              selected: false,
              count: 1,
            },
            {
              id: 'K81239',
              text: 'United States',
              selected: false,
              count: 167,
            },
            {
              id: 'K81242',
              text: 'Worldwide',
              selected: false,
              count: 3,
            },
          ],
        },
        {
          id: 'A00694',
          name: 'Packaged Quantity',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1,
            max: 25,
          },
          options: [
            {
              id: 'K01960',
              text: '25',
              selected: false,
              count: 1,
            },
            {
              id: 'K01962',
              text: '10',
              selected: false,
              count: 1,
            },
            {
              id: 'K02097',
              text: '2',
              selected: false,
              count: 1,
            },
            {
              id: 'K02103',
              text: '1',
              selected: false,
              count: 607,
            },
          ],
        },
      ],
    },
    {
      group: 'General',
      refinements: [
        {
          id: 'A00371',
          name: 'Product Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K11984',
              text: 'Carrying backpack',
              selected: false,
              count: 1,
            },
            {
              id: 'K162446',
              text: 'Mounting bracket',
              selected: false,
              count: 1,
            },
            {
              id: 'K37812',
              text: 'Notebook accessories bundle',
              selected: false,
              count: 1,
            },
            {
              id: 'K844432',
              text: 'Notebook anti-glare filter',
              selected: false,
              count: 2,
            },
            {
              id: 'K167964',
              text: 'Notebook arm mount tray',
              selected: false,
              count: 1,
            },
            {
              id: 'K159644',
              text: 'Notebook carrying backpack',
              selected: false,
              count: 14,
            },
            {
              id: 'K159645',
              text: 'Notebook carrying case',
              selected: false,
              count: 14,
            },
            {
              id: 'K39621',
              text: 'Notebook locking cable',
              selected: false,
              count: 2,
            },
            {
              id: 'K229600',
              text: 'Notebook privacy filter',
              selected: false,
              count: 21,
            },
            {
              id: 'K97949',
              text: 'Notebook screen protector',
              selected: false,
              count: 1,
            },
            {
              id: 'K36590',
              text: 'Notebook shield case',
              selected: false,
              count: 1,
            },
            {
              id: 'K259139',
              text: 'Notebook sleeve',
              selected: false,
              count: 11,
            },
            {
              id: 'K19670',
              text: 'Notebook stylus',
              selected: false,
              count: 1,
            },
            {
              id: 'K216876',
              text: 'Scanner carrying case',
              selected: false,
              count: 1,
            },
            {
              id: 'K05414',
              text: 'Security cable lock',
              selected: false,
              count: 14,
            },
            {
              id: 'K35712',
              text: 'Security screen filter',
              selected: false,
              count: 1,
            },
            {
              id: 'K123786',
              text: 'Stylus tether',
              selected: false,
              count: 1,
            },
            {
              id: 'K10010',
              text: 'System desk stand',
              selected: false,
              count: 1,
            },
            {
              id: 'K05245',
              text: 'System floor stand',
              selected: false,
              count: 1,
            },
            {
              id: 'K285551',
              text: 'Tablet PC protective case',
              selected: false,
              count: 1,
            },
            {
              id: 'K171254',
              text: 'Tablet PC screen protector',
              selected: false,
              count: 1,
            },
            {
              id: 'K872669',
              text: 'Web camera cover',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A04431',
          name: 'Category of Accessory',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K159800',
              text: 'Carrying cases',
              selected: false,
              count: 43,
            },
            {
              id: 'K159798',
              text: 'Computer security products',
              selected: false,
              count: 37,
            },
            {
              id: 'K159795',
              text: 'Desktop computer and server accessories',
              selected: false,
              count: 4,
            },
            {
              id: 'K159788',
              text: 'Monitor accessories',
              selected: false,
              count: 2,
            },
            {
              id: 'K159786',
              text: 'Notebook and tablet PC accessories',
              selected: false,
              count: 85,
            },
            {
              id: 'K159776',
              text: 'Scanner accessories',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A02215',
          name: 'Display Screen Size Compatibility',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K392765',
              text: '10.1"',
              selected: false,
              count: 1,
            },
            {
              id: 'K301576',
              text: '11.6" wide',
              selected: false,
              count: 1,
            },
            {
              id: 'K934879',
              text: '12.3" wide',
              selected: false,
              count: 1,
            },
            {
              id: 'K327089',
              text: '12.5" wide',
              selected: false,
              count: 2,
            },
            {
              id: 'K243962',
              text: '13.3" wide',
              selected: false,
              count: 4,
            },
            {
              id: 'K271489',
              text: '13"',
              selected: false,
              count: 1,
            },
            {
              id: 'K232156',
              text: '14.1" wide',
              selected: false,
              count: 2,
            },
            {
              id: 'K56000',
              text: '14"',
              selected: false,
              count: 1,
            },
            {
              id: 'K181413',
              text: '14" wide',
              selected: false,
              count: 2,
            },
            {
              id: 'K232157',
              text: '15.4" wide',
              selected: false,
              count: 2,
            },
            {
              id: 'K181415',
              text: '15.6" wide',
              selected: false,
              count: 5,
            },
            {
              id: 'K52381',
              text: '15"',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A05387',
          name: 'Display Screen Size Compatibility (metric)',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K392766',
              text: '25.7 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K327007',
              text: '29.4 cm wide',
              selected: false,
              count: 1,
            },
            {
              id: 'K743851',
              text: '31.2 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K327090',
              text: '31.8 cm wide',
              selected: false,
              count: 2,
            },
            {
              id: 'K190243',
              text: '33 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K190248',
              text: '33.8 cm wide',
              selected: false,
              count: 4,
            },
            {
              id: 'K190249',
              text: '35.6 cm',
              selected: false,
              count: 2,
            },
            {
              id: 'K190259',
              text: '35.6 cm wide',
              selected: false,
              count: 1,
            },
            {
              id: 'K190261',
              text: '35.8 cm wide',
              selected: false,
              count: 2,
            },
            {
              id: 'K190262',
              text: '38.1 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K190275',
              text: '39.1 cm wide',
              selected: false,
              count: 2,
            },
            {
              id: 'K190276',
              text: '39.6 cm wide',
              selected: false,
              count: 5,
            },
          ],
        },
        {
          id: 'A04657',
          name: 'Subcategory',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K200353',
              text: 'Batteries',
              selected: false,
              count: 26,
            },
            {
              id: 'K200370',
              text: 'Power adapters',
              selected: false,
              count: 58,
            },
          ],
        },
        {
          id: 'A04659',
          name: 'Product Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K200515',
              text: 'Car power adapter',
              selected: false,
              count: 2,
            },
            {
              id: 'K200499',
              text: 'Notebook battery',
              selected: false,
              count: 26,
            },
            {
              id: 'K200508',
              text: 'Power adapter',
              selected: false,
              count: 54,
            },
            {
              id: 'K200512',
              text: 'Power adapter - AC / car',
              selected: false,
              count: 1,
            },
            {
              id: 'K200516',
              text: 'Power adapter - car / airplane',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00342',
          name: 'Category',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K04799',
              text: 'Networking applications',
              selected: false,
              count: 12,
            },
          ],
        },
        {
          id: 'A00343',
          name: 'Subcategory',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K06569',
              text: 'Network - network backup',
              selected: false,
              count: 12,
            },
          ],
        },
        {
          id: 'A07107',
          name: 'Installation Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K524325',
              text: 'Locally installed',
              selected: false,
              count: 25,
            },
          ],
        },
      ],
    },
    {
      group: 'CE Accessories',
      refinements: [
        {
          id: 'A07520',
          name: 'Product Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K460743',
              text: 'Cradle',
              selected: false,
              count: 1,
            },
            {
              id: 'K461370',
              text: 'Hand strap',
              selected: false,
              count: 1,
            },
            {
              id: 'K460948',
              text: 'Screen privacy filter',
              selected: false,
              count: 1,
            },
            {
              id: 'K460951',
              text: 'Screen protector',
              selected: false,
              count: 3,
            },
            {
              id: 'K608450',
              text: 'Secure table stand',
              selected: false,
              count: 1,
            },
            {
              id: 'K460783',
              text: 'Stylus',
              selected: false,
              count: 1,
            },
            {
              id: 'K503357',
              text: 'Wipes holder',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A07522',
          name: 'Intended for',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K459842',
              text: 'Cart',
              selected: false,
              count: 1,
            },
            {
              id: 'K603574',
              text: 'Tablet',
              selected: false,
              count: 8,
            },
          ],
        },
      ],
    },
    {
      group: 'System',
      refinements: [
        {
          id: 'A00432',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K652004',
              text: 'Chromebox',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00032',
          name: 'Device Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K00200',
              text: 'Docking station',
              selected: false,
              count: 35,
            },
            {
              id: 'K00199',
              text: 'Port replicator',
              selected: false,
              count: 11,
            },
          ],
        },
        {
          id: 'A10585',
          name: 'Docking Interface',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K798095',
              text: 'Thunderbolt',
              selected: false,
              count: 2,
            },
            {
              id: 'K807564',
              text: 'Thunderbolt 3',
              selected: false,
              count: 3,
            },
            {
              id: 'K798093',
              text: 'USB',
              selected: false,
              count: 5,
            },
            {
              id: 'K940406',
              text: 'USB 3.0',
              selected: false,
              count: 1,
            },
            {
              id: 'K798094',
              text: 'USB-C',
              selected: false,
              count: 12,
            },
            {
              id: 'K850316',
              text: 'USB-C / Thunderbolt 3',
              selected: false,
              count: 5,
            },
            {
              id: 'K913596',
              text: 'USB-C 3.1',
              selected: false,
              count: 1,
            },
            {
              id: 'K891958',
              text: 'USB-C 3.1 / Thunderbolt 3',
              selected: false,
              count: 3,
            },
            {
              id: 'K1234311',
              text: 'USB-C 3.2 Gen 2 / Thunderbolt 3',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A02871',
          name: 'Platform Technology',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K214803',
              text: 'Intel vPro Technology',
              selected: false,
              count: 87,
            },
          ],
        },
        {
          id: 'A02797',
          name: 'Notebook Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K437686',
              text: 'Chromebook',
              selected: false,
              count: 4,
            },
            {
              id: 'K245441',
              text: 'Mobile thin client',
              selected: false,
              count: 2,
            },
            {
              id: 'K93611',
              text: 'Notebook',
              selected: false,
              count: 195,
            },
            {
              id: 'K375395',
              text: 'Tablet',
              selected: false,
              count: 30,
            },
            {
              id: 'K362273',
              text: 'Ultrabook',
              selected: false,
              count: 5,
            },
          ],
        },
        {
          id: 'A06438',
          name: 'Mechanical Design',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K972876',
              text: '180° lay-flat design',
              selected: false,
              count: 7,
            },
            {
              id: 'K405138',
              text: '360° flip design',
              selected: false,
              count: 37,
            },
            {
              id: 'K418484',
              text: 'Detachable keyboard',
              selected: false,
              count: 2,
            },
            {
              id: 'K405141',
              text: 'Keyboard dock',
              selected: false,
              count: 9,
            },
            {
              id: 'K420695',
              text: 'No keyboard',
              selected: false,
              count: 19,
            },
          ],
        },
        {
          id: 'A06751',
          name: 'Platform',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K600616',
              text: 'Apple Mac OS',
              selected: false,
              count: 4,
            },
            {
              id: 'K600617',
              text: 'Chrome OS',
              selected: false,
              count: 4,
            },
            {
              id: 'K416976',
              text: 'Other',
              selected: false,
              count: 1,
            },
            {
              id: 'K416975',
              text: 'Windows',
              selected: false,
              count: 227,
            },
          ],
        },
        {
          id: 'A04883',
          name: 'Hard Drive Capacity',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 32000000000,
            max: 2000000000000,
          },
          options: [
            {
              id: 'K02097',
              text: '2 TB',
              selected: false,
              count: 1,
            },
            {
              id: 'K324331',
              text: '1.024 TB',
              selected: false,
              count: 1,
            },
            {
              id: 'K02103',
              text: '1 TB',
              selected: false,
              count: 16,
            },
            {
              id: 'K00257',
              text: '512 GB',
              selected: false,
              count: 77,
            },
            {
              id: 'K02195',
              text: '500 GB',
              selected: false,
              count: 6,
            },
            {
              id: 'K00256',
              text: '256 GB',
              selected: false,
              count: 116,
            },
            {
              id: 'K02706',
              text: '128 GB',
              selected: false,
              count: 13,
            },
            {
              id: 'K00254',
              text: '64 GB',
              selected: false,
              count: 3,
            },
            {
              id: 'K02099',
              text: '32 GB',
              selected: false,
              count: 4,
            },
          ],
        },
        {
          id: 'A05645',
          name: 'Introduced',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K1185170',
              text: 'Early 2020',
              selected: false,
              count: 1,
            },
            {
              id: 'K857538',
              text: 'Mid 2017',
              selected: false,
              count: 4,
            },
          ],
        },
        {
          id: 'A03498',
          name: 'Rugged Design',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K140133',
              text: 'Yes',
              selected: false,
              count: 10,
            },
          ],
        },
        {
          id: 'A07883',
          name: 'Dockable',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K537317',
              text: 'Yes',
              selected: false,
              count: 116,
            },
          ],
        },
        {
          id: 'A04797',
          name: 'Embedded Security',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K1138197',
              text: 'Apple T2 Security Chip',
              selected: false,
              count: 1,
            },
            {
              id: 'K796889',
              text: 'Firmware Trusted Platform Module (TPM 2.0) Security Chip',
              selected: false,
              count: 5,
            },
            {
              id: 'K808463',
              text: 'Firmware Trusted Platform Module (TPM) Security Chip',
              selected: false,
              count: 5,
            },
            {
              id: 'K1070790',
              text: 'Google Security Chip H1',
              selected: false,
              count: 2,
            },
            {
              id: 'K804470',
              text: 'Trusted Platform Module (TPM 1.2) and firmware (TPM 2.0)',
              selected: false,
              count: 5,
            },
            {
              id: 'K205644',
              text: 'Trusted Platform Module (TPM 1.2) Security Chip',
              selected: false,
              count: 1,
            },
            {
              id: 'K417819',
              text: 'Trusted Platform Module (TPM 2.0) Security Chip',
              selected: false,
              count: 198,
            },
            {
              id: 'K205745',
              text: 'Trusted Platform Module (TPM) Security Chip',
              selected: false,
              count: 6,
            },
          ],
        },
        {
          id: 'A04732',
          name: 'Security Devices',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K299478',
              text: 'Contactless smart card reader',
              selected: false,
              count: 2,
            },
            {
              id: 'K201660',
              text: 'Fingerprint reader',
              selected: false,
              count: 134,
            },
            {
              id: 'K202321',
              text: 'Smart card reader',
              selected: false,
              count: 51,
            },
            {
              id: 'K808719',
              text: 'Smart card reader (media bay)',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'Cellular',
      refinements: [
        {
          id: 'A07678',
          name: 'SIM Card Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K742737',
              text: 'Electronic SIM card (e-SIM)',
              selected: false,
              count: 6,
            },
            {
              id: 'K493011',
              text: 'Nano SIM',
              selected: false,
              count: 11,
            },
          ],
        },
      ],
    },
    {
      group: 'Chassis',
      refinements: [
        {
          id: 'A00030',
          name: 'Form Factor',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K214459',
              text: 'Ultra small form factor',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A03106',
          name: 'Manufacturer Form Factor',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K541238',
              text: 'Mini',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'Processor',
      refinements: [
        {
          id: 'A03816',
          name: '64-bit Computing',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K148670',
              text: 'Yes',
              selected: false,
              count: 231,
            },
          ],
        },
        {
          id: 'A03483',
          name: 'Number of Cores',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K162139',
              text: '6-core',
              selected: false,
              count: 26,
            },
            {
              id: 'K162140',
              text: '8-core',
              selected: false,
              count: 5,
            },
            {
              id: 'K138929',
              text: 'Dual-Core',
              selected: false,
              count: 16,
            },
            {
              id: 'K162138',
              text: 'Quad-Core',
              selected: false,
              count: 172,
            },
          ],
        },
        {
          id: 'A03267',
          name: 'Processor Number',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K1036008',
              text: '3500U',
              selected: false,
              count: 2,
            },
            {
              id: 'K1039711',
              text: '3700U',
              selected: false,
              count: 4,
            },
            {
              id: 'K822440',
              text: '3865U',
              selected: false,
              count: 1,
            },
            {
              id: 'K1030779',
              text: '3867U',
              selected: false,
              count: 1,
            },
            {
              id: 'K975212',
              text: '4415Y',
              selected: false,
              count: 3,
            },
            {
              id: 'K1219091',
              text: '4650U',
              selected: false,
              count: 3,
            },
            {
              id: 'K1219090',
              text: '4750U',
              selected: false,
              count: 1,
            },
            {
              id: 'K1036867',
              text: 'A4-9120C',
              selected: false,
              count: 1,
            },
            {
              id: 'K1102377',
              text: 'E-2276M',
              selected: false,
              count: 1,
            },
            {
              id: 'K1105049',
              text: 'E-2286M',
              selected: false,
              count: 1,
            },
            {
              id: 'K788059',
              text: 'I3-7100U',
              selected: false,
              count: 1,
            },
            {
              id: 'K1106482',
              text: 'I5-10210U',
              selected: false,
              count: 14,
            },
            {
              id: 'K1110125',
              text: 'I5-10210Y',
              selected: false,
              count: 1,
            },
            {
              id: 'K1201847',
              text: 'I5-10310U',
              selected: false,
              count: 8,
            },
            {
              id: 'K1104368',
              text: 'I5-1035G4',
              selected: false,
              count: 3,
            },
            {
              id: 'K1104364',
              text: 'I5-1035G7',
              selected: false,
              count: 8,
            },
            {
              id: 'K824085',
              text: 'I5-7300U',
              selected: false,
              count: 2,
            },
            {
              id: 'K834308',
              text: 'I5-7Y57',
              selected: false,
              count: 2,
            },
            {
              id: 'K871873',
              text: 'I5-8250U',
              selected: false,
              count: 6,
            },
            {
              id: 'K983449',
              text: 'I5-8265U',
              selected: false,
              count: 14,
            },
            {
              id: 'K893208',
              text: 'I5-8350U',
              selected: false,
              count: 2,
            },
            {
              id: 'K1064467',
              text: 'I5-8365U',
              selected: false,
              count: 32,
            },
            {
              id: 'K1086183',
              text: 'I5-9400H',
              selected: false,
              count: 6,
            },
            {
              id: 'K1106481',
              text: 'I7-10510U',
              selected: false,
              count: 10,
            },
            {
              id: 'K1201846',
              text: 'I7-10610U',
              selected: false,
              count: 5,
            },
            {
              id: 'K1104366',
              text: 'I7-1065G7',
              selected: false,
              count: 18,
            },
            {
              id: 'K1110126',
              text: 'I7-10710U',
              selected: false,
              count: 1,
            },
            {
              id: 'K1170236',
              text: 'I7-10750H',
              selected: false,
              count: 2,
            },
            {
              id: 'K1171303',
              text: 'I7-10875H',
              selected: false,
              count: 1,
            },
            {
              id: 'K790204',
              text: 'I7-7Y75',
              selected: false,
              count: 2,
            },
            {
              id: 'K983813',
              text: 'I7-8565U',
              selected: false,
              count: 10,
            },
            {
              id: 'K893207',
              text: 'I7-8650U',
              selected: false,
              count: 6,
            },
            {
              id: 'K1069090',
              text: 'I7-8665U',
              selected: false,
              count: 29,
            },
            {
              id: 'K1042750',
              text: 'I7-9750H',
              selected: false,
              count: 9,
            },
            {
              id: 'K1086772',
              text: 'I7-9850H',
              selected: false,
              count: 11,
            },
            {
              id: 'K1052852',
              text: 'I9-9880H',
              selected: false,
              count: 2,
            },
            {
              id: 'K986308',
              text: 'M3-8100Y',
              selected: false,
              count: 2,
            },
            {
              id: 'K1127891',
              text: 'N4020',
              selected: false,
              count: 1,
            },
            {
              id: 'K931428',
              text: 'N4100',
              selected: false,
              count: 1,
            },
            {
              id: 'K1146402',
              text: 'N4120',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A06115',
          name: 'Generation',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K1104069',
              text: '10',
              selected: false,
              count: 72,
            },
            {
              id: 'K781855',
              text: '7',
              selected: false,
              count: 10,
            },
            {
              id: 'K871874',
              text: '8',
              selected: false,
              count: 101,
            },
            {
              id: 'K995004',
              text: '9',
              selected: false,
              count: 28,
            },
          ],
        },
        {
          id: 'A00037',
          name: 'Installed Qty',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1,
            max: 1,
          },
          options: [
            {
              id: 'K02103',
              text: '1',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00038',
          name: 'Max Supported Qty',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1,
            max: 1,
          },
          options: [
            {
              id: 'K02103',
              text: '1',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00039',
          name: 'Manufacturer',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K01750',
              text: 'AMD',
              selected: false,
              count: 11,
            },
            {
              id: 'K00242',
              text: 'Intel',
              selected: false,
              count: 221,
            },
            {
              id: 'K1122658',
              text: 'Microsoft',
              selected: false,
              count: 5,
            },
          ],
        },
        {
          id: 'A00040',
          name: 'Clock Speed',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1000000000,
            max: 3000000000,
          },
          options: [
            {
              id: 'K02104',
              text: '3 GHz',
              selected: false,
              count: 5,
            },
            {
              id: 'K02416',
              text: '2.9 GHz',
              selected: false,
              count: 1,
            },
            {
              id: 'K02121',
              text: '2.8 GHz',
              selected: false,
              count: 1,
            },
            {
              id: 'K02283',
              text: '2.6 GHz',
              selected: false,
              count: 24,
            },
            {
              id: 'K02120',
              text: '2.5 GHz',
              selected: false,
              count: 6,
            },
            {
              id: 'K02922',
              text: '2.4 GHz',
              selected: false,
              count: 2,
            },
            {
              id: 'K02235',
              text: '2.3 GHz',
              selected: false,
              count: 7,
            },
            {
              id: 'K02913',
              text: '2.1 GHz',
              selected: false,
              count: 5,
            },
            {
              id: 'K02097',
              text: '2 GHz',
              selected: false,
              count: 1,
            },
            {
              id: 'K02237',
              text: '1.9 GHz',
              selected: false,
              count: 35,
            },
            {
              id: 'K02161',
              text: '1.8 GHz',
              selected: false,
              count: 27,
            },
            {
              id: 'K02433',
              text: '1.7 GHz',
              selected: false,
              count: 11,
            },
            {
              id: 'K02157',
              text: '1.6 GHz',
              selected: false,
              count: 70,
            },
            {
              id: 'K10388',
              text: '1.3 GHz',
              selected: false,
              count: 22,
            },
            {
              id: 'K02526',
              text: '1.2 GHz',
              selected: false,
              count: 10,
            },
            {
              id: 'K02450',
              text: '1.1 GHz',
              selected: false,
              count: 9,
            },
            {
              id: 'K02103',
              text: '1 GHz',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'Mainboard',
      refinements: [
        {
          id: 'A00050',
          name: 'Chipset Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K1200662',
              text: 'Intel HM470',
              selected: false,
              count: 2,
            },
            {
              id: 'K987626',
              text: 'Mobile Intel CM246',
              selected: false,
              count: 17,
            },
            {
              id: 'K946670',
              text: 'Mobile Intel HM370',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'Cache Memory',
      refinements: [
        {
          id: 'A11963',
          name: 'Per Processor Size',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 2097152,
            max: 2097152,
          },
          options: [
            {
              id: 'K02097',
              text: '2 MB',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A11964',
          name: 'Installed Size',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1048576,
            max: 16777216,
          },
          options: [
            {
              id: 'K02272',
              text: '16 MB',
              selected: false,
              count: 3,
            },
            {
              id: 'K02148',
              text: '12 MB',
              selected: false,
              count: 22,
            },
            {
              id: 'K02639',
              text: '8 MB',
              selected: false,
              count: 89,
            },
            {
              id: 'K02146',
              text: '6 MB',
              selected: false,
              count: 89,
            },
            {
              id: 'K02147',
              text: '4 MB',
              selected: false,
              count: 17,
            },
            {
              id: 'K02104',
              text: '3 MB',
              selected: false,
              count: 3,
            },
            {
              id: 'K02097',
              text: '2 MB',
              selected: false,
              count: 5,
            },
            {
              id: 'K02103',
              text: '1 MB',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'RAM',
      refinements: [
        {
          id: 'A00052',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K01907',
              text: 'DRAM',
              selected: false,
              count: 17,
            },
          ],
        },
        {
          id: 'A00061',
          name: 'Form Factor',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K260703',
              text: 'SO-DIMM 204-pin',
              selected: false,
              count: 4,
            },
            {
              id: 'K548202',
              text: 'SO-DIMM 260-pin',
              selected: false,
              count: 125,
            },
          ],
        },
        {
          id: 'A00056',
          name: 'Technology',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K235906',
              text: 'DDR3 SDRAM',
              selected: false,
              count: 2,
            },
            {
              id: 'K375451',
              text: 'DDR3L SDRAM',
              selected: false,
              count: 4,
            },
            {
              id: 'K542414',
              text: 'DDR4 SDRAM',
              selected: false,
              count: 167,
            },
            {
              id: 'K456756',
              text: 'LPDDR3 SDRAM',
              selected: false,
              count: 45,
            },
            {
              id: 'K742801',
              text: 'LPDDR4 SDRAM',
              selected: false,
              count: 2,
            },
            {
              id: 'K865005',
              text: 'LPDDR4X SDRAM',
              selected: false,
              count: 32,
            },
          ],
        },
        {
          id: 'A11969',
          name: 'Installed Size',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 4294967296,
            max: 34359738368,
          },
          options: [
            {
              id: 'K02099',
              text: '32 GB',
              selected: false,
              count: 10,
            },
            {
              id: 'K02272',
              text: '16 GB',
              selected: false,
              count: 109,
            },
            {
              id: 'K02639',
              text: '8 GB',
              selected: false,
              count: 109,
            },
            {
              id: 'K02147',
              text: '4 GB',
              selected: false,
              count: 9,
            },
          ],
        },
        {
          id: 'A11970',
          name: 'Max Supported Size',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 8589934592,
            max: 137438953472,
          },
          options: [
            {
              id: 'K02706',
              text: '128 GB',
              selected: false,
              count: 5,
            },
            {
              id: 'K00254',
              text: '64 GB',
              selected: false,
              count: 36,
            },
            {
              id: 'K01970',
              text: '48 GB',
              selected: false,
              count: 4,
            },
            {
              id: 'K02076',
              text: '40 GB',
              selected: false,
              count: 4,
            },
            {
              id: 'K02099',
              text: '32 GB',
              selected: false,
              count: 72,
            },
            {
              id: 'K02828',
              text: '24 GB',
              selected: false,
              count: 1,
            },
            {
              id: 'K01956',
              text: '20 GB',
              selected: false,
              count: 2,
            },
            {
              id: 'K02272',
              text: '16 GB',
              selected: false,
              count: 4,
            },
            {
              id: 'K02639',
              text: '8 GB',
              selected: false,
              count: 2,
            },
          ],
        },
        {
          id: 'A00062',
          name: 'Storage Capacity',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 8000000000,
            max: 16000000000,
          },
          options: [
            {
              id: 'K02272',
              text: '16 GB',
              selected: false,
              count: 2,
            },
            {
              id: 'K02639',
              text: '8 GB',
              selected: false,
              count: 2,
            },
          ],
        },
        {
          id: 'A11972',
          name: 'Storage Capacity',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 4294967296,
            max: 34359738368,
          },
          options: [
            {
              id: 'K02099',
              text: '32 GB',
              selected: false,
              count: 2,
            },
            {
              id: 'K02272',
              text: '16 GB',
              selected: false,
              count: 2,
            },
            {
              id: 'K02639',
              text: '8 GB',
              selected: false,
              count: 1,
            },
            {
              id: 'K02147',
              text: '4 GB',
              selected: false,
              count: 5,
            },
          ],
        },
        {
          id: 'A03413',
          name: 'Registered or Buffered',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K130562',
              text: 'Unbuffered',
              selected: false,
              count: 17,
            },
          ],
        },
        {
          id: 'A00057',
          name: 'Data Integrity Check',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K00340',
              text: 'Non-ECC',
              selected: false,
              count: 17,
            },
          ],
        },
        {
          id: 'A05823',
          name: 'Slots Qty',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1,
            max: 4,
          },
          options: [
            {
              id: 'K358579',
              text: '4',
              selected: false,
              count: 8,
            },
            {
              id: 'K358577',
              text: '2',
              selected: false,
              count: 101,
            },
            {
              id: 'K358576',
              text: '1',
              selected: false,
              count: 12,
            },
          ],
        },
        {
          id: 'A05779',
          name: 'Empty Slots',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 0,
            max: 3,
          },
          options: [
            {
              id: 'K352731',
              text: '3',
              selected: false,
              count: 8,
            },
            {
              id: 'K352729',
              text: '1',
              selected: false,
              count: 95,
            },
            {
              id: 'K352728',
              text: '0',
              selected: false,
              count: 15,
            },
          ],
        },
        {
          id: 'A00486',
          name: 'Memory Speed',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1333000000,
            max: 3733000000,
          },
          options: [
            {
              id: 'K698999',
              text: '3733 MHz',
              selected: false,
              count: 7,
            },
            {
              id: 'K168086',
              text: '3200 MHz',
              selected: false,
              count: 9,
            },
            {
              id: 'K455288',
              text: '2933 MHz',
              selected: false,
              count: 2,
            },
            {
              id: 'K373198',
              text: '2666 MHz',
              selected: false,
              count: 64,
            },
            {
              id: 'K199733',
              text: '2400 MHz',
              selected: false,
              count: 63,
            },
            {
              id: 'K268315',
              text: '2133 MHz',
              selected: false,
              count: 38,
            },
            {
              id: 'K264315',
              text: '1866 MHz',
              selected: false,
              count: 17,
            },
            {
              id: 'K40536',
              text: '1600 MHz',
              selected: false,
              count: 3,
            },
            {
              id: 'K202930',
              text: '1333 MHz',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A02004',
          name: 'Memory Specification Compliance',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K246603',
              text: 'PC3-10600',
              selected: false,
              count: 1,
            },
            {
              id: 'K245395',
              text: 'PC3-12800',
              selected: false,
              count: 1,
            },
            {
              id: 'K492563',
              text: 'PC3L-12800',
              selected: false,
              count: 1,
            },
            {
              id: 'K542415',
              text: 'PC4-17000',
              selected: false,
              count: 1,
            },
            {
              id: 'K555539',
              text: 'PC4-19200',
              selected: false,
              count: 12,
            },
            {
              id: 'K555542',
              text: 'PC4-21300',
              selected: false,
              count: 6,
            },
            {
              id: 'K896289',
              text: 'PC4-21333',
              selected: false,
              count: 1,
            },
            {
              id: 'K879898',
              text: 'PC4-23400',
              selected: false,
              count: 1,
            },
            {
              id: 'K563458',
              text: 'PC4-25600',
              selected: false,
              count: 2,
            },
          ],
        },
        {
          id: 'A01843',
          name: 'CAS Latency',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K324748',
              text: 'CL11',
              selected: false,
              count: 2,
            },
            {
              id: 'K542416',
              text: 'CL15',
              selected: false,
              count: 1,
            },
            {
              id: 'K572981',
              text: 'CL17',
              selected: false,
              count: 3,
            },
            {
              id: 'K697996',
              text: 'CL19',
              selected: false,
              count: 1,
            },
            {
              id: 'K769961',
              text: 'CL20',
              selected: false,
              count: 1,
            },
            {
              id: 'K237207',
              text: 'CL9',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00066',
          name: 'Upgrade Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K00433',
              text: 'Generic',
              selected: false,
              count: 8,
            },
            {
              id: 'K00434',
              text: 'System specific',
              selected: false,
              count: 9,
            },
          ],
        },
      ],
    },
    {
      group: 'Memory Module',
      refinements: [
        {
          id: 'A03374',
          name: 'Modules in Kit',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K147176',
              text: '2',
              selected: false,
              count: 2,
            },
          ],
        },
      ],
    },
    {
      group: 'Storage',
      refinements: [
        {
          id: 'A00434',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K01856',
              text: 'Hard drive',
              selected: false,
              count: 14,
            },
            {
              id: 'K106372',
              text: 'Solid state drive',
              selected: false,
              count: 26,
            },
          ],
        },
      ],
    },
    {
      group: 'Storage Controller',
      refinements: [
        {
          id: 'A00230',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K02095',
              text: 'None',
              selected: false,
              count: 41,
            },
          ],
        },
      ],
    },
    {
      group: 'Hard Drive',
      refinements: [
        {
          id: 'A06201',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K391944',
              text: 'SSD',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A03164',
          name: 'Hard Drive Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K93101',
              text: 'Internal hard drive',
              selected: false,
              count: 40,
            },
          ],
        },
        {
          id: 'A05780',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K352670',
              text: 'HDD',
              selected: false,
              count: 7,
            },
            {
              id: 'K352671',
              text: 'SSD',
              selected: false,
              count: 229,
            },
          ],
        },
        {
          id: 'A07705',
          name: 'SSD Form Factor',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K504488',
              text: 'eMMC',
              selected: false,
              count: 6,
            },
            {
              id: 'K501035',
              text: 'M.2',
              selected: false,
              count: 75,
            },
            {
              id: 'K1067257',
              text: 'M.2 2230',
              selected: false,
              count: 5,
            },
            {
              id: 'K805980',
              text: 'M.2 2242',
              selected: false,
              count: 1,
            },
            {
              id: 'K790407',
              text: 'M.2 2280',
              selected: false,
              count: 107,
            },
            {
              id: 'K867911',
              text: 'Soldered',
              selected: false,
              count: 6,
            },
          ],
        },
        {
          id: 'A05919',
          name: 'External Drive Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K372039',
              text: 'Desktop',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00489',
          name: 'Form Factor',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K60603',
              text: '2.5"',
              selected: false,
              count: 30,
            },
            {
              id: 'K213677',
              text: '2.5" SFF',
              selected: false,
              count: 8,
            },
            {
              id: 'K60597',
              text: '2.5" x 1/8H',
              selected: false,
              count: 2,
            },
          ],
        },
        {
          id: 'A05396',
          name: 'Form Factor (metric)',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K192012',
              text: '6.4 cm',
              selected: false,
              count: 30,
            },
            {
              id: 'K192014',
              text: '6.4 cm SFF',
              selected: false,
              count: 8,
            },
            {
              id: 'K192023',
              text: '6.4 cm x 1/8H',
              selected: false,
              count: 2,
            },
          ],
        },
        {
          id: 'A05313',
          name: 'Form Factor (Short)',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K118636',
              text: '2.5"',
              selected: false,
              count: 40,
            },
          ],
        },
        {
          id: 'A05402',
          name: 'Form Factor (Short) (metric)',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K192065',
              text: '6.4 cm',
              selected: false,
              count: 40,
            },
          ],
        },
        {
          id: 'A07063',
          name: 'Interface Class',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K427003',
              text: 'Serial ATA',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00433',
          name: 'Interface Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K186562',
              text: 'Serial ATA-600',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A05320',
          name: 'Interface',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K764393',
              text: 'PCI Express 3.1 x4 (NVMe)',
              selected: false,
              count: 1,
            },
            {
              id: 'K122679',
              text: 'Serial ATA',
              selected: false,
              count: 1,
            },
            {
              id: 'K122693',
              text: 'Serial ATA-300',
              selected: false,
              count: 2,
            },
            {
              id: 'K186563',
              text: 'Serial ATA-600',
              selected: false,
              count: 22,
            },
            {
              id: 'K122694',
              text: 'Serial Attached SCSI',
              selected: false,
              count: 2,
            },
            {
              id: 'K122696',
              text: 'Serial Attached SCSI 2',
              selected: false,
              count: 7,
            },
            {
              id: 'K450113',
              text: 'Serial Attached SCSI 3',
              selected: false,
              count: 3,
            },
            {
              id: 'K882603',
              text: 'U.2 PCIe 3.0 x4 (NVMe)',
              selected: false,
              count: 1,
            },
            {
              id: 'K963310',
              text: 'U.2 PCIe 3.1 x4 (NVMe)',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00076',
          name: 'Capacity',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 32000000000,
            max: 6400000000000,
          },
          options: [
            {
              id: 'K03700',
              text: '6.4 TB',
              selected: false,
              count: 1,
            },
            {
              id: 'K14844',
              text: '3.84 TB',
              selected: false,
              count: 3,
            },
            {
              id: 'K02097',
              text: '2 TB',
              selected: false,
              count: 3,
            },
            {
              id: 'K65593',
              text: '1.92 TB',
              selected: false,
              count: 1,
            },
            {
              id: 'K02144',
              text: '1.5 TB',
              selected: false,
              count: 1,
            },
            {
              id: 'K02526',
              text: '1.2 TB',
              selected: false,
              count: 2,
            },
            {
              id: 'K02103',
              text: '1 TB',
              selected: false,
              count: 23,
            },
            {
              id: 'K02388',
              text: '900 GB',
              selected: false,
              count: 1,
            },
            {
              id: 'K02843',
              text: '800 GB',
              selected: false,
              count: 1,
            },
            {
              id: 'K02078',
              text: '750 GB',
              selected: false,
              count: 1,
            },
            {
              id: 'K02413',
              text: '600 GB',
              selected: false,
              count: 1,
            },
            {
              id: 'K00257',
              text: '512 GB',
              selected: false,
              count: 79,
            },
            {
              id: 'K02195',
              text: '500 GB',
              selected: false,
              count: 8,
            },
            {
              id: 'K02047',
              text: '480 GB',
              selected: false,
              count: 4,
            },
            {
              id: 'K03175',
              text: '320 GB',
              selected: false,
              count: 1,
            },
            {
              id: 'K02294',
              text: '300 GB',
              selected: false,
              count: 2,
            },
            {
              id: 'K00256',
              text: '256 GB',
              selected: false,
              count: 117,
            },
            {
              id: 'K02734',
              text: '250 GB',
              selected: false,
              count: 2,
            },
            {
              id: 'K02088',
              text: '240 GB',
              selected: false,
              count: 2,
            },
            {
              id: 'K02480',
              text: '146 GB',
              selected: false,
              count: 2,
            },
            {
              id: 'K02706',
              text: '128 GB',
              selected: false,
              count: 13,
            },
            {
              id: 'K03060',
              text: '120 GB',
              selected: false,
              count: 1,
            },
            {
              id: 'K02328',
              text: '80 GB',
              selected: false,
              count: 1,
            },
            {
              id: 'K00254',
              text: '64 GB',
              selected: false,
              count: 3,
            },
            {
              id: 'K02099',
              text: '32 GB',
              selected: false,
              count: 4,
            },
          ],
        },
        {
          id: 'A10806',
          name: 'SSD Technology',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K867939',
              text: '3D Xpoint (Optane)',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A05914',
          name: 'NAND Flash Memory Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K809756',
              text: '3D multi-level cell (MLC)',
              selected: false,
              count: 4,
            },
            {
              id: 'K771091',
              text: '3D triple-level cell (TLC)',
              selected: false,
              count: 10,
            },
            {
              id: 'K370750',
              text: 'Multi-level cell (MLC)',
              selected: false,
              count: 3,
            },
            {
              id: 'K466364',
              text: 'Triple-level cell (TLC)',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A04654',
          name: 'Hard Drive Features',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K877912',
              text: 'Class 35',
              selected: false,
              count: 17,
            },
            {
              id: 'K892262',
              text: 'Class 40',
              selected: false,
              count: 21,
            },
            {
              id: 'K913255',
              text: 'eMMC 5.1',
              selected: false,
              count: 2,
            },
            {
              id: 'K629416',
              text: 'FIPS Encryption',
              selected: false,
              count: 1,
            },
            {
              id: 'K703889',
              text: 'FIPS Opal 2 Encryption',
              selected: false,
              count: 5,
            },
            {
              id: 'K809478',
              text: 'HP Value',
              selected: false,
              count: 13,
            },
            {
              id: 'K810948',
              text: 'Multi-level cell (MLC)',
              selected: false,
              count: 2,
            },
            {
              id: 'K709552',
              text: 'NVM Express (NVMe)',
              selected: false,
              count: 164,
            },
            {
              id: 'K1087284',
              text: 'Quad-level Cell (QLC)',
              selected: false,
              count: 3,
            },
            {
              id: 'K305291',
              text: 'Self-Encrypting Drive',
              selected: false,
              count: 11,
            },
            {
              id: 'K472285',
              text: 'TCG Opal Encryption',
              selected: false,
              count: 1,
            },
            {
              id: 'K588315',
              text: 'TCG Opal Encryption 2',
              selected: false,
              count: 56,
            },
            {
              id: 'K807892',
              text: 'Triple-level cell (TLC)',
              selected: false,
              count: 20,
            },
          ],
        },
        {
          id: 'A00078',
          name: 'Average Seek Time',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 0,
            max: 0.01,
          },
          options: [
            {
              id: 'K02137',
              text: '11 ms',
              selected: false,
              count: 1,
            },
            {
              id: 'K03256',
              text: '8.5 ms',
              selected: false,
              count: 1,
            },
            {
              id: 'K02268',
              text: '3.7 ms',
              selected: false,
              count: 1,
            },
            {
              id: 'K02283',
              text: '2.6 ms',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00082',
          name: 'Data Transfer Rate',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 2400000000,
            max: 9600000000,
          },
          options: [
            {
              id: 'K02526',
              text: '1.2 GBps',
              selected: false,
              count: 3,
            },
            {
              id: 'K02413',
              text: '600 MBps',
              selected: false,
              count: 24,
            },
            {
              id: 'K02294',
              text: '300 MBps',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00083',
          name: 'Internal Data Rate',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1104000000,
            max: 24000000000,
          },
          options: [
            {
              id: 'K02223',
              text: '3000 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K15965',
              text: '2850 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K05557',
              text: '2600 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K04278',
              text: '560 MBps',
              selected: false,
              count: 6,
            },
            {
              id: 'K27405',
              text: '555 MBps',
              selected: false,
              count: 2,
            },
            {
              id: 'K03398',
              text: '550 MBps',
              selected: false,
              count: 5,
            },
            {
              id: 'K02441',
              text: '545 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K02236',
              text: '540 MBps',
              selected: false,
              count: 3,
            },
            {
              id: 'K22949',
              text: '535 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K03741',
              text: '475 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K02509',
              text: '270 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K02734',
              text: '250 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K06358',
              text: '237 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K09610',
              text: '204 MBps',
              selected: false,
              count: 2,
            },
            {
              id: 'K14781',
              text: '202 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K04642',
              text: '144 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K03947',
              text: '138 MBps',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A05327',
          name: 'Internal Data Rate (Write)',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 720000000,
            max: 23200000000,
          },
          options: [
            {
              id: 'K06389',
              text: '2900 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K04074',
              text: '2200 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K04078',
              text: '1100 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K00582',
              text: '530 MBps',
              selected: false,
              count: 2,
            },
            {
              id: 'K04080',
              text: '520 MBps',
              selected: false,
              count: 9,
            },
            {
              id: 'K04842',
              text: '510 MBps',
              selected: false,
              count: 2,
            },
            {
              id: 'K02195',
              text: '500 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K03743',
              text: '490 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K02808',
              text: '330 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K02225',
              text: '280 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K02366',
              text: '135 MBps',
              selected: false,
              count: 1,
            },
            {
              id: 'K03011',
              text: '90 MBps',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A05763',
          name: '4KB Random Read',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 38000,
            max: 640000,
          },
          options: [
            {
              id: 'K125621',
              text: '640000 IOPS',
              selected: false,
              count: 1,
            },
            {
              id: 'K956670',
              text: '575000 IOPS',
              selected: false,
              count: 1,
            },
            {
              id: 'K923724',
              text: '469000 IOPS',
              selected: false,
              count: 1,
            },
            {
              id: 'K491482',
              text: '99000 IOPS',
              selected: false,
              count: 1,
            },
            {
              id: 'K427484',
              text: '98000 IOPS',
              selected: false,
              count: 2,
            },
            {
              id: 'K404858',
              text: '97000 IOPS',
              selected: false,
              count: 1,
            },
            {
              id: 'K271950',
              text: '96000 IOPS',
              selected: false,
              count: 1,
            },
            {
              id: 'K143109',
              text: '95000 IOPS',
              selected: false,
              count: 1,
            },
            {
              id: 'K42325',
              text: '90000 IOPS',
              selected: false,
              count: 1,
            },
            {
              id: 'K148655',
              text: '84000 IOPS',
              selected: false,
              count: 1,
            },
            {
              id: 'K368338',
              text: '68000 IOPS',
              selected: false,
              count: 1,
            },
            {
              id: 'K176776',
              text: '38000 IOPS',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00084',
          name: 'Spindle Speed',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 5400,
            max: 15000,
          },
          options: [
            {
              id: 'K20849',
              text: '15000 rpm',
              selected: false,
              count: 3,
            },
            {
              id: 'K02498',
              text: '10000 rpm',
              selected: false,
              count: 5,
            },
            {
              id: 'K00519',
              text: '7200 rpm',
              selected: false,
              count: 3,
            },
            {
              id: 'K00520',
              text: '5400 rpm',
              selected: false,
              count: 2,
            },
          ],
        },
        {
          id: 'A00085',
          name: 'Buffer Size',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 8000000,
            max: 2000000000,
          },
          options: [
            {
              id: 'K02097',
              text: '2 GB',
              selected: false,
              count: 1,
            },
            {
              id: 'K02103',
              text: '1 GB',
              selected: false,
              count: 1,
            },
            {
              id: 'K00257',
              text: '512 MB',
              selected: false,
              count: 3,
            },
            {
              id: 'K02706',
              text: '128 MB',
              selected: false,
              count: 1,
            },
            {
              id: 'K00254',
              text: '64 MB',
              selected: false,
              count: 5,
            },
            {
              id: 'K02272',
              text: '16 MB',
              selected: false,
              count: 2,
            },
            {
              id: 'K02639',
              text: '8 MB',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A12138',
          name: 'Buffer Size',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 8388608,
            max: 2147483648,
          },
          options: [
            {
              id: 'K02097',
              text: '2 GB',
              selected: false,
              count: 1,
            },
            {
              id: 'K02103',
              text: '1 GB',
              selected: false,
              count: 1,
            },
            {
              id: 'K00257',
              text: '512 MB',
              selected: false,
              count: 3,
            },
            {
              id: 'K02706',
              text: '128 MB',
              selected: false,
              count: 1,
            },
            {
              id: 'K00254',
              text: '64 MB',
              selected: false,
              count: 5,
            },
            {
              id: 'K02272',
              text: '16 MB',
              selected: false,
              count: 2,
            },
            {
              id: 'K02639',
              text: '8 MB',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00088',
          name: 'Non-Recoverable Errors',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K00548',
              text: '1 per 10^14',
              selected: false,
              count: 3,
            },
            {
              id: 'K02482',
              text: '1 per 10^15',
              selected: false,
              count: 1,
            },
            {
              id: 'K04032',
              text: '1 per 10^16',
              selected: false,
              count: 5,
            },
            {
              id: 'K348551',
              text: '1 per 10^17',
              selected: false,
              count: 8,
            },
          ],
        },
        {
          id: 'A11197',
          name: '24x7 Operation',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K951357',
              text: 'Yes',
              selected: false,
              count: 2,
            },
          ],
        },
      ],
    },
    {
      group: 'SSD Cache',
      refinements: [
        {
          id: 'A10807',
          name: 'Technology',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K867940',
              text: '3D Xpoint (Optane)',
              selected: false,
              count: 25,
            },
          ],
        },
      ],
    },
    {
      group: 'Hard Drive (2nd)',
      refinements: [
        {
          id: 'A06206',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K392840',
              text: 'None',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'Optical Storage',
      refinements: [
        {
          id: 'A05796',
          name: 'Drive Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K352678',
              text: 'DVD SuperMulti',
              selected: false,
              count: 5,
            },
            {
              id: 'K352680',
              text: 'DVD-Writer',
              selected: false,
              count: 3,
            },
            {
              id: 'K454179',
              text: 'No optical drive',
              selected: false,
              count: 229,
            },
          ],
        },
        {
          id: 'A00109',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K107318',
              text: 'DVD-Writer',
              selected: false,
              count: 3,
            },
            {
              id: 'K151111',
              text: 'DVD±RW (±R DL) / DVD-RAM',
              selected: false,
              count: 3,
            },
            {
              id: 'K81090',
              text: 'DVD±RW / DVD-RAM',
              selected: false,
              count: 2,
            },
            {
              id: 'K01772',
              text: 'None',
              selected: false,
              count: 270,
            },
          ],
        },
      ],
    },
    {
      group: 'Card Reader',
      refinements: [
        {
          id: 'A03174',
          name: 'Supported Flash Memory Cards',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K147308',
              text: 'microSD',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A03241',
          name: 'Supported Flash Memory',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K271286',
              text: 'microSD',
              selected: false,
              count: 95,
            },
            {
              id: 'K379639',
              text: 'microSDHC',
              selected: false,
              count: 29,
            },
            {
              id: 'K423505',
              text: 'microSDXC',
              selected: false,
              count: 30,
            },
            {
              id: 'K508235',
              text: 'microSDXC UHS',
              selected: false,
              count: 11,
            },
            {
              id: 'K202208',
              text: 'miniSD',
              selected: false,
              count: 1,
            },
            {
              id: 'K100465',
              text: 'MultiMediaCard',
              selected: false,
              count: 8,
            },
            {
              id: 'K100406',
              text: 'SD Memory Card',
              selected: false,
              count: 36,
            },
            {
              id: 'K260553',
              text: 'SDHC Memory Card',
              selected: false,
              count: 28,
            },
            {
              id: 'K285335',
              text: 'SDXC Memory Card',
              selected: false,
              count: 34,
            },
            {
              id: 'K549888',
              text: 'SDXC UHS Memory Card',
              selected: false,
              count: 1,
            },
            {
              id: 'K481575',
              text: 'SDXC UHS-II Memory Card',
              selected: false,
              count: 24,
            },
          ],
        },
      ],
    },
    {
      group: 'Storage Removable',
      refinements: [
        {
          id: 'A00094',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K01789',
              text: 'None',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'Display',
      refinements: [
        {
          id: 'A05784',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K352688',
              text: 'LCD',
              selected: false,
              count: 68,
            },
            {
              id: 'K352689',
              text: 'LED',
              selected: false,
              count: 167,
            },
            {
              id: 'K737056',
              text: 'OLED',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A06209',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K391955',
              text: 'None.',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A07658',
          name: 'Touchscreen',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K486513',
              text: 'Yes',
              selected: false,
              count: 36,
            },
            {
              id: 'K486929',
              text: 'Yes (10-point multi-touch)',
              selected: false,
              count: 73,
            },
            {
              id: 'K486927',
              text: 'Yes (multi-touch)',
              selected: false,
              count: 4,
            },
          ],
        },
        {
          id: 'A05371',
          name: 'Diagonal Size (metric)',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 25.4,
            max: 43.9,
          },
          options: [
            {
              id: 'K03018',
              text: '43.9 cm',
              selected: false,
              count: 2,
            },
            {
              id: 'K02221',
              text: '43.2 cm',
              selected: false,
              count: 2,
            },
            {
              id: 'K749883',
              text: '39.652 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K199816',
              text: '39.62 cm',
              selected: false,
              count: 4,
            },
            {
              id: 'K03751',
              text: '39.6 cm',
              selected: false,
              count: 44,
            },
            {
              id: 'K791562',
              text: '39.487 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K494192',
              text: '39.49 cm',
              selected: false,
              count: 3,
            },
            {
              id: 'K1069269',
              text: '39.491 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K02589',
              text: '39.1 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K02686',
              text: '38.1 cm',
              selected: false,
              count: 13,
            },
            {
              id: 'K02341',
              text: '35.6 cm',
              selected: false,
              count: 46,
            },
            {
              id: 'K12060',
              text: '35.56 cm',
              selected: false,
              count: 38,
            },
            {
              id: 'K1055363',
              text: '35.489 cm',
              selected: false,
              count: 2,
            },
            {
              id: 'K03676',
              text: '34.3 cm',
              selected: false,
              count: 13,
            },
            {
              id: 'K404786',
              text: '33.96 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K06680',
              text: '33.9 cm',
              selected: false,
              count: 2,
            },
            {
              id: 'K05907',
              text: '33.8 cm',
              selected: false,
              count: 29,
            },
            {
              id: 'K1069270',
              text: '33.704 cm',
              selected: false,
              count: 3,
            },
            {
              id: 'K02602',
              text: '33.3 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K02429',
              text: '33 cm',
              selected: false,
              count: 7,
            },
            {
              id: 'K844054',
              text: '31.242 cm',
              selected: false,
              count: 2,
            },
            {
              id: 'K04101',
              text: '31.2 cm',
              selected: false,
              count: 7,
            },
            {
              id: 'K02086',
              text: '30.5 cm',
              selected: false,
              count: 2,
            },
            {
              id: 'K02279',
              text: '29.5 cm',
              selected: false,
              count: 3,
            },
            {
              id: 'K184422',
              text: '29.46 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K03796',
              text: '26.7 cm',
              selected: false,
              count: 2,
            },
            {
              id: 'K03423',
              text: '25.7 cm',
              selected: false,
              count: 2,
            },
            {
              id: 'K02438',
              text: '25.4 cm',
              selected: false,
              count: 3,
            },
          ],
        },
        {
          id: 'A00149',
          name: 'Native Resolution',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K00718',
              text: '1024 x 768',
              selected: false,
              count: 1,
            },
            {
              id: 'K17137',
              text: '1366 x 768',
              selected: false,
              count: 20,
            },
            {
              id: 'K975181',
              text: '1800 x 1200',
              selected: false,
              count: 3,
            },
            {
              id: 'K02035',
              text: '1920 x 1080',
              selected: false,
              count: 144,
            },
            {
              id: 'K02036',
              text: '1920 x 1200',
              selected: false,
              count: 3,
            },
            {
              id: 'K52810',
              text: '1920 x 1280',
              selected: false,
              count: 2,
            },
            {
              id: 'K853276',
              text: '2256 x 1504',
              selected: false,
              count: 10,
            },
            {
              id: 'K37745',
              text: '2304 x 1440',
              selected: false,
              count: 2,
            },
            {
              id: 'K1122492',
              text: '2496 x 1664',
              selected: false,
              count: 9,
            },
            {
              id: 'K187792',
              text: '2560 x 1440',
              selected: false,
              count: 4,
            },
            {
              id: 'K107842',
              text: '2560 x 1600',
              selected: false,
              count: 3,
            },
            {
              id: 'K698233',
              text: '2736 x 1824',
              selected: false,
              count: 7,
            },
            {
              id: 'K382406',
              text: '2880 x 1800',
              selected: false,
              count: 1,
            },
            {
              id: 'K812250',
              text: '2880 x 1920',
              selected: false,
              count: 5,
            },
            {
              id: 'K698234',
              text: '3000 x 2000',
              selected: false,
              count: 5,
            },
            {
              id: 'K895767',
              text: '3240 x 2160',
              selected: false,
              count: 4,
            },
            {
              id: 'K301118',
              text: '3840 x 2160',
              selected: false,
              count: 13,
            },
          ],
        },
        {
          id: 'A04804',
          name: 'Widescreen Display',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K206051',
              text: 'No',
              selected: false,
              count: 1,
            },
            {
              id: 'K205971',
              text: 'Yes',
              selected: false,
              count: 235,
            },
          ],
        },
        {
          id: 'A12175',
          name: 'Privacy Technology',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K1221941',
              text: 'HP SureView',
              selected: false,
              count: 16,
            },
            {
              id: 'K1221940',
              text: 'ThinkPad Privacy Guard',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'Video Output',
      refinements: [
        {
          id: 'A05642',
          name: 'Discrete Graphics Processor',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K319562',
              text: 'Yes',
              selected: false,
              count: 49,
            },
          ],
        },
        {
          id: 'A00247',
          name: 'Graphics Processor',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K1175867',
              text: 'AMD Radeon Graphics',
              selected: false,
              count: 4,
            },
            {
              id: 'K862535',
              text: 'AMD Radeon Pro 560 / Intel HD Graphics 630',
              selected: false,
              count: 1,
            },
            {
              id: 'K884566',
              text: 'AMD Radeon Pro WX 2100',
              selected: false,
              count: 1,
            },
            {
              id: 'K1081527',
              text: 'AMD Radeon Pro WX 3200 / Intel UHD Graphics 620',
              selected: false,
              count: 6,
            },
            {
              id: 'K536261',
              text: 'AMD Radeon R4',
              selected: false,
              count: 1,
            },
            {
              id: 'K911755',
              text: 'AMD Radeon Vega 10',
              selected: false,
              count: 4,
            },
            {
              id: 'K907353',
              text: 'AMD Radeon Vega 8',
              selected: false,
              count: 2,
            },
            {
              id: 'K196382',
              text: 'Intel HD Graphics',
              selected: false,
              count: 1,
            },
            {
              id: 'K822441',
              text: 'Intel HD Graphics 610',
              selected: false,
              count: 1,
            },
            {
              id: 'K782851',
              text: 'Intel HD Graphics 615',
              selected: false,
              count: 11,
            },
            {
              id: 'K782849',
              text: 'Intel HD Graphics 620',
              selected: false,
              count: 4,
            },
            {
              id: 'K1111533',
              text: 'Intel Iris Plus Graphics',
              selected: false,
              count: 26,
            },
            {
              id: 'K1112582',
              text: 'Intel UHD Graphics',
              selected: false,
              count: 31,
            },
            {
              id: 'K931476',
              text: 'Intel UHD Graphics 600',
              selected: false,
              count: 3,
            },
            {
              id: 'K880145',
              text: 'Intel UHD Graphics 620',
              selected: false,
              count: 90,
            },
            {
              id: 'K931234',
              text: 'Intel UHD Graphics 630',
              selected: false,
              count: 4,
            },
            {
              id: 'K797266',
              text: 'NVIDIA GeForce GTX 1050',
              selected: false,
              count: 1,
            },
            {
              id: 'K775806',
              text: 'NVIDIA GeForce GTX 1060',
              selected: false,
              count: 1,
            },
            {
              id: 'K1042762',
              text: 'NVIDIA GeForce GTX 1650',
              selected: false,
              count: 1,
            },
            {
              id: 'K1081524',
              text: 'NVIDIA GeForce GTX 1650 / Intel UHD Graphics 630',
              selected: false,
              count: 4,
            },
            {
              id: 'K1035059',
              text: 'NVIDIA GeForce GTX 1660 Ti',
              selected: false,
              count: 4,
            },
            {
              id: 'K864452',
              text: 'NVIDIA GeForce MX150',
              selected: false,
              count: 2,
            },
            {
              id: 'K1032877',
              text: 'NVIDIA GeForce MX250',
              selected: false,
              count: 1,
            },
            {
              id: 'K1095662',
              text: 'NVIDIA GeForce RTX 2070 Super',
              selected: false,
              count: 2,
            },
            {
              id: 'K964027',
              text: 'NVIDIA Quadro P1000 / Intel UHD Graphics 630',
              selected: false,
              count: 2,
            },
            {
              id: 'K964852',
              text: 'NVIDIA Quadro P2000 / Intel UHD Graphics P630',
              selected: false,
              count: 1,
            },
            {
              id: 'K1207433',
              text: 'NVIDIA Quadro P520 / Intel UHD Graphics',
              selected: false,
              count: 4,
            },
            {
              id: 'K1092136',
              text: 'NVIDIA Quadro P520 / Intel UHD Graphics 620',
              selected: false,
              count: 2,
            },
            {
              id: 'K939118',
              text: 'NVIDIA Quadro P620',
              selected: false,
              count: 2,
            },
            {
              id: 'K980613',
              text: 'NVIDIA Quadro P620 / Intel UHD Graphics 630',
              selected: false,
              count: 1,
            },
            {
              id: 'K1102378',
              text: 'NVIDIA Quadro RTX 3000 / Intel UHD Graphics 630',
              selected: false,
              count: 1,
            },
            {
              id: 'K1068616',
              text: 'NVIDIA Quadro RTX 4000 / Intel UHD Graphics 630',
              selected: false,
              count: 1,
            },
            {
              id: 'K1099354',
              text: 'NVIDIA Quadro T1000',
              selected: false,
              count: 3,
            },
            {
              id: 'K1097146',
              text: 'NVIDIA Quadro T1000 / Intel UHD Graphics 630',
              selected: false,
              count: 4,
            },
            {
              id: 'K1073048',
              text: 'NVIDIA Quadro T2000',
              selected: false,
              count: 1,
            },
            {
              id: 'K1097882',
              text: 'NVIDIA Quadro T2000 / Intel UHD Graphics 630',
              selected: false,
              count: 3,
            },
            {
              id: 'K1117356',
              text: 'NVIDIA Quadro T2000 / Intel UHD Graphics P630',
              selected: false,
              count: 1,
            },
            {
              id: 'K1122661',
              text: 'Qualcomm Adreno 685',
              selected: false,
              count: 5,
            },
          ],
        },
        {
          id: 'A07598',
          name: 'Graphics Processor Series',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K514724',
              text: 'AMD Radeon',
              selected: false,
              count: 4,
            },
            {
              id: 'K854111',
              text: 'AMD Radeon Pro',
              selected: false,
              count: 1,
            },
            {
              id: 'K938512',
              text: 'AMD Radeon Pro WX',
              selected: false,
              count: 7,
            },
            {
              id: 'K581937',
              text: 'AMD Radeon R4',
              selected: false,
              count: 1,
            },
            {
              id: 'K907354',
              text: 'AMD Radeon Vega',
              selected: false,
              count: 6,
            },
            {
              id: 'K474368',
              text: 'Intel HD Graphics',
              selected: false,
              count: 18,
            },
            {
              id: 'K853288',
              text: 'Intel Iris Plus Graphics',
              selected: false,
              count: 26,
            },
            {
              id: 'K880146',
              text: 'Intel UHD Graphics',
              selected: false,
              count: 158,
            },
            {
              id: 'K474364',
              text: 'NVIDIA Geforce',
              selected: false,
              count: 2,
            },
            {
              id: 'K474360',
              text: 'NVIDIA Geforce GTX',
              selected: false,
              count: 11,
            },
            {
              id: 'K875832',
              text: 'NVIDIA GeForce MX',
              selected: false,
              count: 1,
            },
            {
              id: 'K984712',
              text: 'NVIDIA GeForce RTX',
              selected: false,
              count: 2,
            },
            {
              id: 'K474354',
              text: 'NVIDIA Quadro',
              selected: false,
              count: 24,
            },
            {
              id: 'K1037765',
              text: 'NVIDIA Quadro RTX',
              selected: false,
              count: 2,
            },
            {
              id: 'K930929',
              text: 'Qualcomm Adreno',
              selected: false,
              count: 5,
            },
          ],
        },
        {
          id: 'A11158',
          name: 'VR Ready',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K940388',
              text: 'Yes',
              selected: false,
              count: 3,
            },
          ],
        },
      ],
    },
    {
      group: 'Video Memory',
      refinements: [
        {
          id: 'A11987',
          name: 'Installed Size',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 2147483648,
            max: 8589934592,
          },
          options: [
            {
              id: 'K02639',
              text: '8 GB',
              selected: false,
              count: 3,
            },
            {
              id: 'K02146',
              text: '6 GB',
              selected: false,
              count: 6,
            },
            {
              id: 'K02147',
              text: '4 GB',
              selected: false,
              count: 33,
            },
            {
              id: 'K02097',
              text: '2 GB',
              selected: false,
              count: 8,
            },
          ],
        },
      ],
    },
    {
      group: 'Audio Output',
      refinements: [
        {
          id: 'A00264',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K01768',
              text: 'None',
              selected: false,
              count: 36,
            },
          ],
        },
      ],
    },
    {
      group: 'Audio Input',
      refinements: [
        {
          id: 'A00276',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K929582',
              text: '3 multi-array microphone',
              selected: false,
              count: 29,
            },
            {
              id: 'K884218',
              text: 'Array microphone',
              selected: false,
              count: 19,
            },
            {
              id: 'K884219',
              text: 'Dual array microphone',
              selected: false,
              count: 97,
            },
            {
              id: 'K557450',
              text: 'Four microphones',
              selected: false,
              count: 9,
            },
            {
              id: 'K1230481',
              text: 'HP World Facing Microphone multi-array digital microphone',
              selected: false,
              count: 2,
            },
            {
              id: 'K01292',
              text: 'Microphone',
              selected: false,
              count: 20,
            },
            {
              id: 'K906333',
              text: 'Quad array microphone',
              selected: false,
              count: 12,
            },
            {
              id: 'K207060',
              text: 'Stereo microphone',
              selected: false,
              count: 3,
            },
            {
              id: 'K525960',
              text: 'Three microphones',
              selected: false,
              count: 2,
            },
            {
              id: 'K409324',
              text: 'Two microphones',
              selected: false,
              count: 39,
            },
          ],
        },
      ],
    },
    {
      group: 'Input Device',
      refinements: [
        {
          id: 'A00218',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K56855',
              text: 'AccuPoint',
              selected: false,
              count: 4,
            },
            {
              id: 'K294895',
              text: 'ClickPad',
              selected: false,
              count: 60,
            },
            {
              id: 'K74144',
              text: 'Digital pen',
              selected: false,
              count: 15,
            },
            {
              id: 'K01147',
              text: 'Digitizer',
              selected: false,
              count: 16,
            },
            {
              id: 'K60667',
              text: 'DualPoint',
              selected: false,
              count: 1,
            },
            {
              id: 'K629569',
              text: 'Force Touch trackpad',
              selected: false,
              count: 4,
            },
            {
              id: 'K01146',
              text: 'Keyboard',
              selected: false,
              count: 215,
            },
            {
              id: 'K906796',
              text: 'Keyboard (on selected markets only)',
              selected: false,
              count: 2,
            },
            {
              id: 'K01161',
              text: 'Pointing stick',
              selected: false,
              count: 38,
            },
            {
              id: 'K850312',
              text: 'SecurePad',
              selected: false,
              count: 4,
            },
            {
              id: 'K80429',
              text: 'Stylus',
              selected: false,
              count: 3,
            },
            {
              id: 'K801627',
              text: 'Touch Bar',
              selected: false,
              count: 2,
            },
            {
              id: 'K01160',
              text: 'Touchpad',
              selected: false,
              count: 71,
            },
            {
              id: 'K51803',
              text: 'Trackpad',
              selected: false,
              count: 25,
            },
            {
              id: 'K04547',
              text: 'TrackPoint',
              selected: false,
              count: 55,
            },
            {
              id: 'K79435',
              text: 'UltraNav',
              selected: false,
              count: 54,
            },
          ],
        },
        {
          id: 'A07683',
          name: 'Product Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K493265',
              text: 'Mouse',
              selected: false,
              count: 16,
            },
          ],
        },
        {
          id: 'A00220',
          name: 'Connectivity Technology',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K01032',
              text: 'Wired',
              selected: false,
              count: 2,
            },
            {
              id: 'K01031',
              text: 'Wireless',
              selected: false,
              count: 14,
            },
          ],
        },
        {
          id: 'A03283',
          name: 'Interface',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K268873',
              text: '2.4 GHz',
              selected: false,
              count: 7,
            },
            {
              id: 'K169919',
              text: 'Bluetooth',
              selected: false,
              count: 2,
            },
            {
              id: 'K602103',
              text: 'Bluetooth 4.0',
              selected: false,
              count: 2,
            },
            {
              id: 'K921829',
              text: 'Bluetooth 4.1',
              selected: false,
              count: 1,
            },
            {
              id: 'K921830',
              text: 'Bluetooth 4.2',
              selected: false,
              count: 2,
            },
            {
              id: 'K107976',
              text: 'USB',
              selected: false,
              count: 2,
            },
          ],
        },
        {
          id: 'A05538',
          name: 'Notebook Mouse',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K300860',
              text: 'Yes',
              selected: false,
              count: 16,
            },
          ],
        },
        {
          id: 'A00226',
          name: 'Buttons Qty',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 2,
            max: 3,
          },
          options: [
            {
              id: 'K02104',
              text: '3',
              selected: false,
              count: 11,
            },
            {
              id: 'K02097',
              text: '2',
              selected: false,
              count: 2,
            },
          ],
        },
        {
          id: 'A08636',
          name: 'Numeric Keypad',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K679578',
              text: 'Yes',
              selected: false,
              count: 34,
            },
          ],
        },
        {
          id: 'A04379',
          name: 'Ergonomic Design',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K154395',
              text: 'Yes',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00225',
          name: 'Movement Resolution',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1000,
            max: 1750,
          },
          options: [
            {
              id: 'K26181',
              text: '1750 dpi',
              selected: false,
              count: 1,
            },
            {
              id: 'K04354',
              text: '1600 dpi',
              selected: false,
              count: 1,
            },
            {
              id: 'K02481',
              text: '1000 dpi',
              selected: false,
              count: 7,
            },
          ],
        },
        {
          id: 'A00221',
          name: 'Movement Detection Technology',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K104578',
              text: 'Infrared',
              selected: false,
              count: 1,
            },
            {
              id: 'K01156',
              text: 'Optical',
              selected: false,
              count: 14,
            },
          ],
        },
        {
          id: 'A10622',
          name: 'Backlight',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K808707',
              text: 'Yes',
              selected: false,
              count: 185,
            },
            {
              id: 'K808709',
              text: 'Yes (emissive)',
              selected: false,
              count: 10,
            },
            {
              id: 'K808708',
              text: 'Yes (RGB)',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A02280',
          name: 'Orientation',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K226589',
              text: 'Right and left-handed',
              selected: false,
              count: 9,
            },
            {
              id: 'K50999',
              text: 'Right-handed',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'Keyboard',
      refinements: [
        {
          id: 'A11879',
          name: 'Keyboard Localization',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K1106051',
              text: 'English',
              selected: false,
              count: 10,
            },
            {
              id: 'K1106103',
              text: 'US',
              selected: false,
              count: 135,
            },
            {
              id: 'K1106064',
              text: 'US International',
              selected: false,
              count: 7,
            },
          ],
        },
        {
          id: 'A11869',
          name: 'Keyboard Layout',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K1106613',
              text: 'QWERTY',
              selected: false,
              count: 145,
            },
          ],
        },
      ],
    },
    {
      group: 'Mobile Broadband',
      refinements: [
        {
          id: 'A05506',
          name: 'Generation',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K357208',
              text: '4G',
              selected: false,
              count: 18,
            },
            {
              id: 'K493874',
              text: 'WWAN upgradable',
              selected: false,
              count: 3,
            },
          ],
        },
        {
          id: 'A00296',
          name: 'Cellular Protocol',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K828349',
              text: 'FirstNet Band 14',
              selected: false,
              count: 4,
            },
            {
              id: 'K310922',
              text: 'LTE',
              selected: false,
              count: 2,
            },
            {
              id: 'K731392',
              text: 'LTE Advanced',
              selected: false,
              count: 11,
            },
            {
              id: 'K978996',
              text: 'LTE Advanced Pro',
              selected: false,
              count: 5,
            },
          ],
        },
      ],
    },
    {
      group: 'Networking',
      refinements: [
        {
          id: 'A04905',
          name: 'Wireless LAN Supported',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K221655',
              text: 'Yes',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00306',
          name: 'Data Link Protocol',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K25153',
              text: 'Bluetooth',
              selected: false,
              count: 3,
            },
            {
              id: 'K557263',
              text: 'Bluetooth 4.1',
              selected: false,
              count: 13,
            },
            {
              id: 'K557260',
              text: 'Bluetooth 4.2',
              selected: false,
              count: 19,
            },
            {
              id: 'K900682',
              text: 'Bluetooth 5.0',
              selected: false,
              count: 167,
            },
            {
              id: 'K1097147',
              text: 'Bluetooth 5.1',
              selected: false,
              count: 29,
            },
            {
              id: 'K01382',
              text: 'Ethernet',
              selected: false,
              count: 122,
            },
            {
              id: 'K01395',
              text: 'Fast Ethernet',
              selected: false,
              count: 119,
            },
            {
              id: 'K04746',
              text: 'Gigabit Ethernet',
              selected: false,
              count: 128,
            },
            {
              id: 'K49915',
              text: 'IEEE 802.11a',
              selected: false,
              count: 175,
            },
            {
              id: 'K378133',
              text: 'IEEE 802.11ac',
              selected: false,
              count: 145,
            },
            {
              id: 'K738970',
              text: 'IEEE 802.11ac Wave 2',
              selected: false,
              count: 35,
            },
            {
              id: 'K954947',
              text: 'IEEE 802.11ax',
              selected: false,
              count: 110,
            },
            {
              id: 'K39938',
              text: 'IEEE 802.11b',
              selected: false,
              count: 175,
            },
            {
              id: 'K54390',
              text: 'IEEE 802.11g',
              selected: false,
              count: 175,
            },
            {
              id: 'K185206',
              text: 'IEEE 802.11n',
              selected: false,
              count: 175,
            },
            {
              id: 'K419840',
              text: 'NFC',
              selected: false,
              count: 20,
            },
          ],
        },
        {
          id: 'A04645',
          name: 'Wireless Protocol',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K185207',
              text: '802.11a/b/g/n',
              selected: false,
              count: 1,
            },
            {
              id: 'K378134',
              text: '802.11a/b/g/n/ac',
              selected: false,
              count: 87,
            },
            {
              id: 'K738971',
              text: '802.11a/b/g/n/ac Wave 2',
              selected: false,
              count: 28,
            },
            {
              id: 'K1063042',
              text: '802.11a/b/g/n/ac Wave 2/ax',
              selected: false,
              count: 7,
            },
            {
              id: 'K984840',
              text: '802.11a/b/g/n/ac/ax',
              selected: false,
              count: 52,
            },
            {
              id: 'K421324',
              text: '802.11ac',
              selected: false,
              count: 5,
            },
            {
              id: 'K954948',
              text: '802.11ax',
              selected: false,
              count: 51,
            },
            {
              id: 'K170990',
              text: 'Bluetooth',
              selected: false,
              count: 3,
            },
            {
              id: 'K557264',
              text: 'Bluetooth 4.1',
              selected: false,
              count: 13,
            },
            {
              id: 'K557261',
              text: 'Bluetooth 4.2',
              selected: false,
              count: 19,
            },
            {
              id: 'K908432',
              text: 'Bluetooth 5.0',
              selected: false,
              count: 167,
            },
            {
              id: 'K1097148',
              text: 'Bluetooth 5.1',
              selected: false,
              count: 29,
            },
            {
              id: 'K385604',
              text: 'NFC',
              selected: false,
              count: 25,
            },
            {
              id: 'K1164132',
              text: 'No Bluetooth',
              selected: false,
              count: 2,
            },
            {
              id: 'K1164130',
              text: 'No WLAN',
              selected: false,
              count: 2,
            },
          ],
        },
        {
          id: 'A05790',
          name: 'Wired Protocol',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K352690',
              text: '10/100 Ethernet',
              selected: false,
              count: 3,
            },
            {
              id: 'K717392',
              text: 'Ethernet',
              selected: false,
              count: 2,
            },
            {
              id: 'K352691',
              text: 'Gigabit Ethernet',
              selected: false,
              count: 97,
            },
          ],
        },
      ],
    },
    {
      group: 'GPS System',
      refinements: [
        {
          id: 'A02874',
          name: 'Navigation',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K342594',
              text: 'A-GPS receiver',
              selected: false,
              count: 5,
            },
            {
              id: 'K78503',
              text: 'GPS receiver',
              selected: false,
              count: 2,
            },
            {
              id: 'K373546',
              text: 'GPS/A-GPS receiver',
              selected: false,
              count: 1,
            },
            {
              id: 'K396772',
              text: 'GPS/GLONASS receiver',
              selected: false,
              count: 8,
            },
          ],
        },
      ],
    },
    {
      group: 'Interfaces',
      refinements: [
        {
          id: 'A08059',
          name: 'USB 2.0 Ports Qty',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1,
            max: 3,
          },
          options: [
            {
              id: 'K02104',
              text: '3',
              selected: false,
              count: 2,
            },
            {
              id: 'K02097',
              text: '2',
              selected: false,
              count: 2,
            },
            {
              id: 'K02103',
              text: '1',
              selected: false,
              count: 6,
            },
          ],
        },
        {
          id: 'A08060',
          name: 'USB 3.0 Ports Qty',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1,
            max: 3,
          },
          options: [
            {
              id: 'K02104',
              text: '3',
              selected: false,
              count: 40,
            },
            {
              id: 'K02097',
              text: '2',
              selected: false,
              count: 134,
            },
            {
              id: 'K02103',
              text: '1',
              selected: false,
              count: 42,
            },
          ],
        },
        {
          id: 'A10809',
          name: 'USB-C Ports Qty',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1,
            max: 4,
          },
          options: [
            {
              id: 'K02147',
              text: '4',
              selected: false,
              count: 2,
            },
            {
              id: 'K02104',
              text: '3',
              selected: false,
              count: 3,
            },
            {
              id: 'K02097',
              text: '2',
              selected: false,
              count: 105,
            },
            {
              id: 'K02103',
              text: '1',
              selected: false,
              count: 118,
            },
          ],
        },
        {
          id: 'A08061',
          name: 'HDMI Ports Qty',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1,
            max: 2,
          },
          options: [
            {
              id: 'K02097',
              text: '2',
              selected: false,
              count: 2,
            },
            {
              id: 'K02103',
              text: '1',
              selected: false,
              count: 176,
            },
          ],
        },
        {
          id: 'A10808',
          name: 'USB-C Features',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K870058',
              text: 'USB Power Delivery',
              selected: false,
              count: 91,
            },
          ],
        },
      ],
    },
    {
      group: 'OS Provided',
      refinements: [
        {
          id: 'A05470',
          name: 'Family',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K589725',
              text: 'Chrome OS',
              selected: false,
              count: 5,
            },
            {
              id: 'K937261',
              text: 'macOS',
              selected: false,
              count: 4,
            },
            {
              id: 'K641175',
              text: 'Windows 10',
              selected: false,
              count: 228,
            },
          ],
        },
        {
          id: 'A05471',
          name: 'Edition',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K1126738',
              text: 'macOS 10.15 Catalina',
              selected: false,
              count: 4,
            },
            {
              id: 'K672378',
              text: 'Windows 10',
              selected: false,
              count: 1,
            },
            {
              id: 'K641176',
              text: 'Windows 10 Home',
              selected: false,
              count: 1,
            },
            {
              id: 'K751558',
              text: 'Windows 10 IOT Enterprise',
              selected: false,
              count: 1,
            },
            {
              id: 'K655195',
              text: 'Windows 10 Pro',
              selected: false,
              count: 225,
            },
          ],
        },
        {
          id: 'A00016',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K1110892',
              text: 'Apple macOS Catalina 10.15',
              selected: false,
              count: 4,
            },
            {
              id: 'K331355',
              text: 'Google Chrome OS',
              selected: false,
              count: 4,
            },
            {
              id: 'K777313',
              text: 'Google Chrome OS 64',
              selected: false,
              count: 1,
            },
            {
              id: 'K653444',
              text: 'Windows 10 Home',
              selected: false,
              count: 1,
            },
            {
              id: 'K921550',
              text: 'Windows 10 IoT Enterprise 2016 LTSB',
              selected: false,
              count: 1,
            },
            {
              id: 'K960395',
              text: 'Windows 10 IOT Enterprise for Thin Clients',
              selected: false,
              count: 1,
            },
            {
              id: 'K653446',
              text: 'Windows 10 Pro',
              selected: false,
              count: 44,
            },
            {
              id: 'K661060',
              text: 'Windows 10 Pro 64-bit Edition',
              selected: false,
              count: 178,
            },
            {
              id: 'K911686',
              text: 'Windows 10 Pro for Workstations 64-bit Edition',
              selected: false,
              count: 3,
            },
          ],
        },
      ],
    },
    {
      group: 'Cable',
      refinements: [
        {
          id: 'A01045',
          name: 'AV Cable Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K92672',
              text: 'Video adapter',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A01046',
          name: 'Interface Supported',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K143834',
              text: 'HDMI / VGA',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00588',
          name: 'Left Connector Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K101003',
              text: '19 pin HDMI Type A',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00591',
          name: 'Left Connector Gender',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K00144',
              text: 'Male',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00589',
          name: 'Right Connector Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K00105',
              text: '15 pin HD D-Sub (HD-15)',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00590',
          name: 'Right Connector Gender',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K00145',
              text: 'Female',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'Software',
      refinements: [
        {
          id: 'A00344',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K577972',
              text: 'Absolute Persistence',
              selected: false,
              count: 17,
            },
            {
              id: 'K344883',
              text: 'App Store',
              selected: false,
              count: 3,
            },
            {
              id: 'K347281',
              text: 'Apple AirDrop',
              selected: false,
              count: 3,
            },
            {
              id: 'K465600',
              text: 'Apple AirPlay',
              selected: false,
              count: 3,
            },
            {
              id: 'K338341',
              text: 'Apple Automator',
              selected: false,
              count: 3,
            },
            {
              id: 'K338345',
              text: 'Apple Calculator',
              selected: false,
              count: 3,
            },
            {
              id: 'K139643',
              text: 'Apple Dashboard',
              selected: false,
              count: 3,
            },
            {
              id: 'K338346',
              text: 'Apple Dictionary',
              selected: false,
              count: 3,
            },
            {
              id: 'K75886',
              text: 'Apple DVD Player',
              selected: false,
              count: 1,
            },
            {
              id: 'K338340',
              text: 'Apple FaceTime',
              selected: false,
              count: 4,
            },
            {
              id: 'K472353',
              text: 'Apple Font Book',
              selected: false,
              count: 3,
            },
            {
              id: 'K109011',
              text: 'Apple GarageBand',
              selected: false,
              count: 4,
            },
            {
              id: 'K488724',
              text: 'Apple iBooks',
              selected: false,
              count: 4,
            },
            {
              id: 'K338347',
              text: 'Apple Image Capture',
              selected: false,
              count: 3,
            },
            {
              id: 'K61158',
              text: 'Apple iMovie',
              selected: false,
              count: 4,
            },
            {
              id: 'K51749',
              text: 'Apple iTunes',
              selected: false,
              count: 3,
            },
            {
              id: 'K488725',
              text: 'Apple Keynote',
              selected: false,
              count: 4,
            },
            {
              id: 'K338342',
              text: 'Apple Launchpad',
              selected: false,
              count: 3,
            },
            {
              id: 'K338339',
              text: 'Apple Mac App Store',
              selected: false,
              count: 1,
            },
            {
              id: 'K56309',
              text: 'Apple Mac OS X Chess',
              selected: false,
              count: 1,
            },
            {
              id: 'K56308',
              text: 'Apple Mac OS X Mail',
              selected: false,
              count: 1,
            },
            {
              id: 'K338343',
              text: 'Apple Mission Control',
              selected: false,
              count: 3,
            },
            {
              id: 'K488727',
              text: 'Apple Numbers',
              selected: false,
              count: 4,
            },
            {
              id: 'K488726',
              text: 'Apple Pages',
              selected: false,
              count: 4,
            },
            {
              id: 'K338344',
              text: 'Apple Preview',
              selected: false,
              count: 4,
            },
            {
              id: 'K50303',
              text: 'Apple QuickTime',
              selected: false,
              count: 3,
            },
            {
              id: 'K82276',
              text: 'Apple Safari',
              selected: false,
              count: 4,
            },
            {
              id: 'K338348',
              text: 'Apple Stickies',
              selected: false,
              count: 3,
            },
            {
              id: 'K338350',
              text: 'Apple System Preferences',
              selected: false,
              count: 3,
            },
            {
              id: 'K338349',
              text: 'Apple TextEdit',
              selected: false,
              count: 3,
            },
            {
              id: 'K248463',
              text: 'Apple Time Machine',
              selected: false,
              count: 4,
            },
            {
              id: 'K283349',
              text: 'Bing Toolbar',
              selected: false,
              count: 1,
            },
            {
              id: 'K344892',
              text: 'Calendar',
              selected: false,
              count: 4,
            },
            {
              id: 'K1166723',
              text: 'Chrome Education Upgrade',
              selected: false,
              count: 1,
            },
            {
              id: 'K1166722',
              text: 'Chrome Enterprise Upgrade',
              selected: false,
              count: 1,
            },
            {
              id: 'K459520',
              text: 'Classroom Management',
              selected: false,
              count: 1,
            },
            {
              id: 'K344888',
              text: 'Contacts',
              selected: false,
              count: 4,
            },
            {
              id: 'K523546',
              text: 'CyberLink Power Media Player',
              selected: false,
              count: 2,
            },
            {
              id: 'K792087',
              text: 'Dell Applications for Windows 10',
              selected: false,
              count: 3,
            },
            {
              id: 'K1086773',
              text: 'Dell Precision Optimizer Premium (30-day trial)',
              selected: false,
              count: 4,
            },
            {
              id: 'K412034',
              text: 'Device Access Manager',
              selected: false,
              count: 1,
            },
            {
              id: 'K410162',
              text: 'Dictation',
              selected: false,
              count: 3,
            },
            {
              id: 'K02165',
              text: 'Drivers & Utilities',
              selected: false,
              count: 13,
            },
            {
              id: 'K410164',
              text: 'Game Center',
              selected: false,
              count: 3,
            },
            {
              id: 'K509339',
              text: 'Google Drive (100 GB Cloud Storage) (free for 2 years)',
              selected: false,
              count: 1,
            },
            {
              id: 'K346303',
              text: 'Google Play',
              selected: false,
              count: 1,
            },
            {
              id: 'K1004027',
              text: 'Home',
              selected: false,
              count: 1,
            },
            {
              id: 'K672379',
              text: 'HP 3D DriveGuard',
              selected: false,
              count: 1,
            },
            {
              id: 'K590901',
              text: 'HP BIOS Config Utility',
              selected: false,
              count: 26,
            },
            {
              id: 'K890249',
              text: 'HP BIOSphere Gen4',
              selected: false,
              count: 4,
            },
            {
              id: 'K1088755',
              text: 'HP BIOSphere Gen5',
              selected: false,
              count: 9,
            },
            {
              id: 'K564663',
              text: 'HP Client Catalog',
              selected: false,
              count: 26,
            },
            {
              id: 'K1228849',
              text: 'HP Client Management Script Library',
              selected: false,
              count: 2,
            },
            {
              id: 'K1091383',
              text: 'HP Client Security Gen5',
              selected: false,
              count: 5,
            },
            {
              id: 'K577971',
              text: 'HP Client Security Manager',
              selected: false,
              count: 1,
            },
            {
              id: 'K1088756',
              text: 'HP Client Security Manager Gen5',
              selected: false,
              count: 2,
            },
            {
              id: 'K1229590',
              text: 'HP Client Security Manager Gen6',
              selected: false,
              count: 2,
            },
            {
              id: 'K929585',
              text: 'HP Client Security Suite Gen4',
              selected: false,
              count: 8,
            },
            {
              id: 'K1091370',
              text: 'HP Client Security Suite Gen5',
              selected: false,
              count: 1,
            },
            {
              id: 'K1093385',
              text: 'HP Cloud Recovery',
              selected: false,
              count: 2,
            },
            {
              id: 'K888545',
              text: 'HP Connection Optimizer',
              selected: false,
              count: 18,
            },
            {
              id: 'K566222',
              text: 'HP Credential Manager',
              selected: false,
              count: 8,
            },
            {
              id: 'K591657',
              text: 'HP Device Access Manager',
              selected: false,
              count: 9,
            },
            {
              id: 'K564662',
              text: 'HP Drive Packs (free download)',
              selected: false,
              count: 8,
            },
            {
              id: 'K590900',
              text: 'HP Driver Packs',
              selected: false,
              count: 12,
            },
            {
              id: 'K307800',
              text: 'HP ePrint',
              selected: false,
              count: 10,
            },
            {
              id: 'K931815',
              text: 'HP Fingerprint Sensor',
              selected: false,
              count: 2,
            },
            {
              id: 'K942499',
              text: 'HP Host Based MAC Address Manager',
              selected: false,
              count: 1,
            },
            {
              id: 'K323343',
              text: 'HP Hotkey Support',
              selected: false,
              count: 20,
            },
            {
              id: 'K722322',
              text: 'HP Image Assistant',
              selected: false,
              count: 6,
            },
            {
              id: 'K827992',
              text: 'HP JetAdvantage',
              selected: false,
              count: 10,
            },
            {
              id: 'K784115',
              text: 'HP JumpStart',
              selected: false,
              count: 21,
            },
            {
              id: 'K823170',
              text: 'HP LAN-WLAN Protection',
              selected: false,
              count: 13,
            },
            {
              id: 'K929583',
              text: 'HP Manageability & Integration Kit Gen2',
              selected: false,
              count: 2,
            },
            {
              id: 'K942500',
              text: 'HP Manageability & Integration Kit Gen2 (free download)',
              selected: false,
              count: 6,
            },
            {
              id: 'K1089236',
              text: 'HP Manageability Integration Kit',
              selected: false,
              count: 1,
            },
            {
              id: 'K1086820',
              text: 'HP Manageability Integration Kit Gen3',
              selected: false,
              count: 11,
            },
            {
              id: 'K1228848',
              text: 'HP Manageability Integration Kit Gen4 (free dowload)',
              selected: false,
              count: 1,
            },
            {
              id: 'K722318',
              text: 'HP Mobile Connect Pro',
              selected: false,
              count: 1,
            },
            {
              id: 'K820360',
              text: 'HP Noise Cancellation',
              selected: false,
              count: 21,
            },
            {
              id: 'K326973',
              text: 'HP Performance Advisor',
              selected: false,
              count: 1,
            },
            {
              id: 'K887592',
              text: 'HP PhoneWise',
              selected: false,
              count: 8,
            },
            {
              id: 'K300589',
              text: 'HP Power Manager',
              selected: false,
              count: 4,
            },
            {
              id: 'K272467',
              text: 'HP Recovery Manager',
              selected: false,
              count: 12,
            },
            {
              id: 'K472970',
              text: 'HP Secure Erase',
              selected: false,
              count: 16,
            },
            {
              id: 'K483112',
              text: 'HP Security Manager',
              selected: false,
              count: 8,
            },
            {
              id: 'K385611',
              text: 'HP Spare Key',
              selected: false,
              count: 8,
            },
            {
              id: 'K283235',
              text: 'HP Support Assistant',
              selected: false,
              count: 20,
            },
            {
              id: 'K888700',
              text: 'HP Sure Click',
              selected: false,
              count: 10,
            },
            {
              id: 'K1097151',
              text: 'HP Sure Recover Gen2',
              selected: false,
              count: 1,
            },
            {
              id: 'K1225871',
              text: 'HP Sure Recover Gen3',
              selected: false,
              count: 2,
            },
            {
              id: 'K1230784',
              text: 'HP Sure Run Gen3',
              selected: false,
              count: 1,
            },
            {
              id: 'K1096682',
              text: 'HP Sure Sense',
              selected: false,
              count: 3,
            },
            {
              id: 'K1097149',
              text: 'HP SureStart Gen5',
              selected: false,
              count: 2,
            },
            {
              id: 'K1230591',
              text: 'HP SureStart Gen6',
              selected: false,
              count: 2,
            },
            {
              id: 'K820361',
              text: 'HP System Software Manager',
              selected: false,
              count: 21,
            },
            {
              id: 'K861714',
              text: 'HP System Software Manager (free download)',
              selected: false,
              count: 5,
            },
            {
              id: 'K449813',
              text: 'HP Velocity',
              selected: false,
              count: 9,
            },
            {
              id: 'K836063',
              text: 'HP Wireless Wakeup',
              selected: false,
              count: 4,
            },
            {
              id: 'K1225872',
              text: 'HP WorkWell',
              selected: false,
              count: 1,
            },
            {
              id: 'K410163',
              text: 'iCloud',
              selected: false,
              count: 3,
            },
            {
              id: 'K48536',
              text: 'iTunes',
              selected: false,
              count: 1,
            },
            {
              id: 'K942522',
              text: 'Ivanti Management Suite',
              selected: false,
              count: 3,
            },
            {
              id: 'K929584',
              text: 'Ivanti Management Suite (subscription required)',
              selected: false,
              count: 3,
            },
            {
              id: 'K344879',
              text: 'Mail',
              selected: false,
              count: 3,
            },
            {
              id: 'K344880',
              text: 'Maps',
              selected: false,
              count: 4,
            },
            {
              id: 'K649061',
              text: 'McAfee LiveSafe (12 months subscription)',
              selected: false,
              count: 1,
            },
            {
              id: 'K410161',
              text: 'Messages',
              selected: false,
              count: 4,
            },
            {
              id: 'K427370',
              text: 'Microsoft 365 (30 days trial)',
              selected: false,
              count: 39,
            },
            {
              id: 'K449517',
              text: 'Microsoft 365 (Trial)',
              selected: false,
              count: 1,
            },
            {
              id: 'K427496',
              text: 'Microsoft Office (30 days trial)',
              selected: false,
              count: 32,
            },
            {
              id: 'K602350',
              text: 'MS BitLocker',
              selected: false,
              count: 5,
            },
            {
              id: 'K1081525',
              text: 'MSI Creator Center',
              selected: false,
              count: 1,
            },
            {
              id: 'K825837',
              text: 'Native Miracast',
              selected: false,
              count: 10,
            },
            {
              id: 'K490900',
              text: 'News',
              selected: false,
              count: 1,
            },
            {
              id: 'K344890',
              text: 'Notes',
              selected: false,
              count: 4,
            },
            {
              id: 'K400110',
              text: 'Notification Center',
              selected: false,
              count: 3,
            },
            {
              id: 'K187807',
              text: 'Panasonic Dashboard',
              selected: false,
              count: 10,
            },
            {
              id: 'K404183',
              text: 'Panasonic Recovery Partition',
              selected: false,
              count: 7,
            },
            {
              id: 'K386378',
              text: 'Password Manager',
              selected: false,
              count: 8,
            },
            {
              id: 'K155604',
              text: 'Photo Booth',
              selected: false,
              count: 4,
            },
            {
              id: 'K344881',
              text: 'Photos',
              selected: false,
              count: 3,
            },
            {
              id: 'K931816',
              text: 'Power On Authentication',
              selected: false,
              count: 5,
            },
            {
              id: 'K344882',
              text: 'Reminders',
              selected: false,
              count: 4,
            },
            {
              id: 'K400108',
              text: 'Siri',
              selected: false,
              count: 4,
            },
            {
              id: 'K811884',
              text: 'Skype for Business',
              selected: false,
              count: 1,
            },
            {
              id: 'K344889',
              text: 'Stocks',
              selected: false,
              count: 1,
            },
            {
              id: 'K189696',
              text: 'Toshiba Eco Utility',
              selected: false,
              count: 1,
            },
            {
              id: 'K295761',
              text: 'Toshiba Service Station',
              selected: false,
              count: 1,
            },
            {
              id: 'K668610',
              text: 'Voice Memos',
              selected: false,
              count: 1,
            },
            {
              id: 'K408509',
              text: 'Windows Defender',
              selected: false,
              count: 19,
            },
          ],
        },
        {
          id: 'A01851',
          name: 'Software Title',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K730587',
              text: 'Veritas Desktop and Laptop Option',
              selected: false,
              count: 13,
            },
          ],
        },
        {
          id: 'A03544',
          name: 'License Category',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K144706',
              text: 'License',
              selected: false,
              count: 8,
            },
            {
              id: 'K145551',
              text: 'Subscription license',
              selected: false,
              count: 4,
            },
          ],
        },
        {
          id: 'A00478',
          name: 'License Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K713275',
              text: 'On-Premise competitive upgrade license',
              selected: false,
              count: 1,
            },
            {
              id: 'K1034455',
              text: 'On-Premise Consumption license',
              selected: false,
              count: 2,
            },
            {
              id: 'K708270',
              text: 'On-Premise license',
              selected: false,
              count: 7,
            },
            {
              id: 'K629123',
              text: 'On-Premise subscription license',
              selected: false,
              count: 2,
            },
          ],
        },
        {
          id: 'A00481',
          name: 'License Qty',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K02964',
              text: '10 users',
              selected: false,
              count: 7,
            },
            {
              id: 'K02970',
              text: '100 users',
              selected: false,
              count: 5,
            },
          ],
        },
        {
          id: 'A01259',
          name: 'License Validation Period',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K19397',
              text: '1 month',
              selected: false,
              count: 2,
            },
            {
              id: 'K94747',
              text: '3 years',
              selected: false,
              count: 1,
            },
            {
              id: 'K71434',
              text: '5 years',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A02907',
          name: 'Bundled Support',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K220443',
              text: '1 Year Essential Support',
              selected: false,
              count: 2,
            },
            {
              id: 'K1195857',
              text: '1 Year Verified Support',
              selected: false,
              count: 1,
            },
            {
              id: 'K1199253',
              text: '2 Years Verified Support',
              selected: false,
              count: 2,
            },
            {
              id: 'K221886',
              text: '3 Years Essential Support',
              selected: false,
              count: 1,
            },
            {
              id: 'K1195858',
              text: '3 Years Verified Support',
              selected: false,
              count: 2,
            },
            {
              id: 'K562938',
              text: 'Essential Support',
              selected: false,
              count: 4,
            },
          ],
        },
      ],
    },
    {
      group: 'Licensing',
      refinements: [
        {
          id: 'A00479',
          name: 'License Pricing',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K02954',
              text: 'Academic',
              selected: false,
              count: 2,
            },
            {
              id: 'K210324',
              text: 'Corporate',
              selected: false,
              count: 4,
            },
            {
              id: 'K21877',
              text: 'Government',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A01191',
          name: 'Licensing Program',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K702458',
              text: 'Veritas Academic Licensing Program (ALP)',
              selected: false,
              count: 2,
            },
            {
              id: 'K702457',
              text: 'Veritas Corporate Licensing Program (CLP)',
              selected: false,
              count: 4,
            },
            {
              id: 'K702459',
              text: 'Veritas Government Licensing Program (GLP)',
              selected: false,
              count: 1,
            },
            {
              id: 'K1033806',
              text: 'Veritas Service Provider Program (VSPP)',
              selected: false,
              count: 5,
            },
          ],
        },
      ],
    },
    {
      group: 'Power Device',
      refinements: [
        {
          id: 'A02869',
          name: 'Form Factor',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K229664',
              text: 'DIN rail mountable',
              selected: false,
              count: 1,
            },
            {
              id: 'K77824',
              text: 'External',
              selected: false,
              count: 56,
            },
          ],
        },
        {
          id: 'A00387',
          name: 'Voltage Provided',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K02862',
              text: '12 V',
              selected: false,
              count: 5,
            },
            {
              id: 'K51955',
              text: '13.8 V',
              selected: false,
              count: 1,
            },
            {
              id: 'K66008',
              text: '15.6 V',
              selected: false,
              count: 1,
            },
            {
              id: 'K28168',
              text: '18.5 V',
              selected: false,
              count: 1,
            },
            {
              id: 'K03267',
              text: '19 V',
              selected: false,
              count: 6,
            },
            {
              id: 'K12816',
              text: '19.5 V',
              selected: false,
              count: 1,
            },
            {
              id: 'K04052',
              text: '48 V',
              selected: false,
              count: 3,
            },
            {
              id: 'K181807',
              text: '5 / 19.5 V',
              selected: false,
              count: 1,
            },
            {
              id: 'K833068',
              text: '5 / 9 / 15 / 20 V',
              selected: false,
              count: 3,
            },
          ],
        },
        {
          id: 'A00526',
          name: 'Power Provided',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 24,
            max: 240,
          },
          options: [
            {
              id: 'K02088',
              text: '240 Watt',
              selected: false,
              count: 1,
            },
            {
              id: 'K01997',
              text: '200 Watt',
              selected: false,
              count: 1,
            },
            {
              id: 'K02366',
              text: '135 Watt',
              selected: false,
              count: 1,
            },
            {
              id: 'K03051',
              text: '130 Watt',
              selected: false,
              count: 2,
            },
            {
              id: 'K04163',
              text: '127 Watt',
              selected: false,
              count: 1,
            },
            {
              id: 'K03060',
              text: '120 Watt',
              selected: false,
              count: 1,
            },
            {
              id: 'K02685',
              text: '110 Watt',
              selected: false,
              count: 1,
            },
            {
              id: 'K03011',
              text: '90 Watt',
              selected: false,
              count: 10,
            },
            {
              id: 'K02854',
              text: '85 Watt',
              selected: false,
              count: 2,
            },
            {
              id: 'K02539',
              text: '65 Watt',
              selected: false,
              count: 14,
            },
            {
              id: 'K02257',
              text: '60 Watt',
              selected: false,
              count: 1,
            },
            {
              id: 'K01972',
              text: '50 Watt',
              selected: false,
              count: 1,
            },
            {
              id: 'K01953',
              text: '45 Watt',
              selected: false,
              count: 6,
            },
            {
              id: 'K02072',
              text: '44 Watt',
              selected: false,
              count: 1,
            },
            {
              id: 'K02171',
              text: '36 Watt',
              selected: false,
              count: 2,
            },
            {
              id: 'K01961',
              text: '30 Watt',
              selected: false,
              count: 1,
            },
            {
              id: 'K02828',
              text: '24 Watt',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A01883',
          name: 'Max Electric Current',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 0.5,
            max: 7.05,
          },
          options: [
            {
              id: 'K89086',
              text: '7.05 A',
              selected: false,
              count: 1,
            },
            {
              id: 'K02091',
              text: '5 A',
              selected: false,
              count: 1,
            },
            {
              id: 'K02883',
              text: '4.7 A',
              selected: false,
              count: 1,
            },
            {
              id: 'K03507',
              text: '3.25 A',
              selected: false,
              count: 2,
            },
            {
              id: 'K38850',
              text: '2.37 A',
              selected: false,
              count: 1,
            },
            {
              id: 'K02103',
              text: '1 A',
              selected: false,
              count: 2,
            },
            {
              id: 'K02195',
              text: '500 mA',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00326',
          name: 'Voltage Required',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K04052',
              text: '48 V',
              selected: false,
              count: 1,
            },
            {
              id: 'K61429',
              text: 'AC 100-240 V',
              selected: false,
              count: 12,
            },
            {
              id: 'K03501',
              text: 'AC 100/240 V',
              selected: false,
              count: 1,
            },
            {
              id: 'K01473',
              text: 'AC 120 V',
              selected: false,
              count: 1,
            },
            {
              id: 'K491993',
              text: 'AC 88-132/ DC 124-370 V',
              selected: false,
              count: 1,
            },
            {
              id: 'K131310',
              text: 'AC 90-264 V',
              selected: false,
              count: 1,
            },
            {
              id: 'K133532',
              text: 'AC 90-265 V',
              selected: false,
              count: 1,
            },
            {
              id: 'K891702',
              text: 'DC 12 / 24 V',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'Battery',
      refinements: [
        {
          id: 'A00335',
          name: 'Form Factor',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K01802',
              text: 'AA type',
              selected: false,
              count: 7,
            },
            {
              id: 'K06391',
              text: 'AAA type',
              selected: false,
              count: 7,
            },
          ],
        },
        {
          id: 'A00333',
          name: 'Installed Qty',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1,
            max: 1,
          },
          options: [
            {
              id: 'K02103',
              text: '1',
              selected: false,
              count: 4,
            },
          ],
        },
        {
          id: 'A00862',
          name: 'Included Qty',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1,
            max: 1,
          },
          options: [
            {
              id: 'K02103',
              text: '1',
              selected: false,
              count: 26,
            },
          ],
        },
        {
          id: 'A00332',
          name: 'Technology',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K04466',
              text: 'Alkaline',
              selected: false,
              count: 9,
            },
            {
              id: 'K36616',
              text: 'Lithium',
              selected: false,
              count: 1,
            },
            {
              id: 'K01497',
              text: 'Lithium ion',
              selected: false,
              count: 156,
            },
            {
              id: 'K14578',
              text: 'Lithium polymer',
              selected: false,
              count: 48,
            },
          ],
        },
        {
          id: 'A00337',
          name: 'Voltage Provided',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K02863',
              text: '10.8 V',
              selected: false,
              count: 3,
            },
            {
              id: 'K14324',
              text: '11.1 V',
              selected: false,
              count: 1,
            },
            {
              id: 'K232495',
              text: '11.4 V',
              selected: false,
              count: 2,
            },
            {
              id: 'K833937',
              text: '11.55 V',
              selected: false,
              count: 1,
            },
            {
              id: 'K04862',
              text: '14.4 V',
              selected: false,
              count: 2,
            },
            {
              id: 'K22061',
              text: '7.4 V',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A10814',
          name: 'Capacity (Ah)',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 2060,
            max: 8400,
          },
          options: [
            {
              id: 'K07467',
              text: '8400 mAh',
              selected: false,
              count: 1,
            },
            {
              id: 'K279895',
              text: '6880 mAh',
              selected: false,
              count: 1,
            },
            {
              id: 'K05527',
              text: '5600 mAh',
              selected: false,
              count: 1,
            },
            {
              id: 'K15351',
              text: '5200 mAh',
              selected: false,
              count: 1,
            },
            {
              id: 'K19503',
              text: '4400 mAh',
              selected: false,
              count: 1,
            },
            {
              id: 'K21072',
              text: '4122 mAh',
              selected: false,
              count: 1,
            },
            {
              id: 'K04007',
              text: '2800 mAh',
              selected: false,
              count: 1,
            },
            {
              id: 'K04948',
              text: '2100 mAh',
              selected: false,
              count: 1,
            },
            {
              id: 'K85735',
              text: '2.06 Ah',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A10815',
          name: 'Capacity (Wh)',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 24,
            max: 97,
          },
          options: [
            {
              id: 'K02764',
              text: '97 Wh',
              selected: false,
              count: 3,
            },
            {
              id: 'K03011',
              text: '90 Wh',
              selected: false,
              count: 1,
            },
            {
              id: 'K03803',
              text: '83 Wh',
              selected: false,
              count: 1,
            },
            {
              id: 'K04194',
              text: '73 Wh',
              selected: false,
              count: 1,
            },
            {
              id: 'K05837',
              text: '66.6 Wh',
              selected: false,
              count: 1,
            },
            {
              id: 'K02736',
              text: '56 Wh',
              selected: false,
              count: 1,
            },
            {
              id: 'K02092',
              text: '55 Wh',
              selected: false,
              count: 1,
            },
            {
              id: 'K02123',
              text: '51 Wh',
              selected: false,
              count: 2,
            },
            {
              id: 'K01970',
              text: '48 Wh',
              selected: false,
              count: 1,
            },
            {
              id: 'K02143',
              text: '47 Wh',
              selected: false,
              count: 2,
            },
            {
              id: 'K01953',
              text: '45 Wh',
              selected: false,
              count: 1,
            },
            {
              id: 'K02273',
              text: '42 Wh',
              selected: false,
              count: 1,
            },
            {
              id: 'K02076',
              text: '40 Wh',
              selected: false,
              count: 1,
            },
            {
              id: 'K02163',
              text: '28 Wh',
              selected: false,
              count: 1,
            },
            {
              id: 'K02828',
              text: '24 Wh',
              selected: false,
              count: 2,
            },
          ],
        },
        {
          id: 'A00341',
          name: 'Run Time (Up To)',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 25200,
            max: 86400,
          },
          options: [
            {
              id: 'K02828',
              text: '24 hours',
              selected: false,
              count: 2,
            },
            {
              id: 'K01973',
              text: '23 hours',
              selected: false,
              count: 4,
            },
            {
              id: 'K02493',
              text: '21 hours',
              selected: false,
              count: 5,
            },
            {
              id: 'K01956',
              text: '20 hours',
              selected: false,
              count: 9,
            },
            {
              id: 'K02814',
              text: '19.5 hours',
              selected: false,
              count: 1,
            },
            {
              id: 'K03706',
              text: '19.3 hours',
              selected: false,
              count: 3,
            },
            {
              id: 'K02149',
              text: '19 hours',
              selected: false,
              count: 2,
            },
            {
              id: 'K02176',
              text: '18.5 hours',
              selected: false,
              count: 1,
            },
            {
              id: 'K02525',
              text: '18.3 hours',
              selected: false,
              count: 5,
            },
            {
              id: 'K00494',
              text: '18.2 hours',
              selected: false,
              count: 3,
            },
            {
              id: 'K04378',
              text: '18.1 hours',
              selected: false,
              count: 4,
            },
            {
              id: 'K03291',
              text: '17.6 hours',
              selected: false,
              count: 2,
            },
            {
              id: 'K02935',
              text: '17.5 hours',
              selected: false,
              count: 3,
            },
            {
              id: 'K02807',
              text: '17.25 hours',
              selected: false,
              count: 4,
            },
            {
              id: 'K02136',
              text: '17 hours',
              selected: false,
              count: 4,
            },
            {
              id: 'K03136',
              text: '16.5 hours',
              selected: false,
              count: 4,
            },
            {
              id: 'K02644',
              text: '16.4 hours',
              selected: false,
              count: 1,
            },
            {
              id: 'K373234',
              text: '16.11 hours',
              selected: false,
              count: 3,
            },
            {
              id: 'K03817',
              text: '15.5 hours',
              selected: false,
              count: 3,
            },
            {
              id: 'K02130',
              text: '15 hours',
              selected: false,
              count: 2,
            },
            {
              id: 'K04505',
              text: '14.75 hours',
              selected: false,
              count: 2,
            },
            {
              id: 'K02411',
              text: '14.7 hours',
              selected: false,
              count: 1,
            },
            {
              id: 'K02001',
              text: '14.5 hours',
              selected: false,
              count: 4,
            },
            {
              id: 'K09817',
              text: '14.36 hours',
              selected: false,
              count: 2,
            },
            {
              id: 'K02436',
              text: '14.1 hours',
              selected: false,
              count: 2,
            },
            {
              id: 'K02435',
              text: '14 hours',
              selected: false,
              count: 13,
            },
            {
              id: 'K04001',
              text: '13.8 hours',
              selected: false,
              count: 7,
            },
            {
              id: 'K412446',
              text: '13.78 hours',
              selected: false,
              count: 2,
            },
            {
              id: 'K03524',
              text: '13.5 hours',
              selected: false,
              count: 3,
            },
            {
              id: 'K02142',
              text: '13 hours',
              selected: false,
              count: 8,
            },
            {
              id: 'K03331',
              text: '12.8 hours',
              selected: false,
              count: 1,
            },
            {
              id: 'K02463',
              text: '12.2 hours',
              selected: false,
              count: 1,
            },
            {
              id: 'K02148',
              text: '12 hours',
              selected: false,
              count: 2,
            },
            {
              id: 'K02282',
              text: '11.6 hours',
              selected: false,
              count: 1,
            },
            {
              id: 'K02565',
              text: '11.5 hours',
              selected: false,
              count: 16,
            },
            {
              id: 'K03520',
              text: '10.5 hours',
              selected: false,
              count: 4,
            },
            {
              id: 'K01962',
              text: '10 hours',
              selected: false,
              count: 12,
            },
            {
              id: 'K02162',
              text: '9.5 hours',
              selected: false,
              count: 2,
            },
            {
              id: 'K02021',
              text: '9 hours',
              selected: false,
              count: 3,
            },
            {
              id: 'K03256',
              text: '8.5 hours',
              selected: false,
              count: 2,
            },
            {
              id: 'K02639',
              text: '8 hours',
              selected: false,
              count: 2,
            },
            {
              id: 'K02151',
              text: '7 hours',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'AV Furniture',
      refinements: [
        {
          id: 'A00881',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K51481',
              text: 'Cart',
              selected: false,
              count: 5,
            },
            {
              id: 'K507241',
              text: 'Enclosure',
              selected: false,
              count: 2,
            },
            {
              id: 'K125854',
              text: 'Mounting component',
              selected: false,
              count: 2,
            },
            {
              id: 'K125965',
              text: 'Mounting kit',
              selected: false,
              count: 7,
            },
            {
              id: 'K92022',
              text: 'Stand',
              selected: false,
              count: 5,
            },
            {
              id: 'K742633',
              text: 'Wall mount',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00882',
          name: 'Design',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K1179792',
              text: 'Adjustable',
              selected: false,
              count: 1,
            },
            {
              id: 'K951074',
              text: 'Full-Motion',
              selected: false,
              count: 1,
            },
            {
              id: 'K1182142',
              text: 'Slim',
              selected: false,
              count: 2,
            },
          ],
        },
        {
          id: 'A00883',
          name: 'Recommended Use',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K600103',
              text: '16 tablets / notebooks',
              selected: false,
              count: 1,
            },
            {
              id: 'K281462',
              text: '20 notebooks',
              selected: false,
              count: 2,
            },
            {
              id: 'K275698',
              text: '32 notebooks',
              selected: false,
              count: 1,
            },
            {
              id: 'K600071',
              text: '36 tablets / notebooks',
              selected: false,
              count: 1,
            },
            {
              id: 'K280043',
              text: 'LCD display / notebook',
              selected: false,
              count: 1,
            },
            {
              id: 'K600047',
              text: 'Tablet',
              selected: false,
              count: 15,
            },
            {
              id: 'K600075',
              text: 'Tablet / keyboard',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A03365',
          name: 'Mounting Components',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K336490',
              text: '2 dual articulating arm',
              selected: false,
              count: 1,
            },
            {
              id: 'K327263',
              text: '2 interface brackets',
              selected: false,
              count: 1,
            },
            {
              id: 'K572003',
              text: '5 casters',
              selected: false,
              count: 1,
            },
            {
              id: 'K365601',
              text: 'Adjustable mounting arm',
              selected: false,
              count: 1,
            },
            {
              id: 'K160523',
              text: 'Basket',
              selected: false,
              count: 1,
            },
            {
              id: 'K196398',
              text: 'C-clamp',
              selected: false,
              count: 1,
            },
            {
              id: 'K298633',
              text: 'Collars',
              selected: false,
              count: 1,
            },
            {
              id: 'K553515',
              text: 'Cradle',
              selected: false,
              count: 1,
            },
            {
              id: 'K604934',
              text: 'Desk clamp pole',
              selected: false,
              count: 1,
            },
            {
              id: 'K183044',
              text: 'Dock/cradle mounting bracket',
              selected: false,
              count: 1,
            },
            {
              id: 'K317365',
              text: 'Flexible gooseneck',
              selected: false,
              count: 1,
            },
            {
              id: 'K160197',
              text: 'Gooseneck mount',
              selected: false,
              count: 1,
            },
            {
              id: 'K973936',
              text: 'Heavy duty mount',
              selected: false,
              count: 1,
            },
            {
              id: 'K283530',
              text: 'Holder',
              selected: false,
              count: 5,
            },
            {
              id: 'K710598',
              text: 'Key',
              selected: false,
              count: 1,
            },
            {
              id: 'K216109',
              text: 'Keyboard shelf',
              selected: false,
              count: 1,
            },
            {
              id: 'K327974',
              text: 'Knob',
              selected: false,
              count: 1,
            },
            {
              id: 'K134239',
              text: 'Shelf',
              selected: false,
              count: 1,
            },
            {
              id: 'K334216',
              text: 'Sleeve',
              selected: false,
              count: 1,
            },
            {
              id: 'K280519',
              text: 'Stand base',
              selected: false,
              count: 1,
            },
            {
              id: 'K388075',
              text: 'Telescopic pole',
              selected: false,
              count: 1,
            },
            {
              id: 'K737892',
              text: 'VESA adapter plate',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00885',
          name: 'Color',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K90703',
              text: 'Aluminum',
              selected: false,
              count: 3,
            },
            {
              id: 'K01699',
              text: 'Black',
              selected: false,
              count: 6,
            },
            {
              id: 'K214107',
              text: 'Black gray',
              selected: false,
              count: 3,
            },
            {
              id: 'K194927',
              text: 'Concrete powder',
              selected: false,
              count: 3,
            },
            {
              id: 'K250694',
              text: 'Gray white',
              selected: false,
              count: 1,
            },
            {
              id: 'K87613',
              text: 'RAL 7021',
              selected: false,
              count: 1,
            },
            {
              id: 'K01700',
              text: 'White',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00884',
          name: 'Material',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K02628',
              text: 'Aluminum',
              selected: false,
              count: 2,
            },
            {
              id: 'K01694',
              text: 'Metal',
              selected: false,
              count: 3,
            },
            {
              id: 'K01692',
              text: 'Plastic',
              selected: false,
              count: 2,
            },
            {
              id: 'K459931',
              text: 'Powder-coated steel',
              selected: false,
              count: 1,
            },
            {
              id: 'K21280',
              text: 'Rubber',
              selected: false,
              count: 1,
            },
            {
              id: 'K35103',
              text: 'Steel',
              selected: false,
              count: 9,
            },
          ],
        },
        {
          id: 'A00886',
          name: 'Shelf Qty',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 2,
            max: 3,
          },
          options: [
            {
              id: 'K02104',
              text: '3',
              selected: false,
              count: 1,
            },
            {
              id: 'K02097',
              text: '2',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A02602',
          name: 'Recommended Display Size',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K1120763',
              text: '10.2"',
              selected: false,
              count: 2,
            },
            {
              id: 'K190683',
              text: '13"-27"',
              selected: false,
              count: 1,
            },
            {
              id: 'K726373',
              text: '7"-13"',
              selected: false,
              count: 3,
            },
            {
              id: 'K518289',
              text: '7"-14"',
              selected: false,
              count: 3,
            },
            {
              id: 'K339695',
              text: 'Up to 10"',
              selected: false,
              count: 1,
            },
            {
              id: 'K190999',
              text: 'Up to 12"',
              selected: false,
              count: 1,
            },
            {
              id: 'K191002',
              text: 'Up to 17"',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A08508',
          name: 'Tilt',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K961131',
              text: '-80° to 90°',
              selected: false,
              count: 1,
            },
            {
              id: 'K696080',
              text: '128°',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A08513',
          name: 'Lift',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'W22990',
              text: '14.96 in',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A08511',
          name: 'Rotation',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K615440',
              text: '360°',
              selected: false,
              count: 7,
            },
          ],
        },
        {
          id: 'A11218',
          name: 'Swivel',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K960795',
              text: '180°',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A07053',
          name: 'Wheels Qty',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 4,
            max: 5,
          },
          options: [
            {
              id: 'K02091',
              text: '5',
              selected: false,
              count: 1,
            },
            {
              id: 'K02147',
              text: '4',
              selected: false,
              count: 3,
            },
          ],
        },
        {
          id: 'A07440',
          name: 'Brakes Qty',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 2,
            max: 2,
          },
          options: [
            {
              id: 'K02097',
              text: '2',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A07054',
          name: 'Wheel Diameter',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'W00809',
              text: '5 in',
              selected: false,
              count: 2,
            },
          ],
        },
      ],
    },
    {
      group: 'Notebook Compatibility Dimensions',
      refinements: [
        {
          id: 'A04430',
          name: 'Notebook Compatibility',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 10.2,
            max: 18,
          },
          options: [
            {
              id: 'K05442',
              text: '18 in',
              selected: false,
              count: 1,
            },
            {
              id: 'K11137',
              text: '17.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'K00682',
              text: '17 in',
              selected: false,
              count: 7,
            },
            {
              id: 'K00681',
              text: '16 in',
              selected: false,
              count: 8,
            },
            {
              id: 'K256223',
              text: '15.6 in',
              selected: false,
              count: 7,
            },
            {
              id: 'K09680',
              text: '15.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'K00680',
              text: '15 in',
              selected: false,
              count: 3,
            },
            {
              id: 'K00679',
              text: '14 in',
              selected: false,
              count: 4,
            },
            {
              id: 'K03065',
              text: '13 in',
              selected: false,
              count: 4,
            },
            {
              id: 'K107929',
              text: '10.2 in',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A05384',
          name: 'Notebook Compatibility (metric)',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 25.9,
            max: 45.7,
          },
          options: [
            {
              id: 'K02569',
              text: '45.7 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K03018',
              text: '43.9 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K02221',
              text: '43.2 cm',
              selected: false,
              count: 6,
            },
            {
              id: 'K02010',
              text: '40.6 cm',
              selected: false,
              count: 8,
            },
            {
              id: 'K03751',
              text: '39.6 cm',
              selected: false,
              count: 7,
            },
            {
              id: 'K02589',
              text: '39.1 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K02686',
              text: '38.1 cm',
              selected: false,
              count: 3,
            },
            {
              id: 'K02341',
              text: '35.6 cm',
              selected: false,
              count: 4,
            },
            {
              id: 'K02429',
              text: '33 cm',
              selected: false,
              count: 4,
            },
            {
              id: 'K02100',
              text: '25.9 cm',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A02160',
          name: 'Width',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 10.2,
            max: 17.8,
          },
          options: [
            {
              id: 'W00245',
              text: '17.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00139',
              text: '16.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00035',
              text: '16.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00232',
              text: '16.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00217',
              text: '15.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00075',
              text: '15.2 in',
              selected: false,
              count: 7,
            },
            {
              id: 'W00205',
              text: '15 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00076',
              text: '14.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00200',
              text: '14.3 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00332',
              text: '12.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00531',
              text: '10.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00049',
              text: '10.2 in',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A02161',
          name: 'Depth',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1.5,
            max: 14.8,
          },
          options: [
            {
              id: 'W00076',
              text: '14.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00038',
              text: '12.2 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00271',
              text: '11.8 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00074',
              text: '11.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00277',
              text: '11.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00531',
              text: '10.5 in',
              selected: false,
              count: 5,
            },
            {
              id: 'W00350',
              text: '10.4 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00335',
              text: '10.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00059',
              text: '8.9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00051',
              text: '7.7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00125',
              text: '1.7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00090',
              text: '1.5 in',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A02162',
          name: 'Height',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1,
            max: 10.5,
          },
          options: [
            {
              id: 'W00531',
              text: '10.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00049',
              text: '10.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00043',
              text: '2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00110',
              text: '1.9 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00050',
              text: '1.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00125',
              text: '1.7 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00040',
              text: '1.6 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00090',
              text: '1.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00112',
              text: '1.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00106',
              text: '1.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00097',
              text: '1 in',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'Carrying Case',
      refinements: [
        {
          id: 'A00854',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K76295',
              text: 'Case',
              selected: false,
              count: 1,
            },
            {
              id: 'K328942',
              text: 'Protective case',
              selected: false,
              count: 4,
            },
            {
              id: 'K161430',
              text: 'Protective cover',
              selected: false,
              count: 14,
            },
            {
              id: 'K124176',
              text: 'Protective sleeve',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00855',
          name: 'Recommended Use',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K278873',
              text: 'For tablet',
              selected: false,
              count: 20,
            },
          ],
        },
        {
          id: 'A00859',
          name: 'Carrying Strap',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K808810',
              text: 'Adjustable padded shoulder straps',
              selected: false,
              count: 2,
            },
            {
              id: 'K787299',
              text: 'Adjustable shoulder strap',
              selected: false,
              count: 4,
            },
            {
              id: 'K769654',
              text: 'Carrying strap',
              selected: false,
              count: 1,
            },
            {
              id: 'K829211',
              text: 'Dual handles',
              selected: false,
              count: 1,
            },
            {
              id: 'K598825',
              text: 'Elastic strap',
              selected: false,
              count: 1,
            },
            {
              id: 'K378647',
              text: 'Grab handle',
              selected: false,
              count: 2,
            },
            {
              id: 'K21340',
              text: 'Hand grip',
              selected: false,
              count: 9,
            },
            {
              id: 'K18804',
              text: 'Hand strap',
              selected: false,
              count: 7,
            },
            {
              id: 'K146898',
              text: 'Lanyard',
              selected: false,
              count: 1,
            },
            {
              id: 'K829205',
              text: 'Padded grab handle',
              selected: false,
              count: 3,
            },
            {
              id: 'K810176',
              text: 'Padded shoulder straps',
              selected: false,
              count: 4,
            },
            {
              id: 'K625750',
              text: 'Padded top handle',
              selected: false,
              count: 1,
            },
            {
              id: 'K706180',
              text: 'Removable shoulder strap',
              selected: false,
              count: 2,
            },
            {
              id: 'K219446',
              text: 'Rolling luggage strap',
              selected: false,
              count: 1,
            },
            {
              id: 'K92059',
              text: 'Shoulder carrying strap',
              selected: false,
              count: 10,
            },
            {
              id: 'K262857',
              text: 'Shoulder carrying straps',
              selected: false,
              count: 8,
            },
            {
              id: 'K511634',
              text: 'Side carry handle',
              selected: false,
              count: 1,
            },
            {
              id: 'K327186',
              text: 'Soft padded handle',
              selected: false,
              count: 1,
            },
            {
              id: 'K511632',
              text: 'Top carry handle',
              selected: false,
              count: 9,
            },
            {
              id: 'K213638',
              text: 'Trolley strap',
              selected: false,
              count: 6,
            },
            {
              id: 'K79175',
              text: 'Waist strap',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A04688',
          name: 'Telescopic Handle',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K200333',
              text: 'Yes',
              selected: false,
              count: 2,
            },
          ],
        },
        {
          id: 'A07246',
          name: 'Wheels Qty',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 2,
            max: 2,
          },
          options: [
            {
              id: 'K02097',
              text: '2',
              selected: false,
              count: 2,
            },
          ],
        },
        {
          id: 'A02527',
          name: 'Additional Compartments',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K240625',
              text: '2 x water bottle pockets',
              selected: false,
              count: 1,
            },
            {
              id: 'K236673',
              text: '5 x CD/DVD',
              selected: false,
              count: 1,
            },
            {
              id: 'K893837',
              text: 'Back zippered pocket',
              selected: false,
              count: 1,
            },
            {
              id: 'K147096',
              text: 'Books',
              selected: false,
              count: 1,
            },
            {
              id: 'K205226',
              text: 'Bottle',
              selected: false,
              count: 7,
            },
            {
              id: 'K234634',
              text: 'Business cards',
              selected: false,
              count: 8,
            },
            {
              id: 'K91270',
              text: 'Cable',
              selected: false,
              count: 2,
            },
            {
              id: 'K207532',
              text: 'CD/DVD',
              selected: false,
              count: 1,
            },
            {
              id: 'K57170',
              text: 'Cellular phone',
              selected: false,
              count: 8,
            },
            {
              id: 'K559349',
              text: 'Chargers',
              selected: false,
              count: 2,
            },
            {
              id: 'K209493',
              text: 'Clothing',
              selected: false,
              count: 1,
            },
            {
              id: 'K170177',
              text: 'Digital player',
              selected: false,
              count: 1,
            },
            {
              id: 'K171318',
              text: 'Documents',
              selected: false,
              count: 8,
            },
            {
              id: 'K282813',
              text: 'Earplugs',
              selected: false,
              count: 1,
            },
            {
              id: 'K613841',
              text: 'File',
              selected: false,
              count: 3,
            },
            {
              id: 'K625751',
              text: 'Folder',
              selected: false,
              count: 1,
            },
            {
              id: 'K923901',
              text: 'Front external pocket',
              selected: false,
              count: 1,
            },
            {
              id: 'K679215',
              text: 'Front pocket',
              selected: false,
              count: 4,
            },
            {
              id: 'K823213',
              text: 'Front zippered pocket',
              selected: false,
              count: 3,
            },
            {
              id: 'K217868',
              text: 'Headset',
              selected: false,
              count: 1,
            },
            {
              id: 'K748197',
              text: 'Internal zippered mesh pocket',
              selected: false,
              count: 1,
            },
            {
              id: 'K599314',
              text: 'Key clip',
              selected: false,
              count: 4,
            },
            {
              id: 'K217869',
              text: 'Keyboard',
              selected: false,
              count: 1,
            },
            {
              id: 'K218908',
              text: 'Keys',
              selected: false,
              count: 4,
            },
            {
              id: 'K210882',
              text: 'Magazines',
              selected: false,
              count: 1,
            },
            {
              id: 'K209318',
              text: 'Mouse',
              selected: false,
              count: 2,
            },
            {
              id: 'K202357',
              text: 'MP3 player',
              selected: false,
              count: 2,
            },
            {
              id: 'K299192',
              text: 'Notebook accessories',
              selected: false,
              count: 1,
            },
            {
              id: 'K234635',
              text: 'Organizer',
              selected: false,
              count: 1,
            },
            {
              id: 'K961913',
              text: 'Organizer front pocket',
              selected: false,
              count: 1,
            },
            {
              id: 'K866813',
              text: 'Papers',
              selected: false,
              count: 1,
            },
            {
              id: 'K57592',
              text: 'PDA',
              selected: false,
              count: 1,
            },
            {
              id: 'K898024',
              text: 'Pen loops',
              selected: false,
              count: 5,
            },
            {
              id: 'K173423',
              text: 'Pens',
              selected: false,
              count: 4,
            },
            {
              id: 'K202538',
              text: 'Personal accessories',
              selected: false,
              count: 8,
            },
            {
              id: 'K723914',
              text: 'Power bank',
              selected: false,
              count: 2,
            },
            {
              id: 'K793423',
              text: 'Power cable',
              selected: false,
              count: 1,
            },
            {
              id: 'K576539',
              text: 'Quick pocket',
              selected: false,
              count: 1,
            },
            {
              id: 'K789262',
              text: 'Side mesh pocket',
              selected: false,
              count: 1,
            },
            {
              id: 'K209317',
              text: 'Sunglasses',
              selected: false,
              count: 8,
            },
            {
              id: 'K701623',
              text: 'Supplies',
              selected: false,
              count: 1,
            },
            {
              id: 'K610455',
              text: 'Tablet',
              selected: false,
              count: 9,
            },
            {
              id: 'K904483',
              text: 'Top pocket',
              selected: false,
              count: 2,
            },
            {
              id: 'K233099',
              text: 'Wallet',
              selected: false,
              count: 2,
            },
            {
              id: 'K911684',
              text: 'Zippered accessory pocket',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00857',
          name: 'Color',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K01699',
              text: 'Black',
              selected: false,
              count: 12,
            },
            {
              id: 'K121364',
              text: 'Black/clear',
              selected: false,
              count: 1,
            },
            {
              id: 'K21144',
              text: 'Clear',
              selected: false,
              count: 2,
            },
            {
              id: 'K133791',
              text: 'Dark black',
              selected: false,
              count: 1,
            },
            {
              id: 'K01698',
              text: 'Gray',
              selected: false,
              count: 2,
            },
            {
              id: 'K508246',
              text: 'Magma',
              selected: false,
              count: 1,
            },
            {
              id: 'K32004',
              text: 'Midnight blue',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00858',
          name: 'Material',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K38269',
              text: 'ABS plastic',
              selected: false,
              count: 1,
            },
            {
              id: 'K09241',
              text: 'Galvanized steel',
              selected: false,
              count: 1,
            },
            {
              id: 'K777126',
              text: 'Hardened polycarbonate',
              selected: false,
              count: 2,
            },
            {
              id: 'K841727',
              text: 'Medical grade polycarbonate',
              selected: false,
              count: 1,
            },
            {
              id: 'K21233',
              text: 'Polycarbonate',
              selected: false,
              count: 4,
            },
            {
              id: 'K06137',
              text: 'Polyester',
              selected: false,
              count: 1,
            },
            {
              id: 'K08905',
              text: 'Polyurethane',
              selected: false,
              count: 3,
            },
            {
              id: 'K19985',
              text: 'Silicone',
              selected: false,
              count: 4,
            },
            {
              id: 'K698593',
              text: 'Thermoplastic elastomer (TPE)',
              selected: false,
              count: 2,
            },
            {
              id: 'K912856',
              text: 'Thermoplastic polyurethane (TPU)',
              selected: false,
              count: 5,
            },
          ],
        },
      ],
    },
    {
      group: 'System Requirements',
      refinements: [
        {
          id: 'A00429',
          name: 'OS Required',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K463697',
              text: 'Android 3.1 (Honeycomb) or later',
              selected: false,
              count: 1,
            },
            {
              id: 'K565752',
              text: 'Android 5.0 (Lollipop)',
              selected: false,
              count: 2,
            },
            {
              id: 'K782564',
              text: 'Android 6.0 (Marshmallow) or later',
              selected: false,
              count: 1,
            },
            {
              id: 'K75404',
              text: 'Apple MacOS X 10.0 or later',
              selected: false,
              count: 1,
            },
            {
              id: 'K575131',
              text: 'Apple MacOS X 10.10',
              selected: false,
              count: 2,
            },
            {
              id: 'K138368',
              text: 'Apple MacOS X 10.4 or later',
              selected: false,
              count: 1,
            },
            {
              id: 'K229542',
              text: 'Apple MacOS X 10.4.x or later',
              selected: false,
              count: 1,
            },
            {
              id: 'K231594',
              text: 'Apple MacOS X 10.5 or later',
              selected: false,
              count: 1,
            },
            {
              id: 'K600324',
              text: 'Apple OS X 10.10 Yosemite or later',
              selected: false,
              count: 1,
            },
            {
              id: 'K331355',
              text: 'Google Chrome OS',
              selected: false,
              count: 1,
            },
            {
              id: 'K182634',
              text: 'Linux Kernel 2.6 or later',
              selected: false,
              count: 2,
            },
            {
              id: 'K67658',
              text: 'Microsoft Windows 2000 / XP',
              selected: false,
              count: 1,
            },
            {
              id: 'K462841',
              text: 'Microsoft Windows 2000/XP/Vista/7/8',
              selected: false,
              count: 1,
            },
            {
              id: 'K116689',
              text: 'Microsoft Windows 7',
              selected: false,
              count: 3,
            },
            {
              id: 'K649217',
              text: 'Microsoft Windows 7 / 8 / 10 or later',
              selected: false,
              count: 1,
            },
            {
              id: 'K615436',
              text: 'Microsoft Windows 7 / 8 / 8.1 / 10',
              selected: false,
              count: 1,
            },
            {
              id: 'K383692',
              text: 'Microsoft Windows RT',
              selected: false,
              count: 1,
            },
            {
              id: 'K234127',
              text: 'Microsoft Windows Vista / XP',
              selected: false,
              count: 1,
            },
            {
              id: 'K188009',
              text: 'Microsoft Windows Vista / XP / 7',
              selected: false,
              count: 1,
            },
            {
              id: 'K598297',
              text: 'Windows 10',
              selected: false,
              count: 3,
            },
            {
              id: 'K809472',
              text: 'Windows 10 or later',
              selected: false,
              count: 1,
            },
            {
              id: 'K346822',
              text: 'Windows 8',
              selected: false,
              count: 3,
            },
            {
              id: 'K746646',
              text: 'Windows 8 / 8.1 / 10',
              selected: false,
              count: 1,
            },
            {
              id: 'K867739',
              text: 'Windows 8 / 8.1 / 10 (32/64 bits)',
              selected: false,
              count: 2,
            },
            {
              id: 'K485406',
              text: 'Windows 8.1',
              selected: false,
              count: 1,
            },
            {
              id: 'K741827',
              text: 'Windows 8.1 / 10',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A02299',
          name: 'OS Family',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K94363',
              text: 'Windows',
              selected: false,
              count: 12,
            },
          ],
        },
      ],
    },
    {
      group: 'Miscellaneous',
      refinements: [
        {
          id: 'A03301',
          name: 'OEM Manufacturer Equivalent Part Number',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K710564',
              text: 'DELL A8547953',
              selected: false,
              count: 1,
            },
            {
              id: 'K795057',
              text: 'DELL A9206671',
              selected: false,
              count: 1,
            },
            {
              id: 'K795052',
              text: 'DELL A9210967',
              selected: false,
              count: 1,
            },
            {
              id: 'K945834',
              text: 'DELL AA075845',
              selected: false,
              count: 1,
            },
            {
              id: 'K945835',
              text: 'DELL SNPCRXJ6C/16G',
              selected: false,
              count: 1,
            },
            {
              id: 'K795056',
              text: 'DELL SNPHYXPXC/8G',
              selected: false,
              count: 1,
            },
            {
              id: 'K795053',
              text: 'DELL SNPMKYF9C/8G',
              selected: false,
              count: 1,
            },
            {
              id: 'K710565',
              text: 'DELL SNPTD3KXC/8G',
              selected: false,
              count: 1,
            },
            {
              id: 'K986118',
              text: 'HP 741727-001',
              selected: false,
              count: 1,
            },
            {
              id: 'K986120',
              text: 'HP H6Y89UT#ABA',
              selected: false,
              count: 1,
            },
            {
              id: 'K803243',
              text: 'Lenovo 4X70M60573',
              selected: false,
              count: 1,
            },
            {
              id: 'K1100667',
              text: 'Lenovo 4X70W30751',
              selected: false,
              count: 2,
            },
            {
              id: 'K1223022',
              text: 'Lenovo 4X70Z90847',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00373',
          name: 'Color',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K832282',
              text: 'Abyss black',
              selected: false,
              count: 3,
            },
            {
              id: 'K90703',
              text: 'Aluminum',
              selected: false,
              count: 1,
            },
            {
              id: 'K01699',
              text: 'Black',
              selected: false,
              count: 89,
            },
            {
              id: 'K488402',
              text: 'Black (keyboard)',
              selected: false,
              count: 1,
            },
            {
              id: 'K214107',
              text: 'Black gray',
              selected: false,
              count: 1,
            },
            {
              id: 'K1093084',
              text: 'Black leather magnetic snap with heather gray outer',
              selected: false,
              count: 1,
            },
            {
              id: 'K1091672',
              text: 'Black paint',
              selected: false,
              count: 11,
            },
            {
              id: 'K256978',
              text: 'Black weave',
              selected: false,
              count: 5,
            },
            {
              id: 'K1037898',
              text: 'Black with HD Screen print logo',
              selected: false,
              count: 3,
            },
            {
              id: 'K1027008',
              text: 'Black with silkscreen Dell logo',
              selected: false,
              count: 1,
            },
            {
              id: 'K180764',
              text: 'Black/orange',
              selected: false,
              count: 1,
            },
            {
              id: 'K02744',
              text: 'Blue',
              selected: false,
              count: 2,
            },
            {
              id: 'K11548',
              text: 'Burgundy',
              selected: false,
              count: 1,
            },
            {
              id: 'K62246',
              text: 'Carbon gray',
              selected: false,
              count: 1,
            },
            {
              id: 'K973933',
              text: 'Chalkboard gray',
              selected: false,
              count: 1,
            },
            {
              id: 'K27026',
              text: 'Charcoal',
              selected: false,
              count: 1,
            },
            {
              id: 'K21144',
              text: 'Clear',
              selected: false,
              count: 4,
            },
            {
              id: 'K53635',
              text: 'Cobalt blue',
              selected: false,
              count: 2,
            },
            {
              id: 'K24515',
              text: 'Dark gray',
              selected: false,
              count: 1,
            },
            {
              id: 'K30192',
              text: 'Dark red',
              selected: false,
              count: 1,
            },
            {
              id: 'K281485',
              text: 'Dark shadow',
              selected: false,
              count: 1,
            },
            {
              id: 'K61399',
              text: 'Dark silver',
              selected: false,
              count: 2,
            },
            {
              id: 'K765449',
              text: 'Dragonfly blue',
              selected: false,
              count: 5,
            },
            {
              id: 'K14899',
              text: 'Glossy',
              selected: false,
              count: 1,
            },
            {
              id: 'K58670',
              text: 'Gold',
              selected: false,
              count: 3,
            },
            {
              id: 'K53672',
              text: 'Graphite black',
              selected: false,
              count: 2,
            },
            {
              id: 'K58680',
              text: 'Graphite gray',
              selected: false,
              count: 1,
            },
            {
              id: 'K01698',
              text: 'Gray',
              selected: false,
              count: 10,
            },
            {
              id: 'K186714',
              text: 'Heather gray',
              selected: false,
              count: 2,
            },
            {
              id: 'K27595',
              text: 'Ice blue',
              selected: false,
              count: 1,
            },
            {
              id: 'K1127061',
              text: 'Iridescent dragonfly blue',
              selected: false,
              count: 1,
            },
            {
              id: 'K76989',
              text: 'Iron gray',
              selected: false,
              count: 7,
            },
            {
              id: 'K170848',
              text: 'Matte',
              selected: false,
              count: 1,
            },
            {
              id: 'K55656',
              text: 'Matte black',
              selected: false,
              count: 11,
            },
            {
              id: 'K940772',
              text: 'Matte black with gold diamond cut',
              selected: false,
              count: 1,
            },
            {
              id: 'K1104075',
              text: 'Mountain gray',
              selected: false,
              count: 1,
            },
            {
              id: 'K369888',
              text: 'Natural silver',
              selected: false,
              count: 5,
            },
            {
              id: 'K941589',
              text: 'Onyx blue metallic',
              selected: false,
              count: 1,
            },
            {
              id: 'K831436',
              text: 'Onyx blue with hairline',
              selected: false,
              count: 1,
            },
            {
              id: 'K76685',
              text: 'Pastel blue',
              selected: false,
              count: 1,
            },
            {
              id: 'K14334',
              text: 'Platinum',
              selected: false,
              count: 17,
            },
            {
              id: 'K88113',
              text: 'Platinum silver',
              selected: false,
              count: 2,
            },
            {
              id: 'K233717',
              text: 'Poppy red',
              selected: false,
              count: 1,
            },
            {
              id: 'K05543',
              text: 'Purple',
              selected: false,
              count: 1,
            },
            {
              id: 'K167754',
              text: 'Sandstone',
              selected: false,
              count: 2,
            },
            {
              id: 'K02918',
              text: 'Silver',
              selected: false,
              count: 11,
            },
            {
              id: 'K480037',
              text: 'Space gray',
              selected: false,
              count: 3,
            },
            {
              id: 'K1031098',
              text: 'Space gray with silver diamond cut',
              selected: false,
              count: 1,
            },
            {
              id: 'K182113',
              text: 'Sparkling black',
              selected: false,
              count: 1,
            },
            {
              id: 'K63982',
              text: 'Steel gray',
              selected: false,
              count: 1,
            },
            {
              id: 'K11636',
              text: 'Teal',
              selected: false,
              count: 1,
            },
            {
              id: 'K09576',
              text: 'Transparent',
              selected: false,
              count: 3,
            },
            {
              id: 'K653719',
              text: 'Turbo silver',
              selected: false,
              count: 1,
            },
            {
              id: 'K01700',
              text: 'White',
              selected: false,
              count: 3,
            },
            {
              id: 'K216895',
              text: 'White gloss',
              selected: false,
              count: 1,
            },
            {
              id: 'K305439',
              text: 'Wool blue',
              selected: false,
              count: 1,
            },
            {
              id: 'K04664',
              text: 'Yellow',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A05795',
          name: 'Color Category',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K352693',
              text: 'Beige',
              selected: false,
              count: 2,
            },
            {
              id: 'K352694',
              text: 'Black',
              selected: false,
              count: 273,
            },
            {
              id: 'K352695',
              text: 'Blue',
              selected: false,
              count: 17,
            },
            {
              id: 'K352697',
              text: 'Gold',
              selected: false,
              count: 1,
            },
            {
              id: 'K352698',
              text: 'Gray',
              selected: false,
              count: 50,
            },
            {
              id: 'K352699',
              text: 'Green',
              selected: false,
              count: 1,
            },
            {
              id: 'K352700',
              text: 'Orange',
              selected: false,
              count: 1,
            },
            {
              id: 'K352702',
              text: 'Purple',
              selected: false,
              count: 1,
            },
            {
              id: 'K352703',
              text: 'Red',
              selected: false,
              count: 4,
            },
            {
              id: 'K352704',
              text: 'Silver',
              selected: false,
              count: 93,
            },
            {
              id: 'K469801',
              text: 'Transparent',
              selected: false,
              count: 12,
            },
            {
              id: 'K352705',
              text: 'White',
              selected: false,
              count: 7,
            },
          ],
        },
        {
          id: 'A05811',
          name: 'Color Category',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K356330',
              text: 'Black',
              selected: false,
              count: 7,
            },
            {
              id: 'K356326',
              text: 'Gray',
              selected: false,
              count: 2,
            },
            {
              id: 'K376888',
              text: 'Transparent',
              selected: false,
              count: 3,
            },
          ],
        },
        {
          id: 'A07243',
          name: 'Finish',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K441164',
              text: 'Glossy',
              selected: false,
              count: 7,
            },
            {
              id: 'K441165',
              text: 'Matte',
              selected: false,
              count: 12,
            },
          ],
        },
        {
          id: 'A00372',
          name: 'Product Material',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K252606',
              text: '1200D polyester',
              selected: false,
              count: 1,
            },
            {
              id: 'K236671',
              text: '1680D ballistic nylon',
              selected: false,
              count: 2,
            },
            {
              id: 'K312051',
              text: '1680D ballistic polyester',
              selected: false,
              count: 1,
            },
            {
              id: 'K260672',
              text: '800D nylon',
              selected: false,
              count: 1,
            },
            {
              id: 'K317758',
              text: 'Carbon',
              selected: false,
              count: 1,
            },
            {
              id: 'K226759',
              text: 'Carbon steel',
              selected: false,
              count: 6,
            },
            {
              id: 'K252078',
              text: 'Dobby nylon',
              selected: false,
              count: 1,
            },
            {
              id: 'K561121',
              text: 'Durable nylon',
              selected: false,
              count: 1,
            },
            {
              id: 'K431677',
              text: 'Durable polyester',
              selected: false,
              count: 1,
            },
            {
              id: 'K536411',
              text: 'Ethylene vinyl acetate (EVA)',
              selected: false,
              count: 1,
            },
            {
              id: 'K09565',
              text: 'Fabric',
              selected: false,
              count: 1,
            },
            {
              id: 'K09241',
              text: 'Galvanized steel',
              selected: false,
              count: 2,
            },
            {
              id: 'K80089',
              text: 'Leatherette',
              selected: false,
              count: 1,
            },
            {
              id: 'K01694',
              text: 'Metal',
              selected: false,
              count: 1,
            },
            {
              id: 'K10079',
              text: 'Neoprene',
              selected: false,
              count: 1,
            },
            {
              id: 'K625333',
              text: 'Nylex',
              selected: false,
              count: 1,
            },
            {
              id: 'K02711',
              text: 'Nylon',
              selected: false,
              count: 5,
            },
            {
              id: 'K78797',
              text: 'Nylon twill',
              selected: false,
              count: 1,
            },
            {
              id: 'K143276',
              text: 'PET',
              selected: false,
              count: 1,
            },
            {
              id: 'K21233',
              text: 'Polycarbonate',
              selected: false,
              count: 3,
            },
            {
              id: 'K06137',
              text: 'Polyester',
              selected: false,
              count: 4,
            },
            {
              id: 'K08905',
              text: 'Polyurethane',
              selected: false,
              count: 2,
            },
            {
              id: 'K459931',
              text: 'Powder-coated steel',
              selected: false,
              count: 1,
            },
            {
              id: 'K15042',
              text: 'PVC',
              selected: false,
              count: 1,
            },
            {
              id: 'K64593',
              text: 'Ripstop',
              selected: false,
              count: 1,
            },
            {
              id: 'K35103',
              text: 'Steel',
              selected: false,
              count: 2,
            },
            {
              id: 'K912856',
              text: 'Thermoplastic polyurethane (TPU)',
              selected: false,
              count: 3,
            },
          ],
        },
        {
          id: 'A01825',
          name: 'Pricing Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K50998',
              text: 'Academic',
              selected: false,
              count: 1,
            },
            {
              id: 'K844103',
              text: 'Brown Box',
              selected: false,
              count: 1,
            },
            {
              id: 'K673440',
              text: 'Build To Plan (BTP)',
              selected: false,
              count: 2,
            },
            {
              id: 'K673438',
              text: 'Build To Stock (BTS)',
              selected: false,
              count: 26,
            },
            {
              id: 'K335529',
              text: 'Commercial',
              selected: false,
              count: 41,
            },
            {
              id: 'K341944',
              text: 'Customer-replaceable Unit (CRU)',
              selected: false,
              count: 2,
            },
            {
              id: 'K90955',
              text: 'Demo',
              selected: false,
              count: 15,
            },
            {
              id: 'K324192',
              text: 'Field Replaceable Unit (FRU)',
              selected: false,
              count: 4,
            },
            {
              id: 'K61852',
              text: 'Promo',
              selected: false,
              count: 1,
            },
            {
              id: 'K150636',
              text: 'Upgrade',
              selected: false,
              count: 2,
            },
          ],
        },
        {
          id: 'A04851',
          name: 'Manufacturer Selling Program',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K792927',
              text: 'Dell Smart Selection',
              selected: false,
              count: 12,
            },
            {
              id: 'K110651',
              text: 'HP Smart Buy',
              selected: false,
              count: 45,
            },
            {
              id: 'K52346',
              text: 'TopSeller',
              selected: false,
              count: 56,
            },
          ],
        },
        {
          id: 'A05312',
          name: 'Refurbished',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K113638',
              text: 'Refurbished',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A05579',
          name: 'TAA Compliant',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K301883',
              text: 'Yes',
              selected: false,
              count: 10,
            },
          ],
        },
        {
          id: 'A10690',
          name: 'OEM Manufacturer Equivalent Part Number',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K1119281',
              text: 'Toshiba KPM5XRUG3T84',
              selected: false,
              count: 1,
            },
            {
              id: 'K1032815',
              text: 'Toshiba KPM5XVUG480G',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A04806',
          name: 'Microsoft Certification',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K186528',
              text: 'Compatible with Windows 7',
              selected: false,
              count: 4,
            },
          ],
        },
        {
          id: 'A02368',
          name: 'Flat Panel Mount Interface',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K53067',
              text: '100 x 100 mm',
              selected: false,
              count: 4,
            },
            {
              id: 'K53071',
              text: '75 x 75 mm',
              selected: false,
              count: 4,
            },
          ],
        },
        {
          id: 'A04904',
          name: 'Bay Compatibility',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K223353',
              text: 'Modular Bay',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A02562',
          name: 'Max Load Weight',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 35.2,
            max: 530,
          },
          options: [
            {
              id: 'W00386',
              text: '33.1 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W00141',
              text: '3.6 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W00104',
              text: '2.4 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W00130',
              text: '2.2 lbs',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A07676',
          name: 'Medical',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K491038',
              text: 'Yes',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00374',
          name: 'Features',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K955241',
              text: '+/- 30° visible angle',
              selected: false,
              count: 1,
            },
            {
              id: 'K126257',
              text: '360° swivel capability',
              selected: false,
              count: 1,
            },
            {
              id: 'K416528',
              text: '4 digit code',
              selected: false,
              count: 2,
            },
            {
              id: 'K824713',
              text: '5mm Keying System',
              selected: false,
              count: 1,
            },
            {
              id: 'K775901',
              text: '60° viewing',
              selected: false,
              count: 9,
            },
            {
              id: 'K738092',
              text: '60° visible angle',
              selected: false,
              count: 1,
            },
            {
              id: 'K814828',
              text: 'Adhesive',
              selected: false,
              count: 1,
            },
            {
              id: 'K59458',
              text: 'Anti-glare',
              selected: false,
              count: 12,
            },
            {
              id: 'K66821',
              text: 'Anti-reflective',
              selected: false,
              count: 2,
            },
            {
              id: 'K859926',
              text: 'Blue light filter',
              selected: false,
              count: 1,
            },
            {
              id: 'K569741',
              text: 'ClickSafe Security Anchor',
              selected: false,
              count: 1,
            },
            {
              id: 'K97189',
              text: 'Combination lock',
              selected: false,
              count: 2,
            },
            {
              id: 'K590313',
              text: 'Cut-resistant',
              selected: false,
              count: 4,
            },
            {
              id: 'K935129',
              text: 'Durable screen protection',
              selected: false,
              count: 2,
            },
            {
              id: 'K72075',
              text: 'Dust-resistant',
              selected: false,
              count: 2,
            },
            {
              id: 'K1008329',
              text: 'For units with integrated SmartCard reader',
              selected: false,
              count: 1,
            },
            {
              id: 'K476012',
              text: 'Frameless',
              selected: false,
              count: 2,
            },
            {
              id: 'K659033',
              text: 'Glossy surface',
              selected: false,
              count: 1,
            },
            {
              id: 'K347019',
              text: 'Heavy-duty',
              selected: false,
              count: 1,
            },
            {
              id: 'K446493',
              text: 'Height adjustable',
              selected: false,
              count: 1,
            },
            {
              id: 'K883140',
              text: 'Hidden pick-resistant pin',
              selected: false,
              count: 1,
            },
            {
              id: 'K601682',
              text: 'Hidden pin',
              selected: false,
              count: 2,
            },
            {
              id: 'K94914',
              text: 'Key lock',
              selected: false,
              count: 1,
            },
            {
              id: 'K813003',
              text: 'Landscape mounting',
              selected: false,
              count: 12,
            },
            {
              id: 'K576948',
              text: 'Low-reflective',
              selected: false,
              count: 1,
            },
            {
              id: 'K87760',
              text: 'Matte',
              selected: false,
              count: 1,
            },
            {
              id: 'K412195',
              text: 'Micro-Louver technology',
              selected: false,
              count: 10,
            },
            {
              id: 'K313185',
              text: 'Microlouver privacy technology',
              selected: false,
              count: 1,
            },
            {
              id: 'K316641',
              text: 'Password lock',
              selected: false,
              count: 1,
            },
            {
              id: 'K301198',
              text: 'Pivot adjustment',
              selected: false,
              count: 2,
            },
            {
              id: 'K536744',
              text: 'Push-to-lock',
              selected: false,
              count: 1,
            },
            {
              id: 'K955242',
              text: 'Reduces 30% of blue light transmission',
              selected: false,
              count: 1,
            },
            {
              id: 'K179780',
              text: 'Reversible',
              selected: false,
              count: 7,
            },
            {
              id: 'K614932',
              text: 'Rotatable',
              selected: false,
              count: 1,
            },
            {
              id: 'K614919',
              text: 'Scratch-resistant',
              selected: false,
              count: 2,
            },
            {
              id: 'K912810',
              text: 'Serialized combination lock',
              selected: false,
              count: 1,
            },
            {
              id: 'K37997',
              text: 'Sliding',
              selected: false,
              count: 1,
            },
            {
              id: 'K283698',
              text: 'T-bar lock',
              selected: false,
              count: 4,
            },
            {
              id: 'K320312',
              text: 'Tamper-proof',
              selected: false,
              count: 4,
            },
            {
              id: 'K539411',
              text: 'Touch screen compatible',
              selected: false,
              count: 6,
            },
            {
              id: 'K971997',
              text: 'Tough Lock Head lock',
              selected: false,
              count: 1,
            },
            {
              id: 'K444940',
              text: 'VESA interface support',
              selected: false,
              count: 1,
            },
            {
              id: 'K453738',
              text: 'Vinyl-coated',
              selected: false,
              count: 1,
            },
            {
              id: 'K21547',
              text: 'Wheels',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A09055',
          name: 'Assembly Required',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K705135',
              text: 'Yes',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'Display Filter',
      refinements: [
        {
          id: 'A07041',
          name: 'Viewing Area Height',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 5.7,
            max: 9,
          },
          options: [
            {
              id: 'W00102',
              text: '9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00117',
              text: '8.3 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00137',
              text: '8.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00202',
              text: '7.6 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00413',
              text: '7.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00249',
              text: '7 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00208',
              text: '6.9 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00020',
              text: '6.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00056',
              text: '5.7 in',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A07040',
          name: 'Viewing Area Width',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 10.1,
            max: 14.2,
          },
          options: [
            {
              id: 'W00015',
              text: '14.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00275',
              text: '13.9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00387',
              text: '13.6 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00326',
              text: '13.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00038',
              text: '12.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00089',
              text: '12 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00152',
              text: '11.6 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00135',
              text: '11.3 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00632',
              text: '10.9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00190',
              text: '10.1 in',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A07039',
          name: 'Aspect Ratio',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K07860',
              text: '16:10',
              selected: false,
              count: 2,
            },
            {
              id: 'K00786',
              text: '16:9',
              selected: false,
              count: 9,
            },
            {
              id: 'K00787',
              text: '4:3',
              selected: false,
              count: 1,
            },
            {
              id: 'K842471',
              text: '8:5',
              selected: false,
              count: 3,
            },
          ],
        },
        {
          id: 'A07034',
          name: 'Scratch Resistant',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K426264',
              text: 'Yes',
              selected: false,
              count: 15,
            },
          ],
        },
        {
          id: 'A07032',
          name: 'Frameless',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K426266',
              text: 'Yes',
              selected: false,
              count: 14,
            },
          ],
        },
      ],
    },
    {
      group: 'Environmental Standards',
      refinements: [
        {
          id: 'A05294',
          name: 'EPEAT Compliant',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K265025',
              text: 'Yes',
              selected: false,
              count: 48,
            },
          ],
        },
        {
          id: 'A05295',
          name: 'EPEAT Level',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K265022',
              text: 'EPEAT Gold',
              selected: false,
              count: 36,
            },
            {
              id: 'K265023',
              text: 'EPEAT Silver',
              selected: false,
              count: 7,
            },
          ],
        },
        {
          id: 'A05296',
          name: 'ENERGY STAR Certified',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K265026',
              text: 'Yes',
              selected: false,
              count: 153,
            },
          ],
        },
        {
          id: 'A06583',
          name: 'Blue Angel',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K410728',
              text: 'No',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A06589',
          name: 'ENERGY STAR',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K410734',
              text: 'No',
              selected: false,
              count: 3,
            },
            {
              id: 'K410722',
              text: 'Yes',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A06592',
          name: 'TCO Certified',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K410725',
              text: 'Yes',
              selected: false,
              count: 127,
            },
          ],
        },
        {
          id: 'A11787',
          name: 'TCO Certification',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K1046369',
              text: 'TCO Certified Displays 8',
              selected: false,
              count: 3,
            },
            {
              id: 'K1114096',
              text: 'TCO Certified Notebooks 8',
              selected: false,
              count: 124,
            },
          ],
        },
        {
          id: 'A06584',
          name: 'Nordic Swan Ecolabel',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K410729',
              text: 'No',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A06582',
          name: 'EU Ecolabel',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K410727',
              text: 'No',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A06591',
          name: 'NF Environment',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K410736',
              text: 'No',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'Dimensions & Weight',
      refinements: [
        {
          id: 'A00354',
          name: 'Width',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1.3,
            max: 48,
          },
          options: [
            {
              id: 'W00490',
              text: '48 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00658',
              text: '34.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00849',
              text: '33 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00169',
              text: '24 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00308',
              text: '19.7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00268',
              text: '18.9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00222',
              text: '18.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00143',
              text: '17.7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00177',
              text: '17.5 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00085',
              text: '17.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00061',
              text: '17 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00072',
              text: '16.9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00036',
              text: '16.5 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00035',
              text: '16.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00294',
              text: '16 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00324',
              text: '15.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00034',
              text: '15.7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00196',
              text: '15.6 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00205',
              text: '15 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00262',
              text: '14.9 in',
              selected: false,
              count: 10,
            },
            {
              id: 'W00076',
              text: '14.8 in',
              selected: false,
              count: 6,
            },
            {
              id: 'W00016',
              text: '14.6 in',
              selected: false,
              count: 4,
            },
            {
              id: 'W00239',
              text: '14.5 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00153',
              text: '14.4 in',
              selected: false,
              count: 6,
            },
            {
              id: 'W00015',
              text: '14.2 in',
              selected: false,
              count: 16,
            },
            {
              id: 'W00157',
              text: '14.1 in',
              selected: false,
              count: 14,
            },
            {
              id: 'W00297',
              text: '14 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00145',
              text: '13.8 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00387',
              text: '13.6 in',
              selected: false,
              count: 8,
            },
            {
              id: 'W00612',
              text: '13.5 in',
              selected: false,
              count: 5,
            },
            {
              id: 'W00142',
              text: '13.4 in',
              selected: false,
              count: 12,
            },
            {
              id: 'W00310',
              text: '13.2 in',
              selected: false,
              count: 4,
            },
            {
              id: 'W00054',
              text: '13 in',
              selected: false,
              count: 12,
            },
            {
              id: 'W00113',
              text: '12.9 in',
              selected: false,
              count: 5,
            },
            {
              id: 'W00332',
              text: '12.8 in',
              selected: false,
              count: 18,
            },
            {
              id: 'W00527',
              text: '12.7 in',
              selected: false,
              count: 38,
            },
            {
              id: 'W00373',
              text: '12.6 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00204',
              text: '12.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00048',
              text: '12.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00148',
              text: '12.3 in',
              selected: false,
              count: 10,
            },
            {
              id: 'W00038',
              text: '12.2 in',
              selected: false,
              count: 10,
            },
            {
              id: 'W00191',
              text: '12.1 in',
              selected: false,
              count: 17,
            },
            {
              id: 'W00089',
              text: '12 in',
              selected: false,
              count: 18,
            },
            {
              id: 'W00198',
              text: '11.9 in',
              selected: false,
              count: 4,
            },
            {
              id: 'W00271',
              text: '11.8 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00224',
              text: '11.7 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00152',
              text: '11.6 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00074',
              text: '11.5 in',
              selected: false,
              count: 10,
            },
            {
              id: 'W00248',
              text: '11.4 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00135',
              text: '11.3 in',
              selected: false,
              count: 9,
            },
            {
              id: 'W00277',
              text: '11.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00088',
              text: '11 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00246',
              text: '10.7 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00350',
              text: '10.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00114',
              text: '10 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00154',
              text: '9.7 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00019',
              text: '9.6 in',
              selected: false,
              count: 6,
            },
            {
              id: 'W00274',
              text: '9.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00116',
              text: '9.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00017',
              text: '9.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00244',
              text: '9.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00102',
              text: '9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00134',
              text: '8.7 in',
              selected: false,
              count: 4,
            },
            {
              id: 'W00073',
              text: '8.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00212',
              text: '8.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00117',
              text: '8.3 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00442',
              text: '8.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00137',
              text: '8.1 in',
              selected: false,
              count: 4,
            },
            {
              id: 'W00410',
              text: '7.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00202',
              text: '7.6 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00413',
              text: '7.2 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00120',
              text: '7.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00249',
              text: '7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00605',
              text: '6.8 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00026',
              text: '6.7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00042',
              text: '6.6 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00199',
              text: '6.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00105',
              text: '6.3 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00211',
              text: '5.9 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00096',
              text: '5.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00056',
              text: '5.7 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00209',
              text: '5.6 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00182',
              text: '5.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00126',
              text: '5.1 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00027',
              text: '5 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00081',
              text: '4.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00365',
              text: '4.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00021',
              text: '3.9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00079',
              text: '3.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00132',
              text: '3.5 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00188',
              text: '3.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00101',
              text: '2.8 in',
              selected: false,
              count: 13,
            },
            {
              id: 'W00634',
              text: '2.7 in',
              selected: false,
              count: 13,
            },
            {
              id: 'W00159',
              text: '2.5 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00104',
              text: '2.4 in',
              selected: false,
              count: 5,
            },
            {
              id: 'W00150',
              text: '2.3 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00130',
              text: '2.2 in',
              selected: false,
              count: 7,
            },
            {
              id: 'W00043',
              text: '2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00110',
              text: '1.9 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00050',
              text: '1.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00125',
              text: '1.7 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00040',
              text: '1.6 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00090',
              text: '1.5 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00112',
              text: '1.3 in',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00355',
          name: 'Depth',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 0.1,
            max: 25,
          },
          options: [
            {
              id: 'W00122',
              text: '25 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00169',
              text: '24 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00093',
              text: '17.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00324',
              text: '15.8 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00153',
              text: '14.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00145',
              text: '13.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00332',
              text: '12.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00074',
              text: '11.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00632',
              text: '10.9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00246',
              text: '10.7 in',
              selected: false,
              count: 7,
            },
            {
              id: 'W00350',
              text: '10.4 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00335',
              text: '10.3 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00049',
              text: '10.2 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00190',
              text: '10.1 in',
              selected: false,
              count: 4,
            },
            {
              id: 'W00114',
              text: '10 in',
              selected: false,
              count: 5,
            },
            {
              id: 'W00082',
              text: '9.9 in',
              selected: false,
              count: 13,
            },
            {
              id: 'W00039',
              text: '9.8 in',
              selected: false,
              count: 5,
            },
            {
              id: 'W00154',
              text: '9.7 in',
              selected: false,
              count: 12,
            },
            {
              id: 'W00019',
              text: '9.6 in',
              selected: false,
              count: 10,
            },
            {
              id: 'W00274',
              text: '9.5 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00116',
              text: '9.4 in',
              selected: false,
              count: 8,
            },
            {
              id: 'W00017',
              text: '9.3 in',
              selected: false,
              count: 17,
            },
            {
              id: 'W00315',
              text: '9.2 in',
              selected: false,
              count: 17,
            },
            {
              id: 'W00244',
              text: '9.1 in',
              selected: false,
              count: 6,
            },
            {
              id: 'W00102',
              text: '9 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00059',
              text: '8.9 in',
              selected: false,
              count: 12,
            },
            {
              id: 'W00184',
              text: '8.8 in',
              selected: false,
              count: 9,
            },
            {
              id: 'W00134',
              text: '8.7 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00214',
              text: '8.6 in',
              selected: false,
              count: 16,
            },
            {
              id: 'W00073',
              text: '8.5 in',
              selected: false,
              count: 30,
            },
            {
              id: 'W00212',
              text: '8.4 in',
              selected: false,
              count: 5,
            },
            {
              id: 'W00117',
              text: '8.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00442',
              text: '8.2 in',
              selected: false,
              count: 16,
            },
            {
              id: 'W00137',
              text: '8.1 in',
              selected: false,
              count: 8,
            },
            {
              id: 'W00057',
              text: '8 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00086',
              text: '7.9 in',
              selected: false,
              count: 11,
            },
            {
              id: 'W00410',
              text: '7.8 in',
              selected: false,
              count: 6,
            },
            {
              id: 'W00051',
              text: '7.7 in',
              selected: false,
              count: 4,
            },
            {
              id: 'W00119',
              text: '7.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00127',
              text: '7.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00192',
              text: '7.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00413',
              text: '7.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00120',
              text: '7.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00249',
              text: '7 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00208',
              text: '6.9 in',
              selected: false,
              count: 5,
            },
            {
              id: 'W00026',
              text: '6.7 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00199',
              text: '6.5 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00105',
              text: '6.3 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00020',
              text: '6.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00091',
              text: '6 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00211',
              text: '5.9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00096',
              text: '5.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00056',
              text: '5.7 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00182',
              text: '5.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00027',
              text: '5 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00083',
              text: '4.9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00030',
              text: '4.7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00155',
              text: '4.5 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00107',
              text: '4.3 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00365',
              text: '4.2 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00123',
              text: '4.1 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00095',
              text: '4 in',
              selected: false,
              count: 12,
            },
            {
              id: 'W00021',
              text: '3.9 in',
              selected: false,
              count: 22,
            },
            {
              id: 'W00079',
              text: '3.8 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00098',
              text: '3.7 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00132',
              text: '3.5 in',
              selected: false,
              count: 4,
            },
            {
              id: 'W00129',
              text: '3.3 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00372',
              text: '3.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00188',
              text: '3.1 in',
              selected: false,
              count: 5,
            },
            {
              id: 'W00031',
              text: '3 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00101',
              text: '2.8 in',
              selected: false,
              count: 4,
            },
            {
              id: 'W00634',
              text: '2.7 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00159',
              text: '2.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00104',
              text: '2.4 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00130',
              text: '2.2 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00128',
              text: '2.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00043',
              text: '2 in',
              selected: false,
              count: 7,
            },
            {
              id: 'W00110',
              text: '1.9 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00050',
              text: '1.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00125',
              text: '1.7 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00040',
              text: '1.6 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00090',
              text: '1.5 in',
              selected: false,
              count: 4,
            },
            {
              id: 'W00115',
              text: '1.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00106',
              text: '1.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00022',
              text: '1.1 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00097',
              text: '1 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00103',
              text: '0.9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00029',
              text: '0.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00025',
              text: '0.7 in',
              selected: false,
              count: 4,
            },
            {
              id: 'W00293',
              text: '0.6 in',
              selected: false,
              count: 5,
            },
            {
              id: 'W00028',
              text: '0.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00618',
              text: '0.1 in',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00356',
          name: 'Height',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 0.3,
            max: 59.8,
          },
          options: [
            {
              id: 'W01752',
              text: '59.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00399',
              text: '43 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00942',
              text: '42.9 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00122',
              text: '25 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00308',
              text: '19.7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00393',
              text: '19.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00146',
              text: '19 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00045',
              text: '18.7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00173',
              text: '18.5 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00151',
              text: '18 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00245',
              text: '17.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00143',
              text: '17.7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00241',
              text: '16.7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00379',
              text: '15.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00205',
              text: '15 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00016',
              text: '14.6 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00297',
              text: '14 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00145',
              text: '13.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00387',
              text: '13.6 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00612',
              text: '13.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00170',
              text: '13.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00326',
              text: '13.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00054',
              text: '13 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00332',
              text: '12.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00527',
              text: '12.7 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00048',
              text: '12.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00038',
              text: '12.2 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00089',
              text: '12 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00271',
              text: '11.8 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00277',
              text: '11.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00210',
              text: '10.6 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00531',
              text: '10.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00049',
              text: '10.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00190',
              text: '10.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00114',
              text: '10 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00039',
              text: '9.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00017',
              text: '9.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00244',
              text: '9.1 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00102',
              text: '9 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00059',
              text: '8.9 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00117',
              text: '8.3 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00442',
              text: '8.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00137',
              text: '8.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00051',
              text: '7.7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00202',
              text: '7.6 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00119',
              text: '7.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00127',
              text: '7.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00120',
              text: '7.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00249',
              text: '7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00208',
              text: '6.9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00105',
              text: '6.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00020',
              text: '6.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00182',
              text: '5.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00083',
              text: '4.9 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00081',
              text: '4.8 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00079',
              text: '3.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00098',
              text: '3.7 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00132',
              text: '3.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00188',
              text: '3.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00121',
              text: '2.9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00634',
              text: '2.7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00159',
              text: '2.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00130',
              text: '2.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00128',
              text: '2.1 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00043',
              text: '2 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00050',
              text: '1.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00040',
              text: '1.6 in',
              selected: false,
              count: 4,
            },
            {
              id: 'W00090',
              text: '1.5 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00115',
              text: '1.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00112',
              text: '1.3 in',
              selected: false,
              count: 11,
            },
            {
              id: 'W00106',
              text: '1.2 in',
              selected: false,
              count: 10,
            },
            {
              id: 'W00022',
              text: '1.1 in',
              selected: false,
              count: 13,
            },
            {
              id: 'W00097',
              text: '1 in',
              selected: false,
              count: 16,
            },
            {
              id: 'W00103',
              text: '0.9 in',
              selected: false,
              count: 22,
            },
            {
              id: 'W00029',
              text: '0.8 in',
              selected: false,
              count: 42,
            },
            {
              id: 'W00025',
              text: '0.7 in',
              selected: false,
              count: 78,
            },
            {
              id: 'W00293',
              text: '0.6 in',
              selected: false,
              count: 66,
            },
            {
              id: 'W00160',
              text: '0.5 in',
              selected: false,
              count: 5,
            },
            {
              id: 'W00028',
              text: '0.4 in',
              selected: false,
              count: 12,
            },
            {
              id: 'W00108',
              text: '0.3 in',
              selected: false,
              count: 36,
            },
          ],
        },
        {
          id: 'A01109',
          name: 'Thickness',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 0.01,
            max: 0.01,
          },
          options: [
            {
              id: 'W00998',
              text: '0.01 in',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00436',
          name: 'Length',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 3.7,
            max: 96,
          },
          options: [
            {
              id: 'W00057',
              text: '8 ft',
              selected: false,
              count: 1,
            },
            {
              id: 'W00091',
              text: '6 ft',
              selected: false,
              count: 8,
            },
            {
              id: 'W00027',
              text: '5 ft',
              selected: false,
              count: 3,
            },
            {
              id: 'W00098',
              text: '3.7 in',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00357',
          name: 'Weight',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 0.16,
            max: 4974,
          },
          options: [
            {
              id: 'W41678',
              text: '310.85 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W40843',
              text: '169.75 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W07257',
              text: '33.07 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W00142',
              text: '13.4 oz',
              selected: false,
              count: 3,
            },
            {
              id: 'W00089',
              text: '12 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W00214',
              text: '8.6 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W39823',
              text: '7.54 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W39704',
              text: '7.05 oz',
              selected: false,
              count: 5,
            },
            {
              id: 'W43620',
              text: '6.05 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W39785',
              text: '5.95 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W39730',
              text: '5.73 lbs',
              selected: false,
              count: 3,
            },
            {
              id: 'W02690',
              text: '5.71 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W40357',
              text: '5.56 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W09614',
              text: '5.51 lbs',
              selected: false,
              count: 4,
            },
            {
              id: 'W39741',
              text: '5.29 oz',
              selected: false,
              count: 5,
            },
            {
              id: 'W39787',
              text: '5.11 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W08590',
              text: '5.07 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W40574',
              text: '4.96 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W40591',
              text: '4.89 lbs',
              selected: false,
              count: 4,
            },
            {
              id: 'W39756',
              text: '4.85 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W40457',
              text: '4.81 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W02625',
              text: '4.72 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W39809',
              text: '4.63 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W08736',
              text: '4.61 lbs',
              selected: false,
              count: 3,
            },
            {
              id: 'W05286',
              text: '4.41 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W39725',
              text: '4.37 lbs',
              selected: false,
              count: 3,
            },
            {
              id: 'W39957',
              text: '4.34 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W00365',
              text: '4.2 lbs',
              selected: false,
              count: 4,
            },
            {
              id: 'W39755',
              text: '4.19 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W40634',
              text: '4.17 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W40439',
              text: '4.14 lbs',
              selected: false,
              count: 3,
            },
            {
              id: 'W00123',
              text: '4.1 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W40231',
              text: '4.03 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W41096',
              text: '4.01 lbs',
              selected: false,
              count: 4,
            },
            {
              id: 'W06773',
              text: '3.99 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W39783',
              text: '3.97 lbs',
              selected: false,
              count: 4,
            },
            {
              id: 'W39710',
              text: '3.95 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W39931',
              text: '3.92 lbs',
              selected: false,
              count: 3,
            },
            {
              id: 'W00021',
              text: '3.9 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W40120',
              text: '3.86 lbs',
              selected: false,
              count: 4,
            },
            {
              id: 'W39940',
              text: '3.84 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W12091',
              text: '3.81 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W39811',
              text: '3.77 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W17282',
              text: '3.75 lbs',
              selected: false,
              count: 10,
            },
            {
              id: 'W40459',
              text: '3.73 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W19688',
              text: '3.62 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W40270',
              text: '3.59 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W40733',
              text: '3.57 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W39753',
              text: '3.55 lbs',
              selected: false,
              count: 4,
            },
            {
              id: 'W39716',
              text: '3.53 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W40094',
              text: '3.51 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W39754',
              text: '3.42 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W00284',
              text: '3.4 lbs',
              selected: false,
              count: 9,
            },
            {
              id: 'W20492',
              text: '3.38 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W39956',
              text: '3.37 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W02688',
              text: '3.35 lbs',
              selected: false,
              count: 5,
            },
            {
              id: 'W40072',
              text: '3.33 lbs',
              selected: false,
              count: 3,
            },
            {
              id: 'W36271',
              text: '3.31 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W40015',
              text: '3.26 lbs',
              selected: false,
              count: 13,
            },
            {
              id: 'W39834',
              text: '3.24 lbs',
              selected: false,
              count: 5,
            },
            {
              id: 'W40395',
              text: '3.22 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W00372',
              text: '3.2 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W24929',
              text: '3.17 oz',
              selected: false,
              count: 4,
            },
            {
              id: 'W40227',
              text: '3.13 lbs',
              selected: false,
              count: 3,
            },
            {
              id: 'W40654',
              text: '3.11 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W39770',
              text: '3.09 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W40156',
              text: '3.04 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W40097',
              text: '3.02 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W00031',
              text: '3 lbs',
              selected: false,
              count: 11,
            },
            {
              id: 'W40290',
              text: '2.98 lbs',
              selected: false,
              count: 15,
            },
            {
              id: 'W05015',
              text: '2.95 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W39868',
              text: '2.93 lbs',
              selected: false,
              count: 6,
            },
            {
              id: 'W39735',
              text: '2.89 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W40649',
              text: '2.84 lbs',
              selected: false,
              count: 5,
            },
            {
              id: 'W05287',
              text: '2.83 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W39709',
              text: '2.82 lbs',
              selected: false,
              count: 4,
            },
            {
              id: 'W00101',
              text: '2.8 lbs',
              selected: false,
              count: 3,
            },
            {
              id: 'W24796',
              text: '2.79 lbs',
              selected: false,
              count: 3,
            },
            {
              id: 'W02792',
              text: '2.76 lbs',
              selected: false,
              count: 3,
            },
            {
              id: 'W40026',
              text: '2.73 lbs',
              selected: false,
              count: 5,
            },
            {
              id: 'W40443',
              text: '2.69 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W27758',
              text: '2.67 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W39711',
              text: '2.65 lbs',
              selected: false,
              count: 5,
            },
            {
              id: 'W40151',
              text: '2.62 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W00087',
              text: '2.6 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W39898',
              text: '2.43 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W00104',
              text: '2.4 lbs',
              selected: false,
              count: 8,
            },
            {
              id: 'W35117',
              text: '2.31 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W20989',
              text: '2.29 lbs',
              selected: false,
              count: 3,
            },
            {
              id: 'W40957',
              text: '2.27 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W42501',
              text: '35.23 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W00130',
              text: '2.2 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W39847',
              text: '34.92 oz',
              selected: false,
              count: 6,
            },
            {
              id: 'W39863',
              text: '34.56 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40722',
              text: '33.61 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W42593',
              text: '33.58 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40917',
              text: '32.45 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W02686',
              text: '2.01 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W40255',
              text: '31.39 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W41483',
              text: '1.96 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W43804',
              text: '30.01 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W04732',
              text: '1.85 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W00513',
              text: '29.1 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W41645',
              text: '28.64 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W39838',
              text: '28.22 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W39747',
              text: '1.76 oz',
              selected: false,
              count: 4,
            },
            {
              id: 'W40560',
              text: '27.86 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W42029',
              text: '27.65 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W39985',
              text: '1.72 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W41376',
              text: '27.33 oz',
              selected: false,
              count: 3,
            },
            {
              id: 'W00240',
              text: '27.3 oz',
              selected: false,
              count: 5,
            },
            {
              id: 'W39917',
              text: '27.16 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W39962',
              text: '26.98 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W37718',
              text: '1.68 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W00341',
              text: '26.1 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W33242',
              text: '1.59 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W40252',
              text: '25.39 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W39846',
              text: '23.98 oz',
              selected: false,
              count: 4,
            },
            {
              id: 'W39844',
              text: '20.81 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40085',
              text: '20.63 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W00360',
              text: '20.1 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W00313',
              text: '19.5 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W39967',
              text: '19.05 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40355',
              text: '18.41 oz',
              selected: false,
              count: 3,
            },
            {
              id: 'W00092',
              text: '17.6 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W39909',
              text: '16.22 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W03095',
              text: '15.98 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W29992',
              text: '15.87 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W41356',
              text: '0.93 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W39720',
              text: '14.81 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40294',
              text: '14.39 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W39740',
              text: '14.11 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W42087',
              text: '0.86 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W40177',
              text: '13.76 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W41309',
              text: '13.65 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40694',
              text: '13.44 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W81557',
              text: '13.42 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40920',
              text: '13.16 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40135',
              text: '13.05 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W19931',
              text: '12.87 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W00527',
              text: '12.7 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W90977',
              text: '12.51 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40114',
              text: '11.99 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W39925',
              text: '11.64 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W39827',
              text: '11.46 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W02689',
              text: '0.71 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W40175',
              text: '10.86 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W39752',
              text: '10.23 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40368',
              text: '10.09 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40345',
              text: '9.98 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W39840',
              text: '9.88 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W00293',
              text: '0.6 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W24930',
              text: '9.52 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40304',
              text: '9.13 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W11586',
              text: '8.82 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W01145',
              text: '8.46 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40010',
              text: '8.29 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W01703',
              text: '0.51 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W00057',
              text: '8 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40079',
              text: '7.83 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40166',
              text: '7.79 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W04719',
              text: '7.76 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W08514',
              text: '7.48 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W00413',
              text: '7.2 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W40035',
              text: '6.81 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W00605',
              text: '6.8 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W07269',
              text: '6.35 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W00091',
              text: '6 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W39714',
              text: '5.64 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W05146',
              text: '0.33 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W39706',
              text: '4.94 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W00083',
              text: '4.9 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W24001',
              text: '4.06 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W00132',
              text: '3.5 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40464',
              text: '3.44 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W00188',
              text: '3.1 oz',
              selected: false,
              count: 3,
            },
            {
              id: 'W39993',
              text: '2.91 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W09385',
              text: '2.75 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W39788',
              text: '2.47 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W04151',
              text: '2.24 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40028',
              text: '2.22 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W40164',
              text: '2.19 oz',
              selected: false,
              count: 3,
            },
            {
              id: 'W31772',
              text: '1.94 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W32243',
              text: '1.83 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W39861',
              text: '1.44 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W39954',
              text: '1.41 oz',
              selected: false,
              count: 2,
            },
            {
              id: 'W17285',
              text: '1.32 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W17288',
              text: '1.14 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W17324',
              text: '1.06 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W20075',
              text: '0.87 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W23451',
              text: '0.81 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W04140',
              text: '0.16 oz',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A08106',
          name: 'Comments',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K574690',
              text: 'Tablet',
              selected: false,
              count: 6,
            },
          ],
        },
      ],
    },
    {
      group: 'Dimensions & Weight (Shipping)',
      refinements: [
        {
          id: 'A01556',
          name: 'Shipping Width',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 2,
            max: 19.5,
          },
          options: [
            {
              id: 'W00313',
              text: '19.5 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00314',
              text: '19.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00250',
              text: '17.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00093',
              text: '17.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00273',
              text: '16.6 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00294',
              text: '16 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00217',
              text: '15.3 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00075',
              text: '15.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00350',
              text: '10.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00335',
              text: '10.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00116',
              text: '9.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00017',
              text: '9.3 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00212',
              text: '8.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00117',
              text: '8.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00057',
              text: '8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00086',
              text: '7.9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00413',
              text: '7.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00041',
              text: '6.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00124',
              text: '6.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00096',
              text: '5.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00021',
              text: '3.9 in',
              selected: false,
              count: 4,
            },
            {
              id: 'W00043',
              text: '2 in',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A01557',
          name: 'Shipping Depth',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 0.6,
            max: 12.3,
          },
          options: [
            {
              id: 'W00148',
              text: '12.3 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00191',
              text: '12.1 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00088',
              text: '11 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00331',
              text: '10.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00049',
              text: '10.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00114',
              text: '10 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00086',
              text: '7.9 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00119',
              text: '7.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00249',
              text: '7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00208',
              text: '6.9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00199',
              text: '6.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00124',
              text: '6.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00056',
              text: '5.7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00209',
              text: '5.6 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00107',
              text: '4.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00095',
              text: '4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00141',
              text: '3.6 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00132',
              text: '3.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00188',
              text: '3.1 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00031',
              text: '3 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00130',
              text: '2.2 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00025',
              text: '0.7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00293',
              text: '0.6 in',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A01558',
          name: 'Shipping Height',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 0.1,
            max: 12.9,
          },
          options: [
            {
              id: 'W00113',
              text: '12.9 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00074',
              text: '11.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00331',
              text: '10.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00212',
              text: '8.4 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00096',
              text: '5.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00107',
              text: '4.3 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00284',
              text: '3.4 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00031',
              text: '3 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00104',
              text: '2.4 in',
              selected: false,
              count: 3,
            },
            {
              id: 'W00128',
              text: '2.1 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00125',
              text: '1.7 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00040',
              text: '1.6 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00097',
              text: '1 in',
              selected: false,
              count: 2,
            },
            {
              id: 'W00103',
              text: '0.9 in',
              selected: false,
              count: 4,
            },
            {
              id: 'W00293',
              text: '0.6 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00160',
              text: '0.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'W00618',
              text: '0.1 in',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A01559',
          name: 'Shipping Weight',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 1.06,
            max: 104,
          },
          options: [
            {
              id: 'W00199',
              text: '6.5 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W00091',
              text: '6 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W00096',
              text: '5.8 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W05286',
              text: '4.41 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W00107',
              text: '4.3 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W00123',
              text: '4.1 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W39783',
              text: '3.97 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W00079',
              text: '3.8 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W40733',
              text: '3.57 lbs',
              selected: false,
              count: 2,
            },
            {
              id: 'W00087',
              text: '2.6 lbs',
              selected: false,
              count: 1,
            },
            {
              id: 'W27505',
              text: '33.86 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40560',
              text: '27.86 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40126',
              text: '18.34 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W39767',
              text: '17.64 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40193',
              text: '17.28 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W39909',
              text: '16.22 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W01145',
              text: '8.46 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W40256',
              text: '8.01 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W39858',
              text: '7.41 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W86225',
              text: '6.41 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W39806',
              text: '5.78 oz',
              selected: false,
              count: 1,
            },
            {
              id: 'W17324',
              text: '1.06 oz',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'Inner Dimensions',
      refinements: [
        {
          id: 'A05650',
          name: 'Screen Size Compatibility',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 7,
            max: 12.9,
          },
          options: [
            {
              id: 'K687427',
              text: '12.9 in',
              selected: false,
              count: 1,
            },
            {
              id: 'K492112',
              text: '10.8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'K232099',
              text: '10.5 in',
              selected: false,
              count: 1,
            },
            {
              id: 'K107929',
              text: '10.2 in',
              selected: false,
              count: 2,
            },
            {
              id: 'K175339',
              text: '9.7 in',
              selected: false,
              count: 1,
            },
            {
              id: 'K10598',
              text: '8 in',
              selected: false,
              count: 1,
            },
            {
              id: 'K17921',
              text: '7 in',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A05651',
          name: 'Screen Size Compatibility (metric)',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 17.8,
            max: 32.8,
          },
          options: [
            {
              id: 'K03218',
              text: '32.8 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K05319',
              text: '27.4 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K03796',
              text: '26.7 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K02100',
              text: '25.9 cm',
              selected: false,
              count: 2,
            },
            {
              id: 'K03269',
              text: '24.6 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K02765',
              text: '20.3 cm',
              selected: false,
              count: 1,
            },
            {
              id: 'K02521',
              text: '17.8 cm',
              selected: false,
              count: 1,
            },
          ],
        },
      ],
    },
    {
      group: 'Service & Support',
      refinements: [
        {
          id: 'A00430',
          name: 'Type',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K01807',
              text: '1-year warranty',
              selected: false,
              count: 146,
            },
            {
              id: 'K24924',
              text: '18-month warranty',
              selected: false,
              count: 5,
            },
            {
              id: 'K01808',
              text: '2-year warranty',
              selected: false,
              count: 19,
            },
            {
              id: 'K20290',
              text: '25-year warranty',
              selected: false,
              count: 6,
            },
            {
              id: 'K01809',
              text: '3-year warranty',
              selected: false,
              count: 150,
            },
            {
              id: 'K18030',
              text: '30-day warranty',
              selected: false,
              count: 1,
            },
            {
              id: 'K01810',
              text: '5-year warranty',
              selected: false,
              count: 30,
            },
            {
              id: 'K10986',
              text: '7-year warranty',
              selected: false,
              count: 5,
            },
            {
              id: 'K01811',
              text: 'Limited lifetime warranty',
              selected: false,
              count: 42,
            },
            {
              id: 'K04556',
              text: 'New releases update',
              selected: false,
              count: 7,
            },
            {
              id: 'K82511',
              text: 'Technical support',
              selected: false,
              count: 5,
            },
            {
              id: 'K71955',
              text: 'Technical support (renewal)',
              selected: false,
              count: 13,
            },
          ],
        },
        {
          id: 'A00595',
          name: 'Service Included',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K01990',
              text: 'Phone consulting',
              selected: false,
              count: 13,
            },
          ],
        },
        {
          id: 'A04969',
          name: 'On-Site Warranty',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: null,
            max: null,
          },
          options: [
            {
              id: 'K234168',
              text: 'On-site',
              selected: false,
              count: 1,
            },
          ],
        },
        {
          id: 'A00592',
          name: 'Full Contract Period',
          originalGroupName: 'CNETAttributes',
          type: 'MultiSelect',
          range: {
            min: 31557600,
            max: 126230400,
          },
          options: [
            {
              id: 'K02147',
              text: '4 years',
              selected: false,
              count: 1,
            },
            {
              id: 'K02104',
              text: '3 years',
              selected: false,
              count: 4,
            },
            {
              id: 'K02097',
              text: '2 years',
              selected: false,
              count: 2,
            },
            {
              id: 'K02103',
              text: '1 year',
              selected: false,
              count: 6,
            },
          ],
        },
      ],
    },
  ];

  res.json(response);
});

app.get('/ui-search/v1/product/keywordsearch', (req, res) => {
  const response = {
    page: 1,
    pageSize: 25,
    totalPages: 26,
    totalResults: 628,
    searchReport: {
      orginalSearchTerm: 'LAPTOP',
      alternateSearchSuggestions: [],
    },
    products: [
      {
        system: '2',
        id: '13859132',
        manufacturerPartNumber: 'SJQ-00001',
        upc: '889842589405',
        displayName:
          'Microsoft Surface Laptop 3 - 15" - Core i7 1065G7 - 16 GB RAM - 256 GB SSD - TAA Compliant',
        description:
          'Microsoft Surface Laptop 3 - Core i7 1065G7 / 1.3 GHz - Win 10 Pro - 16 GB RAM - 256 GB SSD NVMe - 15" touchscreen 2496 x 1664 - Iris Plus Graphics - Bluetooth, Wi-Fi - platinum - TAA Compliant',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 5,
          totalAvailable: 5,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,650.35',
          bestPrice: '$1,650.35',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$1,849.99',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/f5/66/f5660afa-1ee3-4d92-aac7-271e18b658e4.jpg',
            type: 'Product shot',
            angle: 'Right-angle',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10182322',
            value:
              'Intel Core i7 (10th Gen) 1065G7 / 1.3 GHz (3.9 GHz) / 8 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B10183132',
            value: '16 GB LPDDR4X',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6837440',
            value: '256 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13859127',
        manufacturerPartNumber: 'RYH-00053',
        upc: '889842602111',
        displayName:
          'Microsoft Surface Laptop 3 - 13.5" - Core i5 1035G7 - 16 GB RAM - 256 GB SSD - US',
        description:
          'Microsoft Surface Laptop 3 - Core i5 1035G7 / 1.2 GHz - Win 10 Pro - 16 GB RAM - 256 GB SSD NVMe - 13.5" touchscreen 2256 x 1504 - Iris Plus Graphics - Bluetooth, Wi-Fi - sandstone - kbd: US - commercial',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 1,
          totalAvailable: 1,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,460.14',
          bestPrice: '$1,460.14',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$1,599.99',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/96/1e/961e6cf0-d288-4062-95f1-545153c4272f.jpg',
            type: 'Product shot',
            angle: 'Front',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10270944',
            value:
              'Intel Core i5 (10th Gen) 1035G7 / 1.2 GHz (3.7 GHz) / 6 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B10183132',
            value: '16 GB LPDDR4X',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6837440',
            value: '256 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13859125',
        manufacturerPartNumber: 'RYH-00022',
        upc: '889842601824',
        displayName:
          'Microsoft Surface Laptop 3 - 13.5" - Core i5 1035G7 - 16 GB RAM - 256 GB SSD - US',
        description:
          'Microsoft Surface Laptop 3 - Core i5 1035G7 / 1.2 GHz - Win 10 Pro - 16 GB RAM - 256 GB SSD NVMe - 13.5" touchscreen 2256 x 1504 - Iris Plus Graphics - Bluetooth, Wi-Fi - matte black - kbd: US - commercial',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 192,
          totalAvailable: 192,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,460.14',
          bestPrice: '$1,460.14',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$1,599.99',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/36/27/36270550-854c-43b4-bafc-0218f094959e.jpg',
            type: 'Product shot',
            angle: 'Front',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10270944',
            value:
              'Intel Core i5 (10th Gen) 1035G7 / 1.2 GHz (3.7 GHz) / 6 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B10183132',
            value: '16 GB LPDDR4X',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6837440',
            value: '256 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13859123',
        manufacturerPartNumber: 'SJV-00001',
        upc: '889842589344',
        displayName:
          'Microsoft Surface Laptop 3 - 13.5" - Core i7 1065G7 - 16 GB RAM - 1 TB SSD - TAA Compliant',
        description:
          'Microsoft Surface Laptop 3 - Core i7 1065G7 / 1.3 GHz - Win 10 Pro - 16 GB RAM - 1 TB SSD NVMe - 13.5" touchscreen 2256 x 1504 - Iris Plus Graphics - Bluetooth, Wi-Fi - matte black - TAA Compliant',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 5,
          totalAvailable: 5,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$2,274.81',
          bestPrice: '$2,274.81',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$2,549.98',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/36/27/36270550-854c-43b4-bafc-0218f094959e.jpg',
            type: 'Product shot',
            angle: 'Front',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10182322',
            value:
              'Intel Core i7 (10th Gen) 1065G7 / 1.3 GHz (3.9 GHz) / 8 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B10183132',
            value: '16 GB LPDDR4X',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6835706',
            value: '1 TB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13761863',
        manufacturerPartNumber: 'PLZ-00001',
        upc: '889842490855',
        displayName:
          'Microsoft Surface Laptop 3 - 15" - Core i7 1065G7 - 16 GB RAM - 256 GB SSD',
        description:
          'Microsoft Surface Laptop 3 - Core i7 1065G7 / 1.3 GHz - Win 10 Pro - 16 GB RAM - 256 GB SSD NVMe - 15" touchscreen 2496 x 1664 - Iris Plus Graphics - Bluetooth, Wi-Fi - platinum - commercial',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 77,
          totalAvailable: 77,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,605.75',
          bestPrice: '$1,605.75',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$1,799.99',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/f5/66/f5660afa-1ee3-4d92-aac7-271e18b658e4.jpg',
            type: 'Product shot',
            angle: 'Right-angle',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10182322',
            value:
              'Intel Core i7 (10th Gen) 1065G7 / 1.3 GHz (3.9 GHz) / 8 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B10183132',
            value: '16 GB LPDDR4X',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6837440',
            value: '256 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13761861',
        manufacturerPartNumber: 'PLT-00001',
        upc: '889842490657',
        displayName:
          'Microsoft Surface Laptop 3 - 15" - Core i5 1035G7 - 8 GB RAM - 128 GB SSD',
        description:
          'Microsoft Surface Laptop 3 - Core i5 1035G7 / 1.2 GHz - Win 10 Pro - 8 GB RAM - 128 GB SSD NVMe - 15" touchscreen 2496 x 1664 - Iris Plus Graphics - Bluetooth, Wi-Fi - platinum - commercial',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 85,
          totalAvailable: 85,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,213.03',
          bestPrice: '$1,213.03',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$1,299.99',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/f5/66/f5660afa-1ee3-4d92-aac7-271e18b658e4.jpg',
            type: 'Product shot',
            angle: 'Right-angle',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10270944',
            value:
              'Intel Core i5 (10th Gen) 1035G7 / 1.2 GHz (3.7 GHz) / 6 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B9308655',
            value: '8 GB LPDDR4X',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B8302574',
            value: '128 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13761872',
        manufacturerPartNumber: 'PLA-00064',
        upc: ' ',
        displayName:
          'Microsoft Surface Laptop 3 - 13.5" - Core i7 1065G7 - 16 GB RAM - 256 GB SSD',
        description:
          'Microsoft Surface Laptop 3 - Core i7 1065G7 / 1.3 GHz - Win 10 Pro - 16 GB RAM - 256 GB SSD NVMe - 13.5" touchscreen 2256 x 1504 - Iris Plus Graphics - Bluetooth, Wi-Fi - sandstone - commercial',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 12,
          totalAvailable: 12,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,516.54',
          bestPrice: '$1,516.54',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$1,699.99',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/96/1e/961e6cf0-d288-4062-95f1-545153c4272f.jpg',
            type: 'Product shot',
            angle: 'Front',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10182322',
            value:
              'Intel Core i7 (10th Gen) 1065G7 / 1.3 GHz (3.9 GHz) / 8 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B10183132',
            value: '16 GB LPDDR4X',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6837440',
            value: '256 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13761843',
        manufacturerPartNumber: 'RDZ-00001',
        upc: '889842517309',
        displayName:
          'Microsoft Surface Laptop 3 - 15" - Core i5 1035G7 - 8 GB RAM - 256 GB SSD',
        description:
          'Microsoft Surface Laptop 3 - Core i5 1035G7 / 1.2 GHz - Win 10 Pro - 8 GB RAM - 256 GB SSD NVMe - 15" touchscreen 2496 x 1664 - Iris Plus Graphics - Bluetooth, Wi-Fi - platinum - commercial',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 116,
          totalAvailable: 116,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,460.14',
          bestPrice: '$1,460.14',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$1,599.99',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/f5/66/f5660afa-1ee3-4d92-aac7-271e18b658e4.jpg',
            type: 'Product shot',
            angle: 'Right-angle',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10270944',
            value:
              'Intel Core i5 (10th Gen) 1035G7 / 1.2 GHz (3.7 GHz) / 6 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B9308655',
            value: '8 GB LPDDR4X',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6837440',
            value: '256 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13761801',
        manufacturerPartNumber: 'QXS-00001',
        upc: ' ',
        displayName:
          'Microsoft Surface Laptop 3 - 13.5" - Core i7 1065G7 - 16 GB RAM - 512 GB SSD',
        description:
          'Microsoft Surface Laptop 3 - Core i7 1065G7 / 1.3 GHz - Win 10 Pro - 16 GB RAM - 512 GB SSD NVMe - 13.5" touchscreen 2256 x 1504 - Iris Plus Graphics - Bluetooth, Wi-Fi - platinum - commercial',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 36,
          totalAvailable: 36,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,873.38',
          bestPrice: '$1,873.38',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$2,099.98',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/25/90/259083a3-3fdd-4ed9-ba29-03b6a5589557.jpg',
            type: 'Product shot',
            angle: 'Left-angle',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10182322',
            value:
              'Intel Core i7 (10th Gen) 1065G7 / 1.3 GHz (3.9 GHz) / 8 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B10183132',
            value: '16 GB LPDDR4X',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6834363',
            value: '512 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13761864',
        manufacturerPartNumber: 'PLZ-00022',
        upc: '889842491050',
        displayName:
          'Microsoft Surface Laptop 3 - 15" - Core i7 1065G7 - 16 GB RAM - 256 GB SSD',
        description:
          'Microsoft Surface Laptop 3 - Core i7 1065G7 / 1.3 GHz - Win 10 Pro - 16 GB RAM - 256 GB SSD NVMe - 15" touchscreen 2496 x 1664 - Iris Plus Graphics - Bluetooth, Wi-Fi - matte black - commercial',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 114,
          totalAvailable: 114,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,605.75',
          bestPrice: '$1,605.75',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$1,799.99',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/36/27/36270550-854c-43b4-bafc-0218f094959e.jpg',
            type: 'Product shot',
            angle: 'Front',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10182322',
            value:
              'Intel Core i7 (10th Gen) 1065G7 / 1.3 GHz (3.9 GHz) / 8 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B10183132',
            value: '16 GB LPDDR4X',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6837440',
            value: '256 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13761842',
        manufacturerPartNumber: 'QVQ-00001',
        upc: ' ',
        displayName:
          'Microsoft Surface Laptop 3 - 15" - Core i7 1065G7 - 32 GB RAM - 1 TB SSD',
        description:
          'Microsoft Surface Laptop 3 - Core i7 1065G7 / 1.3 GHz - Win 10 Pro - 32 GB RAM - 1 TB SSD NVMe - 15" touchscreen 2496 x 1664 - Iris Plus Graphics - Bluetooth, Wi-Fi - matte black - commercial',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 96,
          totalAvailable: 96,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$2,587.05',
          bestPrice: '$2,587.05',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$2,899.99',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/36/27/36270550-854c-43b4-bafc-0218f094959e.jpg',
            type: 'Product shot',
            angle: 'Front',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10182322',
            value:
              'Intel Core i7 (10th Gen) 1065G7 / 1.3 GHz (3.9 GHz) / 8 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B10285482',
            value: '32 GB LPDDR4X',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6835706',
            value: '1 TB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13761844',
        manufacturerPartNumber: 'RDZ-00022',
        upc: '889842517507',
        displayName:
          'Microsoft Surface Laptop 3 - 15" - Core i5 1035G7 - 8 GB RAM - 256 GB SSD',
        description:
          'Microsoft Surface Laptop 3 - Core i5 1035G7 / 1.2 GHz - Win 10 Pro - 8 GB RAM - 256 GB SSD NVMe - 15" touchscreen 2496 x 1664 - Iris Plus Graphics - Bluetooth, Wi-Fi - matte black - commercial',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 9,
          totalAvailable: 9,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,460.14',
          bestPrice: '$1,460.14',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$1,599.99',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/36/27/36270550-854c-43b4-bafc-0218f094959e.jpg',
            type: 'Product shot',
            angle: 'Front',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10270944',
            value:
              'Intel Core i5 (10th Gen) 1035G7 / 1.2 GHz (3.7 GHz) / 6 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B9308655',
            value: '8 GB LPDDR4X',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6837440',
            value: '256 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13761803',
        manufacturerPartNumber: 'QXS-00043',
        upc: '889842515985',
        displayName:
          'Microsoft Surface Laptop 3 - 13.5" - Core i7 1065G7 - 16 GB RAM - 512 GB SSD',
        description:
          'Microsoft Surface Laptop 3 - Core i7 1065G7 / 1.3 GHz - Win 10 Pro - 16 GB RAM - 512 GB SSD NVMe - 13.5" touchscreen 2256 x 1504 - Iris Plus Graphics - Bluetooth, Wi-Fi - cobalt blue - commercial',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 10,
          totalAvailable: 10,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,873.38',
          bestPrice: '$1,873.38',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$2,099.98',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/cf/5c/cf5c208d-3c6f-43cf-b131-1af3db48630a.jpg',
            type: 'Product shot',
            angle: 'Top',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10182322',
            value:
              'Intel Core i7 (10th Gen) 1065G7 / 1.3 GHz (3.9 GHz) / 8 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B10183132',
            value: '16 GB LPDDR4X',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6834363',
            value: '512 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13761871',
        manufacturerPartNumber: 'PLA-00043',
        upc: ' ',
        displayName:
          'Microsoft Surface Laptop 3 - 13.5" - Core i7 1065G7 - 16 GB RAM - 256 GB SSD',
        description:
          'Microsoft Surface Laptop 3 - Core i7 1065G7 / 1.3 GHz - Win 10 Pro - 16 GB RAM - 256 GB SSD NVMe - 13.5" touchscreen 2256 x 1504 - Iris Plus Graphics - Bluetooth, Wi-Fi - cobalt blue - commercial',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 29,
          totalAvailable: 29,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,516.54',
          bestPrice: '$1,516.54',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$1,699.99',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/cf/5c/cf5c208d-3c6f-43cf-b131-1af3db48630a.jpg',
            type: 'Product shot',
            angle: 'Top',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10182322',
            value:
              'Intel Core i7 (10th Gen) 1065G7 / 1.3 GHz (3.9 GHz) / 8 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B10183132',
            value: '16 GB LPDDR4X',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6837440',
            value: '256 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13921186',
        manufacturerPartNumber: 'VPN-00001',
        upc: '889842603002',
        displayName:
          'Microsoft Surface Laptop 3 - 15" - Core i5 1035G7 - 16 GB RAM - 256 GB SSD - English',
        description:
          'Microsoft Surface Laptop 3 - Core i5 1035G7 / 1.2 GHz - Win 10 Pro - 16 GB RAM - 256 GB SSD NVMe - 15" touchscreen 2496 x 1664 - Iris Plus Graphics - Bluetooth, Wi-Fi - platinum - kbd: English - commercial',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 87,
          totalAvailable: 87,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,516.54',
          bestPrice: '$1,516.54',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$1,699.99',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/f5/66/f5660afa-1ee3-4d92-aac7-271e18b658e4.jpg',
            type: 'Product shot',
            angle: 'Right-angle',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10270944',
            value:
              'Intel Core i5 (10th Gen) 1035G7 / 1.2 GHz (3.7 GHz) / 6 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B10183132',
            value: '16 GB LPDDR4X',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6837440',
            value: '256 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13416297',
        manufacturerPartNumber: 'LQT-00024',
        upc: ' ',
        displayName:
          'Microsoft Surface Laptop 2 - 13.5" - Core i7 8650U - 16 GB RAM - 512 GB SSD - US',
        description:
          'Microsoft Surface Laptop 2 - Core i7 8650U / 1.9 GHz - Win 10 Pro - 16 GB RAM - 512 GB SSD - 13.5" touchscreen 2256 x 1504 - UHD Graphics 620 - Wi-Fi, Bluetooth - burgundy - kbd: US - commercial',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 16,
          totalAvailable: 16,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$2,007.52',
          bestPrice: '$2,007.52',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$2,249.00',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/47/bf/47bf1f40-16e0-4c0e-93f7-02109354c8fc.jpg',
            type: 'Product shot',
            angle: 'Back',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B8348055',
            value:
              'Intel Core i7 (8th Gen) 8650U / 1.9 GHz (4.2 GHz) / 8 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B5343035',
            value: '16 GB LPDDR3',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B2324161',
            value: '512 GB SSD',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13416308',
        manufacturerPartNumber: 'JKW-00024',
        upc: '889842372960',
        displayName:
          'Microsoft Surface Laptop 2 - 13.5" - Core i7 8650U - 8 GB RAM - 256 GB SSD - US',
        description:
          'Microsoft Surface Laptop 2 - Core i7 8650U / 1.9 GHz - Win 10 Pro - 8 GB RAM - 256 GB SSD - 13.5" touchscreen 2256 x 1504 - UHD Graphics 620 - Wi-Fi, Bluetooth - black - kbd: US - demo, commercial',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 1,
          totalAvailable: 1,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: null,
          bestPrice: null,
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: null,
          promoAmount: null,
          volumePricing: null,
          listPrice: '$1,649.00',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/a5/a4/a5a44fc5-d763-4e26-80a8-01ee5038162a.jpg',
            type: 'Product shot',
            angle: 'Right-angle',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B8348055',
            value:
              'Intel Core i7 (8th Gen) 8650U / 1.9 GHz (4.2 GHz) / 8 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B3689161',
            value: '8 GB LPDDR3',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B2320689',
            value: '256 GB SSD',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: false,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13761845',
        manufacturerPartNumber: 'RE6-00001',
        upc: '889842517705',
        displayName:
          'Microsoft Surface Laptop 3 - 15" - Core i5 1035G7 - 8 GB RAM - 256 GB SSD - English',
        description:
          'Microsoft Surface Laptop 3 - Core i5 1035G7 / 1.2 GHz - Win 10 Pro - 8 GB RAM - 256 GB SSD NVMe - 15" touchscreen 2496 x 1664 - Iris Plus Graphics - Bluetooth, Wi-Fi - platinum - kbd: English - demo, commercial',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 2,
          totalAvailable: 2,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$730.51',
          bestPrice: '$730.51',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$1,599.99',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/f5/66/f5660afa-1ee3-4d92-aac7-271e18b658e4.jpg',
            type: 'Product shot',
            angle: 'Right-angle',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5897761',
            value: 'Win 10 Pro',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10270944',
            value:
              'Intel Core i5 (10th Gen) 1035G7 / 1.2 GHz (3.7 GHz) / 6 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B9308655',
            value: '8 GB LPDDR4X',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6837440',
            value: '256 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '12695075',
        manufacturerPartNumber: 'MNYL2LL/A',
        upc: '190198204639',
        displayName:
          'Apple MacBook - 12" - Core i5 - 8 GB RAM - 512 GB SSD - US',
        description:
          'Apple MacBook - Core i5 1.3 GHz - macOS Catalina 10.15 - 8 GB RAM - 512 GB SSD - 12" IPS 2304 x 1440 - HD Graphics 615 - Wi-Fi, Bluetooth - gold - kbd: US',
        status: 'PhasedOut',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 1,
          totalAvailable: 1,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: null,
          bestPrice: null,
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: null,
          promoAmount: null,
          volumePricing: null,
          listPrice: '$1,599.00',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/29/ff/29ff2b91-0ba2-4fd8-ace5-02fb289486ba.jpg',
            type: 'Product shot',
            angle: 'Multi-angle',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B10286930',
            value: 'macOS Catalina 10.15',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B7776790',
            value: 'Intel Core i5 (7th Gen) 1.3 GHz (3.2 GHz) / 4 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B8768935',
            value: '8 GB LPDDR3 (provided memory is soldered)',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B2324161',
            value: '512 GB SSD',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: false,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '12695071',
        manufacturerPartNumber: 'MNYG2LL/A',
        upc: '190198202956',
        displayName:
          'Apple MacBook - 12" - Core i5 - 8 GB RAM - 512 GB SSD - US',
        description:
          'Apple MacBook - Core i5 1.3 GHz - macOS Catalina 10.15 - 8 GB RAM - 512 GB SSD - 12" IPS 2304 x 1440 - HD Graphics 615 - Wi-Fi, Bluetooth - space gray - kbd: US',
        status: 'PhasedOut',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 10,
          totalAvailable: 10,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: null,
          bestPrice: null,
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: null,
          promoAmount: null,
          volumePricing: null,
          listPrice: '$1,599.00',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/8c/e7/8ce7f425-8bca-46a9-a45d-00a601fef1bd.jpg',
            type: 'Product shot',
            angle: 'Close-up',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B10286930',
            value: 'macOS Catalina 10.15',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B7776790',
            value: 'Intel Core i5 (7th Gen) 1.3 GHz (3.2 GHz) / 4 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B8768935',
            value: '8 GB LPDDR3 (provided memory is soldered)',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B2324161',
            value: '512 GB SSD',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: false,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '14057200',
        manufacturerPartNumber: '14Z90N-N.APS7U1',
        upc: '719192641822',
        displayName:
          'LG gram 14Z90N-N.APS7U1 - 14" - Core i7 1065G7 - 16 GB RAM - 512 GB SSD',
        description:
          'LG gram 14Z90N-N.APS7U1 - Core i7 1065G7 / 1.3 GHz - Win 10 Pro 64-bit - 16 GB RAM - 512 GB SSD NVMe - 14" IPS 1920 x 1080 (Full HD) - Iris Plus Graphics - Bluetooth, Wi-Fi - dark silver',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 4,
          totalAvailable: 4,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,455.01',
          bestPrice: '$1,455.01',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$3,500.99',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/ae/37/ae3701dd-8a51-436f-b39a-0355b1e50abc.jpg',
            type: 'Product shot',
            angle: 'Top',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5896587',
            value: 'Win 10 Pro 64-bit',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B10182322',
            value:
              'Intel Core i7 (10th Gen) 1065G7 / 1.3 GHz (3.9 GHz) / 8 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B8770297',
            value: '16 GB DDR4 (1 x 8 GB + 8 GB (soldered))',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6834363',
            value: '512 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13880974',
        manufacturerPartNumber: '9VU91UT#ABA',
        upc: '194850131318',
        displayName:
          'HP Elite Dragonfly - 13.3" - Core i7 8565U - 16 GB RAM - 512 GB SSD - US',
        description:
          'HP Elite Dragonfly - Flip design - Core i7 8565U / 1.8 GHz - Win 10 Pro 64-bit - 16 GB RAM - 512 GB SSD NVMe - 13.3" IPS touchscreen HP SureView 3840 x 2160 (Ultra HD 4K) - UHD Graphics 620 - Bluetooth, Wi-Fi - dragonfly blue - kbd: US',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 2,
          totalAvailable: 2,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,943.27',
          bestPrice: '$1,943.27',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$2,149.00',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/6b/b0/6bb01705-0149-4733-a8e5-0187a8585b12.jpg',
            type: 'Product shot',
            angle: 'Back',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5908742',
            value: 'Win 10 Pro 64-bit - English',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B9175060',
            value:
              'Intel Core i7 (8th Gen) 8565U / 1.8 GHz (4.6 GHz) / 8 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B8769265',
            value: '16 GB LPDDR3 (provided memory is soldered)',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6834363',
            value: '512 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13808787',
        manufacturerPartNumber: '8ZD92UT#ABA',
        upc: '194721216571',
        displayName:
          'HP Elite Dragonfly - 13.3" - Core i5 8265U - 8 GB RAM - 256 GB SSD - US',
        description:
          'HP Elite Dragonfly - Flip design - Core i5 8265U / 1.6 GHz - Win 10 Pro 64-bit - 8 GB RAM - 256 GB SSD NVMe - 13.3" IPS touchscreen 1920 x 1080 (Full HD) - UHD Graphics 620 - Bluetooth, Wi-Fi - iridescent dragonfly blue - kbd: US',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 11,
          totalAvailable: 11,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,509.22',
          bestPrice: '$1,509.22',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$1,669.00',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/6b/b0/6bb01705-0149-4733-a8e5-0187a8585b12.jpg',
            type: 'Product shot',
            angle: 'Back',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5896587',
            value: 'Win 10 Pro 64-bit',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B9168205',
            value:
              'Intel Core i5 (8th Gen) 8265U / 1.6 GHz (3.9 GHz) / 6 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B8768935',
            value: '8 GB LPDDR3 (provided memory is soldered)',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6837440',
            value: '256 GB SSD NVMe',
          },
          {
            id: 'T0001320',
            name: 'Optical Drive',
            valueId: 'B4615436',
            value: 'No optical drive',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13808790',
        manufacturerPartNumber: '8WN92UT#ABA',
        upc: '194721087980',
        displayName:
          'HP Elite Dragonfly - 13.3" - Core i7 8665U - 16 GB RAM - 256 GB SSD - US',
        description:
          'HP Elite Dragonfly - Flip design - Core i7 8665U / 1.9 GHz - Win 10 Pro 64-bit - 16 GB RAM - 256 GB SSD NVMe - 13.3" IPS touchscreen HP SureView 1920 x 1080 (Full HD) - UHD Graphics 620 - Bluetooth, Wi-Fi - vPro - dragonfly blue - kbd: US',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 2,
          totalAvailable: 2,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,943.27',
          bestPrice: '$1,943.27',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$2,149.00',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/6b/b0/6bb01705-0149-4733-a8e5-0187a8585b12.jpg',
            type: 'Product shot',
            angle: 'Back',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5908742',
            value: 'Win 10 Pro 64-bit - English',
          },
          {
            id: 'T0001097',
            name: 'Platform Technology',
            valueId: 'B1022276',
            value: 'Intel vPro Technology',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B9816754',
            value:
              'Intel Core i7 (8th Gen) 8665U / 1.9 GHz (4.8 GHz) / 8 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B8769265',
            value: '16 GB LPDDR3 (provided memory is soldered)',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B6837440',
            value: '256 GB SSD NVMe',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
      {
        system: '2',
        id: '13808786',
        manufacturerPartNumber: '8UY50UT#ABA',
        upc: '194441942446',
        displayName:
          'HP Elite Dragonfly - 13.3" - Core i7 8665U - 16 GB RAM - 512 GB SSD - US',
        description:
          'HP Elite Dragonfly - Flip design - Core i7 8665U / 1.9 GHz - Win 10 Pro 64-bit - 16 GB RAM - 512 GB SSD (32 GB SSD cache) NVMe, QLC - 13.3" IPS touchscreen 1920 x 1080 (Full HD) - UHD Graphics 620 - Bluetooth, Wi-Fi - vPro - dragonfly blue - kbd: US',
        status: 'Active',
        isSelectedForCompare: false,
        isFavorite: false,
        isExactMatch: false,
        stock: {
          corporate: 6,
          totalAvailable: 6,
          vendorDirectInventory: null,
          vendorShipped: false,
        },
        productNotes: [],
        price: {
          basePrice: '$1,988.48',
          bestPrice: '$1,988.48',
          bestPriceExpiration: null,
          bestPriceIncludesWebDiscount: false,
          promoAmount: '$0.00',
          volumePricing: null,
          listPrice: '$2,199.00',
        },
        productImages: [
          {
            url: 'https://cdn.cnetcontent.com/6b/b0/6bb01705-0149-4733-a8e5-0187a8585b12.jpg',
            type: 'Product shot',
            angle: 'Back',
          },
        ],
        mainSpecifications: [
          {
            id: 'T0000122',
            name: 'Operating System',
            valueId: 'B5908742',
            value: 'Win 10 Pro 64-bit - English',
          },
          {
            id: 'T0001097',
            name: 'Platform Technology',
            valueId: 'B1022276',
            value: 'Intel vPro Technology',
          },
          {
            id: 'T0000020',
            name: 'Processor',
            valueId: 'B9816754',
            value:
              'Intel Core i7 (8th Gen) 8665U / 1.9 GHz (4.8 GHz) / 8 MB Cache',
          },
          {
            id: 'T0000281',
            name: 'Memory',
            valueId: 'B8769265',
            value: '16 GB LPDDR3 (provided memory is soldered)',
          },
          {
            id: 'T0001520',
            name: 'Storage',
            valueId: 'B10198456',
            value:
              '512 GB SSD NVMe, QLC + 32 GB SSD cache (3D Xpoint (Optane))',
          },
        ],
        plants: null,
        authorization: {
          canOrder: true,
          canViewPrice: true,
        },
        indicators: {
          FreeShipping: '',
          Virtual: '',
        },
      },
    ],
    topRefinements: [
      {
        id: 'ALT',
        name: 'Categories',
        originalGroupName: 'Categories',
        type: 'SingleSelect',
        range: null,
        options: [
          {
            id: '1_1',
            text: 'Hardware',
            selected: false,
            count: 599,
          },
          {
            id: '1_2',
            text: 'Software',
            selected: false,
            count: 25,
          },
          {
            id: '1_SECURITY',
            text: 'Security',
            selected: false,
            count: 12,
          },
          {
            id: '1_1196',
            text: 'Facilities',
            selected: false,
            count: 6,
          },
          {
            id: '1_3',
            text: 'Electronics',
            selected: false,
            count: 4,
          },
          {
            id: '1_1197',
            text: 'Furniture',
            selected: false,
            count: 2,
          },
        ],
      },
      {
        id: 'A00630',
        name: 'Header / Manufacturer',
        originalGroupName: 'CNETAttributes',
        type: 'MultiSelect',
        range: {
          min: null,
          max: null,
        },
        options: [
          {
            id: 'Z00197',
            text: '3M',
            selected: false,
            count: 18,
          },
          {
            id: 'Z00196',
            text: 'Acer',
            selected: false,
            count: 10,
          },
          {
            id: 'Z03099',
            text: 'AddOn Networks',
            selected: false,
            count: 2,
          },
          {
            id: 'Z00201',
            text: 'Apple',
            selected: false,
            count: 18,
          },
          {
            id: 'Z01881',
            text: 'Axiom Memory',
            selected: false,
            count: 2,
          },
          {
            id: 'Z00416',
            text: 'Battery Technology',
            selected: false,
            count: 9,
          },
          {
            id: 'Z00163',
            text: 'Belkin',
            selected: false,
            count: 1,
          },
          {
            id: 'Z01730',
            text: 'Bretford',
            selected: false,
            count: 4,
          },
          {
            id: 'Z00165',
            text: 'C2G',
            selected: false,
            count: 3,
          },
          {
            id: 'Z00740',
            text: 'Case Logic',
            selected: false,
            count: 7,
          },
          {
            id: 'Z00087',
            text: 'Cisco',
            selected: false,
            count: 1,
          },
          {
            id: 'Z02034',
            text: 'CommScope',
            selected: false,
            count: 4,
          },
          {
            id: 'Z08344',
            text: 'CTA Digital',
            selected: false,
            count: 9,
          },
          {
            id: 'Z00140',
            text: 'Dell',
            selected: false,
            count: 73,
          },
          {
            id: 'Z00075',
            text: 'Digi',
            selected: false,
            count: 1,
          },
          {
            id: 'Z49304',
            text: 'Dynabook',
            selected: false,
            count: 5,
          },
          {
            id: 'Z01505',
            text: 'Ergotron',
            selected: false,
            count: 6,
          },
          {
            id: 'Z00080',
            text: 'Fujitsu',
            selected: false,
            count: 4,
          },
          {
            id: 'Z00605',
            text: 'Griffin Technology',
            selected: false,
            count: 5,
          },
          {
            id: 'Z28369',
            text: 'Heckler Design',
            selected: false,
            count: 6,
          },
          {
            id: 'Z35214',
            text: 'Hewlett Packard Enterprise',
            selected: false,
            count: 4,
          },
          {
            id: 'Z00023',
            text: 'HP Inc.',
            selected: false,
            count: 74,
          },
          {
            id: 'Z00025',
            text: 'Intel',
            selected: false,
            count: 6,
          },
          {
            id: 'Z28364',
            text: 'Juiced Systems',
            selected: false,
            count: 1,
          },
          {
            id: 'Z00026',
            text: 'Kensington',
            selected: false,
            count: 17,
          },
          {
            id: 'Z00027',
            text: 'Kingston',
            selected: false,
            count: 11,
          },
          {
            id: 'Z11178',
            text: 'Lenovo',
            selected: false,
            count: 90,
          },
          {
            id: 'Z00021',
            text: 'LG Electronics',
            selected: false,
            count: 3,
          },
          {
            id: 'Z00031',
            text: 'Logitech',
            selected: false,
            count: 3,
          },
          {
            id: 'Z18534',
            text: 'M-edge Accessories',
            selected: false,
            count: 2,
          },
          {
            id: 'Z00036',
            text: 'Microsoft',
            selected: false,
            count: 53,
          },
          {
            id: 'Z08973',
            text: 'Mobile Edge',
            selected: false,
            count: 2,
          },
          {
            id: 'Z00622',
            text: 'MSI',
            selected: false,
            count: 5,
          },
          {
            id: 'Z05982',
            text: 'National Products',
            selected: false,
            count: 1,
          },
          {
            id: 'Z00066',
            text: 'Panasonic',
            selected: false,
            count: 19,
          },
          {
            id: 'Z00045',
            text: 'PNY',
            selected: false,
            count: 1,
          },
          {
            id: 'Z00069',
            text: 'Samsung',
            selected: false,
            count: 1,
          },
          {
            id: 'Z00282',
            text: 'SonicWall',
            selected: false,
            count: 2,
          },
          {
            id: 'Z26255',
            text: 'SUPCASE',
            selected: false,
            count: 1,
          },
          {
            id: 'Z00054',
            text: 'Targus',
            selected: false,
            count: 34,
          },
          {
            id: 'Z43567',
            text: 'TDSourcing',
            selected: false,
            count: 52,
          },
          {
            id: 'Z21784',
            text: 'Thule',
            selected: false,
            count: 1,
          },
          {
            id: 'Z00883',
            text: 'Transition Networks',
            selected: false,
            count: 1,
          },
          {
            id: 'Z00187',
            text: 'Tripp Lite',
            selected: false,
            count: 12,
          },
          {
            id: 'Z26552',
            text: 'Urban Armor Gear',
            selected: false,
            count: 8,
          },
          {
            id: 'Z00057',
            text: 'Verbatim',
            selected: false,
            count: 3,
          },
          {
            id: 'Z00891',
            text: 'Veritas',
            selected: false,
            count: 25,
          },
          {
            id: 'Z01050',
            text: 'WatchGuard',
            selected: false,
            count: 3,
          },
        ],
      },
      {
        id: 'A00035',
        name: 'Processor / Type',
        originalGroupName: 'CNETAttributes',
        type: 'MultiSelect',
        range: {
          min: null,
          max: null,
        },
        options: [
          {
            id: 'K198881',
            text: 'A4',
            selected: false,
            count: 1,
          },
          {
            id: 'K01919',
            text: 'Celeron',
            selected: false,
            count: 5,
          },
          {
            id: 'K192734',
            text: 'Core i3',
            selected: false,
            count: 1,
          },
          {
            id: 'K181271',
            text: 'Core i5',
            selected: false,
            count: 103,
          },
          {
            id: 'K270854',
            text: 'Core i7',
            selected: false,
            count: 106,
          },
          {
            id: 'K860647',
            text: 'Core i9',
            selected: false,
            count: 2,
          },
          {
            id: 'K688341',
            text: 'Core m3',
            selected: false,
            count: 2,
          },
          {
            id: 'K921735',
            text: 'Pentium Gold',
            selected: false,
            count: 3,
          },
          {
            id: 'K914328',
            text: 'Ryzen 5 Pro',
            selected: false,
            count: 5,
          },
          {
            id: 'K914321',
            text: 'Ryzen 7 Pro',
            selected: false,
            count: 5,
          },
          {
            id: 'K1122657',
            text: 'SQ1',
            selected: false,
            count: 5,
          },
          {
            id: 'K42803',
            text: 'Xeon',
            selected: false,
            count: 2,
          },
        ],
      },
      {
        id: 'DisplayStatus',
        name: 'Product Status',
        originalGroupName: 'ProductStatus',
        type: 'MultiSelect',
        range: null,
        options: [
          {
            id: 'Active',
            text: 'Active',
            selected: true,
            count: 588,
          },
          {
            id: 'PhasedOut',
            text: 'Phased Out',
            selected: true,
            count: 37,
          },
          {
            id: 'Allocated',
            text: 'Allocated',
            selected: true,
            count: 3,
          },
        ],
      },
      {
        id: 'InStock',
        name: 'Stock Level',
        originalGroupName: 'InStock',
        type: 'SingleSelectAndRange',
        range: {
          min: null,
          max: null,
        },
        options: [
          {
            id: 'InStockOnly',
            text: 'In Stock Only',
            selected: true,
            count: 603,
          },
        ],
      },
      {
        id: 'A00140',
        name: 'Display / Diagonal Size',
        originalGroupName: 'CNETAttributes',
        type: 'MultiSelect',
        range: {
          min: 10,
          max: 17.3,
        },
        options: [
          {
            id: 'K11137',
            text: '17.3 in',
            selected: false,
            count: 2,
          },
          {
            id: 'K00682',
            text: '17 in',
            selected: false,
            count: 2,
          },
          {
            id: 'K256223',
            text: '15.6 in',
            selected: false,
            count: 55,
          },
          {
            id: 'K09680',
            text: '15.4 in',
            selected: false,
            count: 1,
          },
          {
            id: 'K00680',
            text: '15 in',
            selected: false,
            count: 13,
          },
          {
            id: 'K00679',
            text: '14 in',
            selected: false,
            count: 86,
          },
          {
            id: 'K266358',
            text: '13.5 in',
            selected: false,
            count: 13,
          },
          {
            id: 'K266329',
            text: '13.4 in',
            selected: false,
            count: 1,
          },
          {
            id: 'K1069196',
            text: '13.33 in',
            selected: false,
            count: 2,
          },
          {
            id: 'K02119',
            text: '13.3 in',
            selected: false,
            count: 34,
          },
          {
            id: 'K13738',
            text: '13.1 in',
            selected: false,
            count: 1,
          },
          {
            id: 'K03065',
            text: '13 in',
            selected: false,
            count: 7,
          },
          {
            id: 'K593727',
            text: '12.3 in',
            selected: false,
            count: 9,
          },
          {
            id: 'K54511',
            text: '12 in',
            selected: false,
            count: 2,
          },
          {
            id: 'K248571',
            text: '11.6 in',
            selected: false,
            count: 4,
          },
          {
            id: 'K232099',
            text: '10.5 in',
            selected: false,
            count: 2,
          },
          {
            id: 'K44652',
            text: '10.1 in',
            selected: false,
            count: 2,
          },
          {
            id: 'K10669',
            text: '10 in',
            selected: false,
            count: 3,
          },
        ],
      },
      {
        id: 'Price',
        name: 'Price',
        originalGroupName: 'Price',
        type: 'MultiSelect',
        range: {
          min: null,
          max: null,
        },
        options: [],
      },
      {
        id: 'AvailabilityType',
        name: 'Availability Type',
        originalGroupName: 'AvailabilityType',
        type: 'MultiSelect',
        range: null,
        options: [
          {
            id: 'DropShip',
            text: 'Drop Ship',
            selected: true,
            count: 467,
          },
          {
            id: 'Virtual',
            text: 'Virtual',
            selected: true,
            count: 25,
          },
          {
            id: 'Warehouse',
            text: 'In Warehouse',
            selected: true,
            count: 603,
          },
        ],
      },
      {
        id: 'Countries',
        name: 'Countries',
        originalGroupName: 'Countries',
        type: 'MultiSelect',
        range: null,
        options: [
          {
            id: 'US',
            text: 'US',
            selected: false,
            count: 620,
          },
          {
            id: 'PR',
            text: 'PR',
            selected: false,
            count: 480,
          },
          {
            id: 'VI',
            text: 'VI',
            selected: false,
            count: 444,
          },
          {
            id: 'AG',
            text: 'AG',
            selected: false,
            count: 394,
          },
          {
            id: 'AI',
            text: 'AI',
            selected: false,
            count: 394,
          },
          {
            id: 'AW',
            text: 'AW',
            selected: false,
            count: 394,
          },
          {
            id: 'BB',
            text: 'BB',
            selected: false,
            count: 394,
          },
          {
            id: 'BS',
            text: 'BS',
            selected: false,
            count: 394,
          },
          {
            id: 'CR',
            text: 'CR',
            selected: false,
            count: 394,
          },
          {
            id: 'CW',
            text: 'CW',
            selected: false,
            count: 394,
          },
        ],
      },
      {
        id: 'AuthRequiredView',
        name: 'Authorization Status',
        originalGroupName: 'AuthorizedOnly',
        type: 'SingleSelect',
        range: null,
        options: [
          {
            id: 'AuthRequiredView',
            text: 'Hide Requires Authorization',
            selected: false,
            count: 606,
          },
        ],
      },
      {
        id: 'Condition',
        name: 'Condition',
        originalGroupName: 'Condition',
        type: 'MultiSelect',
        range: null,
        options: [
          {
            id: 'Refurbished',
            text: 'Refurbished',
            selected: false,
            count: 3,
          },
        ],
      },
      {
        id: 'A00600A00601',
        name: 'General / Product Model',
        originalGroupName: 'CNETAttributes',
        type: 'MultiSelect',
        range: {
          min: null,
          max: null,
        },
        options: [
          {
            id: 'P259630_NA',
            text: '3M',
            selected: false,
            count: 1,
          },
          {
            id: 'P353770_M2080527',
            text: '3M Anti-Glare Filter for 12.5" Widescreen Laptop',
            selected: false,
            count: 1,
          },
          {
            id: 'P353770_M2080526',
            text: '3M Anti-Glare Filter for 14" Widescreen Laptop',
            selected: false,
            count: 1,
          },
          {
            id: 'P458458_M2899613',
            text: '3M Anti-Glare Filter for Microsoft Surface Pro 3/4',
            selected: false,
            count: 1,
          },
          {
            id: 'P112008_M557049',
            text: '3M Computer Stand CS100MB',
            selected: false,
            count: 1,
          },
          {
            id: 'P458453_M1172222',
            text: '3M Gold Privacy Filter for 13" Apple MacBook Air',
            selected: false,
            count: 1,
          },
          {
            id: 'P458453_M1578959',
            text: '3M Gold Privacy Filter for 15" Apple MacBook Pro with Retina Display',
            selected: false,
            count: 1,
          },
          {
            id: 'P474736_M3952375',
            text: '3M High Clarity Privacy Filter for 15.6" Laptop with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'P474736_M3952373',
            text: '3M High Clarity Privacy Filter for Apple MacBook Pro 13" (2016 or newer) with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'P176590_M1073981',
            text: '3M PF14.0W',
            selected: false,
            count: 1,
          },
          {
            id: 'P238404_M3952337',
            text: '3M Privacy Filter for 11.6" Widescreen Laptop with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'P238404_M3952334',
            text: '3M Privacy Filter for 15.0" Standard Laptop with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'P238404_M3952357',
            text: '3M Privacy Filter for 15.6" Widescreen Laptop with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'P238404_M3952339',
            text: '3M Privacy Filter for Apple Macbook Pro 13" (2016 model or newer) with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'P238404_M3952352',
            text: '3M Privacy Filter for Apple Macbook Pro 15" (2016 model or newer) with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'P238404_M3952341',
            text: '3M Privacy Filter for Dell Latitude 7480 with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'P238404_M3952322',
            text: '3M Privacy Filter for Edge-to-Edge 12.5" Full Screen Laptop with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'P238404_M3952343',
            text: '3M Privacy Filter for Edge-to-Edge 13.3" Full Screen Laptop with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'P238404_M3952330',
            text: '3M Privacy Filter for Edge-to-Edge 15.6" Full Screen Laptop with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'P238404_M3261608',
            text: '3M Privacy Filter for Google Pixelbook',
            selected: false,
            count: 1,
          },
          {
            id: 'P78742_M3087765',
            text: 'Acer ABG830 Portfolio',
            selected: false,
            count: 1,
          },
          {
            id: 'P608640_M3238133',
            text: 'Acer Chromebook Spin 13 CP713-1WN-55HT',
            selected: false,
            count: 1,
          },
          {
            id: 'P417424_M3057540',
            text: 'Acer Swift 7 SF714-51T-M4PV',
            selected: false,
            count: 1,
          },
          {
            id: 'P417424_M3241976',
            text: 'Acer Swift 7 SF714-51T-M871',
            selected: false,
            count: 1,
          },
          {
            id: 'P02266_M3069217',
            text: 'Acer TravelMate P2410-G2-M-55HN',
            selected: false,
            count: 1,
          },
          {
            id: 'P02266_M3104766',
            text: 'Acer TravelMate P2510-G2-M-56AT',
            selected: false,
            count: 1,
          },
          {
            id: 'P02266_M3901932',
            text: 'Acer TravelMate P614-51-50FJ',
            selected: false,
            count: 1,
          },
          {
            id: 'P02266_M3902003',
            text: 'Acer TravelMate P614-51-7294',
            selected: false,
            count: 1,
          },
          {
            id: 'P651317_M3257024',
            text: 'Acer TravelMate X3 TMX3410-M-5608',
            selected: false,
            count: 1,
          },
          {
            id: 'P29354_M1272254',
            text: 'Acer Universal USB 3.0 Docking Station',
            selected: false,
            count: 1,
          },
          {
            id: 'P262063_NA',
            text: 'AddOn',
            selected: false,
            count: 1,
          },
          {
            id: 'P265534_M3322450',
            text: 'AddOn 65W 19V 4.7A Laptop Power Adapter for HP',
            selected: false,
            count: 1,
          },
          {
            id: 'P29851_NA',
            text: 'Apple',
            selected: false,
            count: 1,
          },
          {
            id: 'P132602_NA',
            text: 'Apple MacBook',
            selected: false,
            count: 2,
          },
          {
            id: 'P164352_M3810659',
            text: 'Apple MacBook Air with Retina display',
            selected: false,
            count: 2,
          },
          {
            id: 'P124858_M2082023',
            text: 'Apple MacBook Pro with Touch Bar',
            selected: false,
            count: 2,
          },
          {
            id: 'P132603_NA',
            text: 'Apple MagSafe',
            selected: false,
            count: 2,
          },
          {
            id: 'P132603_M1229709',
            text: 'Apple MagSafe 2',
            selected: false,
            count: 2,
          },
          {
            id: 'P308370_NA',
            text: 'Apple Smart',
            selected: false,
            count: 3,
          },
          {
            id: 'P308370_M3811109',
            text: 'Apple Smart Folio',
            selected: false,
            count: 2,
          },
          {
            id: 'P29238_M1786249',
            text: 'Apple USB-C',
            selected: false,
            count: 2,
          },
          {
            id: 'P29592_M214022',
            text: 'Axiom AX',
            selected: false,
            count: 1,
          },
          {
            id: 'P40420_M829681',
            text: 'Axiom AX',
            selected: false,
            count: 1,
          },
          {
            id: 'P18099_M2075170',
            text: 'Belkin Thunderbolt 3 Express Dock HD',
            selected: false,
            count: 1,
          },
          {
            id: 'P267162_M1575962',
            text: 'Bretford Basics 32 Unit Network Ready Laptop Cart MDMLAP32NR',
            selected: false,
            count: 1,
          },
          {
            id: 'P100683_M1305319',
            text: 'Bretford Basics MDMLAP20NR-CTAL Network Ready MDM Laptop Cart',
            selected: false,
            count: 1,
          },
          {
            id: 'P642873_NA',
            text: 'Bretford CoreX Charging Cart',
            selected: false,
            count: 1,
          },
          {
            id: 'P642871_NA',
            text: 'Bretford Pulse 20L Charging Cart',
            selected: false,
            count: 1,
          },
          {
            id: 'P30011_NA',
            text: 'BTI',
            selected: false,
            count: 3,
          },
          {
            id: 'P30011_M3826225',
            text: 'BTI 741727-001-BTI',
            selected: false,
            count: 1,
          },
          {
            id: 'P30011_M3059330',
            text: 'BTI CA06XL-BTI',
            selected: false,
            count: 1,
          },
          {
            id: 'P30011_M3327522',
            text: 'BTI H6Y88UT#ABA-BTI',
            selected: false,
            count: 1,
          },
          {
            id: 'P30011_M1188552',
            text: 'BTI HP-PB4530SX6',
            selected: false,
            count: 1,
          },
          {
            id: 'P30011_M2901841',
            text: 'BTI HP-PB455G3',
            selected: false,
            count: 1,
          },
          {
            id: 'P30011_M3327027',
            text: 'BTI NGGX5-BTI',
            selected: false,
            count: 1,
          },
          {
            id: 'P45563_M4101941',
            text: 'C2G USB C Dock with 4K HDMI, Ethernet, & Power Delivery up to 60W',
            selected: false,
            count: 1,
          },
          {
            id: 'P45563_M4101939',
            text: 'C2G USB C Dock with HDMI, VGA, Ethernet, USB, SD & Power Delivery up to 100W',
            selected: false,
            count: 1,
          },
          {
            id: 'P56580_M2065321',
            text: 'C2G USB C to HDMI or VGA Audio/Video Adapter Kit for Apple MacBook',
            selected: false,
            count: 1,
          },
          {
            id: 'P29916_NA',
            text: 'Case Logic',
            selected: false,
            count: 3,
          },
          {
            id: 'P29916_M1077140',
            text: 'Case Logic 10.2" Netbook / iPad Attaché',
            selected: false,
            count: 1,
          },
          {
            id: 'P29916_M887695',
            text: 'Case Logic 17" Laptop Messenger Bag',
            selected: false,
            count: 1,
          },
          {
            id: 'P220504_NA',
            text: 'Case Logic SLR Backpack',
            selected: false,
            count: 1,
          },
          {
            id: 'P37112_M3961156',
            text: 'Case Logic TNEO-108',
            selected: false,
            count: 1,
          },
          {
            id: 'P29305_NA',
            text: 'Cisco',
            selected: false,
            count: 1,
          },
          {
            id: 'P703437_M4131242',
            text: 'CTA Digital Angle-Adjustable Locking Desktop Stand',
            selected: false,
            count: 1,
          },
          {
            id: 'P703437_M4131145',
            text: 'CTA Digital Dual Security Kiosk Stand with Locking Case',
            selected: false,
            count: 1,
          },
          {
            id: 'P703437_M4131168',
            text: 'CTA Digital Heavy-Duty Gooseneck Clamp Stand',
            selected: false,
            count: 1,
          },
          {
            id: 'P703437_M4131215',
            text: 'CTA Digital Heavy-Duty Gooseneck Floor Stand',
            selected: false,
            count: 1,
          },
          {
            id: 'P703437_M4131185',
            text: 'CTA Digital Heavy-Duty Security Pole Clamp',
            selected: false,
            count: 1,
          },
          {
            id: 'P703437_M4131156',
            text: 'CTA Digital Locking Tablet Mount and USB Hub',
            selected: false,
            count: 1,
          },
          {
            id: 'P703438_M4131271',
            text: 'CTA Digital Security Case with Kickstand and Anti-Theft Cable',
            selected: false,
            count: 1,
          },
          {
            id: 'P703437_M4131206',
            text: 'CTA Digital Security Tabletop and Wall',
            selected: false,
            count: 1,
          },
          {
            id: 'P150023_M2934728',
            text: 'CTA Digital Twisted Steel Security Cable Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'P28587_NA',
            text: 'Dell',
            selected: false,
            count: 4,
          },
          {
            id: 'P32298_NA',
            text: 'Dell',
            selected: false,
            count: 4,
          },
          {
            id: 'P32675_M704899',
            text: 'Dell 3 Prong AC Adapter',
            selected: false,
            count: 2,
          },
          {
            id: 'P25510_M3873012',
            text: 'Dell Commercial Grade Case',
            selected: false,
            count: 1,
          },
          {
            id: 'P46080_M1587828',
            text: 'Dell D3100',
            selected: false,
            count: 1,
          },
          {
            id: 'P25510_M3842444',
            text: 'Dell Essential Sleeve 13',
            selected: false,
            count: 1,
          },
          {
            id: 'P01952_M3913099',
            text: 'Dell Latitude 3301',
            selected: false,
            count: 1,
          },
          {
            id: 'P01952_M3895517',
            text: 'Dell Latitude 5300',
            selected: false,
            count: 2,
          },
          {
            id: 'P01952_M3894941',
            text: 'Dell Latitude 5300 2-in-1',
            selected: false,
            count: 2,
          },
          {
            id: 'P01952_M3895137',
            text: 'Dell Latitude 5400',
            selected: false,
            count: 5,
          },
          {
            id: 'P01952_M3913087',
            text: 'Dell Latitude 5401',
            selected: false,
            count: 2,
          },
          {
            id: 'P01952_M4067941',
            text: 'Dell Latitude 5410',
            selected: false,
            count: 3,
          },
          {
            id: 'P01952_M3895140',
            text: 'Dell Latitude 5500',
            selected: false,
            count: 3,
          },
          {
            id: 'P01952_M3912610',
            text: 'Dell Latitude 5501',
            selected: false,
            count: 3,
          },
          {
            id: 'P01952_M4067951',
            text: 'Dell Latitude 5510',
            selected: false,
            count: 1,
          },
          {
            id: 'P01952_M3898338',
            text: 'Dell Latitude 7200 2-in-1',
            selected: false,
            count: 2,
          },
          {
            id: 'P01952_M3895373',
            text: 'Dell Latitude 7300',
            selected: false,
            count: 3,
          },
          {
            id: 'P01952_M3895375',
            text: 'Dell Latitude 7400',
            selected: false,
            count: 3,
          },
          {
            id: 'P01952_M3880136',
            text: 'Dell Latitude 7400 2-in-1',
            selected: false,
            count: 2,
          },
          {
            id: 'P01952_M4077079',
            text: 'Dell Latitude 7410',
            selected: false,
            count: 2,
          },
          {
            id: 'P01952_M4067953',
            text: 'Dell Latitude 9410 2-in-1',
            selected: false,
            count: 1,
          },
          {
            id: 'P46080_M2025759',
            text: 'Dell Latitude Rugged DisplayPort Desk Dock',
            selected: false,
            count: 1,
          },
          {
            id: 'P25510_M1557009',
            text: 'Dell OptiPlex Micro Vertical Stand',
            selected: false,
            count: 1,
          },
          {
            id: 'P46080_M3887769',
            text: 'Dell Performance Dock WD19DC',
            selected: false,
            count: 1,
          },
          {
            id: 'P21252_M3894898',
            text: 'Dell Precision Mobile Workstation 3540',
            selected: false,
            count: 1,
          },
          {
            id: 'P21252_M3903681',
            text: 'Dell Precision Mobile Workstation 3541',
            selected: false,
            count: 1,
          },
          {
            id: 'P21252_M4065207',
            text: 'Dell Precision Mobile Workstation 3551',
            selected: false,
            count: 1,
          },
          {
            id: 'P21252_M3924140',
            text: 'Dell Precision Mobile Workstation 5540',
            selected: false,
            count: 2,
          },
          {
            id: 'P21252_M3924142',
            text: 'Dell Precision Mobile Workstation 7540',
            selected: false,
            count: 2,
          },
          {
            id: 'P25510_M1934438',
            text: 'Dell Premier Sleeve (L)',
            selected: false,
            count: 1,
          },
          {
            id: 'P25510_M2258318',
            text: 'Dell Premier Sleeve 13',
            selected: false,
            count: 1,
          },
          {
            id: 'P32675_M485265',
            text: 'Dell Primary Battery',
            selected: false,
            count: 5,
          },
          {
            id: 'P25510_M3859429',
            text: 'Dell Pro Backpack',
            selected: false,
            count: 1,
          },
          {
            id: 'P25510_M3857828',
            text: 'Dell Pro Backpack 17',
            selected: false,
            count: 1,
          },
          {
            id: 'P25510_M3860753',
            text: 'Dell Pro Briefcase 15',
            selected: false,
            count: 1,
          },
          {
            id: 'P649251_M2084022',
            text: 'Dell Pro Sleeve 13',
            selected: false,
            count: 1,
          },
          {
            id: 'P649251_M2083941',
            text: 'Dell Pro Sleeve 15',
            selected: false,
            count: 1,
          },
          {
            id: 'P469216_NA',
            text: 'Dell TDSourcing',
            selected: false,
            count: 3,
          },
          {
            id: 'P474564_NA',
            text: 'Dell TDSourcing',
            selected: false,
            count: 1,
          },
          {
            id: 'P474597_NA',
            text: 'Dell TDSourcing',
            selected: false,
            count: 1,
          },
          {
            id: 'P469216_M2949918',
            text: 'Dell TDSourcing 3 Prong AC Adapter',
            selected: false,
            count: 1,
          },
          {
            id: 'P469216_M2949916',
            text: 'Dell TDSourcing Auto/Air/DC Adapter',
            selected: false,
            count: 1,
          },
          {
            id: 'P469227_M3020772',
            text: 'Dell TDSourcing Docking Station',
            selected: false,
            count: 1,
          },
          {
            id: 'P474553_M2972126',
            text: 'Dell TDSourcing E-Port Plus',
            selected: false,
            count: 2,
          },
          {
            id: 'P469216_M2949909',
            text: 'Dell TDSourcing Main Battery Pack',
            selected: false,
            count: 1,
          },
          {
            id: 'P469216_M2972103',
            text: 'Dell TDSourcing Primary Battery',
            selected: false,
            count: 3,
          },
          {
            id: 'P469216_M2949908',
            text: 'Dell TDSourcing Slim',
            selected: false,
            count: 1,
          },
          {
            id: 'P469227_M3055258',
            text: 'Dell TDSourcing Thunderbolt Dock TB16',
            selected: false,
            count: 2,
          },
          {
            id: 'P469216_M3817147',
            text: 'Dell TDSourcing Type-C AC Adapter',
            selected: false,
            count: 1,
          },
          {
            id: 'P46079_M1620797',
            text: 'Dell WM615',
            selected: false,
            count: 1,
          },
          {
            id: 'P275063_M4023294',
            text: 'Dell Wyse 5470',
            selected: false,
            count: 1,
          },
          {
            id: 'P134596_M3930954',
            text: 'Dell XPS 13 7390 2-in-1',
            selected: false,
            count: 1,
          },
          {
            id: 'P30896_NA',
            text: 'Digi',
            selected: false,
            count: 1,
          },
          {
            id: 'P647975_NA',
            text: 'Dynabook',
            selected: false,
            count: 1,
          },
          {
            id: 'P645639_M3932379',
            text: 'Dynabook Toshiba Portégé X30-F',
            selected: false,
            count: 1,
          },
          {
            id: 'P645639_M3936600',
            text: 'Dynabook Toshiba Portégé X30-F1331',
            selected: false,
            count: 1,
          },
          {
            id: 'P645643_M3899987',
            text: 'Dynabook Toshiba Tecra A50-EC',
            selected: false,
            count: 1,
          },
          {
            id: 'P645643_M4021773',
            text: 'Dynabook Toshiba Tecra A50-F1520',
            selected: false,
            count: 1,
          },
          {
            id: 'P110224_NA',
            text: 'Ergotron',
            selected: false,
            count: 1,
          },
          {
            id: 'P14056_M1245210',
            text: 'Ergotron CPU Lock Kit',
            selected: false,
            count: 1,
          },
          {
            id: 'P126107_NA',
            text: 'Ergotron LX',
            selected: false,
            count: 1,
          },
          {
            id: 'P114985_M1878011',
            text: 'Ergotron StyleView Tablet Cart, SV10',
            selected: false,
            count: 1,
          },
          {
            id: 'P253425_NA',
            text: 'Ergotron Universal Tablet Cradle',
            selected: false,
            count: 1,
          },
          {
            id: 'P237664_M1026889',
            text: 'Ergotron WorkFit-S Tablet/Document Holder',
            selected: false,
            count: 1,
          },
          {
            id: 'P28640_NA',
            text: 'Fujitsu',
            selected: false,
            count: 1,
          },
          {
            id: 'P30082_NA',
            text: 'Fujitsu',
            selected: false,
            count: 1,
          },
          {
            id: 'P30280_NA',
            text: 'Fujitsu',
            selected: false,
            count: 1,
          },
          {
            id: 'P29445_M947395',
            text: 'Fujitsu Screen Protector',
            selected: false,
            count: 1,
          },
          {
            id: 'P262999_M1161158',
            text: 'Gamber-Johnson Vehicle Docking Station',
            selected: false,
            count: 1,
          },
          {
            id: 'P247715_M1560247',
            text: 'Griffin Survivor All-Terrain',
            selected: false,
            count: 2,
          },
          {
            id: 'P247715_M3259869',
            text: 'Griffin Survivor Endurance',
            selected: false,
            count: 1,
          },
          {
            id: 'P247715_M2100522',
            text: 'Griffin Survivor Extreme',
            selected: false,
            count: 1,
          },
          {
            id: 'P155803_M1487432',
            text: 'Griffin Survivor Harness Kit',
            selected: false,
            count: 1,
          },
          {
            id: 'P636667_NA',
            text: 'Heckler AV',
            selected: false,
            count: 1,
          },
          {
            id: 'P636667_M4049786',
            text: 'Heckler AV Wall Mount plus Power',
            selected: false,
            count: 1,
          },
          {
            id: 'P342201_M2908539',
            text: 'Heckler Meeting Room Console',
            selected: false,
            count: 1,
          },
          {
            id: 'P399057_NA',
            text: 'Heckler WindFall',
            selected: false,
            count: 1,
          },
          {
            id: 'P399057_M3245074',
            text: 'Heckler WindFall Checkout Stand',
            selected: false,
            count: 1,
          },
          {
            id: 'P399057_M2948009',
            text: 'Heckler WindFall Stand Prime',
            selected: false,
            count: 1,
          },
          {
            id: 'P469263_M3857304',
            text: 'HGST TDSourcing Ultrastar C10K600 HUC106030CSS600',
            selected: false,
            count: 1,
          },
          {
            id: 'P00171_NA',
            text: 'HP',
            selected: false,
            count: 1,
          },
          {
            id: 'P304883_M4017026',
            text: 'HP Chromebook 11A G8',
            selected: false,
            count: 1,
          },
          {
            id: 'P328285_M3046391',
            text: 'HP Chromebox G2',
            selected: false,
            count: 1,
          },
          {
            id: 'P00171_M1932166',
            text: 'HP Combination Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'P665163_NA',
            text: 'HP Elite Dragonfly',
            selected: false,
            count: 6,
          },
          {
            id: 'P172291_M3909276',
            text: 'HP EliteBook 735 G6',
            selected: false,
            count: 1,
          },
          {
            id: 'P172291_M3909050',
            text: 'HP EliteBook 745 G6',
            selected: false,
            count: 2,
          },
          {
            id: 'P172291_M3895108',
            text: 'HP EliteBook 830 G6',
            selected: false,
            count: 1,
          },
          {
            id: 'P172291_M3895110',
            text: 'HP EliteBook 840 G6',
            selected: false,
            count: 5,
          },
          {
            id: 'P172291_M4073049',
            text: 'HP EliteBook 840 G7',
            selected: false,
            count: 3,
          },
          {
            id: 'P172291_M3895109',
            text: 'HP EliteBook 850 G6',
            selected: false,
            count: 3,
          },
          {
            id: 'P172291_M4073050',
            text: 'HP EliteBook 850 G7',
            selected: false,
            count: 2,
          },
          {
            id: 'P439445_M3927787',
            text: 'HP EliteBook x360 1030 G4',
            selected: false,
            count: 2,
          },
          {
            id: 'P439445_M3909275',
            text: 'HP EliteBook x360 1040 G6',
            selected: false,
            count: 5,
          },
          {
            id: 'P439445_M3892120',
            text: 'HP EliteBook x360 830 G6',
            selected: false,
            count: 4,
          },
          {
            id: 'P00171_M996991',
            text: 'HP Keyed Cable Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'P207533_M2925071',
            text: 'HP Mobile Thin Client mt21',
            selected: false,
            count: 1,
          },
          {
            id: 'P00171_M4056002',
            text: 'HP Prelude Pro Recycle Top Load',
            selected: false,
            count: 1,
          },
          {
            id: 'P206315_M4000490',
            text: 'HP ProBook 440 G7',
            selected: false,
            count: 2,
          },
          {
            id: 'P206315_M3899903',
            text: 'HP ProBook 640 G5',
            selected: false,
            count: 2,
          },
          {
            id: 'P206315_M3899902',
            text: 'HP ProBook 650 G5',
            selected: false,
            count: 3,
          },
          {
            id: 'P430681_M4048449',
            text: 'HP ProBook x360 11 G6',
            selected: false,
            count: 1,
          },
          {
            id: 'P88731_M870441',
            text: 'HP Slim',
            selected: false,
            count: 3,
          },
          {
            id: 'P88731_M1362776',
            text: 'HP Slim Combo Adapter with USB',
            selected: false,
            count: 1,
          },
          {
            id: 'P129019_NA',
            text: 'HP Smart',
            selected: false,
            count: 2,
          },
          {
            id: 'P88731_M1911729',
            text: 'HP SN03XL',
            selected: false,
            count: 1,
          },
          {
            id: 'P474547_NA',
            text: 'HP TDSourcing',
            selected: false,
            count: 1,
          },
          {
            id: 'P644348_M3942799',
            text: 'HP TDSourcing EliteBook 840 G5',
            selected: false,
            count: 1,
          },
          {
            id: 'P653178_M3908890',
            text: 'HP TDSourcing ProBook 440 G5',
            selected: false,
            count: 1,
          },
          {
            id: 'P474548_NA',
            text: 'HP TDSourcing Smart',
            selected: false,
            count: 2,
          },
          {
            id: 'P474548_M2972119',
            text: 'HP TDSourcing Smart non-PFC AC Adapter',
            selected: false,
            count: 1,
          },
          {
            id: 'P29446_M3058153',
            text: 'HP Thunderbolt Dock G2',
            selected: false,
            count: 1,
          },
          {
            id: 'P29446_M3984089',
            text: 'HP Travel Hub G2',
            selected: false,
            count: 1,
          },
          {
            id: 'P88731_M2264666',
            text: 'HP USB-C G2',
            selected: false,
            count: 1,
          },
          {
            id: 'P469649_M2951256',
            text: 'HP Z VR Backpack G1 Dock',
            selected: false,
            count: 1,
          },
          {
            id: 'P304334_M3893106',
            text: 'HP ZBook 14u G6 Mobile Workstation',
            selected: false,
            count: 5,
          },
          {
            id: 'P304334_M3929755',
            text: 'HP ZBook 15 G6 Mobile Workstation',
            selected: false,
            count: 3,
          },
          {
            id: 'P304334_M3893427',
            text: 'HP ZBook 15u G6 Mobile Workstation',
            selected: false,
            count: 1,
          },
          {
            id: 'P304334_M3056862',
            text: 'HP ZBook 15v G5 Mobile Workstation',
            selected: false,
            count: 1,
          },
          {
            id: 'P690178_M4080774',
            text: 'HP ZBook Firefly 14 G7 Mobile Workstation',
            selected: false,
            count: 1,
          },
          {
            id: 'P690178_M4080481',
            text: 'HP ZBook Firefly 15 G7 Mobile Workstation',
            selected: false,
            count: 2,
          },
          {
            id: 'P304334_M3060969',
            text: 'HP ZBook Studio G5 Mobile Workstation',
            selected: false,
            count: 1,
          },
          {
            id: 'P388342_NA',
            text: 'HPE Aruba',
            selected: false,
            count: 1,
          },
          {
            id: 'P388342_M3978433',
            text: 'HPE Aruba AP-AC2-48C',
            selected: false,
            count: 1,
          },
          {
            id: 'P382570_M1891399',
            text: 'HPE Midline',
            selected: false,
            count: 2,
          },
          {
            id: 'P474595_M2972179',
            text: 'HPE TDSourcing Dual Port Enterprise',
            selected: false,
            count: 1,
          },
          {
            id: 'P328129_NA',
            text: 'HyperX Impact',
            selected: false,
            count: 2,
          },
          {
            id: 'P472465_M3065900',
            text: 'Intel Optane SSD 905P Series',
            selected: false,
            count: 1,
          },
          {
            id: 'P55958_M3243705',
            text: 'Intel Solid-State Drive D3-S4510 Series',
            selected: false,
            count: 2,
          },
          {
            id: 'P55958_M3240296',
            text: 'Intel Solid-State Drive D3-S4610 Series',
            selected: false,
            count: 1,
          },
          {
            id: 'P55958_M2918334',
            text: 'Intel Solid-State Drive DC P4510 Series',
            selected: false,
            count: 1,
          },
          {
            id: 'P55958_M3092031',
            text: 'Intel Solid-State Drive DC P4610 Series',
            selected: false,
            count: 1,
          },
          {
            id: 'P474572_M3020782',
            text: 'Intel TDSourcing Solid-State Drive 320 Series',
            selected: false,
            count: 1,
          },
          {
            id: 'P474572_M2972153',
            text: 'Intel TDSourcing Solid-State Drive DC S3510 Series',
            selected: false,
            count: 1,
          },
          {
            id: 'P474572_M3020780',
            text: 'Intel TDSourcing Solid-State Drive DC S3610 Series',
            selected: false,
            count: 1,
          },
          {
            id: 'P460769_NA',
            text: 'Juiced BizHUB',
            selected: false,
            count: 1,
          },
          {
            id: 'P694915_NA',
            text: 'Kensington ClickSafe 2.0 Keyed Lock for Wedge Shaped Slots',
            selected: false,
            count: 1,
          },
          {
            id: 'P239151_M3972317',
            text: 'Kensington ClickSafe 2.0 Universal Keyed Laptop Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'P239151_M994348',
            text: 'Kensington ClickSafe Keyed Laptop Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'P29124_M1127995',
            text: 'Kensington Combination Laptop Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'P29124_M1127701',
            text: 'Kensington Combination Ultra Laptop Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'P45254_M183474',
            text: 'Kensington Contour Pro 17"',
            selected: false,
            count: 1,
          },
          {
            id: 'P247904_M2270663',
            text: 'Kensington Desktop and Peripherals Standard Keyed Locking Kit 2.0',
            selected: false,
            count: 1,
          },
          {
            id: 'P29124_M4054774',
            text: 'Kensington FP156W9 Privacy Screen for 15.6" Laptops (16:9)',
            selected: false,
            count: 1,
          },
          {
            id: 'P109398_M1296854',
            text: 'Kensington MicroSaver DS Cable Lock From Lenovo',
            selected: false,
            count: 1,
          },
          {
            id: 'P02063_M86251',
            text: 'Kensington MicroSaver Master-keyed',
            selected: false,
            count: 1,
          },
          {
            id: 'P109398_M334788',
            text: 'Kensington MicroSaver Security Cable Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'P685046_M4058327',
            text: 'Kensington MP13 Magnetic Privacy Screen for 13" MacBook Air 2018 & Pro 2016 Later',
            selected: false,
            count: 1,
          },
          {
            id: 'P684348_M4055445',
            text: 'Kensington N17 Combination Lock for Wedge-Shaped Slots',
            selected: false,
            count: 1,
          },
          {
            id: 'P229691_M930862',
            text: 'Kensington Privacy Screen for 15.6" Laptops',
            selected: false,
            count: 1,
          },
          {
            id: 'P213666_M1127994',
            text: 'Kensington Pro Fit Mid-Size',
            selected: false,
            count: 1,
          },
          {
            id: 'P42268_M4058311',
            text: 'Kensington SD2400T Thunderbolt 3 40Gbps Dual 4K Nano Dock with 135W Adapter - Win/Mac',
            selected: false,
            count: 1,
          },
          {
            id: 'P42268_M3953547',
            text: 'Kensington SD5550T Thunderbolt 3 Dock for Windows and Mac',
            selected: false,
            count: 1,
          },
          {
            id: 'P685045_M4058326',
            text: 'Kensington Serialized Combination Laptop Lock 25-Pack',
            selected: false,
            count: 1,
          },
          {
            id: 'P687961_NA',
            text: 'Kensington WindFall Stand for Surface Go and Surface Go 2 (K67932US)',
            selected: false,
            count: 1,
          },
          {
            id: 'P29532_NA',
            text: 'Kingston',
            selected: false,
            count: 2,
          },
          {
            id: 'P644822_M3968301',
            text: 'Kingston Data Center DC450R',
            selected: false,
            count: 1,
          },
          {
            id: 'P644822_M3874658',
            text: 'Kingston Data Center DC500M',
            selected: false,
            count: 2,
          },
          {
            id: 'P102929_M3968875',
            text: 'Kingston KC600',
            selected: false,
            count: 1,
          },
          {
            id: 'P41204_NA',
            text: 'Kingston ValueRAM',
            selected: false,
            count: 3,
          },
          {
            id: 'P128585_NA',
            text: 'Lenovo',
            selected: false,
            count: 4,
          },
          {
            id: 'P131680_NA',
            text: 'Lenovo',
            selected: false,
            count: 3,
          },
          {
            id: 'P640488_M3853355',
            text: 'Lenovo 100e Chromebook (2nd Gen) 81MA',
            selected: false,
            count: 1,
          },
          {
            id: 'P128584_M3250187',
            text: 'Lenovo 135W AC Adapter (Slim Tip)',
            selected: false,
            count: 1,
          },
          {
            id: 'P644328_M3870589',
            text: 'Lenovo 500e Chromebook (2nd Gen) 81MC',
            selected: false,
            count: 1,
          },
          {
            id: 'P128584_M3017570',
            text: 'Lenovo 65W USB-C DC Travel Adapter',
            selected: false,
            count: 1,
          },
          {
            id: 'P132670_M3804596',
            text: 'Lenovo Essential Compact',
            selected: false,
            count: 1,
          },
          {
            id: 'P128220_M3872528',
            text: 'Lenovo Powered USB-C Travel Hub',
            selected: false,
            count: 1,
          },
          {
            id: 'P290967_M3246879',
            text: 'Lenovo Rugged Case',
            selected: false,
            count: 1,
          },
          {
            id: 'P474549_NA',
            text: 'Lenovo TDSourcing',
            selected: false,
            count: 1,
          },
          {
            id: 'P474549_M3934377',
            text: 'Lenovo TDSourcing 65W Standard AC Adapter (USB Type-C)',
            selected: false,
            count: 1,
          },
          {
            id: 'P474542_M4039863',
            text: 'Lenovo TDSourcing ThinkPad Battery 61',
            selected: false,
            count: 1,
          },
          {
            id: 'P474554_M4024428',
            text: 'Lenovo TDSourcing ThinkPad Thunderbolt 3 Dock',
            selected: false,
            count: 1,
          },
          {
            id: 'P474554_M4077994',
            text: 'Lenovo TDSourcing ThinkPad Workstation Dock',
            selected: false,
            count: 1,
          },
          {
            id: 'P108641_NA',
            text: 'Lenovo ThinkPad',
            selected: false,
            count: 1,
          },
          {
            id: 'P109259_M1388031',
            text: 'Lenovo ThinkPad 45W AC Adapter (Slim Tip)',
            selected: false,
            count: 1,
          },
          {
            id: 'P109259_M1438275',
            text: 'Lenovo ThinkPad 65W AC Adapter (Slim Tip)',
            selected: false,
            count: 1,
          },
          {
            id: 'P109259_M3986973',
            text: 'Lenovo ThinkPad 65W Slim AC Adapter (USB Type-C)',
            selected: false,
            count: 1,
          },
          {
            id: 'P109259_M1510534',
            text: 'Lenovo ThinkPad 90W AC Adapter (Slim Tip)',
            selected: false,
            count: 1,
          },
          {
            id: 'P108231_M3001281',
            text: 'Lenovo ThinkPad Basic Docking Station',
            selected: false,
            count: 1,
          },
          {
            id: 'P109259_M1228381',
            text: 'Lenovo ThinkPad Battery 67+',
            selected: false,
            count: 1,
          },
          {
            id: 'P109259_M1390743',
            text: 'Lenovo ThinkPad Battery 68',
            selected: false,
            count: 1,
          },
          {
            id: 'P109259_M1938765',
            text: 'Lenovo ThinkPad Battery 71+',
            selected: false,
            count: 1,
          },
          {
            id: 'P109259_M1889088',
            text: 'Lenovo ThinkPad Battery 77+',
            selected: false,
            count: 1,
          },
          {
            id: 'P665355_M3960131',
            text: 'Lenovo ThinkPad E14 20RA',
            selected: false,
            count: 1,
          },
          {
            id: 'P665712_M3962000',
            text: 'Lenovo ThinkPad E15 20RD',
            selected: false,
            count: 1,
          },
          {
            id: 'P667643_M3972582',
            text: 'Lenovo ThinkPad L13 20R3',
            selected: false,
            count: 2,
          },
          {
            id: 'P686772_M4065965',
            text: 'Lenovo ThinkPad L14 Gen 1 20U5',
            selected: false,
            count: 2,
          },
          {
            id: 'P686771_M4065835',
            text: 'Lenovo ThinkPad L15 Gen 1 20U3',
            selected: false,
            count: 1,
          },
          {
            id: 'P686771_M4065967',
            text: 'Lenovo ThinkPad L15 Gen 1 20U7',
            selected: false,
            count: 2,
          },
          {
            id: 'P656521_M3920964',
            text: 'Lenovo ThinkPad P1 (2nd Gen) 20QT',
            selected: false,
            count: 7,
          },
          {
            id: 'P686535_M4064904',
            text: 'Lenovo ThinkPad P15s Gen 1 20T4',
            selected: false,
            count: 1,
          },
          {
            id: 'P655056_M3916626',
            text: 'Lenovo ThinkPad P43s 20RH',
            selected: false,
            count: 1,
          },
          {
            id: 'P655055_M3916625',
            text: 'Lenovo ThinkPad P53 20QN',
            selected: false,
            count: 3,
          },
          {
            id: 'P652564_M3906605',
            text: 'Lenovo ThinkPad P53s 20N6',
            selected: false,
            count: 1,
          },
          {
            id: 'P108231_M3001283',
            text: 'Lenovo ThinkPad Pro Docking Station',
            selected: false,
            count: 1,
          },
          {
            id: 'P108349_M1468478',
            text: 'Lenovo ThinkPad Professional Backpack',
            selected: false,
            count: 1,
          },
          {
            id: 'P686533_M4064902',
            text: 'Lenovo ThinkPad T14 Gen 1 20S0',
            selected: false,
            count: 2,
          },
          {
            id: 'P686774_M4065838',
            text: 'Lenovo ThinkPad T14s Gen 1 20T0',
            selected: false,
            count: 1,
          },
          {
            id: 'P642125_M3861067',
            text: 'Lenovo ThinkPad T490 20N2',
            selected: false,
            count: 3,
          },
          {
            id: 'P642127_M3861069',
            text: 'Lenovo ThinkPad T490s 20NX',
            selected: false,
            count: 1,
          },
          {
            id: 'P650779_M3899039',
            text: 'Lenovo ThinkPad T495s 20QJ',
            selected: false,
            count: 1,
          },
          {
            id: 'P108231_M3878618',
            text: 'Lenovo ThinkPad USB-C Dock Gen 2',
            selected: false,
            count: 1,
          },
          {
            id: 'P651626_M3906604',
            text: 'Lenovo ThinkPad X1 Carbon (7th Gen) 20QD',
            selected: false,
            count: 2,
          },
          {
            id: 'P651626_M3962450',
            text: 'Lenovo ThinkPad X1 Carbon (7th Gen) 20R1',
            selected: false,
            count: 3,
          },
          {
            id: 'P656748_M3921608',
            text: 'Lenovo ThinkPad X1 Extreme (2nd Gen) 20QV',
            selected: false,
            count: 4,
          },
          {
            id: 'P640394_M3019900',
            text: 'Lenovo ThinkPad X1 Tablet (3rd Gen) 20KJ',
            selected: false,
            count: 2,
          },
          {
            id: 'P651625_M3914906',
            text: 'Lenovo ThinkPad X1 Yoga (4th Gen) 20QF',
            selected: false,
            count: 3,
          },
          {
            id: 'P651625_M3962978',
            text: 'Lenovo ThinkPad X1 Yoga (4th Gen) 20SA',
            selected: false,
            count: 1,
          },
          {
            id: 'P686776_M4065840',
            text: 'Lenovo ThinkPad X1 Yoga Gen 5 20UB',
            selected: false,
            count: 3,
          },
          {
            id: 'P686782_M4065847',
            text: 'Lenovo ThinkPad X13 Yoga Gen 1 20SX',
            selected: false,
            count: 3,
          },
          {
            id: 'P642124_M3861066',
            text: 'Lenovo ThinkPad X390 20Q0',
            selected: false,
            count: 1,
          },
          {
            id: 'P642124_M3973811',
            text: 'Lenovo ThinkPad X390 20SC',
            selected: false,
            count: 1,
          },
          {
            id: 'P650778_M3899037',
            text: 'Lenovo ThinkPad X395 20NL',
            selected: false,
            count: 2,
          },
          {
            id: 'P128220_M4013070',
            text: 'Lenovo Thunderbolt 3 Essential Dock',
            selected: false,
            count: 1,
          },
          {
            id: 'P128584_M1463223',
            text: 'Lenovo Tiny 65W AC Adapter (Slim Tip)',
            selected: false,
            count: 1,
          },
          {
            id: 'P128220_M3924460',
            text: 'Lenovo USB-C 7-in-1 Hub',
            selected: false,
            count: 1,
          },
          {
            id: 'P128220_M2157712',
            text: 'Lenovo USB-C Travel Hub',
            selected: false,
            count: 1,
          },
          {
            id: 'P379076_M4058111',
            text: 'LG gram 14Z90N-N.APS7U1',
            selected: false,
            count: 1,
          },
          {
            id: 'P379076_M4057706',
            text: 'LG gram 17Z90N-N.APS8U1',
            selected: false,
            count: 1,
          },
          {
            id: 'P379076_M4057705',
            text: 'LG gram 17Z90N-N.APW9U1',
            selected: false,
            count: 1,
          },
          {
            id: 'P256131_M1170337',
            text: 'LIND PA1580-1642',
            selected: false,
            count: 1,
          },
          {
            id: 'P55200_M2063891',
            text: 'Logitech Extender Box',
            selected: false,
            count: 1,
          },
          {
            id: 'P28425_M1091894',
            text: 'Logitech M185',
            selected: false,
            count: 1,
          },
          {
            id: 'P28425_M1175473',
            text: 'Logitech M187',
            selected: false,
            count: 1,
          },
          {
            id: 'P285962_M2929110',
            text: 'M-Edge Cargo Backpack with Battery',
            selected: false,
            count: 1,
          },
          {
            id: 'P285962_M2929111',
            text: 'M-Edge Commuter Backpack with Battery',
            selected: false,
            count: 1,
          },
          {
            id: 'P375499_M1851812',
            text: 'Microsoft Bluetooth Mobile Mouse 3600',
            selected: false,
            count: 2,
          },
          {
            id: 'P625336_NA',
            text: 'Microsoft Modern Mobile Mouse',
            selected: false,
            count: 1,
          },
          {
            id: 'P286722_M4066410',
            text: 'Microsoft Surface 127W Power Supply',
            selected: false,
            count: 1,
          },
          {
            id: 'P286722_M1878580',
            text: 'Microsoft Surface 65W Power Supply',
            selected: false,
            count: 1,
          },
          {
            id: 'P452289_NA',
            text: 'Microsoft Surface Arc Mouse',
            selected: false,
            count: 1,
          },
          {
            id: 'P286106_M2945594',
            text: 'Microsoft Surface Book 2',
            selected: false,
            count: 2,
          },
          {
            id: 'P286106_M4064597',
            text: 'Microsoft Surface Book 3',
            selected: false,
            count: 5,
          },
          {
            id: 'P286106_M3105718',
            text: 'Microsoft Surface Go',
            selected: false,
            count: 3,
          },
          {
            id: 'P286106_M4064680',
            text: 'Microsoft Surface Go 2',
            selected: false,
            count: 2,
          },
          {
            id: 'P286106_M3328894',
            text: 'Microsoft Surface Laptop 2',
            selected: false,
            count: 2,
          },
          {
            id: 'P286106_M3939268',
            text: 'Microsoft Surface Laptop 3',
            selected: false,
            count: 16,
          },
          {
            id: 'P606875_NA',
            text: 'Microsoft Surface Mobile Mouse',
            selected: false,
            count: 1,
          },
          {
            id: 'P286106_M1378598',
            text: 'Microsoft Surface Pro',
            selected: false,
            count: 1,
          },
          {
            id: 'P286106_M3328893',
            text: 'Microsoft Surface Pro 6',
            selected: false,
            count: 2,
          },
          {
            id: 'P286106_M3939267',
            text: 'Microsoft Surface Pro 7',
            selected: false,
            count: 4,
          },
          {
            id: 'P286106_M3958001',
            text: 'Microsoft Surface Pro X',
            selected: false,
            count: 5,
          },
          {
            id: 'P602801_M4003883',
            text: 'Microsoft TDSourcing Surface 44W Power Supply',
            selected: false,
            count: 1,
          },
          {
            id: 'P306112_M4064870',
            text: 'Microsoft USB-C Travel Hub',
            selected: false,
            count: 1,
          },
          {
            id: 'P171933_M1486567',
            text: 'Microsoft Wireless Mobile Mouse 1850',
            selected: false,
            count: 2,
          },
          {
            id: 'P171933_M889443',
            text: 'Microsoft Wireless Mobile Mouse 3500',
            selected: false,
            count: 1,
          },
          {
            id: 'P65382_M3893384',
            text: 'Mobile Edge Alienware Area-51m 17.3" Elite Backpack',
            selected: false,
            count: 1,
          },
          {
            id: 'P65382_M3871118',
            text: 'Mobile Edge Alienware Vindicator 14" or 17" Messenger Bag',
            selected: false,
            count: 1,
          },
          {
            id: 'P666871_M4045282',
            text: 'MSI Creator 15M A9SD-037',
            selected: false,
            count: 1,
          },
          {
            id: 'P682613_M4049195',
            text: 'MSI Creator 17 A10SGS-254',
            selected: false,
            count: 1,
          },
          {
            id: 'P682619_M4048612',
            text: 'MSI GS75 10SFS 035 Stealth',
            selected: false,
            count: 1,
          },
          {
            id: 'P596289_M3045961',
            text: 'MSI GT63 Titan-046',
            selected: false,
            count: 1,
          },
          {
            id: 'P661224_M4047288',
            text: 'MSI Modern 14 A10M-1029',
            selected: false,
            count: 1,
          },
          {
            id: 'P29991_NA',
            text: 'Panasonic',
            selected: false,
            count: 1,
          },
          {
            id: 'P28854_M918709',
            text: 'Panasonic CF-AA5713AM',
            selected: false,
            count: 1,
          },
          {
            id: 'P29992_M918714',
            text: 'Panasonic CF-VEB311U',
            selected: false,
            count: 1,
          },
          {
            id: 'P29992_M1832238',
            text: 'Panasonic CF-VEB541AU',
            selected: false,
            count: 1,
          },
          {
            id: 'P29991_M1958830',
            text: 'Panasonic CF-VPF31U',
            selected: false,
            count: 1,
          },
          {
            id: 'P28854_M1091361',
            text: 'Panasonic CF-VZSU71U',
            selected: false,
            count: 1,
          },
          {
            id: 'P29991_M3951267',
            text: 'Panasonic FZ-VNP551U',
            selected: false,
            count: 1,
          },
          {
            id: 'P01995_M1912018',
            text: 'Panasonic Toughbook 20',
            selected: false,
            count: 2,
          },
          {
            id: 'P01995_M26170',
            text: 'Panasonic Toughbook 31',
            selected: false,
            count: 1,
          },
          {
            id: 'P01995_M3950515',
            text: 'Panasonic Toughbook 55',
            selected: false,
            count: 6,
          },
          {
            id: 'P01995_M3967660',
            text: 'Panasonic Toughbook 55 Federal',
            selected: false,
            count: 1,
          },
          {
            id: 'P668163_M3975010',
            text: 'Plugable TDSourcing UD-CAM',
            selected: false,
            count: 1,
          },
          {
            id: 'P208342_M2028245',
            text: 'PNY CS900',
            selected: false,
            count: 1,
          },
          {
            id: 'P254267_M1371621',
            text: 'RAM Tab-Tite RAM-HOL-TAB19U',
            selected: false,
            count: 1,
          },
          {
            id: 'P248574_NA',
            text: 'Ruckus',
            selected: false,
            count: 4,
          },
          {
            id: 'P30445_M1159554',
            text: 'Samsung S Pen',
            selected: false,
            count: 1,
          },
          {
            id: 'P594200_M3046063',
            text: 'Samsung TDSourcing 850 EVO MZ-75E250',
            selected: false,
            count: 1,
          },
          {
            id: 'P592865_M3077740',
            text: 'Samsung TDSourcing 860 EVO MZ-76E1T0B',
            selected: false,
            count: 1,
          },
          {
            id: 'P592865_M3963131',
            text: 'Samsung TDSourcing 860 EVO MZ-76E2T0E',
            selected: false,
            count: 1,
          },
          {
            id: 'P592865_M3012674',
            text: 'Samsung TDSourcing 860 EVO MZ-76E500B',
            selected: false,
            count: 1,
          },
          {
            id: 'P601547_M3974994',
            text: 'Samsung TDSourcing 860 PRO MZ-76P256E',
            selected: false,
            count: 1,
          },
          {
            id: 'P647857_M3942801',
            text: 'Samsung TDSourcing SM883 MZ7KH480HAHQ',
            selected: false,
            count: 1,
          },
          {
            id: 'P469288_M2950065',
            text: 'Seagate TDSourcing Constellation.2 ST91000640SS',
            selected: false,
            count: 1,
          },
          {
            id: 'P469259_M2949981',
            text: 'Seagate TDSourcing Enterprise Performance 10K HDD ST600MM0006',
            selected: false,
            count: 1,
          },
          {
            id: 'P469259_M3870688',
            text: 'Seagate TDSourcing Enterprise Performance 10K HDD ST900MM0006',
            selected: false,
            count: 1,
          },
          {
            id: 'P469296_M2950097',
            text: 'Seagate TDSourcing Enterprise Performance 15K HDD ST9300653SS',
            selected: false,
            count: 1,
          },
          {
            id: 'P683212_M4051126',
            text: 'Seagate TDSourcing Exos 10E2400 ST1200MM0009',
            selected: false,
            count: 1,
          },
          {
            id: 'P469281_M3020852',
            text: 'Seagate TDSourcing Momentus Thin ST320LT020',
            selected: false,
            count: 1,
          },
          {
            id: 'P37042_NA',
            text: 'SonicWall',
            selected: false,
            count: 2,
          },
          {
            id: 'P386106_M1927689',
            text: 'SupCase Unicorn Beetle Pro',
            selected: false,
            count: 1,
          },
          {
            id: 'P109961_NA',
            text: 'Targus',
            selected: false,
            count: 1,
          },
          {
            id: 'P34458_NA',
            text: 'Targus',
            selected: false,
            count: 1,
          },
          {
            id: 'P73272_M712570',
            text: 'Targus 13.3" Widescreen Laptop Privacy Screen',
            selected: false,
            count: 1,
          },
          {
            id: 'P02290_M995472',
            text: 'Targus 14.1" Widescreen Laptop Privacy Screen (16:9)',
            selected: false,
            count: 1,
          },
          {
            id: 'P02290_M614391',
            text: 'Targus 14.1" Widescreen Notebook Privacy Filter',
            selected: false,
            count: 1,
          },
          {
            id: 'P02290_M1145661',
            text: 'Targus 17.3" Widescreen Laptop Privacy Screen (16:9)',
            selected: false,
            count: 1,
          },
          {
            id: 'P379731_NA',
            text: 'Targus Bex II',
            selected: false,
            count: 1,
          },
          {
            id: 'P378258_M1883391',
            text: 'Targus CityGear II Hybrid Messenger',
            selected: false,
            count: 1,
          },
          {
            id: 'P139628_M2160734',
            text: 'Targus CityLite Briefcase',
            selected: false,
            count: 1,
          },
          {
            id: 'P139628_M3896374',
            text: 'Targus CityLite Pro',
            selected: false,
            count: 1,
          },
          {
            id: 'P139628_M3330194',
            text: 'Targus CityLite Pro Premium Convertible',
            selected: false,
            count: 1,
          },
          {
            id: 'P355269_M2078074',
            text: 'Targus CitySmart EVA Pro',
            selected: false,
            count: 1,
          },
          {
            id: 'P11564_M649590',
            text: 'Targus Corporate Traveler Backpack',
            selected: false,
            count: 1,
          },
          {
            id: 'P03644_M128015',
            text: 'Targus Defcon KL',
            selected: false,
            count: 1,
          },
          {
            id: 'P251656_M1085646',
            text: 'Targus Drifter II Laptop Backpack',
            selected: false,
            count: 1,
          },
          {
            id: 'P164484_NA',
            text: 'Targus Grove',
            selected: false,
            count: 1,
          },
          {
            id: 'P294550_M3867863',
            text: 'Targus Intellect Essentials',
            selected: false,
            count: 1,
          },
          {
            id: 'P595732_NA',
            text: 'Targus Newport',
            selected: false,
            count: 1,
          },
          {
            id: 'P94598_NA',
            text: 'Targus Rolling',
            selected: false,
            count: 2,
          },
          {
            id: 'P274851_M1360935',
            text: 'Targus SafePORT Rugged',
            selected: false,
            count: 1,
          },
          {
            id: 'P274851_M1372634',
            text: 'Targus SafePORT Rugged Max Pro',
            selected: false,
            count: 1,
          },
          {
            id: 'P109961_M3828495',
            text: 'Targus Screen Protector for iPad Pro (10.5-inch)',
            selected: false,
            count: 1,
          },
          {
            id: 'P02290_M985748',
            text: 'Targus Sport Standard',
            selected: false,
            count: 1,
          },
          {
            id: 'P02290_M2902409',
            text: 'Targus Spy Guard Webcam Cover',
            selected: false,
            count: 1,
          },
          {
            id: 'P162502_M1369609',
            text: 'Targus Ultralite Backpack',
            selected: false,
            count: 1,
          },
          {
            id: 'P22593_M1769809',
            text: 'Targus Universal Laptop Charger',
            selected: false,
            count: 1,
          },
          {
            id: 'P22593_M1649909',
            text: 'Targus Universal Ultra-Slim Laptop Charger',
            selected: false,
            count: 1,
          },
          {
            id: 'P33128_M2160351',
            text: 'Targus Universal USB 3.0 DV4K Docking Station with Power',
            selected: false,
            count: 1,
          },
          {
            id: 'P33128_M3939196',
            text: 'Targus USB-C Multi-Function DisplayPort Alt. Mode Triple Video',
            selected: false,
            count: 1,
          },
          {
            id: 'P33128_M3939202',
            text: 'Targus USB-C Universal QUAD 4K (QV4K) Docking Station',
            selected: false,
            count: 1,
          },
          {
            id: 'P250157_M2491406',
            text: 'Targus VersaVu Classic',
            selected: false,
            count: 1,
          },
          {
            id: 'P250157_M3970716',
            text: 'Targus VersaVu Classic Case for iPad (7th gen.)10.2-inch, Air 10.5-inch, and Pro Black',
            selected: false,
            count: 1,
          },
          {
            id: 'P02290_M1972074',
            text: 'Targus Vertical',
            selected: false,
            count: 1,
          },
          {
            id: 'P378869_M2268599',
            text: 'Thule Subterra TSLB-315',
            selected: false,
            count: 1,
          },
          {
            id: 'P30931_NA',
            text: 'Transition Networks',
            selected: false,
            count: 1,
          },
          {
            id: 'P301119_M1863421',
            text: 'Tripp Lite 3U Rack Mount Tablet/iPad/Laptop Chrombook Storage Shelf',
            selected: false,
            count: 1,
          },
          {
            id: 'P31418_M2025323',
            text: 'Tripp Lite DC Power Supply 7A 120VAC to 13.8VDC AC Conversion',
            selected: false,
            count: 1,
          },
          {
            id: 'P301119_M2023127',
            text: 'Tripp Lite Dual Display Laptop Mount Monitor Stand Swivel Tilt Clamp 13" to 27" EA and Laptops up 15"',
            selected: false,
            count: 1,
          },
          {
            id: 'P52369_M2014934',
            text: 'Tripp Lite HDMI to VGA Adapter Converter for Ultrabook / Laptop Chromebook',
            selected: false,
            count: 1,
          },
          {
            id: 'P330754_M4095673',
            text: 'Tripp Lite Thunderbolt 3 Dock, Dual Display - 8K DisplayPort, USB 3.2 Gen 2, USB-A/C Hub, Memory Card, GbE, Black',
            selected: false,
            count: 1,
          },
          {
            id: 'P330754_M3968112',
            text: 'Tripp Lite Thunderbolt 3 Docking Station - 4K @ 60 Hz, HDMI, DisplayPort, USB 3.1 Gen 1, GbE, 40 Gb, Black',
            selected: false,
            count: 1,
          },
          {
            id: 'P330754_M2022185',
            text: 'Tripp Lite USB 3.0 Laptop Dual Head Dock Station HDMI DVI Video Audio RJ45 Ethernet',
            selected: false,
            count: 1,
          },
          {
            id: 'P330754_M3066877',
            text: 'Tripp Lite USB 3.1 Gen 1 USB-C Multiport Portable Hub/Adapter, 3 USB-A Ports and Gigabit Ethernet Port, Thunderbolt Compatible, Black, Type C',
            selected: false,
            count: 1,
          },
          {
            id: 'P330754_M3954733',
            text: 'Tripp Lite USB C Docking Station Adapter Converter 4K w/ HDMI Gigabit Ethernet USB-A Hub & PD Charging Thunderbolt 3 Compatible',
            selected: false,
            count: 1,
          },
          {
            id: 'P330754_M3020514',
            text: 'Tripp Lite USB C to HDMI Docking Station Adapter w/ USB-A Hub, USB-C PD Charging, Gigabit Ethernet Port, Type C, USB-C, TYpe-C',
            selected: false,
            count: 1,
          },
          {
            id: 'P330754_M3952857',
            text: 'Tripp Lite USB C to HDMI Multiport Video Adapter Converter w/ USB-A Hub, USB-C PD Charging Port & Gigabit Ethernet Port, Thunderbolt 3 Compatible Type HDMI, Type-C',
            selected: false,
            count: 1,
          },
          {
            id: 'P330754_M2910047',
            text: 'Tripp Lite USB C to HDMI Multiport Video Adapter Converter w/ USB-A Hub, USB-C PD Charging, Gigabit Ethernet Port, Type HDMI, Type-C',
            selected: false,
            count: 1,
          },
          {
            id: 'P302734_M3909102',
            text: 'UAG Rugged Case for iPad Mini (2019) & 4 - Metropolis Magma',
            selected: false,
            count: 1,
          },
          {
            id: 'P302734_M3893393',
            text: 'UAG Rugged Case for iPad Pro 12.9 (3rd Gen, 2018) - Scout Black',
            selected: false,
            count: 1,
          },
          {
            id: 'P345288_M3807883',
            text: 'UAG Rugged Case for MacBook Pro 13 (4th Gen) w/ or w/o TouchBar - Plasma Ice',
            selected: false,
            count: 1,
          },
          {
            id: 'P302734_M4092539',
            text: 'UAG Rugged Case for Microsoft Surface Go/2 w/Handstrap - Scout Black',
            selected: false,
            count: 1,
          },
          {
            id: 'P302734_M3958581',
            text: 'UAG Rugged Case for Microsoft Surface Pro X w/ Handstrap & Shoulder Strap - Plasma Ice',
            selected: false,
            count: 1,
          },
          {
            id: 'P345288_M2997350',
            text: 'UAG Rugged Case for Surface Book 2, Book, & with Performance Base, 13.5-inch Universal',
            selected: false,
            count: 1,
          },
          {
            id: 'P302734_M3973151',
            text: 'UAG Rugged Case for Surface Pro 7, 6, 5, LTE, 4 - Plyo Ice',
            selected: false,
            count: 1,
          },
          {
            id: 'P388271_M3802981',
            text: 'UAG Rugged Tempered Glass Screen Shield for Microsoft Surface Go',
            selected: false,
            count: 1,
          },
          {
            id: 'P454345_NA',
            text: 'Verbatim Corded Notebook Optical Mouse',
            selected: false,
            count: 1,
          },
          {
            id: 'P73366_M2057988',
            text: 'Verbatim Mini Travel Mouse Commuter Series',
            selected: false,
            count: 1,
          },
          {
            id: 'P376673_NA',
            text: 'Verbatim Wireless Tablet Multi-Trac Blue LED',
            selected: false,
            count: 1,
          },
          {
            id: 'P382174_NA',
            text: 'Veritas Desktop and Laptop Option',
            selected: false,
            count: 12,
          },
          {
            id: 'P390140_NA',
            text: 'Veritas Essential Support',
            selected: false,
            count: 6,
          },
          {
            id: 'P683311_NA',
            text: 'Veritas Verified Support',
            selected: false,
            count: 7,
          },
          {
            id: 'P51321_NA',
            text: 'WatchGuard',
            selected: false,
            count: 3,
          },
          {
            id: 'P661480_M3942891',
            text: 'WD TDSourcing Blue 3D NAND SATA SSD WDS500G2B0A',
            selected: false,
            count: 1,
          },
          {
            id: 'P469287_M4003850',
            text: 'WD TDSourcing Blue WD7500BPVX',
            selected: false,
            count: 1,
          },
          {
            id: 'P677794_M4024531',
            text: 'WD TDSourcing Green SSD WDS240G2G0A',
            selected: false,
            count: 1,
          },
          {
            id: 'P611655_M3963145',
            text: 'WD TDSourcing Red NAS Hard Drive WD10JFCX',
            selected: false,
            count: 1,
          },
        ],
      },
      {
        id: 'A00606',
        name: 'Header / Brand',
        originalGroupName: 'CNETAttributes',
        type: 'MultiSelect',
        range: {
          min: null,
          max: null,
        },
        options: [
          {
            id: 'K354478',
            text: '3M',
            selected: false,
            count: 20,
          },
          {
            id: 'K351888',
            text: 'Acer',
            selected: false,
            count: 10,
          },
          {
            id: 'K362337',
            text: 'AddOn',
            selected: false,
            count: 2,
          },
          {
            id: 'K351908',
            text: 'Apple',
            selected: false,
            count: 18,
          },
          {
            id: 'K430716',
            text: 'Aruba',
            selected: false,
            count: 2,
          },
          {
            id: 'K362343',
            text: 'Axiom',
            selected: false,
            count: 2,
          },
          {
            id: 'K361481',
            text: 'Belkin',
            selected: false,
            count: 1,
          },
          {
            id: 'K399584',
            text: 'Bretford',
            selected: false,
            count: 4,
          },
          {
            id: 'K403473',
            text: 'BTI',
            selected: false,
            count: 9,
          },
          {
            id: 'K396356',
            text: 'C2G',
            selected: false,
            count: 3,
          },
          {
            id: 'K364724',
            text: 'Case Logic',
            selected: false,
            count: 7,
          },
          {
            id: 'K354517',
            text: 'Cisco',
            selected: false,
            count: 1,
          },
          {
            id: 'K364746',
            text: 'CTA',
            selected: false,
            count: 9,
          },
          {
            id: 'K351961',
            text: 'Dell',
            selected: false,
            count: 90,
          },
          {
            id: 'K393230',
            text: 'Dell Wyse',
            selected: false,
            count: 1,
          },
          {
            id: 'K351966',
            text: 'Digi',
            selected: false,
            count: 1,
          },
          {
            id: 'K1053552',
            text: 'Dynabook Toshiba',
            selected: false,
            count: 4,
          },
          {
            id: 'K364796',
            text: 'Ergotron',
            selected: false,
            count: 6,
          },
          {
            id: 'K352000',
            text: 'Fujitsu',
            selected: false,
            count: 4,
          },
          {
            id: 'K427233',
            text: 'Gamber-Johnson',
            selected: false,
            count: 1,
          },
          {
            id: 'K366878',
            text: 'Griffin',
            selected: false,
            count: 5,
          },
          {
            id: 'K616545',
            text: 'Heckler Design',
            selected: false,
            count: 6,
          },
          {
            id: 'K352017',
            text: 'HP',
            selected: false,
            count: 80,
          },
          {
            id: 'K705546',
            text: 'HPE',
            selected: false,
            count: 3,
          },
          {
            id: 'K749100',
            text: 'HyperX',
            selected: false,
            count: 2,
          },
          {
            id: 'K354588',
            text: 'Intel',
            selected: false,
            count: 9,
          },
          {
            id: 'K556311',
            text: 'Juiced Systems',
            selected: false,
            count: 1,
          },
          {
            id: 'K361601',
            text: 'Kensington',
            selected: false,
            count: 19,
          },
          {
            id: 'K362363',
            text: 'Kingston',
            selected: false,
            count: 9,
          },
          {
            id: 'K352044',
            text: 'Lenovo',
            selected: false,
            count: 91,
          },
          {
            id: 'K352046',
            text: 'LG',
            selected: false,
            count: 3,
          },
          {
            id: 'K424589',
            text: 'Lind',
            selected: false,
            count: 1,
          },
          {
            id: 'K354618',
            text: 'Logitech',
            selected: false,
            count: 3,
          },
          {
            id: 'K412913',
            text: 'M-EDGE',
            selected: false,
            count: 2,
          },
          {
            id: 'K364620',
            text: 'Microsoft',
            selected: false,
            count: 54,
          },
          {
            id: 'K412922',
            text: 'Mobile Edge',
            selected: false,
            count: 2,
          },
          {
            id: 'K352070',
            text: 'MSI',
            selected: false,
            count: 5,
          },
          {
            id: 'K352100',
            text: 'Panasonic',
            selected: false,
            count: 17,
          },
          {
            id: 'K366935',
            text: 'Plugable',
            selected: false,
            count: 1,
          },
          {
            id: 'K362372',
            text: 'PNY',
            selected: false,
            count: 1,
          },
          {
            id: 'K413192',
            text: 'RAM',
            selected: false,
            count: 1,
          },
          {
            id: 'K433765',
            text: 'Ruckus',
            selected: false,
            count: 4,
          },
          {
            id: 'K352128',
            text: 'Samsung',
            selected: false,
            count: 7,
          },
          {
            id: 'K369760',
            text: 'Seagate',
            selected: false,
            count: 6,
          },
          {
            id: 'K369772',
            text: 'SonicWALL',
            selected: false,
            count: 2,
          },
          {
            id: 'K437467',
            text: 'SupCase',
            selected: false,
            count: 1,
          },
          {
            id: 'K365025',
            text: 'Targus',
            selected: false,
            count: 34,
          },
          {
            id: 'K431285',
            text: 'Thule',
            selected: false,
            count: 1,
          },
          {
            id: 'K352161',
            text: 'Toshiba',
            selected: false,
            count: 1,
          },
          {
            id: 'K431292',
            text: 'Transition Networks',
            selected: false,
            count: 1,
          },
          {
            id: 'K361759',
            text: 'Tripp Lite',
            selected: false,
            count: 12,
          },
          {
            id: 'K434070',
            text: 'UAG',
            selected: false,
            count: 3,
          },
          {
            id: 'K434349',
            text: 'Urban Armor Gear',
            selected: false,
            count: 5,
          },
          {
            id: 'K365056',
            text: 'Verbatim',
            selected: false,
            count: 3,
          },
          {
            id: 'K532016',
            text: 'VERITAS',
            selected: false,
            count: 25,
          },
          {
            id: 'K387742',
            text: 'WatchGuard',
            selected: false,
            count: 3,
          },
          {
            id: 'K369808',
            text: 'WD',
            selected: false,
            count: 5,
          },
        ],
      },
      {
        id: 'A00600',
        name: 'Header / Product Line',
        originalGroupName: 'CNETAttributes',
        type: 'MultiSelect',
        range: {
          min: null,
          max: null,
        },
        options: [
          {
            id: 'P176590',
            text: '3M',
            selected: false,
            count: 1,
          },
          {
            id: 'P259630',
            text: '3M',
            selected: false,
            count: 1,
          },
          {
            id: 'P353770',
            text: '3M Anti-Glare Filter',
            selected: false,
            count: 2,
          },
          {
            id: 'P458458',
            text: '3M Anti-Glare Filter',
            selected: false,
            count: 1,
          },
          {
            id: 'P112008',
            text: '3M Computer Stand',
            selected: false,
            count: 1,
          },
          {
            id: 'P458453',
            text: '3M Gold Privacy Filter',
            selected: false,
            count: 2,
          },
          {
            id: 'P474736',
            text: '3M High Clarity Privacy Filter',
            selected: false,
            count: 2,
          },
          {
            id: 'P238404',
            text: '3M Privacy Filter',
            selected: false,
            count: 10,
          },
          {
            id: 'P29354',
            text: 'Acer',
            selected: false,
            count: 1,
          },
          {
            id: 'P78742',
            text: 'Acer',
            selected: false,
            count: 1,
          },
          {
            id: 'P608640',
            text: 'Acer Chromebook Spin 13',
            selected: false,
            count: 1,
          },
          {
            id: 'P417424',
            text: 'Acer Swift 7',
            selected: false,
            count: 2,
          },
          {
            id: 'P02266',
            text: 'Acer TravelMate',
            selected: false,
            count: 4,
          },
          {
            id: 'P651317',
            text: 'Acer TravelMate X3',
            selected: false,
            count: 1,
          },
          {
            id: 'P262063',
            text: 'AddOn',
            selected: false,
            count: 1,
          },
          {
            id: 'P265534',
            text: 'AddOn',
            selected: false,
            count: 1,
          },
          {
            id: 'P29238',
            text: 'Apple',
            selected: false,
            count: 2,
          },
          {
            id: 'P29851',
            text: 'Apple',
            selected: false,
            count: 1,
          },
          {
            id: 'P132602',
            text: 'Apple MacBook',
            selected: false,
            count: 2,
          },
          {
            id: 'P164352',
            text: 'Apple MacBook Air',
            selected: false,
            count: 2,
          },
          {
            id: 'P124858',
            text: 'Apple MacBook Pro',
            selected: false,
            count: 2,
          },
          {
            id: 'P132603',
            text: 'Apple MagSafe',
            selected: false,
            count: 4,
          },
          {
            id: 'P308370',
            text: 'Apple Smart',
            selected: false,
            count: 5,
          },
          {
            id: 'P29592',
            text: 'Axiom',
            selected: false,
            count: 1,
          },
          {
            id: 'P40420',
            text: 'Axiom',
            selected: false,
            count: 1,
          },
          {
            id: 'P18099',
            text: 'Belkin',
            selected: false,
            count: 1,
          },
          {
            id: 'P100683',
            text: 'Bretford Basics',
            selected: false,
            count: 1,
          },
          {
            id: 'P267162',
            text: 'Bretford Basics 32 Unit Network Ready Laptop Cart',
            selected: false,
            count: 1,
          },
          {
            id: 'P642873',
            text: 'Bretford CoreX Charging Cart',
            selected: false,
            count: 1,
          },
          {
            id: 'P642871',
            text: 'Bretford Pulse 20L Charging Cart',
            selected: false,
            count: 1,
          },
          {
            id: 'P30011',
            text: 'BTI',
            selected: false,
            count: 9,
          },
          {
            id: 'P45563',
            text: 'C2G',
            selected: false,
            count: 2,
          },
          {
            id: 'P56580',
            text: 'C2G',
            selected: false,
            count: 1,
          },
          {
            id: 'P29916',
            text: 'Case Logic',
            selected: false,
            count: 5,
          },
          {
            id: 'P37112',
            text: 'Case Logic',
            selected: false,
            count: 1,
          },
          {
            id: 'P220504',
            text: 'Case Logic SLR Backpack',
            selected: false,
            count: 1,
          },
          {
            id: 'P29305',
            text: 'Cisco',
            selected: false,
            count: 1,
          },
          {
            id: 'P703437',
            text: 'CTA Digital',
            selected: false,
            count: 7,
          },
          {
            id: 'P150023',
            text: 'CTA Digital',
            selected: false,
            count: 1,
          },
          {
            id: 'P703438',
            text: 'CTA Digital',
            selected: false,
            count: 1,
          },
          {
            id: 'P25510',
            text: 'Dell',
            selected: false,
            count: 8,
          },
          {
            id: 'P32675',
            text: 'Dell',
            selected: false,
            count: 7,
          },
          {
            id: 'P28587',
            text: 'Dell',
            selected: false,
            count: 4,
          },
          {
            id: 'P32298',
            text: 'Dell',
            selected: false,
            count: 4,
          },
          {
            id: 'P46080',
            text: 'Dell',
            selected: false,
            count: 3,
          },
          {
            id: 'P46079',
            text: 'Dell',
            selected: false,
            count: 1,
          },
          {
            id: 'P01952',
            text: 'Dell Latitude',
            selected: false,
            count: 35,
          },
          {
            id: 'P21252',
            text: 'Dell Precision Mobile Workstation',
            selected: false,
            count: 7,
          },
          {
            id: 'P649251',
            text: 'Dell Pro',
            selected: false,
            count: 2,
          },
          {
            id: 'P469216',
            text: 'Dell TDSourcing',
            selected: false,
            count: 11,
          },
          {
            id: 'P469227',
            text: 'Dell TDSourcing',
            selected: false,
            count: 3,
          },
          {
            id: 'P474564',
            text: 'Dell TDSourcing',
            selected: false,
            count: 1,
          },
          {
            id: 'P474597',
            text: 'Dell TDSourcing',
            selected: false,
            count: 1,
          },
          {
            id: 'P474553',
            text: 'Dell TDSourcing E-Port',
            selected: false,
            count: 2,
          },
          {
            id: 'P275063',
            text: 'Dell Wyse',
            selected: false,
            count: 1,
          },
          {
            id: 'P134596',
            text: 'Dell XPS',
            selected: false,
            count: 1,
          },
          {
            id: 'P30896',
            text: 'Digi',
            selected: false,
            count: 1,
          },
          {
            id: 'P647975',
            text: 'Dynabook',
            selected: false,
            count: 1,
          },
          {
            id: 'P645639',
            text: 'Dynabook Toshiba Portégé',
            selected: false,
            count: 2,
          },
          {
            id: 'P645643',
            text: 'Dynabook Toshiba Tecra',
            selected: false,
            count: 2,
          },
          {
            id: 'P110224',
            text: 'Ergotron',
            selected: false,
            count: 1,
          },
          {
            id: 'P14056',
            text: 'Ergotron',
            selected: false,
            count: 1,
          },
          {
            id: 'P126107',
            text: 'Ergotron LX',
            selected: false,
            count: 1,
          },
          {
            id: 'P114985',
            text: 'Ergotron StyleView',
            selected: false,
            count: 1,
          },
          {
            id: 'P253425',
            text: 'Ergotron Universal Tablet Cradle',
            selected: false,
            count: 1,
          },
          {
            id: 'P237664',
            text: 'Ergotron WorkFit-S',
            selected: false,
            count: 1,
          },
          {
            id: 'P28640',
            text: 'Fujitsu',
            selected: false,
            count: 1,
          },
          {
            id: 'P29445',
            text: 'Fujitsu',
            selected: false,
            count: 1,
          },
          {
            id: 'P30082',
            text: 'Fujitsu',
            selected: false,
            count: 1,
          },
          {
            id: 'P30280',
            text: 'Fujitsu',
            selected: false,
            count: 1,
          },
          {
            id: 'P262999',
            text: 'Gamber-Johnson',
            selected: false,
            count: 1,
          },
          {
            id: 'P155803',
            text: 'Griffin',
            selected: false,
            count: 1,
          },
          {
            id: 'P247715',
            text: 'Griffin Survivor',
            selected: false,
            count: 4,
          },
          {
            id: 'P342201',
            text: 'Heckler',
            selected: false,
            count: 1,
          },
          {
            id: 'P636667',
            text: 'Heckler AV',
            selected: false,
            count: 2,
          },
          {
            id: 'P399057',
            text: 'Heckler WindFall',
            selected: false,
            count: 3,
          },
          {
            id: 'P469263',
            text: 'HGST TDSourcing Ultrastar C10K600',
            selected: false,
            count: 1,
          },
          {
            id: 'P88731',
            text: 'HP',
            selected: false,
            count: 6,
          },
          {
            id: 'P00171',
            text: 'HP',
            selected: false,
            count: 4,
          },
          {
            id: 'P29446',
            text: 'HP',
            selected: false,
            count: 2,
          },
          {
            id: 'P304883',
            text: 'HP Chromebook',
            selected: false,
            count: 1,
          },
          {
            id: 'P328285',
            text: 'HP Chromebox',
            selected: false,
            count: 1,
          },
          {
            id: 'P665163',
            text: 'HP Elite Dragonfly',
            selected: false,
            count: 6,
          },
          {
            id: 'P172291',
            text: 'HP EliteBook',
            selected: false,
            count: 17,
          },
          {
            id: 'P439445',
            text: 'HP EliteBook x360',
            selected: false,
            count: 11,
          },
          {
            id: 'P207533',
            text: 'HP Mobile Thin Client',
            selected: false,
            count: 1,
          },
          {
            id: 'P206315',
            text: 'HP ProBook',
            selected: false,
            count: 7,
          },
          {
            id: 'P430681',
            text: 'HP ProBook x360',
            selected: false,
            count: 1,
          },
          {
            id: 'P129019',
            text: 'HP Smart',
            selected: false,
            count: 2,
          },
          {
            id: 'P474547',
            text: 'HP TDSourcing',
            selected: false,
            count: 1,
          },
          {
            id: 'P644348',
            text: 'HP TDSourcing EliteBook',
            selected: false,
            count: 1,
          },
          {
            id: 'P653178',
            text: 'HP TDSourcing ProBook',
            selected: false,
            count: 1,
          },
          {
            id: 'P474548',
            text: 'HP TDSourcing Smart',
            selected: false,
            count: 3,
          },
          {
            id: 'P469649',
            text: 'HP Z VR',
            selected: false,
            count: 1,
          },
          {
            id: 'P304334',
            text: 'HP ZBook',
            selected: false,
            count: 11,
          },
          {
            id: 'P690178',
            text: 'HP ZBook Firefly',
            selected: false,
            count: 3,
          },
          {
            id: 'P382570',
            text: 'HPE',
            selected: false,
            count: 2,
          },
          {
            id: 'P388342',
            text: 'HPE Aruba',
            selected: false,
            count: 2,
          },
          {
            id: 'P474595',
            text: 'HPE TDSourcing Dual Port',
            selected: false,
            count: 1,
          },
          {
            id: 'P328129',
            text: 'HyperX Impact',
            selected: false,
            count: 2,
          },
          {
            id: 'P55958',
            text: 'Intel',
            selected: false,
            count: 5,
          },
          {
            id: 'P472465',
            text: 'Intel Optane',
            selected: false,
            count: 1,
          },
          {
            id: 'P474572',
            text: 'Intel TDSourcing',
            selected: false,
            count: 3,
          },
          {
            id: 'P460769',
            text: 'Juiced BizHUB',
            selected: false,
            count: 1,
          },
          {
            id: 'P29124',
            text: 'Kensington',
            selected: false,
            count: 3,
          },
          {
            id: 'P42268',
            text: 'Kensington',
            selected: false,
            count: 2,
          },
          {
            id: 'P239151',
            text: 'Kensington ClickSafe',
            selected: false,
            count: 2,
          },
          {
            id: 'P694915',
            text: 'Kensington ClickSafe 2.0 Keyed Lock for Wedge Shaped Slots',
            selected: false,
            count: 1,
          },
          {
            id: 'P45254',
            text: 'Kensington Contour Pro',
            selected: false,
            count: 1,
          },
          {
            id: 'P247904',
            text: 'Kensington Desktop and Peripherals',
            selected: false,
            count: 1,
          },
          {
            id: 'P109398',
            text: 'Kensington MicroSaver',
            selected: false,
            count: 2,
          },
          {
            id: 'P02063',
            text: 'Kensington MicroSaver',
            selected: false,
            count: 1,
          },
          {
            id: 'P685046',
            text: 'Kensington MP13 Magnetic Privacy Screen',
            selected: false,
            count: 1,
          },
          {
            id: 'P684348',
            text: 'Kensington N17 Combination Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'P229691',
            text: 'Kensington Privacy Screen',
            selected: false,
            count: 1,
          },
          {
            id: 'P213666',
            text: 'Kensington Pro Fit',
            selected: false,
            count: 1,
          },
          {
            id: 'P685045',
            text: 'Kensington Serialized Combination Laptop Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'P687961',
            text: 'Kensington WindFall Stand for Surface Go and Surface Go 2 (K67932US)',
            selected: false,
            count: 1,
          },
          {
            id: 'P29532',
            text: 'Kingston',
            selected: false,
            count: 2,
          },
          {
            id: 'P102929',
            text: 'Kingston',
            selected: false,
            count: 1,
          },
          {
            id: 'P644822',
            text: 'Kingston Data Center',
            selected: false,
            count: 3,
          },
          {
            id: 'P41204',
            text: 'Kingston ValueRAM',
            selected: false,
            count: 3,
          },
          {
            id: 'P128220',
            text: 'Lenovo',
            selected: false,
            count: 4,
          },
          {
            id: 'P128585',
            text: 'Lenovo',
            selected: false,
            count: 4,
          },
          {
            id: 'P128584',
            text: 'Lenovo',
            selected: false,
            count: 3,
          },
          {
            id: 'P131680',
            text: 'Lenovo',
            selected: false,
            count: 3,
          },
          {
            id: 'P132670',
            text: 'Lenovo',
            selected: false,
            count: 1,
          },
          {
            id: 'P290967',
            text: 'Lenovo',
            selected: false,
            count: 1,
          },
          {
            id: 'P640488',
            text: 'Lenovo 100e Chromebook (2nd Gen)',
            selected: false,
            count: 1,
          },
          {
            id: 'P644328',
            text: 'Lenovo 500e Chromebook (2nd Gen)',
            selected: false,
            count: 1,
          },
          {
            id: 'P474549',
            text: 'Lenovo TDSourcing',
            selected: false,
            count: 2,
          },
          {
            id: 'P474554',
            text: 'Lenovo TDSourcing ThinkPad',
            selected: false,
            count: 2,
          },
          {
            id: 'P474542',
            text: 'Lenovo TDSourcing ThinkPad',
            selected: false,
            count: 1,
          },
          {
            id: 'P109259',
            text: 'Lenovo ThinkPad',
            selected: false,
            count: 8,
          },
          {
            id: 'P108231',
            text: 'Lenovo ThinkPad',
            selected: false,
            count: 3,
          },
          {
            id: 'P108349',
            text: 'Lenovo ThinkPad',
            selected: false,
            count: 1,
          },
          {
            id: 'P108641',
            text: 'Lenovo ThinkPad',
            selected: false,
            count: 1,
          },
          {
            id: 'P665355',
            text: 'Lenovo ThinkPad E14',
            selected: false,
            count: 1,
          },
          {
            id: 'P665712',
            text: 'Lenovo ThinkPad E15',
            selected: false,
            count: 1,
          },
          {
            id: 'P667643',
            text: 'Lenovo ThinkPad L13',
            selected: false,
            count: 2,
          },
          {
            id: 'P686772',
            text: 'Lenovo ThinkPad L14 Gen 1',
            selected: false,
            count: 2,
          },
          {
            id: 'P686771',
            text: 'Lenovo ThinkPad L15 Gen 1',
            selected: false,
            count: 3,
          },
          {
            id: 'P656521',
            text: 'Lenovo ThinkPad P1 (2nd Gen)',
            selected: false,
            count: 7,
          },
          {
            id: 'P686535',
            text: 'Lenovo ThinkPad P15s Gen 1',
            selected: false,
            count: 1,
          },
          {
            id: 'P655056',
            text: 'Lenovo ThinkPad P43s',
            selected: false,
            count: 1,
          },
          {
            id: 'P655055',
            text: 'Lenovo ThinkPad P53',
            selected: false,
            count: 3,
          },
          {
            id: 'P652564',
            text: 'Lenovo ThinkPad P53s',
            selected: false,
            count: 1,
          },
          {
            id: 'P686533',
            text: 'Lenovo ThinkPad T14 Gen 1',
            selected: false,
            count: 2,
          },
          {
            id: 'P686774',
            text: 'Lenovo ThinkPad T14s Gen 1',
            selected: false,
            count: 1,
          },
          {
            id: 'P642125',
            text: 'Lenovo ThinkPad T490',
            selected: false,
            count: 3,
          },
          {
            id: 'P642127',
            text: 'Lenovo ThinkPad T490s',
            selected: false,
            count: 1,
          },
          {
            id: 'P650779',
            text: 'Lenovo ThinkPad T495s',
            selected: false,
            count: 1,
          },
          {
            id: 'P651626',
            text: 'Lenovo ThinkPad X1 Carbon (7th Gen)',
            selected: false,
            count: 5,
          },
          {
            id: 'P656748',
            text: 'Lenovo ThinkPad X1 Extreme (2nd Gen)',
            selected: false,
            count: 4,
          },
          {
            id: 'P640394',
            text: 'Lenovo ThinkPad X1 Tablet (3rd Gen)',
            selected: false,
            count: 2,
          },
          {
            id: 'P651625',
            text: 'Lenovo ThinkPad X1 Yoga (4th Gen)',
            selected: false,
            count: 4,
          },
          {
            id: 'P686776',
            text: 'Lenovo ThinkPad X1 Yoga Gen 5',
            selected: false,
            count: 3,
          },
          {
            id: 'P686782',
            text: 'Lenovo ThinkPad X13 Yoga Gen 1',
            selected: false,
            count: 3,
          },
          {
            id: 'P642124',
            text: 'Lenovo ThinkPad X390',
            selected: false,
            count: 2,
          },
          {
            id: 'P650778',
            text: 'Lenovo ThinkPad X395',
            selected: false,
            count: 2,
          },
          {
            id: 'P379076',
            text: 'LG gram',
            selected: false,
            count: 3,
          },
          {
            id: 'P256131',
            text: 'LIND',
            selected: false,
            count: 1,
          },
          {
            id: 'P28425',
            text: 'Logitech',
            selected: false,
            count: 2,
          },
          {
            id: 'P55200',
            text: 'Logitech',
            selected: false,
            count: 1,
          },
          {
            id: 'P285962',
            text: 'M-Edge',
            selected: false,
            count: 2,
          },
          {
            id: 'P286722',
            text: 'Microsoft',
            selected: false,
            count: 2,
          },
          {
            id: 'P306112',
            text: 'Microsoft',
            selected: false,
            count: 1,
          },
          {
            id: 'P375499',
            text: 'Microsoft Bluetooth Mobile Mouse',
            selected: false,
            count: 2,
          },
          {
            id: 'P625336',
            text: 'Microsoft Modern Mobile Mouse',
            selected: false,
            count: 1,
          },
          {
            id: 'P286106',
            text: 'Microsoft Surface',
            selected: false,
            count: 42,
          },
          {
            id: 'P452289',
            text: 'Microsoft Surface Arc Mouse',
            selected: false,
            count: 1,
          },
          {
            id: 'P606875',
            text: 'Microsoft Surface Mobile Mouse',
            selected: false,
            count: 1,
          },
          {
            id: 'P602801',
            text: 'Microsoft TDSourcing',
            selected: false,
            count: 1,
          },
          {
            id: 'P171933',
            text: 'Microsoft Wireless Mobile Mouse',
            selected: false,
            count: 3,
          },
          {
            id: 'P65382',
            text: 'Mobile Edge',
            selected: false,
            count: 2,
          },
          {
            id: 'P666871',
            text: 'MSI Creator 15M',
            selected: false,
            count: 1,
          },
          {
            id: 'P682613',
            text: 'MSI Creator 17',
            selected: false,
            count: 1,
          },
          {
            id: 'P682619',
            text: 'MSI GS75 10SFS',
            selected: false,
            count: 1,
          },
          {
            id: 'P596289',
            text: 'MSI GT63',
            selected: false,
            count: 1,
          },
          {
            id: 'P661224',
            text: 'MSI Modern 14',
            selected: false,
            count: 1,
          },
          {
            id: 'P29991',
            text: 'Panasonic',
            selected: false,
            count: 3,
          },
          {
            id: 'P28854',
            text: 'Panasonic',
            selected: false,
            count: 2,
          },
          {
            id: 'P29992',
            text: 'Panasonic',
            selected: false,
            count: 2,
          },
          {
            id: 'P01995',
            text: 'Panasonic Toughbook',
            selected: false,
            count: 10,
          },
          {
            id: 'P668163',
            text: 'Plugable TDSourcing',
            selected: false,
            count: 1,
          },
          {
            id: 'P208342',
            text: 'PNY',
            selected: false,
            count: 1,
          },
          {
            id: 'P254267',
            text: 'RAM Tab-Tite',
            selected: false,
            count: 1,
          },
          {
            id: 'P248574',
            text: 'Ruckus',
            selected: false,
            count: 4,
          },
          {
            id: 'P30445',
            text: 'Samsung',
            selected: false,
            count: 1,
          },
          {
            id: 'P594200',
            text: 'Samsung TDSourcing 850 EVO',
            selected: false,
            count: 1,
          },
          {
            id: 'P592865',
            text: 'Samsung TDSourcing 860 EVO',
            selected: false,
            count: 3,
          },
          {
            id: 'P601547',
            text: 'Samsung TDSourcing 860 PRO',
            selected: false,
            count: 1,
          },
          {
            id: 'P647857',
            text: 'Samsung TDSourcing SM883',
            selected: false,
            count: 1,
          },
          {
            id: 'P469288',
            text: 'Seagate TDSourcing Constellation.2',
            selected: false,
            count: 1,
          },
          {
            id: 'P469259',
            text: 'Seagate TDSourcing Enterprise Performance 10K HDD',
            selected: false,
            count: 2,
          },
          {
            id: 'P469296',
            text: 'Seagate TDSourcing Enterprise Performance 15K HDD',
            selected: false,
            count: 1,
          },
          {
            id: 'P683212',
            text: 'Seagate TDSourcing Exos 10E2400',
            selected: false,
            count: 1,
          },
          {
            id: 'P469281',
            text: 'Seagate TDSourcing Momentus Thin',
            selected: false,
            count: 1,
          },
          {
            id: 'P37042',
            text: 'SonicWall',
            selected: false,
            count: 2,
          },
          {
            id: 'P386106',
            text: 'SupCase Unicorn Beetle',
            selected: false,
            count: 1,
          },
          {
            id: 'P02290',
            text: 'Targus',
            selected: false,
            count: 6,
          },
          {
            id: 'P33128',
            text: 'Targus',
            selected: false,
            count: 3,
          },
          {
            id: 'P109961',
            text: 'Targus',
            selected: false,
            count: 2,
          },
          {
            id: 'P34458',
            text: 'Targus',
            selected: false,
            count: 1,
          },
          {
            id: 'P73272',
            text: 'Targus',
            selected: false,
            count: 1,
          },
          {
            id: 'P379731',
            text: 'Targus Bex II',
            selected: false,
            count: 1,
          },
          {
            id: 'P378258',
            text: 'Targus CityGear II',
            selected: false,
            count: 1,
          },
          {
            id: 'P139628',
            text: 'Targus CityLite',
            selected: false,
            count: 3,
          },
          {
            id: 'P355269',
            text: 'Targus CitySmart',
            selected: false,
            count: 1,
          },
          {
            id: 'P11564',
            text: 'Targus Corporate',
            selected: false,
            count: 1,
          },
          {
            id: 'P03644',
            text: 'Targus Defcon',
            selected: false,
            count: 1,
          },
          {
            id: 'P251656',
            text: 'Targus Drifter II',
            selected: false,
            count: 1,
          },
          {
            id: 'P164484',
            text: 'Targus Grove',
            selected: false,
            count: 1,
          },
          {
            id: 'P294550',
            text: 'Targus Intellect',
            selected: false,
            count: 1,
          },
          {
            id: 'P595732',
            text: 'Targus Newport',
            selected: false,
            count: 1,
          },
          {
            id: 'P94598',
            text: 'Targus Rolling',
            selected: false,
            count: 2,
          },
          {
            id: 'P274851',
            text: 'Targus SafePORT',
            selected: false,
            count: 2,
          },
          {
            id: 'P162502',
            text: 'Targus Ultralite',
            selected: false,
            count: 1,
          },
          {
            id: 'P22593',
            text: 'Targus Universal',
            selected: false,
            count: 2,
          },
          {
            id: 'P250157',
            text: 'Targus VersaVu',
            selected: false,
            count: 2,
          },
          {
            id: 'P378869',
            text: 'Thule Subterra',
            selected: false,
            count: 1,
          },
          {
            id: 'P30931',
            text: 'Transition Networks',
            selected: false,
            count: 1,
          },
          {
            id: 'P330754',
            text: 'Tripp Lite',
            selected: false,
            count: 8,
          },
          {
            id: 'P301119',
            text: 'Tripp Lite',
            selected: false,
            count: 2,
          },
          {
            id: 'P31418',
            text: 'Tripp Lite',
            selected: false,
            count: 1,
          },
          {
            id: 'P52369',
            text: 'Tripp Lite',
            selected: false,
            count: 1,
          },
          {
            id: 'P302734',
            text: 'UAG',
            selected: false,
            count: 5,
          },
          {
            id: 'P345288',
            text: 'UAG',
            selected: false,
            count: 2,
          },
          {
            id: 'P388271',
            text: 'UAG',
            selected: false,
            count: 1,
          },
          {
            id: 'P454345',
            text: 'Verbatim Corded Notebook Optical Mouse',
            selected: false,
            count: 1,
          },
          {
            id: 'P73366',
            text: 'Verbatim Mini Travel Mouse',
            selected: false,
            count: 1,
          },
          {
            id: 'P376673',
            text: 'Verbatim Wireless Tablet Multi-Trac Blue LED',
            selected: false,
            count: 1,
          },
          {
            id: 'P382174',
            text: 'Veritas Desktop and Laptop Option',
            selected: false,
            count: 12,
          },
          {
            id: 'P390140',
            text: 'Veritas Essential Support',
            selected: false,
            count: 6,
          },
          {
            id: 'P683311',
            text: 'Veritas Verified Support',
            selected: false,
            count: 7,
          },
          {
            id: 'P51321',
            text: 'WatchGuard',
            selected: false,
            count: 3,
          },
          {
            id: 'P469287',
            text: 'WD TDSourcing Blue',
            selected: false,
            count: 1,
          },
          {
            id: 'P661480',
            text: 'WD TDSourcing Blue 3D NAND SATA SSD',
            selected: false,
            count: 1,
          },
          {
            id: 'P677794',
            text: 'WD TDSourcing Green SSD',
            selected: false,
            count: 1,
          },
          {
            id: 'P611655',
            text: 'WD TDSourcing Red NAS Hard Drive',
            selected: false,
            count: 1,
          },
        ],
      },
      {
        id: 'A00601',
        name: 'Header / Model',
        originalGroupName: 'CNETAttributes',
        type: 'MultiSelect',
        range: {
          min: null,
          max: null,
        },
        options: [
          {
            id: 'M4048612',
            text: '035 Stealth',
            selected: false,
            count: 1,
          },
          {
            id: 'M1077140',
            text: '10.2" Netbook / iPad Attaché',
            selected: false,
            count: 1,
          },
          {
            id: 'M3927787',
            text: '1030 G4',
            selected: false,
            count: 2,
          },
          {
            id: 'M3909275',
            text: '1040 G6',
            selected: false,
            count: 5,
          },
          {
            id: 'M4048449',
            text: '11 G6',
            selected: false,
            count: 1,
          },
          {
            id: 'M4017026',
            text: '11A G8',
            selected: false,
            count: 1,
          },
          {
            id: 'M3930954',
            text: '13 7390 2-in-1',
            selected: false,
            count: 1,
          },
          {
            id: 'M712570',
            text: '13.3" Widescreen Laptop Privacy Screen',
            selected: false,
            count: 1,
          },
          {
            id: 'M3250187',
            text: '135W AC Adapter (Slim Tip)',
            selected: false,
            count: 1,
          },
          {
            id: 'M4080774',
            text: '14 G7 Mobile Workstation',
            selected: false,
            count: 1,
          },
          {
            id: 'M995472',
            text: '14.1" Widescreen Laptop Privacy Screen (16:9)',
            selected: false,
            count: 1,
          },
          {
            id: 'M614391',
            text: '14.1" Widescreen Notebook Privacy Filter',
            selected: false,
            count: 1,
          },
          {
            id: 'M3893106',
            text: '14u G6 Mobile Workstation',
            selected: false,
            count: 5,
          },
          {
            id: 'M4058111',
            text: '14Z90N-N.APS7U1',
            selected: false,
            count: 1,
          },
          {
            id: 'M3929755',
            text: '15 G6 Mobile Workstation',
            selected: false,
            count: 3,
          },
          {
            id: 'M4080481',
            text: '15 G7 Mobile Workstation',
            selected: false,
            count: 2,
          },
          {
            id: 'M3893427',
            text: '15u G6 Mobile Workstation',
            selected: false,
            count: 1,
          },
          {
            id: 'M3056862',
            text: '15v G5 Mobile Workstation',
            selected: false,
            count: 1,
          },
          {
            id: 'M1145661',
            text: '17.3" Widescreen Laptop Privacy Screen (16:9)',
            selected: false,
            count: 1,
          },
          {
            id: 'M183474',
            text: '17"',
            selected: false,
            count: 1,
          },
          {
            id: 'M887695',
            text: '17" Laptop Messenger Bag',
            selected: false,
            count: 1,
          },
          {
            id: 'M4057706',
            text: '17Z90N-N.APS8U1',
            selected: false,
            count: 1,
          },
          {
            id: 'M4057705',
            text: '17Z90N-N.APW9U1',
            selected: false,
            count: 1,
          },
          {
            id: 'M1486567',
            text: '1850',
            selected: false,
            count: 2,
          },
          {
            id: 'M1229709',
            text: '2',
            selected: false,
            count: 2,
          },
          {
            id: 'M3972317',
            text: '2.0 Universal Keyed Laptop Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'M1912018',
            text: '20',
            selected: false,
            count: 2,
          },
          {
            id: 'M3019900',
            text: '20KJ',
            selected: false,
            count: 2,
          },
          {
            id: 'M3861067',
            text: '20N2',
            selected: false,
            count: 3,
          },
          {
            id: 'M3906605',
            text: '20N6',
            selected: false,
            count: 1,
          },
          {
            id: 'M3899037',
            text: '20NL',
            selected: false,
            count: 2,
          },
          {
            id: 'M3861069',
            text: '20NX',
            selected: false,
            count: 1,
          },
          {
            id: 'M3861066',
            text: '20Q0',
            selected: false,
            count: 1,
          },
          {
            id: 'M3906604',
            text: '20QD',
            selected: false,
            count: 2,
          },
          {
            id: 'M3914906',
            text: '20QF',
            selected: false,
            count: 3,
          },
          {
            id: 'M3899039',
            text: '20QJ',
            selected: false,
            count: 1,
          },
          {
            id: 'M3916625',
            text: '20QN',
            selected: false,
            count: 3,
          },
          {
            id: 'M3920964',
            text: '20QT',
            selected: false,
            count: 7,
          },
          {
            id: 'M3921608',
            text: '20QV',
            selected: false,
            count: 4,
          },
          {
            id: 'M3962450',
            text: '20R1',
            selected: false,
            count: 3,
          },
          {
            id: 'M3972582',
            text: '20R3',
            selected: false,
            count: 2,
          },
          {
            id: 'M3960131',
            text: '20RA',
            selected: false,
            count: 1,
          },
          {
            id: 'M3962000',
            text: '20RD',
            selected: false,
            count: 1,
          },
          {
            id: 'M3916626',
            text: '20RH',
            selected: false,
            count: 1,
          },
          {
            id: 'M4064902',
            text: '20S0',
            selected: false,
            count: 2,
          },
          {
            id: 'M3962978',
            text: '20SA',
            selected: false,
            count: 1,
          },
          {
            id: 'M3973811',
            text: '20SC',
            selected: false,
            count: 1,
          },
          {
            id: 'M4065847',
            text: '20SX',
            selected: false,
            count: 3,
          },
          {
            id: 'M4065838',
            text: '20T0',
            selected: false,
            count: 1,
          },
          {
            id: 'M4064904',
            text: '20T4',
            selected: false,
            count: 1,
          },
          {
            id: 'M4065835',
            text: '20U3',
            selected: false,
            count: 1,
          },
          {
            id: 'M4065965',
            text: '20U5',
            selected: false,
            count: 2,
          },
          {
            id: 'M4065967',
            text: '20U7',
            selected: false,
            count: 2,
          },
          {
            id: 'M4065840',
            text: '20UB',
            selected: false,
            count: 3,
          },
          {
            id: 'M4058326',
            text: '25-Pack',
            selected: false,
            count: 1,
          },
          {
            id: 'M704899',
            text: '3 Prong AC Adapter',
            selected: false,
            count: 2,
          },
          {
            id: 'M2949918',
            text: '3 Prong AC Adapter',
            selected: false,
            count: 1,
          },
          {
            id: 'M26170',
            text: '31',
            selected: false,
            count: 1,
          },
          {
            id: 'M3913099',
            text: '3301',
            selected: false,
            count: 1,
          },
          {
            id: 'M889443',
            text: '3500',
            selected: false,
            count: 1,
          },
          {
            id: 'M3894898',
            text: '3540',
            selected: false,
            count: 1,
          },
          {
            id: 'M3903681',
            text: '3541',
            selected: false,
            count: 1,
          },
          {
            id: 'M4065207',
            text: '3551',
            selected: false,
            count: 1,
          },
          {
            id: 'M1851812',
            text: '3600',
            selected: false,
            count: 2,
          },
          {
            id: 'M1863421',
            text: '3U Rack Mount Tablet/iPad/Laptop Chrombook Storage Shelf',
            selected: false,
            count: 1,
          },
          {
            id: 'M3908890',
            text: '440 G5',
            selected: false,
            count: 1,
          },
          {
            id: 'M4000490',
            text: '440 G7',
            selected: false,
            count: 2,
          },
          {
            id: 'M1388031',
            text: '45W AC Adapter (Slim Tip)',
            selected: false,
            count: 1,
          },
          {
            id: 'M3895517',
            text: '5300',
            selected: false,
            count: 2,
          },
          {
            id: 'M3894941',
            text: '5300 2-in-1',
            selected: false,
            count: 2,
          },
          {
            id: 'M3895137',
            text: '5400',
            selected: false,
            count: 5,
          },
          {
            id: 'M3913087',
            text: '5401',
            selected: false,
            count: 2,
          },
          {
            id: 'M4067941',
            text: '5410',
            selected: false,
            count: 3,
          },
          {
            id: 'M4023294',
            text: '5470',
            selected: false,
            count: 1,
          },
          {
            id: 'M3950515',
            text: '55',
            selected: false,
            count: 6,
          },
          {
            id: 'M3967660',
            text: '55 Federal',
            selected: false,
            count: 1,
          },
          {
            id: 'M3895140',
            text: '5500',
            selected: false,
            count: 3,
          },
          {
            id: 'M3912610',
            text: '5501',
            selected: false,
            count: 3,
          },
          {
            id: 'M4067951',
            text: '5510',
            selected: false,
            count: 1,
          },
          {
            id: 'M3924140',
            text: '5540',
            selected: false,
            count: 2,
          },
          {
            id: 'M3899903',
            text: '640 G5',
            selected: false,
            count: 2,
          },
          {
            id: 'M3899902',
            text: '650 G5',
            selected: false,
            count: 3,
          },
          {
            id: 'M3322450',
            text: '65W 19V 4.7A Laptop Power Adapter for HP',
            selected: false,
            count: 1,
          },
          {
            id: 'M1438275',
            text: '65W AC Adapter (Slim Tip)',
            selected: false,
            count: 1,
          },
          {
            id: 'M3986973',
            text: '65W Slim AC Adapter (USB Type-C)',
            selected: false,
            count: 1,
          },
          {
            id: 'M3934377',
            text: '65W Standard AC Adapter (USB Type-C)',
            selected: false,
            count: 1,
          },
          {
            id: 'M3017570',
            text: '65W USB-C DC Travel Adapter',
            selected: false,
            count: 1,
          },
          {
            id: 'M3898338',
            text: '7200 2-in-1',
            selected: false,
            count: 2,
          },
          {
            id: 'M3895373',
            text: '7300',
            selected: false,
            count: 3,
          },
          {
            id: 'M3909276',
            text: '735 G6',
            selected: false,
            count: 1,
          },
          {
            id: 'M3895375',
            text: '7400',
            selected: false,
            count: 3,
          },
          {
            id: 'M3880136',
            text: '7400 2-in-1',
            selected: false,
            count: 2,
          },
          {
            id: 'M4077079',
            text: '7410',
            selected: false,
            count: 2,
          },
          {
            id: 'M3826225',
            text: '741727-001-BTI',
            selected: false,
            count: 1,
          },
          {
            id: 'M3909050',
            text: '745 G6',
            selected: false,
            count: 2,
          },
          {
            id: 'M3924142',
            text: '7540',
            selected: false,
            count: 2,
          },
          {
            id: 'M3853355',
            text: '81MA',
            selected: false,
            count: 1,
          },
          {
            id: 'M3870589',
            text: '81MC',
            selected: false,
            count: 1,
          },
          {
            id: 'M3892120',
            text: '830 G6',
            selected: false,
            count: 4,
          },
          {
            id: 'M3895108',
            text: '830 G6',
            selected: false,
            count: 1,
          },
          {
            id: 'M3942799',
            text: '840 G5',
            selected: false,
            count: 1,
          },
          {
            id: 'M3895110',
            text: '840 G6',
            selected: false,
            count: 5,
          },
          {
            id: 'M4073049',
            text: '840 G7',
            selected: false,
            count: 3,
          },
          {
            id: 'M3895109',
            text: '850 G6',
            selected: false,
            count: 3,
          },
          {
            id: 'M4073050',
            text: '850 G7',
            selected: false,
            count: 2,
          },
          {
            id: 'M1510534',
            text: '90W AC Adapter (Slim Tip)',
            selected: false,
            count: 1,
          },
          {
            id: 'M4067953',
            text: '9410 2-in-1',
            selected: false,
            count: 1,
          },
          {
            id: 'M4047288',
            text: 'A10M-1029',
            selected: false,
            count: 1,
          },
          {
            id: 'M4049195',
            text: 'A10SGS-254',
            selected: false,
            count: 1,
          },
          {
            id: 'M3899987',
            text: 'A50-EC',
            selected: false,
            count: 1,
          },
          {
            id: 'M4021773',
            text: 'A50-F1520',
            selected: false,
            count: 1,
          },
          {
            id: 'M4045282',
            text: 'A9SD-037',
            selected: false,
            count: 1,
          },
          {
            id: 'M3087765',
            text: 'ABG830 Portfolio',
            selected: false,
            count: 1,
          },
          {
            id: 'M3893384',
            text: 'Alienware Area-51m 17.3" Elite Backpack',
            selected: false,
            count: 1,
          },
          {
            id: 'M3871118',
            text: 'Alienware Vindicator 14" or 17" Messenger Bag',
            selected: false,
            count: 1,
          },
          {
            id: 'M1560247',
            text: 'All-Terrain',
            selected: false,
            count: 2,
          },
          {
            id: 'M4131242',
            text: 'Angle-Adjustable Locking Desktop Stand',
            selected: false,
            count: 1,
          },
          {
            id: 'M3978433',
            text: 'AP-AC2-48C',
            selected: false,
            count: 1,
          },
          {
            id: 'M2949916',
            text: 'Auto/Air/DC Adapter',
            selected: false,
            count: 1,
          },
          {
            id: 'M214022',
            text: 'AX',
            selected: false,
            count: 1,
          },
          {
            id: 'M829681',
            text: 'AX',
            selected: false,
            count: 1,
          },
          {
            id: 'M1369609',
            text: 'Backpack',
            selected: false,
            count: 1,
          },
          {
            id: 'M2951256',
            text: 'Backpack G1 Dock',
            selected: false,
            count: 1,
          },
          {
            id: 'M3001281',
            text: 'Basic Docking Station',
            selected: false,
            count: 1,
          },
          {
            id: 'M4039863',
            text: 'Battery 61',
            selected: false,
            count: 1,
          },
          {
            id: 'M1228381',
            text: 'Battery 67+',
            selected: false,
            count: 1,
          },
          {
            id: 'M1390743',
            text: 'Battery 68',
            selected: false,
            count: 1,
          },
          {
            id: 'M1938765',
            text: 'Battery 71+',
            selected: false,
            count: 1,
          },
          {
            id: 'M1889088',
            text: 'Battery 77+',
            selected: false,
            count: 1,
          },
          {
            id: 'M2945594',
            text: 'Book 2',
            selected: false,
            count: 2,
          },
          {
            id: 'M4064597',
            text: 'Book 3',
            selected: false,
            count: 5,
          },
          {
            id: 'M2160734',
            text: 'Briefcase',
            selected: false,
            count: 1,
          },
          {
            id: 'M3059330',
            text: 'CA06XL-BTI',
            selected: false,
            count: 1,
          },
          {
            id: 'M2929110',
            text: 'Cargo Backpack with Battery',
            selected: false,
            count: 1,
          },
          {
            id: 'M918709',
            text: 'CF-AA5713AM',
            selected: false,
            count: 1,
          },
          {
            id: 'M918714',
            text: 'CF-VEB311U',
            selected: false,
            count: 1,
          },
          {
            id: 'M1832238',
            text: 'CF-VEB541AU',
            selected: false,
            count: 1,
          },
          {
            id: 'M1958830',
            text: 'CF-VPF31U',
            selected: false,
            count: 1,
          },
          {
            id: 'M1091361',
            text: 'CF-VZSU71U',
            selected: false,
            count: 1,
          },
          {
            id: 'M3245074',
            text: 'Checkout Stand',
            selected: false,
            count: 1,
          },
          {
            id: 'M2491406',
            text: 'Classic',
            selected: false,
            count: 1,
          },
          {
            id: 'M3970716',
            text: 'Classic Case for iPad (7th gen.)10.2-inch, iPad Air 10.5-inch, and iPad Pro 10.5-inch, Black',
            selected: false,
            count: 1,
          },
          {
            id: 'M1127995',
            text: 'Combination Laptop Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'M1932166',
            text: 'Combination Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'M1127701',
            text: 'Combination Ultra Laptop Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'M3873012',
            text: 'Commercial Grade Case',
            selected: false,
            count: 1,
          },
          {
            id: 'M2929111',
            text: 'Commuter Backpack with Battery',
            selected: false,
            count: 1,
          },
          {
            id: 'M2057988',
            text: 'Commuter Series',
            selected: false,
            count: 1,
          },
          {
            id: 'M3238133',
            text: 'CP713-1WN-55HT',
            selected: false,
            count: 1,
          },
          {
            id: 'M1245210',
            text: 'CPU Lock Kit',
            selected: false,
            count: 1,
          },
          {
            id: 'M557049',
            text: 'CS100MB',
            selected: false,
            count: 1,
          },
          {
            id: 'M2028245',
            text: 'CS900',
            selected: false,
            count: 1,
          },
          {
            id: 'M1587828',
            text: 'D3100',
            selected: false,
            count: 1,
          },
          {
            id: 'M2025323',
            text: 'DC Power Supply 7A 120VAC to 13.8VDC AC to DC Conversion',
            selected: false,
            count: 1,
          },
          {
            id: 'M3968301',
            text: 'DC450R',
            selected: false,
            count: 1,
          },
          {
            id: 'M3874658',
            text: 'DC500M',
            selected: false,
            count: 2,
          },
          {
            id: 'M3020772',
            text: 'Docking Station',
            selected: false,
            count: 1,
          },
          {
            id: 'M1296854',
            text: 'DS Cable Lock From Lenovo',
            selected: false,
            count: 1,
          },
          {
            id: 'M2023127',
            text: 'Dual Display Laptop Mount Monitor Stand Swivel Tilt Clamp 13" to 27" EA and Laptops up to 15"',
            selected: false,
            count: 1,
          },
          {
            id: 'M4131145',
            text: 'Dual Security Kiosk Stand with Locking Case',
            selected: false,
            count: 1,
          },
          {
            id: 'M3259869',
            text: 'Endurance',
            selected: false,
            count: 1,
          },
          {
            id: 'M2972179',
            text: 'Enterprise',
            selected: false,
            count: 1,
          },
          {
            id: 'M3804596',
            text: 'Essential Compact',
            selected: false,
            count: 1,
          },
          {
            id: 'M3842444',
            text: 'Essential Sleeve 13',
            selected: false,
            count: 1,
          },
          {
            id: 'M3867863',
            text: 'Essentials',
            selected: false,
            count: 1,
          },
          {
            id: 'M2078074',
            text: 'EVA Pro',
            selected: false,
            count: 1,
          },
          {
            id: 'M2063891',
            text: 'Extender Box',
            selected: false,
            count: 1,
          },
          {
            id: 'M2100522',
            text: 'Extreme',
            selected: false,
            count: 1,
          },
          {
            id: 'M3811109',
            text: 'Folio',
            selected: false,
            count: 2,
          },
          {
            id: 'M3952337',
            text: 'for 11.6" Widescreen Laptop with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'M2080527',
            text: 'for 12.5" Widescreen Laptop',
            selected: false,
            count: 1,
          },
          {
            id: 'M1172222',
            text: 'for 13" Apple MacBook Air',
            selected: false,
            count: 1,
          },
          {
            id: 'M4058327',
            text: 'for 13" MacBook Air 2018 & MacBook Pro 2016 & Later',
            selected: false,
            count: 1,
          },
          {
            id: 'M2080526',
            text: 'for 14" Widescreen Laptop',
            selected: false,
            count: 1,
          },
          {
            id: 'M3952334',
            text: 'for 15.0" Standard Laptop with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'M3952375',
            text: 'for 15.6" Laptop with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'M930862',
            text: 'for 15.6" Laptops',
            selected: false,
            count: 1,
          },
          {
            id: 'M3952357',
            text: 'for 15.6" Widescreen Laptop with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'M1578959',
            text: 'for 15" Apple MacBook Pro with Retina Display',
            selected: false,
            count: 1,
          },
          {
            id: 'M3952339',
            text: 'for Apple Macbook Pro 13" (2016 model or newer) with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'M3952373',
            text: 'for Apple MacBook Pro 13" (2016 or newer) with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'M3952352',
            text: 'for Apple Macbook Pro 15" (2016 model or newer) with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'M3952341',
            text: 'for Dell Latitude 7480 with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'M3952322',
            text: 'for Edge-to-Edge 12.5" Full Screen Laptop with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'M3952343',
            text: 'for Edge-to-Edge 13.3" Full Screen Laptop with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'M3952330',
            text: 'for Edge-to-Edge 15.6" Full Screen Laptop with COMPLY Attachment System',
            selected: false,
            count: 1,
          },
          {
            id: 'M3261608',
            text: 'for Google Pixelbook',
            selected: false,
            count: 1,
          },
          {
            id: 'M2899613',
            text: 'for Microsoft Surface Pro 3/4',
            selected: false,
            count: 1,
          },
          {
            id: 'M4055445',
            text: 'for Wedge-Shaped Slots',
            selected: false,
            count: 1,
          },
          {
            id: 'M4054774',
            text: 'FP156W9 Privacy Screen for 15.6" Laptops (16:9)',
            selected: false,
            count: 1,
          },
          {
            id: 'M3951267',
            text: 'FZ-VNP551U',
            selected: false,
            count: 1,
          },
          {
            id: 'M3046391',
            text: 'G2',
            selected: false,
            count: 1,
          },
          {
            id: 'M3105718',
            text: 'Go',
            selected: false,
            count: 3,
          },
          {
            id: 'M4064680',
            text: 'Go 2',
            selected: false,
            count: 2,
          },
          {
            id: 'M3327522',
            text: 'H6Y88UT#ABA-BTI',
            selected: false,
            count: 1,
          },
          {
            id: 'M2014934',
            text: 'HDMI to VGA Adapter Converter for Ultrabook / Laptop Chromebook',
            selected: false,
            count: 1,
          },
          {
            id: 'M4131168',
            text: 'Heavy-Duty Gooseneck Clamp Stand',
            selected: false,
            count: 1,
          },
          {
            id: 'M4131215',
            text: 'Heavy-Duty Gooseneck Floor Stand',
            selected: false,
            count: 1,
          },
          {
            id: 'M4131185',
            text: 'Heavy-Duty Security Pole Clamp',
            selected: false,
            count: 1,
          },
          {
            id: 'M1188552',
            text: 'HP-PB4530SX6',
            selected: false,
            count: 1,
          },
          {
            id: 'M2901841',
            text: 'HP-PB455G3',
            selected: false,
            count: 1,
          },
          {
            id: 'M3857304',
            text: 'HUC106030CSS600',
            selected: false,
            count: 1,
          },
          {
            id: 'M1883391',
            text: 'Hybrid Messenger',
            selected: false,
            count: 1,
          },
          {
            id: 'M3968875',
            text: 'KC600',
            selected: false,
            count: 1,
          },
          {
            id: 'M996991',
            text: 'Keyed Cable Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'M994348',
            text: 'Keyed Laptop Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'M128015',
            text: 'KL',
            selected: false,
            count: 1,
          },
          {
            id: 'M3328894',
            text: 'Laptop 2',
            selected: false,
            count: 2,
          },
          {
            id: 'M3939268',
            text: 'Laptop 3',
            selected: false,
            count: 16,
          },
          {
            id: 'M1085646',
            text: 'Laptop Backpack',
            selected: false,
            count: 1,
          },
          {
            id: 'M1769809',
            text: 'Laptop Charger',
            selected: false,
            count: 1,
          },
          {
            id: 'M2025759',
            text: 'Latitude Rugged DisplayPort Desk Dock',
            selected: false,
            count: 1,
          },
          {
            id: 'M4131156',
            text: 'Locking Tablet Mount and USB Hub',
            selected: false,
            count: 1,
          },
          {
            id: 'M1091894',
            text: 'M185',
            selected: false,
            count: 1,
          },
          {
            id: 'M1175473',
            text: 'M187',
            selected: false,
            count: 1,
          },
          {
            id: 'M2949909',
            text: 'Main Battery Pack',
            selected: false,
            count: 1,
          },
          {
            id: 'M86251',
            text: 'Master-keyed',
            selected: false,
            count: 1,
          },
          {
            id: 'M1305319',
            text: 'MDMLAP20NR-CTAL Network Ready MDM Laptop Cart',
            selected: false,
            count: 1,
          },
          {
            id: 'M1575962',
            text: 'MDMLAP32NR',
            selected: false,
            count: 1,
          },
          {
            id: 'M2908539',
            text: 'Meeting Room Console',
            selected: false,
            count: 1,
          },
          {
            id: 'M1127994',
            text: 'Mid-Size',
            selected: false,
            count: 1,
          },
          {
            id: 'M1891399',
            text: 'Midline',
            selected: false,
            count: 2,
          },
          {
            id: 'M2925071',
            text: 'mt21',
            selected: false,
            count: 1,
          },
          {
            id: 'M3046063',
            text: 'MZ-75E250',
            selected: false,
            count: 1,
          },
          {
            id: 'M3077740',
            text: 'MZ-76E1T0B',
            selected: false,
            count: 1,
          },
          {
            id: 'M3963131',
            text: 'MZ-76E2T0E',
            selected: false,
            count: 1,
          },
          {
            id: 'M3012674',
            text: 'MZ-76E500B',
            selected: false,
            count: 1,
          },
          {
            id: 'M3974994',
            text: 'MZ-76P256E',
            selected: false,
            count: 1,
          },
          {
            id: 'M3942801',
            text: 'MZ7KH480HAHQ',
            selected: false,
            count: 1,
          },
          {
            id: 'M3327027',
            text: 'NGGX5-BTI',
            selected: false,
            count: 1,
          },
          {
            id: 'M2972119',
            text: 'non-PFC AC Adapter',
            selected: false,
            count: 1,
          },
          {
            id: 'M1557009',
            text: 'OptiPlex Micro Vertical Stand',
            selected: false,
            count: 1,
          },
          {
            id: 'M3069217',
            text: 'P2410-G2-M-55HN',
            selected: false,
            count: 1,
          },
          {
            id: 'M3104766',
            text: 'P2510-G2-M-56AT',
            selected: false,
            count: 1,
          },
          {
            id: 'M3901932',
            text: 'P614-51-50FJ',
            selected: false,
            count: 1,
          },
          {
            id: 'M3902003',
            text: 'P614-51-7294',
            selected: false,
            count: 1,
          },
          {
            id: 'M1170337',
            text: 'PA1580-1642',
            selected: false,
            count: 1,
          },
          {
            id: 'M3887769',
            text: 'Performance Dock WD19DC',
            selected: false,
            count: 1,
          },
          {
            id: 'M1073981',
            text: 'PF14.0W',
            selected: false,
            count: 1,
          },
          {
            id: 'M2972126',
            text: 'Plus',
            selected: false,
            count: 2,
          },
          {
            id: 'M3872528',
            text: 'Powered USB-C Travel Hub',
            selected: false,
            count: 1,
          },
          {
            id: 'M4056002',
            text: 'Prelude Pro Recycle Top Load',
            selected: false,
            count: 1,
          },
          {
            id: 'M1934438',
            text: 'Premier Sleeve (L)',
            selected: false,
            count: 1,
          },
          {
            id: 'M2258318',
            text: 'Premier Sleeve 13',
            selected: false,
            count: 1,
          },
          {
            id: 'M485265',
            text: 'Primary Battery',
            selected: false,
            count: 5,
          },
          {
            id: 'M2972103',
            text: 'Primary Battery',
            selected: false,
            count: 3,
          },
          {
            id: 'M1378598',
            text: 'Pro',
            selected: false,
            count: 1,
          },
          {
            id: 'M1927689',
            text: 'Pro',
            selected: false,
            count: 1,
          },
          {
            id: 'M3896374',
            text: 'Pro',
            selected: false,
            count: 1,
          },
          {
            id: 'M3328893',
            text: 'Pro 6',
            selected: false,
            count: 2,
          },
          {
            id: 'M3939267',
            text: 'Pro 7',
            selected: false,
            count: 4,
          },
          {
            id: 'M3859429',
            text: 'Pro Backpack',
            selected: false,
            count: 1,
          },
          {
            id: 'M3857828',
            text: 'Pro Backpack 17',
            selected: false,
            count: 1,
          },
          {
            id: 'M3860753',
            text: 'Pro Briefcase 15',
            selected: false,
            count: 1,
          },
          {
            id: 'M3001283',
            text: 'Pro Docking Station',
            selected: false,
            count: 1,
          },
          {
            id: 'M3330194',
            text: 'Pro Premium Convertible',
            selected: false,
            count: 1,
          },
          {
            id: 'M3958001',
            text: 'Pro X',
            selected: false,
            count: 5,
          },
          {
            id: 'M1468478',
            text: 'Professional Backpack',
            selected: false,
            count: 1,
          },
          {
            id: 'M1371621',
            text: 'RAM-HOL-TAB19U',
            selected: false,
            count: 1,
          },
          {
            id: 'M1360935',
            text: 'Rugged',
            selected: false,
            count: 1,
          },
          {
            id: 'M3246879',
            text: 'Rugged Case',
            selected: false,
            count: 1,
          },
          {
            id: 'M3909102',
            text: 'Rugged Case for iPad Mini (2019) & iPad Mini 4 - Metropolis Magma',
            selected: false,
            count: 1,
          },
          {
            id: 'M3893393',
            text: 'Rugged Case for iPad Pro 12.9 (3rd Gen, 2018) - Scout Black',
            selected: false,
            count: 1,
          },
          {
            id: 'M3807883',
            text: 'Rugged Case for MacBook Pro 13 (4th Gen) w/ or w/o TouchBar - Plasma Ice',
            selected: false,
            count: 1,
          },
          {
            id: 'M4092539',
            text: 'Rugged Case for Microsoft Surface Go/2 w/Handstrap - Scout Black',
            selected: false,
            count: 1,
          },
          {
            id: 'M3958581',
            text: 'Rugged Case for Microsoft Surface Pro X w/ Handstrap & Shoulder Strap - Plasma Ice',
            selected: false,
            count: 1,
          },
          {
            id: 'M2997350',
            text: 'Rugged Case for Surface Book 2, Surface Book, & Surface Book with Performance Base, 13.5-inch Universal Case',
            selected: false,
            count: 1,
          },
          {
            id: 'M3973151',
            text: 'Rugged Case for Surface Pro 7, Pro 6, Pro 5, Pro LTE, Pro 4 - Plyo Ice',
            selected: false,
            count: 1,
          },
          {
            id: 'M1372634',
            text: 'Rugged Max Pro',
            selected: false,
            count: 1,
          },
          {
            id: 'M3802981',
            text: 'Rugged Tempered Glass Screen Shield for Microsoft Surface Go',
            selected: false,
            count: 1,
          },
          {
            id: 'M1159554',
            text: 'S Pen',
            selected: false,
            count: 1,
          },
          {
            id: 'M947395',
            text: 'Screen Protector',
            selected: false,
            count: 1,
          },
          {
            id: 'M3828495',
            text: 'Screen Protector for iPad Pro (10.5-inch)',
            selected: false,
            count: 1,
          },
          {
            id: 'M4058311',
            text: 'SD2400T Thunderbolt 3 40Gbps Dual 4K Nano Dock with 135W Adapter - Win/Mac',
            selected: false,
            count: 1,
          },
          {
            id: 'M3953547',
            text: 'SD5550T Thunderbolt 3 Dock for Windows and Mac',
            selected: false,
            count: 1,
          },
          {
            id: 'M334788',
            text: 'Security Cable Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'M4131271',
            text: 'Security Case with Kickstand and Anti-Theft Cable',
            selected: false,
            count: 1,
          },
          {
            id: 'M4131206',
            text: 'Security Tabletop and Wall',
            selected: false,
            count: 1,
          },
          {
            id: 'M3057540',
            text: 'SF714-51T-M4PV',
            selected: false,
            count: 1,
          },
          {
            id: 'M3241976',
            text: 'SF714-51T-M871',
            selected: false,
            count: 1,
          },
          {
            id: 'M2084022',
            text: 'Sleeve 13',
            selected: false,
            count: 1,
          },
          {
            id: 'M2083941',
            text: 'Sleeve 15',
            selected: false,
            count: 1,
          },
          {
            id: 'M870441',
            text: 'Slim',
            selected: false,
            count: 3,
          },
          {
            id: 'M2949908',
            text: 'Slim',
            selected: false,
            count: 1,
          },
          {
            id: 'M1362776',
            text: 'Slim Combo Adapter with USB',
            selected: false,
            count: 1,
          },
          {
            id: 'M1911729',
            text: 'SN03XL',
            selected: false,
            count: 1,
          },
          {
            id: 'M3020782',
            text: 'Solid-State Drive 320 Series',
            selected: false,
            count: 1,
          },
          {
            id: 'M3243705',
            text: 'Solid-State Drive D3-S4510 Series',
            selected: false,
            count: 2,
          },
          {
            id: 'M3240296',
            text: 'Solid-State Drive D3-S4610 Series',
            selected: false,
            count: 1,
          },
          {
            id: 'M2918334',
            text: 'Solid-State Drive DC P4510 Series',
            selected: false,
            count: 1,
          },
          {
            id: 'M3092031',
            text: 'Solid-State Drive DC P4610 Series',
            selected: false,
            count: 1,
          },
          {
            id: 'M2972153',
            text: 'Solid-State Drive DC S3510 Series',
            selected: false,
            count: 1,
          },
          {
            id: 'M3020780',
            text: 'Solid-State Drive DC S3610 Series',
            selected: false,
            count: 1,
          },
          {
            id: 'M985748',
            text: 'Sport Standard',
            selected: false,
            count: 1,
          },
          {
            id: 'M2902409',
            text: 'Spy Guard Webcam Cover',
            selected: false,
            count: 1,
          },
          {
            id: 'M3065900',
            text: 'SSD 905P Series',
            selected: false,
            count: 1,
          },
          {
            id: 'M4051126',
            text: 'ST1200MM0009',
            selected: false,
            count: 1,
          },
          {
            id: 'M3020852',
            text: 'ST320LT020',
            selected: false,
            count: 1,
          },
          {
            id: 'M2949981',
            text: 'ST600MM0006',
            selected: false,
            count: 1,
          },
          {
            id: 'M3870688',
            text: 'ST900MM0006',
            selected: false,
            count: 1,
          },
          {
            id: 'M2950065',
            text: 'ST91000640SS',
            selected: false,
            count: 1,
          },
          {
            id: 'M2950097',
            text: 'ST9300653SS',
            selected: false,
            count: 1,
          },
          {
            id: 'M2948009',
            text: 'Stand Prime',
            selected: false,
            count: 1,
          },
          {
            id: 'M2270663',
            text: 'Standard Keyed Locking Kit 2.0',
            selected: false,
            count: 1,
          },
          {
            id: 'M3060969',
            text: 'Studio G5 Mobile Workstation',
            selected: false,
            count: 1,
          },
          {
            id: 'M4066410',
            text: 'Surface 127W Power Supply',
            selected: false,
            count: 1,
          },
          {
            id: 'M4003883',
            text: 'Surface 44W Power Supply',
            selected: false,
            count: 1,
          },
          {
            id: 'M1878580',
            text: 'Surface 65W Power Supply',
            selected: false,
            count: 1,
          },
          {
            id: 'M1487432',
            text: 'Survivor Harness Kit',
            selected: false,
            count: 1,
          },
          {
            id: 'M1878011',
            text: 'Tablet Cart, SV10',
            selected: false,
            count: 1,
          },
          {
            id: 'M1026889',
            text: 'Tablet/Document Holder',
            selected: false,
            count: 1,
          },
          {
            id: 'M4024428',
            text: 'Thunderbolt 3 Dock',
            selected: false,
            count: 1,
          },
          {
            id: 'M4095673',
            text: 'Thunderbolt 3 Dock, Dual Display - 8K DisplayPort, USB 3.2 Gen 2, USB-A/C Hub, Memory Card, GbE, Black',
            selected: false,
            count: 1,
          },
          {
            id: 'M3968112',
            text: 'Thunderbolt 3 Docking Station - 4K @ 60 Hz, HDMI, DisplayPort, USB 3.1 Gen 1, GbE, 40 Gb, Black',
            selected: false,
            count: 1,
          },
          {
            id: 'M4013070',
            text: 'Thunderbolt 3 Essential Dock',
            selected: false,
            count: 1,
          },
          {
            id: 'M2075170',
            text: 'Thunderbolt 3 Express Dock HD',
            selected: false,
            count: 1,
          },
          {
            id: 'M3058153',
            text: 'Thunderbolt Dock G2',
            selected: false,
            count: 1,
          },
          {
            id: 'M3055258',
            text: 'Thunderbolt Dock TB16',
            selected: false,
            count: 2,
          },
          {
            id: 'M1463223',
            text: 'Tiny 65W AC Adapter (Slim Tip)',
            selected: false,
            count: 1,
          },
          {
            id: 'M3045961',
            text: 'Titan-046',
            selected: false,
            count: 1,
          },
          {
            id: 'M3257024',
            text: 'TMX3410-M-5608',
            selected: false,
            count: 1,
          },
          {
            id: 'M3961156',
            text: 'TNEO-108',
            selected: false,
            count: 1,
          },
          {
            id: 'M3984089',
            text: 'Travel Hub G2',
            selected: false,
            count: 1,
          },
          {
            id: 'M649590',
            text: 'Traveler Backpack',
            selected: false,
            count: 1,
          },
          {
            id: 'M2268599',
            text: 'TSLB-315',
            selected: false,
            count: 1,
          },
          {
            id: 'M2934728',
            text: 'Twisted Steel Security Cable Lock',
            selected: false,
            count: 1,
          },
          {
            id: 'M3817147',
            text: 'Type-C AC Adapter',
            selected: false,
            count: 1,
          },
          {
            id: 'M3975010',
            text: 'UD-CAM',
            selected: false,
            count: 1,
          },
          {
            id: 'M1649909',
            text: 'Ultra-Slim Laptop Charger',
            selected: false,
            count: 1,
          },
          {
            id: 'M1272254',
            text: 'Universal USB 3.0 Docking Station',
            selected: false,
            count: 1,
          },
          {
            id: 'M2160351',
            text: 'Universal USB 3.0 DV4K Docking Station with Power',
            selected: false,
            count: 1,
          },
          {
            id: 'M2022185',
            text: 'USB 3.0 Laptop Dual Head Dock Station HDMI DVI Video Audio USB RJ45 Ethernet',
            selected: false,
            count: 1,
          },
          {
            id: 'M3066877',
            text: 'USB 3.1 Gen 1 USB-C Multiport Portable Hub/Adapter, 3 USB-A Ports and Gigabit Ethernet Port, Thunderbolt 3 Compatible, Black, USB Type C',
            selected: false,
            count: 1,
          },
          {
            id: 'M4101941',
            text: 'USB C Dock with 4K HDMI, Ethernet, USB & Power Delivery up to 60W',
            selected: false,
            count: 1,
          },
          {
            id: 'M4101939',
            text: 'USB C Dock with HDMI, VGA, Ethernet, USB, SD & Power Delivery up to 100W',
            selected: false,
            count: 1,
          },
          {
            id: 'M3954733',
            text: 'USB C Docking Station Adapter Converter 4K w/ HDMI Gigabit Ethernet USB-A Hub & PD Charging Thunderbolt 3 Compatible',
            selected: false,
            count: 1,
          },
          {
            id: 'M3020514',
            text: 'USB C to HDMI Docking Station Adapter w/ USB-A Hub, USB-C PD Charging, Gigabit Ethernet Port, USB Type C, USB-C, USB TYpe-C',
            selected: false,
            count: 1,
          },
          {
            id: 'M3952857',
            text: 'USB C to HDMI Multiport Video Adapter Converter w/ USB-A Hub, USB-C PD Charging Port & Gigabit Ethernet Port, Thunderbolt 3 Compatible USB Type C to HDMI, USB Type-C',
            selected: false,
            count: 1,
          },
          {
            id: 'M2910047',
            text: 'USB C to HDMI Multiport Video Adapter Converter w/ USB-A Hub, USB-C PD Charging, Gigabit Ethernet Port, USB Type C to HDMI, USB Type-C',
            selected: false,
            count: 1,
          },
          {
            id: 'M2065321',
            text: 'USB C to HDMI or VGA Audio/Video Adapter Kit for Apple MacBook',
            selected: false,
            count: 1,
          },
          {
            id: 'M1786249',
            text: 'USB-C',
            selected: false,
            count: 2,
          },
          {
            id: 'M3924460',
            text: 'USB-C 7-in-1 Hub',
            selected: false,
            count: 1,
          },
          {
            id: 'M3878618',
            text: 'USB-C Dock Gen 2',
            selected: false,
            count: 1,
          },
          {
            id: 'M2264666',
            text: 'USB-C G2',
            selected: false,
            count: 1,
          },
          {
            id: 'M3939196',
            text: 'USB-C Multi-Function DisplayPort Alt. Mode Triple Video',
            selected: false,
            count: 1,
          },
          {
            id: 'M2157712',
            text: 'USB-C Travel Hub',
            selected: false,
            count: 1,
          },
          {
            id: 'M4064870',
            text: 'USB-C Travel Hub',
            selected: false,
            count: 1,
          },
          {
            id: 'M3939202',
            text: 'USB-C Universal QUAD 4K (QV4K) Docking Station',
            selected: false,
            count: 1,
          },
          {
            id: 'M1161158',
            text: 'Vehicle Docking Station',
            selected: false,
            count: 1,
          },
          {
            id: 'M1972074',
            text: 'Vertical',
            selected: false,
            count: 1,
          },
          {
            id: 'M4049786',
            text: 'Wall Mount plus Power',
            selected: false,
            count: 1,
          },
          {
            id: 'M3963145',
            text: 'WD10JFCX',
            selected: false,
            count: 1,
          },
          {
            id: 'M4003850',
            text: 'WD7500BPVX',
            selected: false,
            count: 1,
          },
          {
            id: 'M4024531',
            text: 'WDS240G2G0A',
            selected: false,
            count: 1,
          },
          {
            id: 'M3942891',
            text: 'WDS500G2B0A',
            selected: false,
            count: 1,
          },
          {
            id: 'M3810659',
            text: 'with Retina display',
            selected: false,
            count: 2,
          },
          {
            id: 'M2082023',
            text: 'with Touch Bar',
            selected: false,
            count: 2,
          },
          {
            id: 'M1620797',
            text: 'WM615',
            selected: false,
            count: 1,
          },
          {
            id: 'M4077994',
            text: 'Workstation Dock',
            selected: false,
            count: 1,
          },
          {
            id: 'M3932379',
            text: 'X30-F',
            selected: false,
            count: 1,
          },
          {
            id: 'M3936600',
            text: 'X30-F1331',
            selected: false,
            count: 1,
          },
        ],
      },
    ],
    categoryBreadcrumb: null,
    hasMoreRefinements: true,
    territories: ['CAM', 'CARB', 'LAEX', 'PRVI', 'USA', 'USTP'],
    sortingOptions: [
      {
        id: 'RELEVANCE',
        selected: true,
        name: 'Best Match',
      },
      {
        id: 'STOCK',
        selected: false,
        name: 'Stock - High to Low',
      },
      {
        id: 'PRICE.True',
        selected: false,
        name: 'Price - High to Low',
      },
      {
        id: 'PRICE.False',
        selected: false,
        name: 'Price - Low to High',
      },
      {
        id: 'POPULARITY',
        selected: false,
        name: 'Most Popular',
      },
    ],
    itemsPerPageOptions: [
      {
        id: 25,
        selected: true,
        name: '25',
      },
      {
        id: 50,
        selected: false,
        name: '50',
      },
      {
        id: 100,
        selected: false,
        name: '100',
      },
    ],
    orderLevels: [
      {
        id: 'Commercial',
        selected: true,
        name: 'Commercial (Non-Govt)',
      },
      {
        id: 'EduHigher',
        selected: false,
        name: 'Education (Higher)',
      },
      {
        id: 'EduK12',
        selected: false,
        name: 'Education (K-12)',
      },
      {
        id: 'GovtFederal',
        selected: false,
        name: 'Federal',
      },
      {
        id: 'GovtState',
        selected: false,
        name: 'State',
      },
      {
        id: 'Medical',
        selected: false,
        name: 'Medical',
      },
    ],
    isLoggedIn: true,
  };
  res.json(response);
});