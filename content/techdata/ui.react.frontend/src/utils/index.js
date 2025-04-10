import React, { Fragment } from "react";
import { nanoid } from 'nanoid';
import { usPost } from './api';
import { initiateAEMLogin } from "./policies";

export const createSessionId = () => nanoid(16)

export const createMaxTimeout = () => {
    // Setting sessionMaxTimeout to future time
    var dt = new Date();
    dt.setHours(dt.getHours() + 8);
    localStorage.setItem('sessionMaxTimeout', dt.valueOf());
}

export const setSessionId = (sessionId) =>
  localStorage.setItem('sessionId', sessionId)

export const signOutUser = async (redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl, ignoreAEMRoundTrip, isPrivatePage, isLoggedIn, isNewLoginEnabled) => {
    /**
     * 2 step logout process:
     *  - initiate UI service logout
     *    -- on no error initiate ping federate logout with shop redirecturl
     */
      // Initiate UI service logout
      // {"content":{"message":"User logged out successfully"},"error":{"code":0,"messages":[],"isError":false}}

      try {
        if(!isLoggedIn) {
            cleanupLocalStorage(shopLogoutRedirectUrl);
        } else {
          const response = await usPost(redirectURL, { });
            if( response.status == 200 || response.status == 401 ) {
                handleLogout(redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl, ignoreAEMRoundTrip, isPrivatePage, isNewLoginEnabled);
            }
        }
      } catch(e){
        //TODO: Marking possible place to fix the logout issue
        //cleanupLocalStorage(window.location.href);
        console.error('Error occurred when trying to logout');
        console.error(e);
      }
}

export const handleLogout = (redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl, ignoreAEMRoundTrip, isPrivatePage, isNewLoginEnabled) => {
    if(!ignoreAEMRoundTrip) {
        var logoutReturnUrl = window.location.href;
        if(isPrivatePage) {
            logoutReturnUrl = window.location.origin;
            var returnHomePageUrl = $(".cmp-languagenavigation__item-link")[0].href;
            if(returnHomePageUrl) {
                logoutReturnUrl = returnHomePageUrl;
            }
        }
        shopLogoutRedirectUrl = shopLogoutRedirectUrl;// + "?returnUrl=" + encodeURIComponent(logoutReturnUrl);
    }
    pingLogoutUrl = pingLogoutUrl + "?TargetResource=" + shopLogoutRedirectUrl + "&InErrorResource=" + encodeURIComponent(errorPageUrl);

    cleanupLocalStorage(isNewLoginEnabled ? shopLogoutRedirectUrl : pingLogoutUrl);
}

export const cleanupLocalStorage = (logoutRedirectUrl, authUrl, clientId) => {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('signin');
    localStorage.removeItem('signout');
    localStorage.removeItem('userData');
    localStorage.removeItem('sessionMaxTimeout');
    localStorage.removeItem('sessionIdleTimeout');
    localStorage.removeItem('signInCode');
    localStorage.removeItem('redirectUrl');
    localStorage.removeItem('ActiveCart');
    authUrl ? initiateAEMLogin(authUrl, clientId, logoutRedirectUrl) : window.location.replace(logoutRedirectUrl);
}

export const signOutBasedOnParam = (redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl, ignoreAEMRoundTrip) => {
    signOutUser(redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl, ignoreAEMRoundTrip);
}

export const signOutForExpiredSession = (authUrl, clientId) => {
    cleanupLocalStorage(window.location.href, authUrl, clientId);
}

export const signOut = (redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl, aemAuthUrl, isPrivatePage, isLoggedIn, isNewLoginEnabled) => {
  const { protocol, hostname, port, pathname } = window.location;
  let returnUrl = encodeURIComponent(aemAuthUrl + "|"+ window.location.href);

  let replacedShopLogoutRedirectUrl = shopLogoutRedirectUrl.replaceAll("{returnUrl}", aemAuthUrl);
  if(window.SHOP && window.SHOP.authentication) {
    /**cleaning up localstorage for logout*/
    localStorage.removeItem('userData');
    localStorage.removeItem('ActiveCart');
    localStorage.removeItem('signin');
    window.location.replace(replacedShopLogoutRedirectUrl);
  } else {
    signOutUser(redirectURL, pingLogoutUrl, errorPageUrl, replacedShopLogoutRedirectUrl, false /*redirect back to current url*/, isPrivatePage, isLoggedIn, isNewLoginEnabled) ;
  }
}

export const getUser = () => JSON.parse(localStorage.getItem('userData'))

export const getUrlParams = () =>
  Object.fromEntries(
    new Map(
      window.location.search
        .replace('?', '')
        .split('&')
        .map((item) => item.split('='))
    )
  )

export const isObject = (val) =>
  typeof val === "object" && !Array.isArray(val) && val !== null;

// Return request site and language from dcp url segments
export function getHeaderInfoFromUrl(pathName) { 
  let countryIndex = 1; // uat/stage/prod
  let languageIndex = 2
  const pathArray = pathName?.split('/');
  if (pathArray && pathArray.length >= 5 && pathArray[1] === 'content') {
    countryIndex = 4; // dit/sit
    languageIndex = 5; 
  }
  const country = pathArray[countryIndex]?.toUpperCase() || '';
  const language = pathArray[languageIndex]?.replace('.html', '') || country === 'US' ? 'en' : '';
  return {
    site: country,
    acceptLanguage: resolveAcceptLanguage(language, country)
  };
}

function resolveAcceptLanguage (language, country) {
  const collectiveCountry = country === 'UK' ? 'GB' : country;
  return language + '-' + collectiveCountry;
}

// Return request consumer from global-config
export function getConsumerRequestHeader() {
  if (
    document.body.hasAttribute('data-consumer-request-header') &&
    document.body.getAttribute('data-consumer-request-header').length > 0
  ) {
    return document.body.getAttribute('data-consumer-request-header');
  }
  return 'AEM';
}

export function isEnvironmentEnabled() {
  return document.body.hasAttribute('data-environment-header-enabled');
}

export function getEnvironmentHeader() {
  if (
    document.body.hasAttribute('data-environment-request-header') &&
    document.body.getAttribute('data-environment-request-header').length > 0
  ) {
    return document.body.getAttribute('data-environment-request-header');
  }
  return '';
}