"use strict";
use(function () {

  var jsonObject = {};
  var internalEndPoint = null;
  var externalEndPoint = null;

  if(this.uiServiceDomain != null && this.punchOutEndpoint !== null){
    jsonObject["punchOutEndpoint"] = this.uiServiceDomain+this.punchOutEndpoint;
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
    jsonObject["errorTitle"] = properties["errorTitle"];
    jsonObject["error404Message"] = properties["error404Message"];
    jsonObject["error428Message"] = properties["error428Message"];
    jsonObject["errorGenericMessage"] = properties["errorGenericMessage"];

  }

  return {
    properties: JSON.stringify(jsonObject)
  };
});
