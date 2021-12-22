"use strict";

use(function () {
  var jsonObject = new Packages.org.json.JSONObject();

  var resourceResolver = resource.getResourceResolver();

  jsonObject.put("id", properties.get("id") || '');
  jsonObject.put("placeholder", properties.get("placeholder") || '');
  jsonObject.put("searchDomain", properties.get("searchDomain") || this.serviceData['searchDomain'] || '');
  jsonObject.put("dcpDomain", properties.get("dcpDomain") || this.serviceData['dcpDomain'] || '');
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

      var partialEndPoint = res.properties["partialEndPoint"];
      var validateResponseEndPoint = res.properties["validateResponseEndPoint"]

      var areaconfig = new Packages.org.json.JSONObject();
      var areaEndpoint, areaSuggestionUrl, dcpLookupEndpoint;
      if (res.properties["areaEndpoint"] != null) {
        areaEndpoint = res.properties["areaEndpoint"];
      } else {
        areaEndpoint = this.serviceData[area + "SearchEndpoint"];
      }
      if (res.properties["dcpLookupEndpoint"] != null) {
        dcpLookupEndpoint = res.properties["dcpLookupEndpoint"];
      } else {
        dcpLookupEndpoint = this.serviceData[area + "DcpLookupEndpoint"];
      }
      if (res.properties["areaSuggestionEndPoint"] != null) {
        areaSuggestionUrl = res.properties["areaSuggestionEndPoint"];
      } else {
        areaSuggestionUrl = this.serviceData[area + "SuggestionUrl"];
      }

      areaconfig.put("partialEndPoint", partialEndPoint);
      areaconfig.put("validateResponseEndPoint", validateResponseEndPoint);

      areaconfig.put("areaLabel", areaLabel);
      areaconfig.put("area", area);
      areaconfig.put("endpoint", areaEndpoint || '');
      areaconfig.put("dcpLookupEndpoint", dcpLookupEndpoint || '');
      areaconfig.put("areaSuggestionUrl", areaSuggestionUrl || '');

      // quote specific vars
      if (area === 'quote') {
        /**
         * quoteDetailPage:         Page to redirect DCP User for successful quote entered
         * dcpQuotesLookupEndpoint: Endpoint for checking if quote ID entered exists, for DCP User
         * dcpSearchFailedPage:     Page to redirect DCP User for failed quote entered
         * partialEndPoint:         Page to redirect to the GRID with queryParam to make a search
         * validateResponseEndPoint: Endpoint for checking if quote ID entered exists
         */
          if (res.properties["detailsPage"] != null) {
              areaconfig.put("detailsPage", res.properties["detailsPage"]);
            } else {
                areaconfig.put("detailsPage", this.serviceData['quoteDetailPage'] || '');
          }
          if(dcpLookupEndpoint == null) {
            areaconfig.put("dcpLookupEndpoint", this.serviceData['quoteDcpLookupEndpoint'] || '');
          }

          if (res.properties["partialEndPoint"] != null) {
            areaconfig.put("partialEndPoint", res.properties["partialEndPoint"]);
          } else {
            areaconfig.put("partialEndPoint", this.serviceData['quotePartialEndPoint'] || '');
          }

          if (res.properties["validateResponseEndPoint"] != null) {
            areaconfig.put("validateResponseEndPoint", res.properties["validateResponseEndPoint"]);
          } else {
            areaconfig.put("validateResponseEndPoint", this.serviceData['quoteValidateResponseEndPoint'] || '');
          }

          areaconfig.put("dcpSearchPage", res.properties['dcpSearchFailedPage'] || '');
          } else if (area === 'order') {
            /**
             * orderDetailPage:         Page to redirect DCP User for successful order entered
             * dcpOrdersLookupEndpoint: Endpoint for checking if order ID entered exists, for DCP User
             * dcpSearchFailedPage:     Page to redirect DCP User for failed order entered
             * partialEndPoint:         Page to redirect to the GRID with queryParam to make a search
             * validateResponseEndPoint: Endpoint for checking if quote ID entered exists
             */
            if (res.properties["detailsPage"] != null) {
                  areaconfig.put("detailsPage", res.properties["detailsPage"]);
            } else {
                areaconfig.put("detailsPage", this.serviceData['orderDetailPage'] || '');
            }
            if(dcpLookupEndpoint == null){
              areaconfig.put("dcpLookupEndpoint", this.serviceData['orderDcpLookupEndpoint'] || '');
            }

            if (res.properties["partialEndPoint"] != null) {
              areaconfig.put("partialEndPoint", res.properties["partialEndPoint"]);
            } else {
              areaconfig.put("partialEndPoint", this.serviceData['orderPartialEndPoint'] || '');
            }
  
            if (res.properties["validateResponseEndPoint"] != null) {
              areaconfig.put("validateResponseEndPoint", res.properties["validateResponseEndPoint"]);
            } else {
              areaconfig.put("validateResponseEndPoint", this.serviceData['orderValidateResponseEndPoint'] || '');
            }

            areaconfig.put("dcpSearchPage", res.properties['ordersGridPage'] || '');
          }

      jsonArray.put(areaconfig);
    }
    jsonObject.put("areaList", jsonArray);
  }

  return {
      configJson: jsonObject.toString()
  };
});
