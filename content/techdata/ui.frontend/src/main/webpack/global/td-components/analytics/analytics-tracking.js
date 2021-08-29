(function(){

    var dataLayer;

    const ALERT_CAROUSEL_COMPONENT_NAME = "alertcarousel";
    const CAROUSEL_COMPONENT_NAME= "carousel";
    const TEASER_COMPONENT_NAME = "teaser";
    const CAROUSEL_ITEM_DIV_CLASSNAME = ".cmp-carousel__item";
    const CAROUSEL_DIV_CLASSNAME = ".cmp-carousel";
    const CAROUSEL_ACTIVE_ITEM_CLASS_NAME = ".cmp-carousel__item--active"
    const DATA_LAYER_DATA_ATTRIBUTE_NAME = "data-cmp-data-layer";
    const CAROUSEL_DEPTH_DATA_ATTRIBUTE_NAME = "data-cmp-carousel-number";
    const DATA_LAYER_CATEGORY_PN = "analyticsCategory";
    const DATA_LAYER_NAME_PN = "carouselName";
    const DATA_LAYER_REGION_PN = "analyticsRegion";
    const ANALYTICS_EVENTINFO_CATEGORY_PN = "category";
    const ANALYTICS_EVENTINFO_NAME_PN = "name";
    const ANALYTICS_EVENTINFO_CAROUSEL_NAME_PN = "carouselName";
    const ANALYTICS_EVENTINFO_REGION_PN = "region";
    const ANALYTICS_EVENTINFO_MASTHEADLEVEL_PN = "mastheadlevel"
    const ANALYTICS_EVENTINFO_SELECTION_DEPTH_PN = "selectionDepth";
    const ANALYTICS_EVENTINFO_TYPE_PN = "type"
    const ANALYTICS_EVENTINFO_TYPE_LINK_VAL = "link"
    const ANALYTICS_EVENTINFO_TYPE_CTA_VAL = "cta"

    function parseNameFromElement(elementClicked) {
        var linkText = elementClicked.text.trim();
        if (linkText.startsWith("|"))
        {
            linkText = linkText.substring(1, linkText.length-1).trim();
        }

        return linkText;

    }

    function getDataLayerObjectFromDataAttribute(componentDivElement) {
        return JSON.parse(componentDivElement.getAttribute(DATA_LAYER_DATA_ATTRIBUTE_NAME));
    }

    function updateClickInfo(dataLayer) {
        let clickInfo = {};
        var firstKey = Object.keys(dataLayer).length > 0 ? Object.keys(dataLayer)[0]:undefined;
        if (firstKey) {
            if (DATA_LAYER_CATEGORY_PN in dataLayer[firstKey]) {
                clickInfo[ANALYTICS_EVENTINFO_CATEGORY_PN] = dataLayer[firstKey][DATA_LAYER_CATEGORY_PN]
            }

            if (DATA_LAYER_NAME_PN in dataLayer[firstKey]) {
                clickInfo[ANALYTICS_EVENTINFO_NAME_PN] = dataLayer[firstKey][DATA_LAYER_NAME_PN]
            }

            if (DATA_LAYER_REGION_PN in dataLayer[firstKey]) {
                clickInfo[ANALYTICS_EVENTINFO_REGION_PN] = dataLayer[firstKey][DATA_LAYER_REGION_PN]
            }
        }


        return clickInfo;
    }

    function pushToDataLayer(clickInfo) {

        window.adobeDataLayer.push(
            {
                "event": 'click',
                "clickInfo": clickInfo
            });

    }

    function carouselTeaserClickHandler(teaserDivElement, carouselItemDivElement, elementClicked) {
        let carouselRootElement = carouselItemDivElement.closest(CAROUSEL_DIV_CLASSNAME);
        let componentDataLayer = getDataLayerObjectFromDataAttribute(carouselRootElement);
        let carouselDepth = JSON.parse(carouselItemDivElement.getAttribute(CAROUSEL_DEPTH_DATA_ATTRIBUTE_NAME));
        let clickInfo = updateClickInfo(componentDataLayer);
        if (carouselDepth) {
            clickInfo[ANALYTICS_EVENTINFO_SELECTION_DEPTH_PN] = carouselDepth;
        }
        clickInfo[ANALYTICS_EVENTINFO_MASTHEADLEVEL_PN] = "";
        clickInfo[ANALYTICS_EVENTINFO_CAROUSEL_NAME_PN] = clickInfo[ANALYTICS_EVENTINFO_NAME_PN];
        clickInfo[ANALYTICS_EVENTINFO_NAME_PN] = parseNameFromElement(elementClicked)
        clickInfo[ANALYTICS_EVENTINFO_TYPE_PN] = ANALYTICS_EVENTINFO_TYPE_LINK_VAL;

        pushToDataLayer(clickInfo);

    }

    function carouselClickHandler(carouselId, elementClicked) {
        let carouselRootElement = document.getElementById(carouselId);
        let componentDataLayer = getDataLayerObjectFromDataAttribute(carouselRootElement);
        let carouselItemDivElement = carouselRootElement.querySelector(CAROUSEL_ACTIVE_ITEM_CLASS_NAME);
        let carouselDepth = JSON.parse(carouselItemDivElement.getAttribute(CAROUSEL_DEPTH_DATA_ATTRIBUTE_NAME));
        let clickInfo = updateClickInfo(componentDataLayer);
        if (carouselDepth) {
            clickInfo[ANALYTICS_EVENTINFO_SELECTION_DEPTH_PN] = carouselDepth;
        }
        clickInfo[ANALYTICS_EVENTINFO_CAROUSEL_NAME_PN] = clickInfo[ANALYTICS_EVENTINFO_NAME_PN];
        clickInfo[ANALYTICS_EVENTINFO_NAME_PN] = parseNameFromElement(elementClicked)
        clickInfo[ANALYTICS_EVENTINFO_TYPE_PN] = ANALYTICS_EVENTINFO_TYPE_CTA_VAL;
        clickInfo[ANALYTICS_EVENTINFO_MASTHEADLEVEL_PN] = "";
        pushToDataLayer(clickInfo);
    }

    function teaserClickHandler(componentDivId, elementClicked) {
        let componentDivElement = document.getElementById(componentDivId);
        if (componentDivElement) {
            let carouselItemParent = componentDivElement.closest(CAROUSEL_ITEM_DIV_CLASSNAME);
            if (carouselItemParent) {
                //    teaser is inside a carousel
                carouselTeaserClickHandler(componentDivElement, carouselItemParent, elementClicked);
            }
        }

    }

    function attachClickEventListener(element) {
        element.addEventListener("click", addClickToDataLayer);
    }

    function getClickId(element) {
        if (element.dataset.cmpDataLayer) {
            return Object.keys(JSON.parse(element.dataset.cmpDataLayer))[0];
        }

        var componentElement = element.closest("[data-cmp-data-layer]");
        return Object.keys(JSON.parse(componentElement.dataset.cmpDataLayer))[0];
    }

    function addClickToDataLayer(event) {
        var element = event.currentTarget;
        var componentId = getClickId(element);

        if (componentId.startsWith(CAROUSEL_COMPONENT_NAME) || componentId.startsWith(ALERT_CAROUSEL_COMPONENT_NAME))
        {
            carouselClickHandler(componentId, element);
        }else if (componentId.startsWith(TEASER_COMPONENT_NAME)){
            teaserClickHandler(componentId, element)
        }

    }

    function carouselClickEventHandler() {
        dataLayer = window.adobeDataLayer || [];
        var clickableElements = document.querySelectorAll("[data-cmp-clickable]");

        clickableElements.forEach(function(element) {
            attachClickEventListener(element);
        });
    }


    if (document.readyState !== "loading") {
        carouselClickEventHandler();
    } else {
        document.addEventListener("DOMContentLoaded", carouselClickEventHandler);
    }
})();
