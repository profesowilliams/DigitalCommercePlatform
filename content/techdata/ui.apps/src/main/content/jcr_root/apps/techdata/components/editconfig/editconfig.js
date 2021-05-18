"use strict";
use(function () {

  var jsonObject = {};
  var internalEndPoint = null;
  var externalEndPoint = null;

  if (properties) {
    jsonObject["label"] = properties["title"];

    if (properties["placeholderText"]) {
      jsonObject["placeholderText"] = properties["placeholderText"];
    }

    jsonObject["buttonTitle"] = properties["buttonLabel"];

    if (properties["buttonLinkExternal"]) {
      externalEndPoint = properties["buttonLinkExternal"];
    }

    if (properties["buttonLinkInternal"]) {
      internalEndPoint = properties["buttonLinkInternal"];
    }

    jsonObject["endPoint"] = properties["buttonLinkType"] === 'external' ? externalEndPoint : internalEndPoint;
    jsonObject["ignoreSalesOrganization"] = properties["ignoreSalesOrganization"];
    jsonObject["isDefault"] = properties["isDefault"];
  }

  return {
    properties: JSON.stringify(jsonObject)
  };
});
