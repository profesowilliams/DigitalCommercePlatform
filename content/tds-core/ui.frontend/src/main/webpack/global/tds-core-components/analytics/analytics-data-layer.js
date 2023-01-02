import { getCookie } from '../../../static/js/utils.js';
(function () {
  let sessionId = window.localStorage.getItem("sessionId");
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
  function pageShownHandler(event) {
    const dataObject = getDataObjectHelper(event, {
      '@type': 'tds-site/components/page',
    });
    if (dataObject != null) {
      const url = window.location.href;
      const server = window.location.hostname;
      const siteSectionArray = window.location.pathname.split('/');
      const categoryObject = { pageType: ''};
      const localStorage = window.localStorage;
      const cmpShowAdobeDataLayer = window.adobeDataLayer[0];
      const pageObjectName = Object.keys(cmpShowAdobeDataLayer.page)[0];
      const pageInfo = cmpShowAdobeDataLayer.page[pageObjectName];
      const pageName = siteSectionArray.toString().replaceAll('/', ':');
      let country = '';
      categoryObject.pageType = pageInfo['xdm:pageType'];
      const pageCurrency = pageInfo['xdm:currency'];
      siteSectionArray.forEach((siteSection, index) => {
        if (index === 1) {
          country = siteSection;
        }
        if (index > 2 && index < siteSectionArray.length) {
          categoryObject['siteSection' + (index - 2)] = siteSection;
        }
      });
      
      const dataLayerObject = {
        page: {
          pageInfo: {
            pageName: pageName, // pull from ACDL
            url: url, // pull from window.location
            server: server, // pull from window.location
            country: country,  // pull from ACDL
            language: dataObject['xdm:language'], // pull from ACDL
            currencyCode: pageCurrency  // pull from ACDL
          },
          category: categoryObject,
          errorDetails: {
            //   "errorCode": "",  // pull from window.location
            //   "errorName": "",  // pull from window.location
            //   "error404": ""  // pull from window.location
          },
          visitor: {
            ecID: sessionId && userData?.id ? userData.id : null,
            sapID: sessionId && userData?.activeCustomer?.customerNumber ? userData.activeCustomer.customerNumber : null,
            loginStatus: sessionId ? "Logged in" : "Logged out"
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
