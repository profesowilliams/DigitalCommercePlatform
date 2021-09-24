import React, { Fragment } from "react";
import { nanoid } from 'nanoid';
import { usPost } from './api';
import {skip} from "rxjs/operators";

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

export const signOutUser = async (redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl) => {
    /**
     * 2 step logout process:
     *  - initiate UI service logout
     *    -- on no error initiate ping federate logout with shop redirecturl
     */
      // Initiate UI service logout
      // {"content":{"message":"User logged out successfully"},"error":{"code":0,"messages":[],"isError":false}}

      try {

        const response = await usPost(redirectURL, { });
                if( response.status == 200 || response.status == 401 ) {
            // Initiate Ping Federate logout
            shopLogoutRedirectUrl = shopLogoutRedirectUrl + "?returnUrl=" + encodeURIComponent(window.location.href);
            pingLogoutUrl = pingLogoutUrl + "?TargetResource=" + shopLogoutRedirectUrl + "&InErrorResource=" + encodeURIComponent(errorPageUrl);
            localStorage.removeItem('sessionId');
            localStorage.removeItem('signin');
            localStorage.removeItem('signout');
            localStorage.removeItem('userData');
            localStorage.removeItem('sessionMaxTimeout');
            localStorage.removeItem('sessionIdleTimeout');
            localStorage.removeItem('signInCode');
            localStorage.removeItem('ActiveCart');
            window.location.replace(pingLogoutUrl);
        }
      } catch(e){
        console.error('Error occurred when trying to logout');
        console.error(e);
      }
}

export const signOutBasedOnParam = (redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl) => {
    signOutUser(redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl);
}

export const signOut = (redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl, aemAuthUrl) => {
  const { protocol, hostname, port, pathname } = window.location;
  let sessionId = localStorage.getItem('sessionId');

  if(window.SHOP && window.SHOP.authentication) {
    let returnUrl = encodeURIComponent(aemAuthUrl + "|"+ window.location.href);
    window.location.replace(shopLogoutRedirectUrl + "?returnUrl=" + returnUrl);
  } else {
    signOutUser(redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl);
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
