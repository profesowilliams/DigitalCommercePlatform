import {getCookie} from '../../../static/js/utils.js';
(function(){
    function validateDataObject(dataObject, filter) {
        if (dataObject != null) {
            for (var property in filter) {   
                if (!dataObject.hasOwnProperty(property) || (filter[property] === null && filter[property] !== dataObject[property])) {
                    return;
                }
                return dataObject;
            }
        }
    }

    function getDataObjectHelper(event, filter) {
        if (event.hasOwnProperty("eventInfo") && event.eventInfo.hasOwnProperty("path")) {
            const dataObject = window.adobeDataLayer.getState(event.eventInfo.path);
            return validateDataObject(dataObject, filter);
        }
        return;
    }
    function pageShownHandler(event) {
        const loginToken = getCookie('login-token');
        const dataObject = getDataObjectHelper(event, {         
            "@type": "tds-site/components/page",
        });
        if (dataObject != null) {
            const dataLayerObject = {
                page: {
                    pageInfo: {
                        pageName: dataObject["dc:title"],
                        url: dataObject["repo:path"],
                        language: dataObject["xdm:language"],
                    },
                    visitor: {
                        loginStatus: loginToken ? true : false,
                    },
                },
            };
            window.dataLayer.push(dataLayerObject);
        }
    }

    function initAdobeDataLayer () {
        window.adobeDataLayer = window.adobeDataLayer || [];
        window.adobeDataLayer.push(function (dl) {
            dl.addEventListener("cmp:show", pageShownHandler);
        });
    }

    if (document.readyState !== "loading") {
        initAdobeDataLayer();
    } else {
        document.addEventListener("DOMContentLoaded", () =>{
            initAdobeDataLayer();
        });
    }        
})();
