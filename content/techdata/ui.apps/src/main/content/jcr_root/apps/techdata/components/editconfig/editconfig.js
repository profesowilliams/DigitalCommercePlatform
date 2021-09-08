"use strict";
use(function () {

  var jsonObject = {};
  var internalEndPoint = null;
  var externalEndPoint = null;

  if(this.uiServiceDomain != null && this.puchOutEndpoint !== null){
    jsonObject["puchOutEndpoint"] = this.uiServiceDomain+this.puchOutEndpoint;
  }

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

    jsonObject["endpoint"] = properties["buttonLinkType"] === 'external' ? externalEndPoint : internalEndPoint;
    jsonObject["ignoreSalesOrganization"] = properties["ignoreSalesOrganization"];
    jsonObject["isDefault"] = properties["isDefault"];
    jsonObject["criteria"] = properties["criteria"];

  }

  return {
    properties: JSON.stringify(jsonObject)
  };
});
