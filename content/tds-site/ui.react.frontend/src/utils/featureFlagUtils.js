//Extra Reload Disabled Feature Flag.
export const isExtraReloadDisabled = () => document.body.hasAttribute("data-disable-extra-reload");
export const isHttpOnlyEnabled = () => document.body.hasAttribute("data-signin-httponly");
export const isAuthormodeAEM = () => document.body.hasAttribute("data-authormode");
export const isDisableChecksForDCPAccess = () => document.body.hasAttribute("data-disable-check-for-dcp-access");
export const disableEntitlementsList = () => document.body.getAttribute("data-disable-entitlements-list");
export const isImpersonateAccountHeaderDisabled = () => document.body.hasAttribute("data-disable-impersonation-header");
export const isEnvironmentEnabled = () => document.body.hasAttribute('data-environment-header-enabled');
export const isQualtricsCodeEnabled = () => document.body.hasAttribute('data-qualtricsCode-enabled');