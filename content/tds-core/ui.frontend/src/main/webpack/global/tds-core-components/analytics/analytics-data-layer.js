import { getCookie } from '../../../static/js/utils.js';
(function () {
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
      const categoryObject = { pageType: '', sitesection: '' };
      const localStorage = window.localStorage;
      siteSectionArray.forEach((siteSection, index) => {
        if (index === siteSectionArray.length - 1) {
          categoryObject.sitesection = siteSection;
        }
        if (index > 0 && index < siteSectionArray.length - 1) {
          categoryObject['siteSection' + index] = siteSection;
        }
      });
      const dataLayerObject = {
        page: {
          pageInfo: {
            pageName: dataObject['dc:title'], // pull from ACDL
            url: url, // pull from window.location
            server: server, // pull from window.location
            //   "country": "us",  // pull from ACDL
            language: dataObject['xdm:language'], // pull from ACDL
            //   "currencyCode": "USD"  // pull from ACDL
          },
          category: categoryObject,
          errorDetails: {
            //   "errorCode": "",  // pull from window.location
            //   "errorName": "",  // pull from window.location
            //   "error404": ""  // pull from window.location
          },
          visitor: {
            ecID: '', // pull from local storage
            sapID: '', // pull from local storage
            loginStatus: localStorage.userData ? true : false, // pull from local storage
          },
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
