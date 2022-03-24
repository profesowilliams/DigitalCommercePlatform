import axios from "axios";
import {nanoid} from "nanoid";
import { usPost } from "./api";

export function getQueryStringValue (key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

export const getSingleQueryStringParameterFromUrl = (queryStringParameterName) => {
    const value = new URLSearchParams(window.location.search).get(queryStringParameterName);

    return value && value.length > 0 ? value : null;
};

// Not updating the TraceId on this function as it does not appear to be used and may be a leftover from a POC
export const prepareCommonHeader = () => ({
    "TraceId" : "NA",
    "Site": "NA",
    "Accept-Language" : "en-us",
    "Consumer" : "AEM",
    "SessionId" : nanoid(16),
    "Content-Type": "application/json"
});

export const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

//Purpose of this util method is to toggle the language navigation
//depending on whether the user is signed in or not
export const toggleLangNavigation = (signedIn) => {
    let navigationWidget = document.querySelector("#cmp-techdata-header .languagenavigation");
    let miniCartWidget = document.querySelector("#cmp-techdata-header .minicart");
    if (signedIn) {
    //    language navigation should be hidden
    //    mini cart should be hidden

        if (navigationWidget ) {
            navigationWidget.style.display = "none";
        }

        if (miniCartWidget ) {
            miniCartWidget.style.display = "";
        }

    }else{
    //    language navigation should be visible
    //    mini cart should be hidden
        if (navigationWidget ) {
            navigationWidget.style.display = "";
        }

        if (miniCartWidget ) {
            miniCartWidget.style.display = "none";
        }
    }
}
export const getImageBuffer =  async imgPath => {
    const buffer =  await fetch(imgPath)
        .then(response => response.buffer ? response.buffer() : response.arrayBuffer())

    return buffer.constructor.name === 'Buffer' ? buffer : Buffer.from(buffer);
}

const generateFile = (response, name, options) => {
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type: type, encoding: 'UTF-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    if (options.redirect) {
        link.setAttribute("target", "_blank");
    } else {
        link.download = name;
    }
    link.click();
    link.remove();
}

export const generateExcelFileFromPost = async ({url, name = '', postData}) => {
    try {
        const sessionId = localStorage.getItem("sessionId");
        const params = {
            method: 'POST',
            url: `${url}`,
            body: postData,
            responseType: 'blob',
        };
        const response = await usPost(`${url}`, postData, params);
        if (response.data.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            alert('There was an error encountered during export.');
            return;
        }
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(response.data);
        link.download = name;
        link.click();
        link.remove();

    } catch (error) {
        console.error("error", error);
    }
}

export const postFileBlob = async (url, name = '', params, options = { redirect: false }) => {
    const response = await usPost(url, params);
    generateFile(response, name, options);
}

export const requestFileBlob = async (url, name = '', options = { redirect: false }) => {
    const response = await axios.get(url, { responseType: 'blob' });
    generateFile(response, name, options);
}

/**
* Add onload event for form submit to handle input text XSS validations.
*/

if (document.readyState !== "loading") {
    onDocumentReadyForForm();
} else {
    document.addEventListener("DOMContentLoaded", onDocumentReadyForForm);
}

function onDocumentReadyForForm() {
    var form = document.getElementsByClassName('cmp-form');
    if(form && form[0]) {
        var buttonEle = document.getElementsByClassName("cmp-form-button");
        if(buttonEle && buttonEle[0]) {
            buttonEle[0].insertAdjacentHTML("beforeBegin","<p id='cmp-form-error-block' style='color: red;padding-bottom: 10px;font-size: 11px;font-weight: 700;'></p>");
            form[0].addEventListener("submit", processForm);
        }
    }
}
/**
* As part of XSS, validating text inputs on submit of form.
*/
function processForm (e) {
    var formTextElements = document.getElementsByClassName('cmp-form-text__text');
    var buttonEle = document.getElementsByClassName('cmp-form-button');
    for (var i=0, max=formTextElements.length; i < max; i++) {
        var currElement = formTextElements[i];
        if(!(/^([-@.,;A-Za-z0-9_:/ ]{2,})$/.test(currElement.value)) && buttonEle) {
            var eleName = currElement.name;
            document.getElementById("cmp-form-error-block").innerHTML = "Validation Failed for " + eleName;
            e.preventDefault();
            return false;
        }
    }

    var formTextAreaElements = document.getElementsByClassName('cmp-form-text__textarea');
    for (var i=0, max=formTextAreaElements.length; i < max; i++) {
        var currElement = formTextAreaElements[i];
        if(!(/^([-@.,;A-Za-z0-9_:/ ]{2,})$/.test(currElement.value)) && buttonEle) {
            var eleName = currElement.name;
            document.getElementById("cmp-form-error-block").innerHTML = "Validation Failed for " + eleName;
            e.preventDefault();
            return false;
        }
    }

    return true;
};
/**
 * Function that get the data from a URL 
 * and if is a file convert to a base64
 * @param {string} url 
 * @returns 
 */
export const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = () => {
        const base64data = reader.result;   
        resolve(base64data);
      }
    });
}

export const normalizeErrorCode = (errorCode) => {
    return errorCode === 401 || errorCode === 403 || errorCode === 404 || errorCode === 408 ? errorCode : 500;
}

export const fromExceptionToErrorObject = (error) => {
    const errorCode = normalizeErrorCode(
        !error.response && error.isAxiosError && error.code === "ECONNABORTED"
        ? 408
        : error.response.status
    );

    return {
        data: {
            error: {
                code: errorCode,
                message: error.response?.statusText || error.message,
                response: error.response,
                isError: true,
            }
        }
    }; // in case of error default value to show the no row message
}

/**
 * Function that validate if the value is a null or undefined
 * and return true or false for this case
 * @param {any} value 
 * @returns 
 */
export const isNotEmptyValue = (value) => (value !== null && value !== undefined)

/**
 * Function that validate if the value and the partner
 * is not and empty value and set a default flag to the
 * Date picker component
 * 
 * Used in Grids of Orders / Quotes / Configurations
 * @param {any} value 
 * @param {any} partnerValue 
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setStateParam 
 * @returns 
 */
export const validateDatePicker = (value, partnerValue, setStateParam) =>
    setStateParam(
    isNotEmptyValue(value) ? 
        !isNotEmptyValue(partnerValue) ? false : true
        : true
    );

/**
 * Function that format in a single format used for the GRID
 * and the date pickers
 * @param {Date} dateValue 
 * @param {string} filterTag 
 * @returns 
 */
export const formateDatePicker = (dateValue, filterTag = '') => filterTag + getDateValue(dateValue);

export const isQueryValid = (query) => {
  const from = query.from?.value;
  const to = query.to?.value;
  const fromValue = from ? getDateNumber(from) : null;
  const toValue = to ? getDateNumber(to) : null;

  return (from && to) &&
    (toValue >= fromValue);
}

export const getDateValue = (date) => {
  const dateMonth = date.getMonth() + 1;
  const dateDay = date.getDate();
  return `${date.getFullYear()}-${zeroPad(dateMonth, 2)}-${zeroPad(dateDay, 2)}`;
}

/**
 * reference
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
 * @param {number} value 
 * @param {Object} extraOptions 
 * @returns 
 */
export const formatPriceNumber = (value, extraOptions = {}) => new Intl.NumberFormat('en-US', extraOptions).format(typeof value === 'number' ? value : parseFloat(value));

/***
   * validate if the date value is by defualt or setting by the user
   */
export const validateDatesForAnalytics = (dateQuery) => dateQuery?.isDefault ? false : isNotEmptyValue(dateQuery.key);

const getDateNumber = (dateValue) => Number(
  `${dateValue.getFullYear()}${zeroPad(dateValue.getMonth() + 1, 2)}${zeroPad(dateValue.getDate(), 2)}`);

const zeroPad = (value, length) => String(value).padStart(length, '0');

/**
* Remove the style attribute on body tag if sessionId is present
*/
window.onload = function() {
    if(localStorage.getItem('sessionId') !== null) {
        document.getElementsByClassName('basicpage')[0].setAttribute('style', '');
    }
}

export const getDictionaryValue = (dictionaryKey, defaultValue) => {
    let dictionaryValue = Granite?.I18n?.get(dictionaryKey);
    return dictionaryValue != dictionaryKey ? dictionaryValue : defaultValue;
}

export default function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getDayMonthYear = (date, separator = "/") => {
  const dateMonth = date.getMonth() + 1;
  const dateDay = date.getDate();
  return `${zeroPad(dateMonth, 2)}${separator}${zeroPad(
    dateDay,
    2
  )}${separator}${date.getFullYear()}`;
};

export const sortRenewalObjects = (objArray, query) => {
    query.SortBy = query.SortBy.trim().split(',').map(prop => {
      var columnDef = prop.trim().split(' ');
      if ((columnDef.length === 1 && query.SortDirection.toLowerCase() === 'asc') || (columnDef.length === 2 && columnDef[1].toLowerCase() === 'asc')) {
        columnDef = [columnDef, "asc"];
      } else {
        columnDef = [columnDef, "desc"];
      }
  
      if (columnDef[1] === "desc") {
        columnDef[1] = -1;
      } else {
        columnDef[1] = 1;
      }
      return columnDef;
    });
  
    function valueCmp(x, y) {
      return x > y ? 1 : x < y ? -1 : 0;
    }
  
    function arrayCmp(a, b) {
      var arr1 = [],
        arr2 = [];
      query.SortBy.forEach(function (prop) {   
        switch (prop[0][0].toLowerCase()) {
          case 'id':
            prop[0] = 'source.id';
            break;
          case 'type':
            prop[0] = prop[0] = 'source';
            break;
          case 'vendor':
            prop[0] = 'vendor.name';
            break;
          case 'name':
            prop[0] = 'nameUpper';
            break;
          case 'enduser':
            prop[0] = 'endUser.nameUpper';
            break;
          case 'resellername':
            prop[0] = 'reseller.nameUpper';
            break;
          case 'totallistprice':
            prop[0] = 'totalListPrice';
            break;
          case 'total':
            prop[0] = 'renewal.total';
            break;
          case 'programname':
            prop[0] = 'programName';
            break;
          case 'renewedduration':
            prop[0] = 'renewDuration';
            break;
          case 'duedate':
            prop[0] = 'dueDate';
            break;
          case 'duedays':
            prop[0] = 'dueDate';
            break;
          case 'support':
            prop[0] = 'items.contract.supportLevel';
            break;
          case 'agreementnumber':
            prop[0] = 'items.contract.id';
            break;
          default:
            break;
        }
        
        var aValue = field(a, prop),
            bValue = field(b, prop);
        arr1.push(prop[1] * valueCmp(aValue, bValue));
        arr2.push(prop[1] * valueCmp(bValue, aValue));
      });
      return arr1 < arr2 ? -1 : 1;
    }

    function field(arr, prop) {
      const col = prop[0].toString().split(".");
      if (!col[1]) {
        return arr ? arr[prop[0]] : 0;
      }
      return field(
        arr[prop[0].toString().split(".").splice(0, 1)],
        prop[0].toString().split(".").splice(1)
      );
    }
  
    return objArray && objArray.length > 0 ? objArray.sort(function (a, b) {
      return arrayCmp(a, b);
    }) : [];
  }
