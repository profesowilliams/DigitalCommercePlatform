const express = require('express')
const fileUpload = require('express-fileupload');
const app = express()
const port = 3000
const { URLSearchParams } = require('url');
const fetch = require('node-fetch');
const encodedParams = new URLSearchParams();
var bodyParser = require('body-parser');
var dateFormat = require("dateformat");
var now = new Date();
var codeValue = "DYSjfUsN1GIOMnQt-YITfti0w9APbRTDPwcAAABk";

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function checkCreds(user, pass) {
  return user in { "admin": "admin", "user": "temp", "bru": "temp" } && pass in { "admin": "admin", "pass": "temp", "123": "temp" };
}


app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, TraceId, Consumer, SessionId, Accept-Language, Site');
  res.header('Consumer', '*');
  res.header('SessionId', '*');
  res.header('Accept-Language', '*');
  res.header('Site', '*');
  res.header('TraceId', '*');


  // "TraceId" : "NA",
  //     "Site": "NA",
  //     "Accept-Language" : "en-us",
  //     "Consumer" : "NA",
  //     "SessionId" : nanoid(16),
  //     "Content-Type": "application/json"

  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.send(200);
  }
  else {
    //move on
    next();
  }
});

app.use('/', express.static('public'));



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
  res.type('application/json');

  if (checkCreds(userid, password)) {
    res.redirect(redirect + "?code=" + codeValue);
  } else {
    // res.send({"userid" : req.body.userid, "password" : req.body.password, auth : checkCreds(userid, password)})
    // res.render('<h1>error</h1>');
    // res.write("<h1>error</h1>");


    res.set("Content-Type", "text/html");
    res.write('<html>');
    res.write('<head> <title> Hello TutorialsPoint </title> </head>');
    res.write(' <body><div id="notfound" style="position: relative;height: 100vh;"><div class="notfound" style="max-width: 920px;width: 100%;line-height: 1.4;text-align: center;padding-left: 15px;padding-right: 15px;position: absolute; left: 50%;top: 50%;transform: translate(-50%, -50%);"><div class="notfound-404" style="position: absolute;height: 100px;top: 0;left: 50%;-webkit-transform: translateX(-50%);-ms-transform: translateX(-50%);transform: translateX(-50%);z-index: -1;"></div><h2 style="font-family:sans-serif;font-size: 46px;color: #000;font-weight: 900;text-transform: uppercase;margin: 0px;">We are sorry, User not found!</h2><p style="font-family: sans-serif;font-size: 16px;color: #000;font-weight: 400;text-transform: uppercase;margin-top: 15px;"></p><a href="http://localhost:8080/signin" style="font-family: sans-serif;font-size: 14px;text-decoration: none;text-transform: uppercase;background: #189cf0;display: inline-block;padding: 16px 38px;border: 2px solid transparent;border-radius: 40px;color: #fff;font-weight: 400;-webkit-transition: 0.2s all;transition: 0.2s all;">Back To Homepage</a></div></div></body>');
    res.write('</html>');
    //write end to mark it as stop for node js response.
    res.end();
  }



});

app.get("/success", function (req, res) {
  res.json({ message: "success" })
});

app.get("/masthead", function (req, res) {
  let resJson = {
    "user": null,
    "cart": {
      "count": 2,
      "items": []
    },
    "links": {
      "home": "http://localhost:3000/auth"
    }
  }
  res.json(resJson)
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
    "content": {
      "user": {
        "id": "516514",
        "firstName": "DAYNA Local Server",
        "lastName": "KARAPHILLIS",
        "name": "DAYNA KARAPHILLIS",
        "email": "SHI@cstenet.com",
        "phone": "9999999971",
        "companyName": "SHI International",
        "customers": ["0038048612", "0009000325"],
        "customersV2":[
          {"number":"0038048612","name":"Company 0"},
          {"number":"0009000325","name":"Company 1"},
          {"number":"0038048612","name":"Company 2"}
        ],
        "roles": []
      }
    }, "error": { "code": 0, "messages": [], "isError": false }
  };

  let resJsonFail = {
    "isError": true,
    "user": null
  }

  if (code === codeValue) {
    res.json(resJsonSuccess)
  } else {
    res.json(resJsonFail);
  }

});

app.options("/*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


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
      formattedAmount: random.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ".0",
      currencyCode: 'USD',
    })
  }
  const response = {
    content: {
      summary: {
        items: items
      },
    },
    error: {
      code: 0,
      message: [],
      isError: false,
    },
  };

  res.json(response)
});

app.get("/quote/MyQuote", function (req, res) {
  const code = req.query.code;

  if (!req.headers['sessionid'])
    return res.status(401)

  res.json({
    "content": {
      "items": {
        "converted": "31.49%",
        "open": 38,
        "quoteToOrder": "3:1",
        "activeQuoteValue": 6251968.0,
        "currencyCode": "USD",
        "currencySymbol": "$",
        "formattedAmount": "6,251,968"
      }
    },
    "error": {
      "code": "",
      "message": "",
      "isError": false
    }
  })
});
app.get("/quote/create/:cart", function (req, res) {
  const code = req.query.code;
  const cart = req.params.cart;


  res.json({
    "content": {
      "quoteDetails": {
        "shipTo": {
          "name": "Sis Margaret's Inc",
          "line1": "Wade Wilson",
          "line2": "9071",
          "line3": "Santa Monica Blvd",
          "city": "West Hollywood",
          "state": "CA",
          "zip": "90069",
          "country": "United States",
          "email": "dpool@sismargarets.com"
        },
        "endUser": {
          "name": "Stark Enterprises",
          "line1": "Tony Stark",
          "line2": "10880 ",
          "line3": "Malibu Point",
          "city": "Malibu",
          "state": "CA",
          "zip": "90069",
          "country": "United States",
          "email": "dpool@sismargarets.com"
        },
        "generalInfo": {
          "configId": "12345!",
          "dealId": "hello",
          "tier": "hello",
          "reference": ""
        },
        "notes": "Descrption of Internal Notes",
        "details": [
          {
            "id": "IN00000053",
            "parent": "TR123YU6653",
            "description": "Description of the Product is very good",
            "quantity": 53,
            "unitPrice": 53,
            "totalPrice": 53,
            "currency": "USD",
            "msrp": 53,
            "invoice": "IHT128763K0987",
            "shortDescription": "Product Description",
            "mfrNumber": "PUT9845011123",
            "tdNumber": "ITW398765243",
            "upcNumber": "924378465",
            "unitListPrice": "2489.00",
            "extendedPrice": "2349.00",
            "availability": "53",
            "rebateValue": "53",
            "urlProductImage": "https://Product/Image",
            "urlProductSpecs": "https://Product/details"
          },
          {
            "id": "IN00000053",
            "parent": "TR123YU6653",
            "description": "Description of the Product is very good",
            "quantity": 53,
            "unitPrice": 53,
            "totalPrice": 53,
            "currency": "USD",
            "msrp": 53,
            "invoice": "IHT128763K0987",
            "shortDescription": "Product Description",
            "mfrNumber": "PUT9845011123",
            "tdNumber": "ITW398765243",
            "upcNumber": "924378465",
            "unitListPrice": "2489.00",
            "extendedPrice": "2349.00",
            "availability": "53",
            "rebateValue": "53",
            "urlProductImage": "https://Product/Image",
            "urlProductSpecs": "https://Product/details"
          },
          {
            "id": "IN00000036",
            "parent": "TR123YU6636",
            "description": "Description of the Product is very good",
            "quantity": 36,
            "unitPrice": 36,
            "totalPrice": 36,
            "currency": "USD",
            "msrp": 36,
            "invoice": "IHT128763K0987",
            "shortDescription": "Product Description",
            "mfrNumber": "PUT9845011123",
            "tdNumber": "ITW398765243",
            "upcNumber": "924378465",
            "unitListPrice": "2489.00",
            "extendedPrice": "2349.00",
            "availability": "36",
            "rebateValue": "36",
            "urlProductImage": "https://Product/Image",
            "urlProductSpecs": "https://Product/details"
          }
        ],
        "quoteNumber": "TIW77755701",
        "orderNumber": "NQL3339019538",
        "poNumber": "PO12760",
        "endUserPO": "EPO50142",
        "poDate": "12/04/2020"
      }
    },
    "error": {
      "code": "",
      "message": "",
      "isError": false
    }
  })
});
app.get("/activeCart", function (req, res) {
  if (!req.headers['sessionid'])
    return res.status(500).json({
      "error":{
        "code":200, 
        "message":"",
        "isError":false 
      }
    });

  res.json({ 
    "content":{
      "data":{
        "source":{
        "salesOrg":"0100,1002",
        "system":"Shop"
      },
      "lines":[
        {
          "lineNo":"100",
          "parentLineNo":null, 
          "productId":"13641675",
          "quantity":1
        }, 
        { 
          "lineNo":"200",
          "parentLineNo":null, 
          "productId":"11337383",
          "quantity":1
        },
        {
          "lineNo":"300",
          "parentLineNo":null,
          "productId":"11357376",
          "quantity":1
        },
        {
          "lineNo":"400",
          "parentLineNo":null,
          "productId":"11456989",
          "quantity":1
        }
      ],
      "totalQuantity":4
      }
    },
    "error":{
      "code":200, 
      "message":"",
      "isError":false 
    }
  })
});

app.get("/configurationsSummary/get", function (req, res) {

  if (!req.headers['sessionid'])
    return res.status(401).json({ "error":{ 
      "code":0, 
      "messages":[], 
      "isError":false
    } });

  res.json({
    "content":{ 
        "summary":{ 
        "quoted":14, 
        "unQuoted":30, 
        "oldConfigurations":25, 
        "currencyCode":null 
      } 
    }, 
    "error":{ 
      "code":0, 
      "messages":[], 
      "isError":false
    } 
  });
});
//---MY RENEWALS MOCK API---//
app.get("/ui-account/v1/getRenewals", function (req, res) {
  const param = req.query.days || '30,60,90';
  const items = [];
  function getRandom(maxValue) {
    return Math.floor(Math.random() * maxValue);
  }
  for (let i = 0; i < param.split(',').length + 1; i++) {
    items.push({
      value: getRandom(100),
    })
  }
  const response = {
    content: {
      items: items
    },
    error: {
      code: 0,
      message: [],
      isError: false,
    },
  };
  res.json(response)
});

app.get("/dealsSummary", function (req, res) {
  if (!req.headers['sessionid'])
    return res.status(500).json({
      "error": {
        "code": 0,
        "message": [],
        "isError": true
      }
    })

  res.json({
    "content": {
      "items": [
        { "value": 5 },
        { "value": 15 },
        { "value": 20 },
      ]
    },
    "error": {
      "code": 0,
      "message": [],
      "isError": false
    }
  });
});
