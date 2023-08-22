export const intouchCSSAPIUrl = () => document.body.getAttribute("data-intouch-css-api-url");
export const intouchJSAPIUrl = () => document.body.getAttribute("data-intouch-js-api-url");
export const intouchHeaderAPIUrl = () => addSalesLogin(document.body.getAttribute("data-intouch-header-api-url"));
export const intouchFooterAPIUrl = () => addSalesLogin(document.body.getAttribute("data-intouch-footer-api-url"));
export const intouchUserCheckAPIUrl = () => addSalesLogin(document.body.getAttribute("data-intouch-user-check-api-url"));
export const uiServiceDomain = () => document.body.getAttribute("data-ui-service-domain");
export const getUserEndpoint = () => document.body.getAttribute("data-get-user-endpoint");

export const addSalesLogin = (url) => {
    const params = new URLSearchParams(window.location.search);
    let lowerCaseParams = new URLSearchParams();
    for (const [name, value] of params) {
        lowerCaseParams.append(name.toLowerCase(), value);
    }
    let salesLogin = lowerCaseParams.get("saleslogin");
    if (salesLogin) {
        var arr = url.split('/');
        arr.splice(5, 0, salesLogin);
        return arr.join('/');
    }
    return url;
};