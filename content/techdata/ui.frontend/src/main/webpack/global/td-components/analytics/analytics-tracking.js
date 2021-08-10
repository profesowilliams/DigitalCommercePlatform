;(function(){

    console.log("%c TD Analytics Tracking Start","background-color: #00b1e2;color: white");

    const CAROUSEL_COMPONENT_EVENTINFO = "component.carousel";
    const TEASER_COMPONENT_EVENTINFO = "component.teaser";
    const COMPONENT_PREFIX = "component.";
    const CAROUSEL_ITEM_DIV_CLASSNAME = ".cmp-carousel__item";
    const CAROUSEL_DIV_CLASSNAME = ".cmp-carousel";
    const CAROUSEL_ACTIVE_ITEM_CLASS_NAME = ".cmp-carousel__item--active"
    const DATA_LAYER_DATA_ATTRIBUTE_NAME = "data-cmp-data-layer";
    const CAROUSEL_DEPTH_DATA_ATTRIBUTE_NAME = "data-cmp-carousel-number";
    const DATA_LAYER_CATEGORY_PN = "analyticsCategory";
    const DATA_LAYER_CAROUSEL_PN = "carousel";
    const DATA_LAYER_NAME_PN = "carouselName";
    const DATA_LAYER_REGION_PN = "analyticsRegion";
    const ANALYTICS_EVENTINFO_CATEGORY_PN = "category";
    const ANALYTICS_EVENTINFO_NAME_PN = "name";
    const ANALYTICS_EVENTINFO_REGION_PN = "region";
    const ANALYTICS_EVENTINFO_MASTHEADLEVEL_PN = "mastheadlevel"
    const ANALYTICS_EVENTINFO_SELECTION_DEPTH_PN = "selectionDepth";
    const ANALYTICS_EVENTINFO_TYPE_PN = "type"
    const ANALYTICS_EVENTINFO_TYPE_LINK_VAL = "link"



    function getDataLayerObjectFromDataAttribute(componentDivElement) {
        return JSON.parse(componentDivElement.getAttribute(DATA_LAYER_DATA_ATTRIBUTE_NAME));
    }


    function updateClickInfo(dataLayer) {
        let clickInfo = {};
        if (DATA_LAYER_CAROUSEL_PN in dataLayer) {
            if (DATA_LAYER_CATEGORY_PN in dataLayer[DATA_LAYER_CAROUSEL_PN]) {
                clickInfo[ANALYTICS_EVENTINFO_CATEGORY_PN] = dataLayer[DATA_LAYER_CAROUSEL_PN][DATA_LAYER_CATEGORY_PN]
            }

            if (DATA_LAYER_NAME_PN in dataLayer[DATA_LAYER_CAROUSEL_PN]) {
                clickInfo[ANALYTICS_EVENTINFO_NAME_PN] = dataLayer[DATA_LAYER_CAROUSEL_PN][DATA_LAYER_NAME_PN]
            }

            if (DATA_LAYER_REGION_PN in dataLayer[DATA_LAYER_CAROUSEL_PN]) {
                clickInfo[ANALYTICS_EVENTINFO_REGION_PN] = dataLayer[DATA_LAYER_CAROUSEL_PN][DATA_LAYER_REGION_PN]
            }
        }

        return clickInfo;
    }

    function pushToDataLayer(clickInfo) {

        clickInfo[ANALYTICS_EVENTINFO_TYPE_PN] = ANALYTICS_EVENTINFO_TYPE_LINK_VAL;

        window.adobeDataLayer.push(
            {
                "event": 'click',
                "clickInfo": clickInfo
            });

    }

    function carouselTeaserClickHandler(teaserDivElement, carouselItemDivElement) {
        let carouselRootElement = carouselItemDivElement.closest(CAROUSEL_DIV_CLASSNAME);
        let dataLayer = getDataLayerObjectFromDataAttribute(carouselRootElement);
        let carouselDepth = JSON.parse(carouselItemDivElement.getAttribute(CAROUSEL_DEPTH_DATA_ATTRIBUTE_NAME));
        let clickInfo = updateClickInfo(dataLayer);
        if (carouselDepth) {
            clickInfo[ANALYTICS_EVENTINFO_SELECTION_DEPTH_PN] = carouselDepth;
        }

        clickInfo[ANALYTICS_EVENTINFO_MASTHEADLEVEL_PN] = "";

        pushToDataLayer(clickInfo);
    }

    function carouselClickHandler(carouselPath) {
        let componentDivId = carouselPath.replace(COMPONENT_PREFIX, "");
        let carouselRootElement = document.getElementById(componentDivId);
        let dataLayer = getDataLayerObjectFromDataAttribute(carouselRootElement);
        let carouselItemDivElement = carouselRootElement.querySelector(CAROUSEL_ACTIVE_ITEM_CLASS_NAME);
        let carouselDepth = JSON.parse(carouselItemDivElement.getAttribute(CAROUSEL_DEPTH_DATA_ATTRIBUTE_NAME));
        let clickInfo = updateClickInfo(dataLayer);
        if (carouselDepth) {
            clickInfo[ANALYTICS_EVENTINFO_SELECTION_DEPTH_PN] = carouselDepth;
        }

        clickInfo[ANALYTICS_EVENTINFO_MASTHEADLEVEL_PN] = "";
        pushToDataLayer(clickInfo);
    }

    function teaserClickHandler(teaserPath) {
        let componentDivId = teaserPath.replace(COMPONENT_PREFIX, "");
        let componentDivElement = document.getElementById(componentDivId);
        if (componentDivElement) {
            let carouselItemParent = componentDivElement.closest(CAROUSEL_ITEM_DIV_CLASSNAME);
            if (carouselItemParent) {
                //    teaser is inside a carousel
                carouselTeaserClickHandler(componentDivElement, carouselItemParent);
            }
        }

    }

    function carouselClickEventHandler() {
        if (window.adobeDataLayer)
            window.adobeDataLayer.addEventListener("cmp:click", function (e) {
                let componentEventInfo;
                if (e.eventInfo && e.eventInfo.path)
                    componentEventInfo = e.eventInfo.path;
                if (componentEventInfo.startsWith(CAROUSEL_COMPONENT_EVENTINFO)) {
                    carouselClickHandler(componentEventInfo);
                } else if (componentEventInfo.startsWith(TEASER_COMPONENT_EVENTINFO)) {
                    teaserClickHandler(componentEventInfo);
                }

            });
    }


    if (document.readyState !== "loading") {
        carouselClickEventHandler();
    } else {
        document.addEventListener("DOMContentLoaded", carouselClickEventHandler);
    }
})();
