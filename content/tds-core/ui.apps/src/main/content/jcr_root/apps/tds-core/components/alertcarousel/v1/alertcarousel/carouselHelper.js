use(function () {
    const ANALYTICS_REGION_PN = "analyticsRegion";
    const ANALYTICS_CATEGORY_PN = "analyticsCategory";
    const ANALYTICS_NAME_PN = "carouselName";
    var dataJson = JSON.parse(this.data);
    var jsonObject = new Packages.org.json.JSONObject();



    var keys = Object.keys(dataJson);
    if (keys && keys.length > 0)
    {
        var firstKey = keys[0];
        jsonObject.put(firstKey,dataJson[firstKey]);
        if (properties.get(ANALYTICS_REGION_PN) != null)
        {
            jsonObject.getJSONObject(firstKey).put(ANALYTICS_REGION_PN, properties.get(ANALYTICS_REGION_PN));
        }

        if (properties.get(ANALYTICS_CATEGORY_PN) != null)
        {
            jsonObject.getJSONObject(firstKey).put(ANALYTICS_CATEGORY_PN, properties.get(ANALYTICS_CATEGORY_PN));
        }

        if (properties.get(ANALYTICS_NAME_PN) != null)
        {
            jsonObject.getJSONObject(firstKey).put(ANALYTICS_NAME_PN, properties.get(ANALYTICS_NAME_PN));
        }

    }else{
        jsonObject = dataJson;
    }



    return {
        dataLayerJson: jsonObject.toString()
    };
});