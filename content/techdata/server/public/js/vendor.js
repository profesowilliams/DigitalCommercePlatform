console.log("vendor.js");
var redirectValue = getQueryStringValue("redirectUrl");

function getQueryStringValue (key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

console.log(redirectValue);

document.passForm.action = redirectValue+"?code=1234";