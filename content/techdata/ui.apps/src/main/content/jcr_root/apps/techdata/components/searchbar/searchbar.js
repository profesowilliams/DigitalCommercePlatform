"use strict";
use(function () {
  var jsonObject = new Packages.org.json.JSONObject();

  var resourceResolver = resource.getResourceResolver();

  if (properties.get("id") != null) {
      jsonObject.put("id", properties.get("id"));
  }

  if (properties.get("placeholder") != null) {
    jsonObject.put("placeholder", properties.get("placeholder"));
  }

  jsonObject.put("typeAheadSearchEndpoint", this.typeAheadSearchEndpoint);

  var areaListNode = resourceResolver.getResource(currentNode.getPath() + "/areaList");

  if (areaListNode !== null) {
    var childrenList = areaListNode.getChildren();
    var jsonArray = new Packages.org.json.JSONArray();

    for (var [key, res] in Iterator(childrenList)) {
      var area = res.properties["area"];
      var areaLabel = res.properties["areaLabel"];

      var areaconfig = new Packages.org.json.JSONObject();

      areaconfig.put("areaLabel", areaLabel);
      areaconfig.put("area", area);
      areaconfig.put("endpoint", this[area + 'SearchEndpoint']);

      jsonArray.put(areaconfig);
    }

    jsonObject.put("areaList", jsonArray);
  }

  return {
      configJson: jsonObject.toString()
  };
});
