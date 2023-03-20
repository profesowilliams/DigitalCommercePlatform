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
    const pageInfo = window.adobeDataLayer.getState('page')?.pageInfo;
    if (pageInfo) {
      elementReturn.country = pageInfo.country;
    } else {
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
    }
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
      siteSectionName.forEach((element, index) => {
        if (index > (countryIndex+1)) {
          pageName += '>' + element;
        }
      })
      pageName = pageName.replace('.html', '');
      pageName += '>' + pageType;
      return pageName;
    }
    siteSectionName.forEach((element, index) => {
      if (index > (countryIndex)) { 
        pageName += '>' + element;
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
    try {
      if (errorCode.includes('error')) {
        flagError = true;
        errorCode = errorCode.split('errors')[1].replace('.html','').substring(1);
      }
      return {
        flagError,
        errorCode
      }
    } catch (error) { // in case of null or undefined, catch the return object
      return {
        flagError,
        errorCode: ''
      }
    }
  }

  function getComponentType(componentString) {
    return componentString.indexOf('/') > -1 ? componentString?.match(/\/([^\/]+)\/?$/)[1]?.toLowerCase() : componentString;
  }

  function getFullComponentType(componentString) {
    const index = componentString.indexOf('/components/') + 12;
    return componentString.substring(index);
  }

  function pageShownHandler(event) {
    const dataObject = getDataObjectHelper(event, {
      '@type': window.adobeDataLayer.getState(event.eventInfo.path)['@type'],
    });
    let dataLayerObject = {};
    if (dataObject != null) {
      const componentType = getComponentType(dataObject['@type']);
      const componentTypeName = getFullComponentType(dataObject['@type']);
      if (componentType === 'page') {
        const pathnamePage = window.location.pathname;
        const url = window.location.href;
        const language = dataObject['xdm:language'];
        const flagLanguage = setFlagHomeLanguagePage(language, pathnamePage);
        const cmpShowAdobeDataLayer = window.adobeDataLayer[0];
        const pageObjectName = Object.keys(cmpShowAdobeDataLayer.page)[0];
        const pageInfo = cmpShowAdobeDataLayer.page[pageObjectName];
        const pageType = pageInfo['xdm:pageType'];
        const siteSectionName = [];
        pathnamePage.split('/').forEach((item, index) => index > 0 && siteSectionName.push(item));
        const returnObject = getCountry(siteSectionName, language, flagLanguage);
        const country = returnObject.country;
        const countryIndex = returnObject.index;
        const pageName = setPageName(siteSectionName, countryIndex, flagLanguage, pageType);
        const pageCurrency = pageInfo['xdm:currency'];
        const noCustomerNumber = { customerNumber: '' };
        const accountDetail = userIsLoggedIn ? userData?.customersV2.length ?
          userData?.customersV2[0] : noCustomerNumber :
          noCustomerNumber;

        dataLayerObject = {
          "event": "show",
          "country": country,
          "pageCategory": pageType,
          "pageName": pageName.substring(1),
          "userID": userIsLoggedIn && userData?.id ? userData.id : '',
          "customerID": accountDetail.customerNumber,
          "currencyCode": pageCurrency,
          "internalTraffic": userIsLoggedIn ? userData?.isInternal?.toString() : null,
          "language": language,
          "loginStatus": userIsLoggedIn ? 'Logged in' : 'Logged out',
          "url": url, 
        };
        window.dataLayer.push(dataLayerObject);
      } else {
        // Handle all other component show events here
        const parentObject = dataObject['parentId'] ? window.adobeDataLayer.getState('component.' + dataObject['parentId']) : null;
        switch (componentType) {
          case 'item':
            if (dataObject['@type'].includes('alertcarousel')) {
              dataLayerObject = {
                "event": "show",
                "showInfo": {
                  "category": parentObject ? parentObject['analyticsCategory'] ?? "carousel" : "carousel",
                  "title": dataObject['dc:title'],
                  "url": dataObject['xdm:linkURL'] ?? "",
                  "type": componentTypeName
                }
              };
            } else if (dataObject['@type'].includes('subheader')) {
              dataLayerObject = {
                "event": "show",
                "showInfo": {
                  "category": parentObject ? parentObject['analyticsCategory'] ?? "subheader" : "subheader",
                  "title": dataObject['dc:title'],
                  "url": dataObject['xdm:linkURL'] ?? "",
                  "type": componentTypeName
                }
              };
            } else if (dataObject['@type'].includes('honeycomb')) {
              dataLayerObject = {
                "event": "show",
                "showInfo": {
                  "category": parentObject ? parentObject['analyticsCategory'] ?? "" : "",
                  "title": dataObject['dc:title'],
                  "url": dataObject['xdm:linkURL'] ?? "",
                  "type": "honeycomb"
                }
              };
            } else if (dataObject['@type'].includes('accordion')) {
              dataLayerObject = {
                "event": "show",
                "showInfo": {
                  "category": parentObject ? parentObject['analyticsCategory'] ?? "" : "",
                  "title": dataObject['dc:title'],
                  "url": dataObject['xdm:linkURL'] ?? "",
                  "type": "accordion"
                }
              };
            } else {
              // Some other item type
              dataLayerObject = {
                "event": "show",
                "showInfo": {
                  "category": parentObject ? parentObject['analyticsCategory'] ?? "" : "",
                  "title": dataObject['dc:title'],
                  "url": dataObject['xdm:linkURL'] ?? "",
                  "type": componentTypeName
                }
              };
            }
            break;
          default:
            dataLayerObject = {
              "event": "show",
              "showInfo": {
                "category": dataObject['analyticsCategory'] ?? "",
                "title": dataObject['dc:title'],
                "url": dataObject['xdm:linkURL'] ?? "",
                "type": componentTypeName// (Required)-the type of component-- Tab, Carousel, Alert carousel, Accordion, Honeycomb, Notification
              }
            };
            break;
        }
        window.dataLayer.push(dataLayerObject);
      }
    }
  }

  function clickHandler(event) {
    const typeString = window.adobeDataLayer.getState(event.eventInfo.path)['@type'];
    const dataObject = getDataObjectHelper(event, {
      '@type': typeString,
    });
    const parentId = dataObject['parentId'];
    const componentType = getComponentType(typeString);
    const parentObject = parentId ?
      (window.adobeDataLayer.getState(`component.${parentId}`) ??
      window.adobeDataLayer.getState(`page.${parentId}`)) ?? 
      new Object() :
      new Object();
    let dlObject = {};

    switch (componentType) {
      case 'linkitem':
        if (parentObject.hasOwnProperty('@type') && parentObject['@type'].indexOf('hub') > -1) {
          dlObject = {
            "event": "click",
            "clickInfo": {
              "category": "Masthead",
              "title": dataObject['dc:title'],
              "type": 'hub-item',
              "url": dataObject['xdm:linkURL'] ?? "",
            }
          };
        } else if (parentObject.hasOwnProperty('@type') && parentObject['@type'].indexOf('dropdownbutton') > -1) {
          dlObject = {
            "event": "click",
            "clickInfo": {
              "category": "button",
              "title": dataObject['dc:title'],
              "type": "dropdown-button-item",
              "url": dataObject['xdm:linkURL'] ?? "",
            }
          };
        } else {
          dlObject = {
            "event": "click",
            "clickInfo": {
              "category": "",
              "title": dataObject['dc:title'],
              "type": componentType,
              "url": dataObject['xdm:linkURL'] ?? "",
            }
          };
        }
        break;
      case 'cta':
        if (parentObject.hasOwnProperty('@type') && parentObject['@type'].indexOf('hero') > -1) {
          dlObject = {
            "event": "click",
            "clickInfo": {
            "category": "",
            "title": dataObject['dc:title'],
            "type": "hero-cta",
            "url": dataObject['xdm:linkURL'] ?? "",
            }
           };
         } else if (parentObject.hasOwnProperty('@type') && parentObject['@type'].indexOf('teaser') > -1) {
          dlObject = {
            "event": "click",
            "clickInfo": {
            "category": "",
            "title": dataObject['dc:title'],
            "type": "teaser-cta",
            "url": dataObject['xdm:linkURL'] ?? "",
            }
           };
         }
         break;
      case 'hero':
          dlObject = {
            "event": "click",
            "clickInfo": {
            "category": "",
            "title": dataObject['dc:title'],
            "type": "hero",
            "url": dataObject['xdm:linkURL'] ?? "",
            }
           };
           break;
      case 'dropdownbutton':  
        dlObject = {
          "event": "click",
          "clickInfo": {
            "category": "button",
            "title": dataObject['dc:title'],
            "type": "dropdown-button",
            "url": "",
          }
        };
        break;
      case 'button':
        dlObject = {
          "event": "click",
          "clickInfo": {
            "category": "button",
            "title": dataObject['dc:title'],
            "type": componentType,
            "url": dataObject['xdm:linkURL'] ?? "",
          }
        };
        break;
      case 'hub':
        dlObject = {
          "event": "click",
          "clickInfo": {
            "category": "Masthead",
            "title": dataObject['dc:title'],
            "type": componentType,
            "url": dataObject['xdm:linkURL'] ?? "",
          }
        };
        break;
      case 'alertcarousel-alert-action':
        dlObject = {
          "event": "click",
          "clickInfo": {
            "category": dataObject['analyticsCategory'],
            "title": dataObject['dc:title'],
            "type": componentType,
            "url": dataObject['xdm:linkURL'] ?? "",
          }
        };
        break;
      case 'alertcarousel':
      case 'carousel':
        const shownItem = window.adobeDataLayer.getState(`component.${dataObject.shownItems[0]}`);
        dlObject = {
          "event": "click",
          "clickInfo": {
            "category": "cta",
            "title": shownItem['dc:title'],
            "type": componentType,
            "url": dataObject['xdm:linkURL'] ?? "",
          }
        };
        break;
      case 'title':
        dlObject = {
          "event": "click",
          "clickInfo": {
            "category": "cta",
            "title": dataObject['dc:title'],
            "type": componentType,
            "url": dataObject['xdm:linkURL'] ?? "",
          }
        };
        break;
      case 'teaser':
        dlObject = {
          "event": "click",
          "clickInfo": {
          "category": "",
          "title": dataObject['dc:title'],
          "type": 'teaser',
          "url": dataObject['xdm:linkURL'] ?? "",
          }
         };
        break;
      case 'item':
        if (parentObject.hasOwnProperty('@type') && parentObject['@type'].indexOf('megamenu') > -1) {
          dlObject = {
            "event": "click",
            "clickInfo": {
              "category": "Masthead",
              "title": dataObject['dc:title'],
              "type": 'megamenu-item',
              "url": dataObject['xdm:linkURL'] ?? "",
            }
          };
        } else if (parentObject.hasOwnProperty('@type') &&
          (parentObject['@type'].indexOf('honeycomb') > -1 || parentObject['@type'].indexOf('accordion') > -1)) {
          dlObject = {
            "event": "click",
            "clickInfo": {
              "category": parentObject ? parentObject['analyticsCategory'] ?? "" : "",
              "title": dataObject['dc:title'],
              "type": getComponentType(parentObject['@type']),
              "url": dataObject['xdm:linkURL'] ?? "",
            }
          };
        } else {
          dlObject = {
            "event": "click",
            "clickInfo": {
              "category": parentObject ? parentObject['analyticsCategory'] ?? "" : "",
              "title": dataObject['dc:title'],
              "type": componentType,
              "url": dataObject['xdm:linkURL'] ?? "",
            }
          };
        }
        break;
      case 'articlelist':
        dlObject = {
          "event": "click",
          "clickInfo": {
            "category": "list",
            "title": dataObject['dc:title'],
            "type": componentType,
            "url": dataObject['xdm:linkURL'] ?? "",
          }
        };
        break;
      default:
        dlObject = {
          "event": "click",
          "clickInfo": {
            "category": "link",
            "title": dataObject['dc:title'],
            "type": componentType,
            "url": dataObject['xdm:linkURL'] ?? "",
          }
        };
        break;
    };
    window.dataLayer.push(dlObject);
  }

  function hideHandler(event) {
    const dataObject = getDataObjectHelper(event, {
      '@type': window.adobeDataLayer.getState(event.eventInfo.path)['@type'],
    });
    const componentType = getComponentType(dataObject['@type']);
    const componentTypeName = getFullComponentType(dataObject['@type']);
    const parentObject = dataObject['parentId'] ? window.adobeDataLayer.getState('component.' + dataObject['parentId']) : null;
    let dataLayerObject = {};
    switch (componentType) {
      case 'item':
        if (dataObject['@type'].includes('alertcarousel')) {
          dataLayerObject = {
            "event": "hide",
            "hideInfo": {
              "category": parentObject ? parentObject['analyticsCategory'] ?? "carousel" : "carousel",
              "title": dataObject['dc:title'],
              "url": dataObject['xdm:linkURL'] ?? "",
              "type": componentTypeName
            }
          };
        } else if (dataObject['@type'].includes('subheader')) {
          dataLayerObject = {
            "event": "hide",
            "hideInfo": {
              "category": parentObject ? parentObject['analyticsCategory'] ?? "subheader" : "subheader",
              "title": dataObject['dc:title'],
              "url": dataObject['xdm:linkURL'] ?? "",
              "type": componentTypeName
            }
          };
        } else if (dataObject['@type'].includes('honeycomb')) {
          dataLayerObject = {
            "event": "hide",
            "hideInfo": {
              "category": parentObject ? parentObject['analyticsCategory'] ?? "" : "",
              "title": dataObject['dc:title'],
              "url": dataObject['xdm:linkURL'] ?? "",
              "type": "honeycomb"
            }
          };
        } else if (dataObject['@type'].includes('accordion')) {
          dataLayerObject = {
            "event": "hide",
            "hideInfo": {
              "category": parentObject ? parentObject['analyticsCategory'] ?? "" : "",
              "title": dataObject['dc:title'],
              "url": dataObject['xdm:linkURL'] ?? "",
              "type": "accordion"
            }
          };
        } else {
          // Some other item type
          dataLayerObject = {
            "event": "hide",
            "hideInfo": {
              "category": parentObject ? parentObject['analyticsCategory'] ?? "" : "",
              "title": dataObject['dc:title'],
              "url": dataObject['xdm:linkURL'] ?? "",
              "type": componentTypeName
            }
          };
        }
        break;
      default:
        dataLayerObject = {
          "event": "hide",
          "hideInfo": {
            "category": dataObject['analyticsCategory'] ?? "",
            "title": dataObject['dc:title'],
            "url": dataObject['xdm:linkURL'] ?? "",
            "type": componentTypeName// (Required)-the type of component-- Tab, Carousel, Alert carousel, Accordion, Honeycomb, Notification
          }
        };
        break;
    }
    window.dataLayer.push(dataLayerObject);
  }

  function initDataLayer() {
    window.dataLayer = window.dataLayer || [];
    window.adobeDataLayer = window.adobeDataLayer || [];
    window.adobeDataLayer.push(function (dl) {
      dl.addEventListener('cmp:show', pageShownHandler);
    });
    window.adobeDataLayer.push(function (dl) {
      dl.addEventListener('cmp:hide', hideHandler);
    });
    window.adobeDataLayer.push(function (dl) {
      dl.addEventListener('cmp:click', clickHandler);
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
