import {nanoid} from "nanoid";

export function getQueryStringValue (key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

export const prepareCommonHeader = () => ({
    "TraceId" : "NA",
    "Site": "NA",
    "Accept-Language" : "en-us",
    "Consumer" : "NA",
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

/**
* Add onload event for form submit to handle input text XSS validations.
*/
window.onload = function() {
    var form = document.getElementsByClassName('cmp-form');
    if(form) {
        document.getElementsByClassName("cmp-form-button")[0].insertAdjacentHTML("beforeBegin","<p id='cmp-form-error-block' style='color: red;padding-bottom: 10px;font-size: 11px;font-weight: 700;'></p>");
        form[0].addEventListener("submit", processForm);
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
