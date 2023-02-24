use(function () {
  const ANALYTICS_CATEGORY_PN = "analyticsCategory";
  var itemJson = this.data;
  var parentId = this.parent;
  var output = new Packages.org.json.JSONObject();
  var uuid = java.util.UUID.randomUUID().toString().split("-", 0)[0];
  var alertId = "alertaction-" + uuid;
  output.put(alertId, new Packages.org.json.JSONObject());
  var keyJson = JSON.parse(output.toString());

  var keys = Object.keys(keyJson);
  if (keys && keys.length > 0) {
    var firstKey = keys[0];
    output.getJSONObject(firstKey).put("@type", "alertcarousel-alert-action");
    output.getJSONObject(firstKey).put("dc:title", itemJson.title);
    output.getJSONObject(firstKey).put("xdm:linkURL", itemJson.linkUrl);
    output.getJSONObject(firstKey).put("parentId", parentId);
    if (properties.get(ANALYTICS_CATEGORY_PN) != null) {
      output.getJSONObject(firstKey).put(ANALYTICS_CATEGORY_PN, properties.get(ANALYTICS_CATEGORY_PN));
    }
  }

  return {
    dataLayerJson: output.toString()
  };
});