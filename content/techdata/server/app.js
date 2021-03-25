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

// View engine setup
// app.set('view engine', 'html');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function checkCreds(user, pass)
{
    return user in {"admin" : "admin","user" : "temp", "bru" : "temp"} && pass in {"admin" : "admin", "pass" : "temp", "123" : "temp"} ;
}


app.use(function(req, res, next) {
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



app.post("/auth", function(req, res){

  let userid = req.body.userid;
  let password = req.body.password;
  let redirect = req.query.redirect_uri;

  console.log("post submit");
  console.log(req.query);
  console.log(req.body);
  console.log(userid);
  console.log(password);
  console.log(redirect);



  res.append("custom" , "value");
  res.type('application/json');

  if (checkCreds(userid, password))
  {
    res.redirect(redirect + "?code="+codeValue);
  }else{
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

app.get("/success", function(req, res){
  res.json({message: "success"})
});

app.get("/masthead", function(req, res){
  let resJson = {
    "user" : null,
    "cart" : {
      "count" : 2,
      "items" : []
    },
    "links" : {
      "home" : "http://localhost:3000/auth"
    }
  }
  res.json(resJson)
});

app.post("/login", function(req, res){

  let code = req.body.code;
  let redirectUrl = req.body.RedirectUri;
  let applicationName = req.body.applicationName;

  console.log("post submit");
  console.log(req.body);
  console.log(code);
  console.log(redirectUrl);
  console.log(applicationName);


  let resJsonSuccess = {
      "isError": false,
      "user": {
          "id": "516514",
          "firstName": "DAYNA bru",
          "lastName": "KARAPHILLIS",
          "name": "DAYNA KARAPHILLIS",
          "email": "SHI@cstenet.com",
          "phone": "9999999971",
          "customers": [
              "0038048612"
  ],
          "roles": []
  }
  }

  let resJsonFail = {
    "isError" : true,
    "user" : null
  }

  if (code === codeValue)
  {
    res.json(resJsonSuccess)
  }else{
    res.json(resJsonFail);
  }

});

app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
