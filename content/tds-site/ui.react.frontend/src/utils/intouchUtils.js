import { getUrlParamsCaseInsensitive } from "./index";

export const intouchHeaderAPIUrl = () => addSalesLogin(document.body.getAttribute("data-intouch-header-api-url"));
export const intouchFooterAPIUrl = () => addSalesLogin(document.body.getAttribute("data-intouch-footer-api-url"));
export const intouchUserCheckAPIUrl = () => addSalesLogin(document.body.getAttribute("data-intouch-user-check-api-url"));
export const uiServiceDomain = () => document.body.getAttribute("data-ui-service-domain");
export const getUserEndpoint = () => document.body.getAttribute("data-get-user-endpoint");
export const getSalesLogin = () => { return getUrlParamsCaseInsensitive().saleslogin; };

export const addSalesLogin = (url) => {
  let salesLogin = getSalesLogin();
  if (!salesLogin) return url;

  var arr = url.split('/');
  arr.splice(5, 0, salesLogin); // this is IntouchUrl -> saleslogin is always on the same position
  return arr.join('/');
};