import { getUser } from "./index";
import {isExtraReloadDisabled, intouchHeaderAPIUrl, intouchFooterAPIUrl} from "./featureFlagUtils";
import {getHeaderInfoFromUrl} from "./utils";

export const redirectUnauthenticatedUser = (authUrl, clientId, shopLoginRedirectUrl) => {

    // colon separated shop domain names
    let actionLogin = '?action=login';
    let currUrl = window.location.href;
    if(currUrl.indexOf('?action=login') > 0) {
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

    // Get Header HTML and render in DOM
    headerHTML();

    // Get Footer HTML and render in DOM
    footerHTML();

    const isEditMode = getIsEditMode();

    return user || signinCode || !isPrivatePage || isEditMode
        ? null
        : redirectUnauthenticatedUser(authUrl, clientId, shopLoginRedirectUrl);
};

export const refreshPage = event => {
    let REDIRECT_URL = "redirectUrl";
    let redirectUrlFromLS = localStorage.getItem(REDIRECT_URL);
    if(redirectUrlFromLS) {
        localStorage.removeItem(REDIRECT_URL);
        if(!isExtraReloadDisabled()){
            window.location.href = redirectUrlFromLS;
        }
        return true;
    } else {
        const { search, origin, pathname } = window.location;
        if(!isExtraReloadDisabled() && search){
            window.location.href = `${origin}${pathname}`;
        }
    }
    return true;
};

const headerHTML = () => {
    const headerEle = document.querySelector('#intouch-headerhtml');
    const sessionId = localStorage.getItem('sessionId');
    if (headerEle && sessionId) {
    	const headerInfo = getHeaderInfoFromUrl(window.location.pathname);
        let xhr = new XMLHttpRequest();
        xhr.open('GET', intouchHeaderAPIUrl);
        xhr.setRequestHeader('Site', headerInfo.site);
        xhr.setRequestHeader('SessionId', sessionId);
        xhr.setRequestHeader('Accept-Language', headerInfo.acceptLanguage);
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send();

        xhr.onload = function() {
          if (xhr.status != 200) {
            console.error(`Error ${xhr.status}: ${xhr.statusText}`);
          } else { // show the result
            console.log(xhr);
          }
        };
    }
};

const footerHTML = () => {
    const footerEle = document.querySelector('#intouch-footerhtml');
    const sessionId = localStorage.getItem('sessionId');
    if (footerEle && sessionId) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', intouchFooterAPIUrl);
        const headerInfo = getHeaderInfoFromUrl(window.location.pathname);
        xhr.setRequestHeader('Site', headerInfo.site);
        xhr.setRequestHeader('SessionId', sessionId);
        xhr.setRequestHeader('Accept-Language', headerInfo.acceptLanguage);
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send();

        xhr.onload = function() {
          if (xhr.status != 200) {
            console.error(`Error ${xhr.status}: ${xhr.statusText}`);
          } else { // show the result
            console.log(xhr);
          }
        };
    }
};