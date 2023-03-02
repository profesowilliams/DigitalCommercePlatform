use(function () {
  var dataJson = JSON.parse(this.data);
  var jsonObject = new Packages.org.json.JSONObject();
  var linkUrl = this.link;

  if (dataJson) {
    var keys = Object.keys(dataJson);
    if (keys && keys.length > 0) {
      var firstKey = keys[0];
      jsonObject.put(firstKey, dataJson[firstKey]);

      if (linkUrl) {
        jsonObject.getJSONObject(firstKey).put("xdm:linkURL", linkUrl);
      }

    } else {
      jsonObject = dataJson;
    }
  }

  return {
    dataLayerJson: jsonObject.toString()
  };
});