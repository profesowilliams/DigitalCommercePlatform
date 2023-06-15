//Extra Reload Disabled Feature Flag.
export const isExtraReloadDisabled = () => document.body.hasAttribute("data-disable-extra-reload");

export const isHttpOnlyEnabled = () => document.body.hasAttribute("data-signin-httponly");

export const isAuthormodeAEM = () => document.body.hasAttribute("data-authormode");

export const isDisableChecksForDCPAccess = () => document.body.hasAttribute("data-disable-check-for-dcp-access");