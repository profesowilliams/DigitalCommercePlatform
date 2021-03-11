use(function() {
    'use strict';

    var jsonProperties = {
        "url" : properties.get("text",""),
        "refreshOnLoad" : properties.get("refreshOnLoad",false),
        "xdm:text" : properties.get("text","")
    }

    return {
        jsonString :
            "{\"text\" : \"" + properties.get("text","") + "\"," +
            "\"xdm:text\" : \"" + properties.get("text","") + "\"," +
            "\"refreshOnLoad\" : " + properties.get("refreshOnLoad",false) + "" +
            "}"

    }
});