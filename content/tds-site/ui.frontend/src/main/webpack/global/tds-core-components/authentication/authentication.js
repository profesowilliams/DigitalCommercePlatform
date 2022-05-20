(function(){

    const ACTION_LOGIN_QUERY_PARAM = "action=login";
    const ACTION_QUERY_PARAM = "action";
    const ACTION_QUERY_PARAM_DELIMITER = "|";

    function handleAutoLoginInAEM(event) {
        let searchValue = window.location.search;
        if(searchValue.indexOf(ACTION_LOGIN_QUERY_PARAM) > -1) {
            let actionParam = getQueryStringValue(ACTION_QUERY_PARAM);
            let actionParamValues = actionParam.split(ACTION_QUERY_PARAM_DELIMITER);
            if (actionParamValues.length > 0) {
              let redirectUrl = actionParamValues.length > 1 ? actionParamValues[1] : "";
              if(redirectUrl) {
                window.location.href = redirectUrl;
                event.preventDefault();
              }
            }
        }
    }

    function getQueryStringValue (key) {
        return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }

    document.addEventListener("DOMContentLoaded", handleAutoLoginInAEM);

})();
