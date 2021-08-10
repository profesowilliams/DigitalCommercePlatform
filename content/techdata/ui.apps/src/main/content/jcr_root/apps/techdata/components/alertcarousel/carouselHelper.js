use(function () {
    const CAROUSEL_PN = "carousel";
    const ANALYTICS_REGION_PN = "analyticsRegion";
    const ANALYTICS_CATEGORY_PN = "analyticsCategory";
    const ANALYTICS_NAME_PN = "carouselName";
    var dataJson = JSON.parse(this.data);
    var jsonObject = new Packages.org.json.JSONObject();
    jsonObject.put(CAROUSEL_PN,dataJson[CAROUSEL_PN]);

    if (CAROUSEL_PN in dataJson)
    {
        if (properties.get(ANALYTICS_REGION_PN) != null)
        {
            jsonObject.getJSONObject(CAROUSEL_PN).put(ANALYTICS_REGION_PN, properties.get(ANALYTICS_REGION_PN));
        }

        if (properties.get(ANALYTICS_CATEGORY_PN) != null)
        {
            jsonObject.getJSONObject(CAROUSEL_PN).put(ANALYTICS_CATEGORY_PN, properties.get(ANALYTICS_CATEGORY_PN));
        }

        if (properties.get(ANALYTICS_NAME_PN) != null)
        {
            jsonObject.getJSONObject(CAROUSEL_PN).put(ANALYTICS_NAME_PN, properties.get(ANALYTICS_NAME_PN));
        }

    }



    return {
        dataLayerJson: jsonObject.toString()
    };
});