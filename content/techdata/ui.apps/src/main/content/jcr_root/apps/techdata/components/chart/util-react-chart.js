use(function() {
    'use strict';

    var jsonProperties = {
        "url" : properties.get("text",""),
        "refreshOnLoad" : properties.get("refreshOnLoad",false),
        "xdm:text" : properties.get("text","")
    }

    return {
        jsonString :
            "{\"name\" : \"" + properties.get("name","") + "\"," +
            "\"xdm:text\" : \"" + properties.get("text","") + "\"," +
            "\"url\" : \"" + properties.get("url","") + "\"," +
            "\"refreshOnLoad\" : " + properties.get("refreshOnLoad",false) + "" +
            "}"

    }
});