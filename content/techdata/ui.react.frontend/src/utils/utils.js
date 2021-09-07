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
