"use strict";
use(function () {
  var jsonObject = new Packages.org.json.JSONObject();

  var listValues = [];
  var resourceResolver = resource.getResourceResolver();

  var node = resourceResolver.getResource(
    currentNode.getPath() + "/labelLinks"
  );

  if (node !== null) {
    var childrenList = node.getChildren();

    for (var [key, res] in Iterator(childrenList)) {
      var orderLabel = res.properties["orderLabel"];
      var orderKey = res.properties["orderKey"];
      var itemData = {};
      itemData.label = orderLabel;
      itemData.key = orderKey;
      listValues.push(itemData);
    }
  }
  if (properties.get("label") != null) {
    jsonObject.put("label", properties.get("label"));
  }

  if (properties.get("daysLabel") != null) {
    jsonObject.put("daysLabel", properties.get("daysLabel"));
  }

  if (this.uiServiceDomain != null) {
    jsonObject.put(
      "endpoint",
      this.uiServiceDomain + this.myConfigurationsEndpoint
    );
  }

  if (listValues != null) {
    jsonObject.put("orderLabels", listValues);
  }
  return {
    listValues: jsonObject.toString(),
  };
});
