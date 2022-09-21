"use strict";

use(function () {
  var jsonResponse = "";
  var resourceResolver = resource.getResourceResolver();

  if (properties.get("json") != null) {
    var jsonResource = resourceResolver.getResource(properties.get("json"));

    if (jsonResource != null) {
      var asset = jsonResource.adaptTo(com.day.cq.dam.api.Asset);
      var rendition = asset.getOriginal();
      var inputStream = rendition.adaptTo(java.io.InputStream);
      var stream;

      try {
        while ((stream = inputStream.read()) != -1) {
          jsonResponse = jsonResponse + String.fromCharCode(stream);
        }
      } catch (e) {
        // if any I/O error occurs
        log.debug("Input Stream Error " + e);
      }
    }
  }
  return {
    configJson: jsonResponse || "",
  };
});
