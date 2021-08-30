import React, { Fragment } from "react";
import { nanoid } from 'nanoid';
import { usPost } from './api';
import {skip} from "rxjs/operators";

export const createSessionId = () => nanoid(16)

export const setSessionId = (sessionId) =>
  localStorage.setItem('sessionId', sessionId)

export const getSessionId = () => localStorage.getItem('sessionId')

export const signOut = async (redirectURL, pingLogoutUrl, errorPageUrl, shopLogoutRedirectUrl, skipShop) => {
  const { protocol, hostname, port, pathname } = window.location;
  let sessionId = localStorage.getItem('sessionId');

    if(window.SHOP && window.SHOP.authentication && !skipShop) {
    window.SHOP.authentication.signOut();
  } else {

    /**
     * 2 step logout process:
     *  - initiate UI service logout
     *    -- on no error initiate ping federate logout with shop redirecturl
     */
      // Initiate UI service logout
      // {"content":{"message":"User logged out successfully"},"error":{"code":0,"messages":[],"isError":false}}

      try {

        const { data: { error: { isError } } } = await usPost(redirectURL, { });
        if( !isError ) {
            // Initiate Ping Federate logout
            pingLogoutUrl = pingLogoutUrl + "?TargetResource=" + shopLogoutRedirectUrl + "&InErrorResource=" + errorPageUrl;
            localStorage.removeItem('sessionId');
            localStorage.removeItem('signin');
            localStorage.removeItem('signout');
            localStorage.removeItem('userData');
            localStorage.removeItem('signInCode');
            localStorage.removeItem('ActiveCart');

            window.location.href = pingLogoutUrl;

        }
      } catch(e){
        console.error('Error occurred when trying to logout');
        console.error(e);
      }

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
