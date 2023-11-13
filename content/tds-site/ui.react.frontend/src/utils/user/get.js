import { uiServiceDomain, getUserEndpoint } from '../intouchUtils';
import { mockedUserData } from './mock';
import { validateCountryAndLanguage } from './validate';
import { getHeaderInfo } from '../headers/get';
import { intouchUserCheckAPIUrl } from '../intouchUtils';
import moment from 'moment';

export const headerInfo = getHeaderInfo();
//let getUserDataPromise = null;
//let checkIntouchUserPromise = null;
let cachedUserData = null;
let cacheExpiration = null;
const CACHE_DURATION = 600; // TODO: value should be configurable

// not set yet, its set to login page after user check action is executed
// value can be used to capture 401 and redirect user to loginpage
// contains continueurl for current page
export var loginPageUrl = null;

export async function getSessionInfo() {
  const authorMode = !(
    typeof Granite === 'undefined' || typeof Granite.author === 'undefined'
  );
  const isLocalhost = window.location.href.includes('localhost');
  if (authorMode) {
    return [false, null];
  } else if (isLocalhost) {
    return [true, mockedUserData];
  }

  let isLoggedIn;
  let userData;
  let data = await getUserData();

  console.log('UserData = ' + userData);

  isLoggedIn = !!data;
  userData = data;

  return [isLoggedIn, userData];
}

async function getUserData() {
  console.log('getUserData');

  if (cachedUserData && Date.now() < cacheExpiration) {
    console.log(
      'Returning user data from local cache cacheExpiration = ' +
        new Date(cacheExpiration)
    );
    return cachedUserData;
  }

  //if (getUserDataPromise) {
  //    console.log("Returning user promise");
  //    return getUserDataPromise;
  //}

  try {
    let headers = {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': headerInfo.acceptLanguage,
      Consumer: 'AEM',
      Site: headerInfo.site,
      TraceId: new Date().toISOString(),
    };
    headerInfo.salesLogin && (headers['SalesLogin'] = headerInfo.salesLogin);

    let getUserDataPromise = fetch(uiServiceDomain() + getUserEndpoint(), {
      headers: headers,
      body: null,
      method: 'GET',
      credentials: 'include',
    });

    const response = await getUserDataPromise;

    if (response.ok) {
      const data = await response.json();
      cachedUserData = data.content.user;
      cacheExpiration = Date.now() + CACHE_DURATION * 1000;
      console.log('Returned user data from API call');

      // set current language based on user data
      moment.locale(data.content.user.language);

      validateCountryAndLanguage(cachedUserData);
      return cachedUserData;
    } else {
      console.log('HTTP-Error: ' + response.status);
      await checkIntouchUser(true);
    }
  } catch (error) {
    console.log('Exception while getting user data: ' + error);
    await checkIntouchUser(true);
  }

  await checkIntouchUser(true);
}

export async function checkIntouchUser(forceRedirectWhenReady) {
  console.log(
    'checkIntouchUser: forceRedirectWhenReady=' + forceRedirectWhenReady
  );

  const url = intouchUserCheckAPIUrl();
  if (!url) return;

  //if (checkIntouchUserPromise) {
  //    return checkIntouchUserPromise;
  //}

  let headers = {
    'Content-Type': 'application/json',
    'Accept-Language': headerInfo.acceptLanguage,
  };

  let checkIntouchUserPromise = fetch(url + window.location.href, {
    headers: headers,
    body: null,
    method: 'GET',
    credentials: 'include',
  });

  const response = await checkIntouchUserPromise;

  if (response.ok) {
    const data = await response.json();
    if (!data.Status || forceRedirectWhenReady) {
      window.location = data.LoginPageUrl;
    } else {
      loginPageUrl = data.LoginPageUrl;
    }
  } else {
    console.error('Error ${xhr.status}: ${xhr.statusText}');
  }
}
