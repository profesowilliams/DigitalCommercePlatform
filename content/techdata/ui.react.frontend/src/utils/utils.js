import axios from "axios";
import {nanoid} from "nanoid";
import { usPost } from "./api";

export function getQueryStringValue (key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

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
* Remove the style attribute on body tag if sessionId is present
*/
window.onload = function() {
    if(localStorage.getItem('sessionId') !== null) {
        document.getElementsByClassName('basicpage')[0].setAttribute('style', '');
    }
}
