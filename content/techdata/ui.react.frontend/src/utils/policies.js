import { getUser } from "./index";

export const redirectUnauthenticatedUser = (authUrl, clientId, shopLoginRedirectUrl) => {

    // colon separated shop domain names
    let actionLogin = 'action=login';
    let currUrl = window.location.href;
    if(currUrl.indexOf('action=login') > 0) {
        currUrl = currUrl.split(actionLogin)[0];
    }
    let redirectUri = encodeURIComponent(currUrl);
    if(window.SHOP && window.SHOP.authentication) {
        //handle login for shop
        redirectUri = shopLoginRedirectUrl + "?returnURL=" + redirectUri;
        window.location.href = redirectUri;
    } else {
        //handle login for aem
        initiateAEMLogin(authUrl, clientId, redirectUri);
    }
};

export const initiateAEMLogin = (authUrl, clientId, redirectUri) => {
    let authUrlLocal = authUrl + "?redirect_uri=" + redirectUri;
    authUrlLocal = authUrlLocal + "&client_id=" + clientId;
    authUrlLocal = authUrlLocal + "&response_type=code";
    authUrlLocal = authUrlLocal + "&pfidpadapterId=ShieldBaseAuthnAdaptor";
    window.location.href = authUrlLocal;
}

export const isAuthenticated = (authUrl, clientId, isPrivatePage, shopLoginRedirectUrl) => {
    const user = getUser();
    const signinCode = localStorage.getItem("signInCode");

    const getIsEditMode = () => {
        return window.location.href.includes("editor.html");
    }

    const isEditMode = getIsEditMode();

    return user || signinCode || !isPrivatePage || isEditMode
        ? null
        : redirectUnauthenticatedUser(authUrl, clientId, shopLoginRedirectUrl);
};

export const refreshPage = () => {
    const { search, origin, pathname } = window.location;
    if (search) window.location.href = `${origin}${pathname}`;
    return true;
};
