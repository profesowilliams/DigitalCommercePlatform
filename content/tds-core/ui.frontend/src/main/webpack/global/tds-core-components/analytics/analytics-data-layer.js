import { getCookie } from '../../../static/js/utils.js';
(function () {  
  const isExtraReloadDisabled = () => document.body.hasAttribute("data-disable-extra-reload");
  let userIsLoggedIn = !isExtraReloadDisabled() && localStorage.getItem("sessionId") ? true : false;
  if (isExtraReloadDisabled()) {
    window.addEventListener('user:loggedIn' , () => userIsLoggedIn = true);
    window.addEventListener('user:loggedOut', () => userIsLoggedIn = false);
  }
  
  let userData = window.localStorage.getItem("userData") ? JSON.parse(window.localStorage.userData) : null;

  function validateDataObject(dataObject, filter) {
    if (dataObject != null) {
      for (var property in filter) {
        if (
          !dataObject.hasOwnProperty(property) ||
          (filter[property] === null &&
            filter[property] !== dataObject[property])
        ) {
          return;
        }
        return dataObject;
      }
    }
  }

  function getDataObjectHelper(event, filter) {
    if (
      event.hasOwnProperty('eventInfo') &&
      event.eventInfo.hasOwnProperty('path')
    ) {
      const dataObject = window.adobeDataLayer.getState(event.eventInfo.path);
      return validateDataObject(dataObject, filter);
    }
    return;
  }

  function getCountry(siteSectionName, language) {
    const elementReturn = {
      country: '',
      index: 0
    }
    siteSectionName.find((s, index) => {
      if (s == language) {
        elementReturn.country = siteSectionName[index - 1];
        elementReturn.index = index;
      }
    });
    return elementReturn
  }

  function pageShownHandler(event) {
    const dataObject = getDataObjectHelper(event, {
      '@type': 'tds-site/components/page',
    });
    if (dataObject != null) {
      const url = window.location.href;
      const server = window.location.hostname;
      const categoryObject = { pageType: ''};
      const language = dataObject['xdm:language'];
      const cmpShowAdobeDataLayer = window.adobeDataLayer[0];
      const pageObjectName = Object.keys(cmpShowAdobeDataLayer.page)[0];
      const pageInfo = cmpShowAdobeDataLayer.page[pageObjectName];
      const siteSectionName = [];
      window.location.pathname.split('/').forEach((item, index) => index > 0 && siteSectionName.push(item));
      const returnObject  = getCountry(siteSectionName, language);
      const country = returnObject.country;
      const countryIndex = returnObject.index;
      let pageName = '';
      siteSectionName.forEach((element, index) => {
        if (index > countryIndex) {
          pageName += ':' + element;
        }
      })
      pageName = pageName.replace('.html', '');
      
      categoryObject.pageType = pageInfo['xdm:pageType'];
      const pageCurrency = pageInfo['xdm:currency'];
      siteSectionName.forEach((siteSection, index) => {
        if (index > 1 && index < siteSectionName.length) {
          categoryObject['siteSection' + (index - 1)] = siteSection.replace('.html', '');
        }
      });
      
      
      const dataLayerObject = {
        page: {
          pageInfo: {
            pageName: pageName.substring(1), // pull from ACDL
            url: url, // pull from window.location
            server: server, // pull from window.location
            country: country,  // pull from ACDL
            language: language, // pull from ACDL
            currencyCode: pageCurrency  // pull from ACDL
          },
          category: categoryObject,
          errorDetails: {
            //   "errorCode": "",  // pull from window.location
            //   "errorName": "",  // pull from window.location
            //   "error404": ""  // pull from window.location
          },
          visitor: {
            ecID: userIsLoggedIn && userData?.id ? userData.id : null,
            sapID: userIsLoggedIn && userData?.activeCustomer?.customerNumber ? userData.activeCustomer.customerNumber : null,
            loginStatus: userIsLoggedIn ? "Logged in" : "Logged out"
          }
        },
      };
      window.dataLayer.push(dataLayerObject);
    }
      
      
  }

  function initDataLayer() {
    window.dataLayer = window.dataLayer || [];
    window.adobeDataLayer = window.adobeDataLayer || [];
    window.adobeDataLayer.push(function (dl) {
      dl.addEventListener('cmp:show', pageShownHandler);
    });
  }

  if (document.readyState !== 'loading') {
    initDataLayer();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      initDataLayer();
    });
  }
})();
