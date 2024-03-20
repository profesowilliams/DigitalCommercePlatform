import { uiServiceDomain, getUserEndpoint } from '../intouchUtils';
import { mockedUserData } from './mock';
import { validateCountryAndLanguage } from './validate';
import { getHeaderInfo } from '../headers/get';
import { intouchUserCheckAPIUrl } from '../intouchUtils';
import moment from 'moment';
import { memoryCache } from '../memoryCache';

export const headerInfo = getHeaderInfo();
let getUserDataPromise = null;
let checkIntouchUserPromise = null;
const CACHE_DURATION = 600;
const PROMISE_DELAY = 25; // in ms

const cachedUserData = {
  set current(data) {
    const expiryDate = Date.now() + CACHE_DURATION * 1000;
    memoryCache.set('cachedUserData', [expiryDate, data])
  },
  get current() {
    const data = memoryCache.get('cachedUserData')
    return data ? data[1] : null
  },
  get expiresOn() {
    const data = memoryCache.get('cachedUserData')
    return data ? data[0] : null
  }
}

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
  let userData = await getUserData();

  moment.locale(userData.language);

  //TODO: REMOVE HARDCODED ROLES
  userData.roleList.push({
    "entitlement": "CanPlaceOrder",
    "accountId": "0002000760:IN"
  });
  userData.roleList.push({
    "entitlement": "CanViewOrders",
    "accountId": "0002000760:IN"
  });
  userData.roleList.push({
    "entitlement": "CanAccessRenewals",
    "accountId": "0002000760:IN"
  });
  userData.roleList.push({
    "entitlement": "CanAccessAccount",
    "accountId": "0002000760:IN"
  });
  userData.roleList.push({
    "entitlement": "CanManageOwnProfile"
  });

  if (!validateCountryAndLanguage(userData)) {
    try {
      document.getElementById("page-container").style.display = "block";
      document.getElementById("page-global-loader").style.display = "none";
    } catch {
      console.error('MISSING PAGE ELEMENTS!');
    }
  }

  isLoggedIn = !!userData;

  return [isLoggedIn, userData];
}

async function getUserData() {
  if (cachedUserData.current && Date.now() < cachedUserData.expiresOn) {
    return cachedUserData.current;
  }

  if (getUserDataPromise) {
    await delay(PROMISE_DELAY);
    return await getUserData();
  }

  try {
    let headers = {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': headerInfo.acceptLanguage,
      Consumer: 'AEM',
      Site: headerInfo.site,
      TraceId: new Date().toISOString(),
    };
    headerInfo.salesLogin && (headers['SalesLogin'] = headerInfo.salesLogin);

    getUserDataPromise = fetch(uiServiceDomain() + getUserEndpoint(), {
      headers: headers,
      body: null,
      method: 'GET',
      credentials: 'include',
    });

    const response = await getUserDataPromise;

    if (response.ok) {
      const data = await response.json();

      cachedUserData.current = data.content.user;

      return cachedUserData.current;
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
  const url = intouchUserCheckAPIUrl();
  if (!url) return;

  if (checkIntouchUserPromise) {
    await delay(PROMISE_DELAY);
    return await checkIntouchUser(forceRedirectWhenReady);
  }

  let headers = {
    'Content-Type': 'application/json',
    'Accept-Language': headerInfo.acceptLanguage,
  };

  checkIntouchUserPromise = fetch(url + window.location.href, {
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
      console.error('redirect to loginpage!');
    } else {
      loginPageUrl = data.LoginPageUrl;
    }
  } else {
    console.error('Error ${xhr.status}: ${xhr.statusText}');
  }
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}