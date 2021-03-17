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

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function checkCreds(user, pass)
{
    return user in {"user" : "temp", "bru" : "temp"} && pass in {"pass" : "temp", "123" : "temp"} ;
}


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  next();
});

app.use('/', express.static('public'));



app.post("/auth", function(req, res){

  let userid = req.body.userid;
  let password = req.body.password;
  let redirect = req.query.redirect;

  console.log("post submit");
  console.log(req.body);
  console.log(userid);
  console.log(password);
  console.log(redirect);



  res.append("custom" , "value");
  res.type('application/json');

  if (checkCreds(userid, password))
  {
    res.redirect(redirect + "?code=1234567890000");
  }else{
    res.send({"userid" : req.body.userid, "password" : req.body.password, auth : checkCreds(userid, password)})
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
  let redirectUrl = req.body.redirectUrl;
  let applicationName = req.body.applicationName;

  console.log("post submit");
  console.log(req.body);
  console.log(code);
  console.log(redirectUrl);
  console.log(applicationName);

  let resJsonSuccess = {
    "isError" : false,

    "user" : {
      "id" : "616154",
      "firstName" : "Brumoon",
      "lastName" : "Ahamat",
      "name" : "Brumoon Ahamat",
      "email" : "brumoon.ahamat@techdata.com",
      "phone" : "1234567890",
      "customers" : [
          "123456"
      ]
    },
    "roles": []
  }

  let resJsonFail = {
    "isError" : true,
    "user" : null
  }

  if (code === "1234567890000")
  {
    res.json(resJsonSuccess)
  }else{
    res.json(resJsonFail);
  }

  res.json(resJson)
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
