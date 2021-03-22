
var redirectValue = getQueryStringValue("redirect_uri");

function getQueryStringValue (key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

console.log(redirectValue);

document.passForm.action = "/auth?redirect_uri=" + redirectValue;