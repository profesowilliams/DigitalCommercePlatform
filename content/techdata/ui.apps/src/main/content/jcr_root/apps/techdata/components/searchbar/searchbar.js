"use strict";

use(function () {
  var jsonObject = new Packages.org.json.JSONObject();

  var resourceResolver = resource.getResourceResolver();

  jsonObject.put("id", properties.get("id") || '');
  jsonObject.put("placeholder", properties.get("placeholder") || '');
  jsonObject.put("searchDomain", properties.get("searchDomain") || this.serviceData['searchDomain'] || '');
  jsonObject.put("uiServiceDomain", this.serviceData['uiServiceDomain'] || '');
  jsonObject.put("typeAheadDomain", properties.get("typeAheadDomain")
                                 || (this.serviceData['typeAheadDomain'] + this.serviceData['typeAheadSearchTermSuffix'])
                                 || '');

  var areaListNode = resourceResolver.getResource(currentNode.getPath() + "/areaList");

  if (areaListNode !== null) {
    var childrenList = areaListNode.getChildren();
    var jsonArray = new Packages.org.json.JSONArray();

    for (var [key, res] in Iterator(childrenList)) {
      var area = res.properties["area"];
      var areaLabel = res.properties["areaLabel"];

      var areaconfig = new Packages.org.json.JSONObject();
      var areaEndpoint, areaSuggestionUrl;
      if (res.properties["areaEndpoint"] != null) {
        areaEndpoint = res.properties["areaEndpoint"];
      } else {
        areaEndpoint = this.serviceData[area + "SearchEndpoint"];
      }
      if (res.properties["areaSuggestionEndPoint"] != null) {
        areaSuggestionUrl = res.properties["areaSuggestionEndPoint"];
      } else {
        areaSuggestionUrl = this.serviceData[area + "SuggestionUrl"];
      }

      areaconfig.put("areaLabel", areaLabel);
      areaconfig.put("area", area);
      areaconfig.put("endpoint", areaEndpoint || '');
      areaconfig.put("areaSuggestionUrl", areaSuggestionUrl || '');

      // quote specific vars
      if (area === 'quote') {
        /**
         * quoteDetailPage:         Page to redirect DCP User for successful quote entered
         * dcpQuotesLookupEndpoint: Endpoint for checking if quote ID entered exists, for DCP User
         * dcpSearchFailedPage:     Page to redirect DCP User for failed quote entered
         */
          areaconfig.put("quoteDetailPage", this.serviceData['quoteDetailPage'] || '');
          areaconfig.put("dcpQuotesLookupEndpoint", this.serviceData['quoteGridEndpoint'] || '');
          areaconfig.put("dcpSearchFailedPage", res.properties['dcpSearchFailedPage'] || '');
      }

      jsonArray.put(areaconfig);
    }
    jsonObject.put("areaList", jsonArray);
  }

  return {
      configJson: jsonObject.toString()
  };
});
