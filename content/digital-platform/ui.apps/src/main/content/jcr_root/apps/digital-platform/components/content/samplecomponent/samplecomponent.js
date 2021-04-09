"use strict";
use(['../../../helpers/http-helper.js'], function (client) {
  var method = resource.properties["method"];
  var response = "";

  if (method === "post") {
    response = client.post(resource.properties["url"], resource.properties["json"])
  } else {
    response = client.get(resource.properties["url"])
  };

  return {
    response: response,
  };
});
