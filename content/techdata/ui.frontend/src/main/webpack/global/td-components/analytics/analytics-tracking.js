(function(){

    var dataLayer;

    const ALERT_CAROUSEL_COMPONENT_NAME = "alertcarousel";
    const CAROUSEL_COMPONENT_NAME= "carousel";
    const TEASER_COMPONENT_NAME = "teaser";
    const IMAGE_COMPONENT_NAME = "title-";
    const CAROUSEL_ITEM_DIV_CLASSNAME = ".cmp-carousel__item";
    const CAROUSEL_DIV_CLASSNAME = ".cmp-carousel";
    const CAROUSEL_ACTIVE_ITEM_CLASS_NAME = ".cmp-carousel__item--active"
    const DATA_LAYER_DATA_ATTRIBUTE_NAME = "data-cmp-data-layer";
    const CAROUSEL_DEPTH_DATA_ATTRIBUTE_NAME = "data-cmp-carousel-number";
    const DATA_LAYER_CATEGORY_PN = "analyticsCategory";
    const DATA_LAYER_TITLE = "jcr:title";
    const DATA_LAYER_NAME_PN = "carouselName";
    const DATA_LAYER_REGION_PN = "analyticsRegion";
    const ANALYTICS_EVENTINFO_CATEGORY_PN = "category";
    const ANALYTICS_EVENTINFO_NAME_PN = "name";
    const ANALYTICS_EVENTINFO_CAROUSEL_NAME_PN = "carouselName";
    const ANALYTICS_EVENTINFO_REGION_PN = "region";
    const ANALYTICS_EVENTINFO_MASTHEADLEVEL_PN = "mastheadlevel";
    const ANALYTICS_EVENTINFO_SELECTION_DEPTH_PN = "selectionDepth";
    const ANALYTICS_EVENTINFO_TYPE_PN = "type";
    const ANALYTICS_EVENTINFO_TYPE_LINK_VAL = "link";
    const ANALYTICS_EVENTINFO_TYPE_LIST_VAL = "list";
    const ANALYTICS_EVENTINFO_TYPE_IMAGE_VAL = "image";
    const ANALYTICS_EVENTINFO_TYPE_CTA_VAL = "cta";
    const IMAGE_CSS_CLASSNAME = "cmp-image";
    const TEASER_CONTENT_CSS_CLASSNAME = "cmp-teaser__content";
    const MEGAMENU_CLASSNAME = "cmp-megamenu__analytics-link";
    const SUBHEADER_CLASSNAME = "cmp-subheader__analytics-link";
    const MEGAMENU_TABS_CLASSNAME = "cmp-megamenu__tab-text";
    const ANALYTICS_EVENTINFO_CLICKHEIR_PN = "clickHier";
    const LIST_CLASSNAME = "cmp-list__item-link-analytics";

    let sessionId = window.localStorage.getItem("sessionId");
    let userData = window.localStorage.getItem("userData") ? JSON.parse(window.localStorage.userData) : null;

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
            setVisitorData({
                "event": 'click',
                "clickInfo": clickInfo
            }));

    }

    // Changes made to this method would need to be replicated on the DataLayerUtils.js method as well.
    function setVisitorData(object) {
        object.page = object.page || {};

        object.page.visitor = {
            ecID: sessionId ? userData.id : null,
            sapID: sessionId ? userData.activeCustomer.customerNumber : null,
            loginStatus: sessionId ? "Logged in" : "Logged out"
        }

        return object;
    }

    function carouselTeaserClickHandler(teaserDivElement, carouselItemDivElement, elementClicked) {
        let carouselRootElement = carouselItemDivElement.closest(CAROUSEL_DIV_CLASSNAME);
        let componentDataLayer = getDataLayerObjectFromDataAttribute(carouselRootElement);
        let carouselDepth = JSON.parse(elementClicked.getAttribute(CAROUSEL_DEPTH_DATA_ATTRIBUTE_NAME));
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
        let carouselDepth = JSON.parse(elementClicked.getAttribute(CAROUSEL_DEPTH_DATA_ATTRIBUTE_NAME));
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

    function titleClickEventHandler(componentId, elementClicked) {
        let titleRootElement = document.getElementById(componentId);
        let componentDataLayer = getDataLayerObjectFromDataAttribute(titleRootElement);
        let clickInfo = updateClickInfo(componentDataLayer);
        clickInfo[ANALYTICS_EVENTINFO_NAME_PN] = populateTitle(componentDataLayer);
        clickInfo[ANALYTICS_EVENTINFO_TYPE_PN] = ANALYTICS_EVENTINFO_TYPE_LINK_VAL;
        clickInfo[ANALYTICS_EVENTINFO_MASTHEADLEVEL_PN] = '';
        clickInfo[ANALYTICS_EVENTINFO_SELECTION_DEPTH_PN] = '';
        clickInfo[ANALYTICS_EVENTINFO_CAROUSEL_NAME_PN] = '';
        pushToDataLayer(clickInfo);
    }

    function imageClickEventHandler(componentId, elementClicked, className) {
        let clickInfo = {};
        clickInfo[ANALYTICS_EVENTINFO_CATEGORY_PN] = elementClicked.getAttribute('data-category');
        clickInfo[ANALYTICS_EVENTINFO_REGION_PN] = elementClicked.getAttribute('data-region');
        let titleVal = elementClicked.getAttribute('data-title');
        if(className && className.startsWith(TEASER_CONTENT_CSS_CLASSNAME)) {
            titleVal = elementClicked.getAttribute('data-teaser-title');
        }
        clickInfo[ANALYTICS_EVENTINFO_NAME_PN] = titleVal;
        clickInfo[ANALYTICS_EVENTINFO_TYPE_PN] = ANALYTICS_EVENTINFO_TYPE_IMAGE_VAL;
        clickInfo[ANALYTICS_EVENTINFO_MASTHEADLEVEL_PN] = '';
        clickInfo[ANALYTICS_EVENTINFO_SELECTION_DEPTH_PN] = '';
        clickInfo[ANALYTICS_EVENTINFO_CAROUSEL_NAME_PN] = '';
        pushToDataLayer(clickInfo);
    }

    function populateTitle(dataLayer) {
        let title = '';
        var firstKey = Object.keys(dataLayer).length > 0 ? Object.keys(dataLayer)[0]:undefined;
        if (firstKey) {
            if (DATA_LAYER_TITLE in dataLayer[firstKey]) {
                title = dataLayer[firstKey][DATA_LAYER_TITLE]
            }
        }
        return title;
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

    function  listClickEventHandler(elemClicked) {
        const label = elemClicked.getAttribute('data-title');
        const category = elemClicked.getAttribute('data-category') || '';
        const clickInfo = {};

        clickInfo[ANALYTICS_EVENTINFO_TYPE_PN] = ANALYTICS_EVENTINFO_TYPE_LIST_VAL;
        clickInfo[ANALYTICS_EVENTINFO_NAME_PN] = label;
        clickInfo[ANALYTICS_EVENTINFO_CATEGORY_PN] = category;

        pushToDataLayer(clickInfo);

    }

    function subHeaderClickEventHandler(elemClicked) {
        const label = elemClicked.getAttribute('data-tab-name');
        let hier = label;
        if (elemClicked.closest('.cmp-tools__category-name')) {
            hier = elemClicked.getAttribute('data-hier') || label;
        }
        const clickInfo = {};

        clickInfo[ANALYTICS_EVENTINFO_TYPE_PN] = ANALYTICS_EVENTINFO_TYPE_LINK_VAL;
        clickInfo[ANALYTICS_EVENTINFO_NAME_PN] = label;
        clickInfo[ANALYTICS_EVENTINFO_CATEGORY_PN] = 'DCP subheader';
        clickInfo[ANALYTICS_EVENTINFO_CLICKHEIR_PN] = hier;

        pushToDataLayer(clickInfo);

    }

    function megamenuClickEventHandler(elemClicked) {
        const mastheadlevel = elemClicked.getAttribute('data-level');
        let clickHier =  elemClicked.getAttribute('data-hier');
        const titleVal = elemClicked.getAttribute('title');
        const clickInfo = {};

        if (mastheadlevel === 'L4' && elemClicked.getAttribute('data-mobile') !== 'true') {
            const level3EleHier = document.querySelector('.cmp-megamenu__tertiary .cmp-megamenu__item--active')
                .getAttribute('data-hier');
            clickHier = level3EleHier + '>' + titleVal;
        }

        clickInfo[ANALYTICS_EVENTINFO_TYPE_PN] = ANALYTICS_EVENTINFO_TYPE_LINK_VAL;
        clickInfo[ANALYTICS_EVENTINFO_CATEGORY_PN] = 'mastheader';
        clickInfo[ANALYTICS_EVENTINFO_MASTHEADLEVEL_PN] = mastheadlevel;
        clickInfo[ANALYTICS_EVENTINFO_CLICKHEIR_PN] = clickHier;
        clickInfo[ANALYTICS_EVENTINFO_NAME_PN] = titleVal;

        pushToDataLayer(clickInfo);
    }

    function attachClickEventListener(element) {
        element.addEventListener("click", addClickToDataLayer);
    }

    function getClickId(element) {
        if (element.dataset.cmpDataLayer) {
            return Object.keys(JSON.parse(element.dataset.cmpDataLayer))[0];
        }

        var componentElement = element.closest("[data-cmp-data-layer]");
        if(componentElement) {
            return Object.keys(JSON.parse(componentElement.dataset.cmpDataLayer))[0];
        }
        return null;
    }

    function addClickToDataLayer(event) {
        var className = event.currentTarget.className;
        if (className && (className.startsWith(IMAGE_CSS_CLASSNAME) || className.startsWith(TEASER_CONTENT_CSS_CLASSNAME))) {
            imageClickEventHandler(event.currentTarget.id, event.currentTarget);
        } else if (className && (className.startsWith(MEGAMENU_CLASSNAME) || className.startsWith(MEGAMENU_TABS_CLASSNAME))) {
            megamenuClickEventHandler(event.currentTarget);
        } else if (className && className.indexOf(LIST_CLASSNAME) > -1) {
            listClickEventHandler(event.currentTarget);
        } else if (className && className.indexOf(SUBHEADER_CLASSNAME) > -1) {
            subHeaderClickEventHandler(event.currentTarget);
        } else {
            var element = event.currentTarget;
            var componentId = getClickId(element);
            if(componentId) {
                if (componentId.startsWith(CAROUSEL_COMPONENT_NAME) || componentId.startsWith(ALERT_CAROUSEL_COMPONENT_NAME))
                {
                    carouselClickHandler(componentId, element);
                }else if (componentId.startsWith(TEASER_COMPONENT_NAME)) {
                    teaserClickHandler(componentId, element)
                } else if(componentId.startsWith(IMAGE_COMPONENT_NAME)){
                    titleClickEventHandler(componentId, element);
                }
            }
        }

    }

    function clickEventHandler() {
        dataLayer = window.adobeDataLayer || [];
        var clickableElements = document.querySelectorAll("[data-cmp-clickable]");

        clickableElements.forEach(function(element) {
            attachClickEventListener(element);
        });
    }


    if (document.readyState !== "loading") {
        clickEventHandler();
    } else {
        document.addEventListener("DOMContentLoaded", clickEventHandler);
    }
})();
