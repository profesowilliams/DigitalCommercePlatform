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