import React, { Fragment } from "react";
import { nanoid } from 'nanoid';
import { usPost } from './api';
import {skip} from "rxjs/operators";
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

export const getSessionId = () => localStorage.getItem('sessionId')

export const signOutUser = async (redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl, ignoreAEMRoundTrip, isPrivatePage) => {
    /**
     * 2 step logout process:
     *  - initiate UI service logout
     *    -- on no error initiate ping federate logout with shop redirecturl
     */
      // Initiate UI service logout
      // {"content":{"message":"User logged out successfully"},"error":{"code":0,"messages":[],"isError":false}}

      try {
        if(!getSessionId()) {
            cleanupLocalStorage(shopLogoutRedirectUrl);
        } else {
            const response = await usPost(redirectURL, { });
            if( response.status == 200 || response.status == 401 ) {
                handleLogout(redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl, ignoreAEMRoundTrip, isPrivatePage);
            }
        }
      } catch(e){
        console.error('Error occurred when trying to logout');
        console.error(e);
      }
}

export const handleLogout = (redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl, ignoreAEMRoundTrip, isPrivatePage) => {
    if(!ignoreAEMRoundTrip) {
        var logoutReturnUrl = window.location.href;
        if(isPrivatePage) {
            logoutReturnUrl = window.location.origin;
        }
        shopLogoutRedirectUrl = shopLogoutRedirectUrl + "?returnUrl=" + encodeURIComponent(logoutReturnUrl);
    }
    pingLogoutUrl = pingLogoutUrl + "?TargetResource=" + shopLogoutRedirectUrl + "&InErrorResource=" + encodeURIComponent(errorPageUrl);
    cleanupLocalStorage(pingLogoutUrl);
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

export const signOut = (redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl, aemAuthUrl, isPrivatePage) => {
  const { protocol, hostname, port, pathname } = window.location;
  let sessionId = localStorage.getItem('sessionId');

  if(window.SHOP && window.SHOP.authentication) {
    /**cleaning up localstorage for logout*/
    localStorage.removeItem('userData');
    localStorage.removeItem('ActiveCart');
    localStorage.removeItem('signin');
    let returnUrl = encodeURIComponent(aemAuthUrl + "|"+ window.location.href);
    window.location.replace(shopLogoutRedirectUrl + "?returnUrl=" + returnUrl);
  } else {
    signOutUser(redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl, false /*redirect back to current url*/, isPrivatePage) ;
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
