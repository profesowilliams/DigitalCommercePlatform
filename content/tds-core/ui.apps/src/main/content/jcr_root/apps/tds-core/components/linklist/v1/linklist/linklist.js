use(function () {
  var dataJson = JSON.parse(this.data);
  var parentId = this.parent;
  var jsonObject = new Packages.org.json.JSONObject();

  if (dataJson) {
    var keys = Object.keys(dataJson);
    if (keys && keys.length > 0) {
      var firstKey = keys[0];
      jsonObject.put(firstKey, dataJson[firstKey]);

      if (parentId) {
        jsonObject.getJSONObject(firstKey).put("parentId", parentId);
      }

    } else {
      jsonObject = dataJson;
    }
  }

  return {
    dataLayerJson: jsonObject.toString()
  };
});
