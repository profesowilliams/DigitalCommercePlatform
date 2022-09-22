
//Extra Reload Disabled Feature Flag.
export const isExtraReloadDisabled = () => document.body.hasAttribute("data-disable-extra-reload");

export const isHttpOnlyEnabled = () => document.body.hasAttribute("data-signin-httponly");

export const isAuthormodeAEM = () => document.body.hasAttribute("data-authormode");

export const isDisableChecksForDCPAccess = () => document.body.hasAttribute("data-disable-check-for-dcp-access");
export const disableEntitlementsList = () => document.body.getAttribute("data-disable-entitlements-list");
export const intouchCSSAPIUrl = () => document.body.getAttribute("data-intouch-css-api-url");
export const intouchJSAPIUrl = () => document.body.getAttribute("data-intouch-js-api-url");
export const intouchHeaderAPIUrl = () => document.body.getAttribute("data-intouch-header-api-url");
export const intouchFooterAPIUrl = () => document.body.getAttribute("data-intouch-footer-api-url");
export const isImpersonateAccountHeaderDisabled = () => document.body.hasAttribute("data-disable-impersonation-header");
