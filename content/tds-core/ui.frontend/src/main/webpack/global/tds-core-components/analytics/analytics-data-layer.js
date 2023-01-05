(function () {
  const isExtraReloadDisabled = () => document.body.hasAttribute("data-disable-extra-reload");
  let userIsLoggedIn = !isExtraReloadDisabled() && localStorage.getItem("sessionId") ? true : false;
  if (isExtraReloadDisabled()) {
    window.addEventListener('user:loggedIn' , () => userIsLoggedIn = true);
    window.addEventListener('user:loggedOut', () => userIsLoggedIn = false);
  }
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

  function getCountry(siteSectionName, language, flagLanguage) {
    const elementReturn = {
      country: '',
      index: 0
    }
    siteSectionName.find((s, index) => {
      if (flagLanguage && s.includes(language)) {
        elementReturn.country = siteSectionName[index - 1];
        elementReturn.index = index;
      }
      if (s == language) {
        elementReturn.country = siteSectionName[index - 1];
        elementReturn.index = index;
      }
    });
    return elementReturn
  }
    

  function isCategoryKeyword(element, keyword = 'siteSection') {
    if (element.includes(keyword)) {
      return element;
    }
  }

  function fillCategorySiteSections (categoryObject, flagLanguage){
    if (flagLanguage) {
      const newCategoryObject = {pageType: ''};
      for (let i = 0; i < 5; i++) {
        newCategoryObject['siteSection' + i] = 'n/a';
      }
      return newCategoryObject;
    }
    const categoryKeys = Object.keys(categoryObject);
    const categorySiteSections = categoryKeys.filter((element) => isCategoryKeyword(element));
    if (categorySiteSections.length < 5) {
      const newCategoryObject = categoryObject;
      for (let i = categorySiteSections.length + 1; i < 5; i++) {
        newCategoryObject['siteSection' + i] = 'n/a';
      }
      return newCategoryObject;
    } else {
      return categoryObject;
    }
  }

  function setPageName(siteSectionName, countryIndex, flagLanguage, pageType) {
    let pageName = '';
    if (flagLanguage) {
      countryIndex = 0;
      siteSectionName.forEach((element, index) => {
        if (index > (countryIndex+1)) {
          pageName += ':' + element;
        }
      })
      pageName = pageName.replace('.html', '');
      pageName += ':' + pageType;
      return pageName;
    }
    siteSectionName.forEach((element, index) => {
      if (index > (countryIndex-2)) { // countryIndex less 2 sites that mean language and country
        pageName += ':' + element;
      }
    })
    pageName = pageName.replace('.html', '');
    return pageName;
  }

  /**
   * 
   * @param {string} language 
   * @param {string} url 
   */
  function setFlagHomeLanguagePage(language, url) {
    const pages = url.split('.html')[0].split('/');
    const page = pages[pages.length - 1];
    return page == language;
  }

  /**
   * 
   * @param {string} errorCode 
   */
  function setErrorFlag(errorCode) {
    let flagError = false;
    if (errorCode.includes('error')) {
      flagError = true;
      errorCode = errorCode.split('errors')[1].replace('.html','').substring(1);
    }
    return {
      flagError,
      errorCode
    }
  }

  function pageShownHandler(event) {
    const dataObject = getDataObjectHelper(event, {
      '@type': 'tds-site/components/page',
    });
    if (dataObject != null) {
      /**@type String */
      let errorCode = dataObject['repo:path'];
      const errorName = dataObject['dc:title'];
      const pathnamePage = window.location.pathname;
      const errorObject = setErrorFlag(errorCode);
      const flagError = errorObject.flagError;
      const url = window.location.href;
      const server = window.location.hostname;
      
      let categoryObject = { pageType: ''};
      const language = dataObject['xdm:language'];
      const flagLanguage = setFlagHomeLanguagePage(language, pathnamePage);
      const cmpShowAdobeDataLayer = window.adobeDataLayer[0];
      const pageObjectName = Object.keys(cmpShowAdobeDataLayer.page)[0];
      const pageInfo = cmpShowAdobeDataLayer.page[pageObjectName];
      const pageType = pageInfo['xdm:pageType'];
      const siteSectionName = [];
      pathnamePage.split('/').forEach((item, index) => index > 0 && siteSectionName.push(item));
      const returnObject  = getCountry(siteSectionName, language, flagLanguage);
      const country = returnObject.country;
      const countryIndex = returnObject.index;
      const pageName = setPageName(siteSectionName, countryIndex, flagLanguage, pageType);
      const pageCurrency = pageInfo['xdm:currency'];
      let cont = 0;
      siteSectionName.forEach((siteSection, index) => {
        if (index > 0 && index > (countryIndex) && index < siteSectionName.length) {
          categoryObject['siteSection' + (cont += 1)] = siteSection.replace('.html', '');
        }
      });
      categoryObject = fillCategorySiteSections(categoryObject, flagLanguage);
      categoryObject.pageType = pageType;
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
            errorCode: flagError ? errorCode : '',
            errorName: flagError ? errorName : ''
          },
          visitor: {
            ecID: userIsLoggedIn && userData?.id ? userData.id : null,
            sapID: userIsLoggedIn && userData?.activeCustomer?.customerNumber ? userData.activeCustomer.customerNumber : null,
            loginStatus: userIsLoggedIn ? "Logged in" : "Logged out"
          }
        },
      };
      dataLayerObject.page[pageObjectName] = pageInfo;
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
