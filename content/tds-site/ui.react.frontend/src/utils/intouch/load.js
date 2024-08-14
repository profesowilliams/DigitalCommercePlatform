import { intouchHeaderAPIUrl, intouchFooterAPIUrl } from "../intouchUtils";
import { checkIntouchUser, loginPageUrl } from "../user/get";

let headerLoadFailed = 0;
let footerLoadFailed = 0;
const MAX_LOAD_FAILED = 3;
const REPEAT_PROMISES = 3;
const REPEAT_INTERVAL = 2000; //2sec

const redirectToLoginPage = () => {
  window.location = loginPageUrl;
  console.error('redirect to loginpage!');
}

const renderIntouchHeaderHTML = () => {
  const url = intouchHeaderAPIUrl();
  const element = document.getElementById('intouch-headerhtml');

  if (!element) return;
  if (headerLoadFailed >= MAX_LOAD_FAILED) {
    redirectToLoginPage();
    return;
  }

  return fetch(url, {
    method: 'GET',
    credentials: "include",
    redirect: "follow"
  })
    .then(checkStatus)
    .then(parseResponse)
    .then(function (data) {
      if (element.innerHTML.length === 0) {
        element.innerHTML = data;
      }
    }).catch(function (error) {
      headerLoadFailed++;
      console.log('Request failed', error);
      renderIntouchHeaderHTML();
    });
};

const renderIntouchFooterHTML = () => {
  const url = intouchFooterAPIUrl();
  const element = document.getElementById('intouch-footerhtml');

  if (!element) return;

  if (footerLoadFailed >= MAX_LOAD_FAILED) {
    redirectToLoginPage();
    return;
  }

  return fetch(url, {
    method: 'GET',
    credentials: "include",
    redirect: "follow"
  })
    .then(checkStatus)
    .then(parseResponse)
    .then(function (data) {
      if (element.innerHTML.length === 0) {
        element.innerHTML = data;
      }
    }).catch(function (error) {
      footerLoadFailed++;
      console.log('Request failed', error);
      renderIntouchFooterHTML();
    });
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

const parseResponse = (response) => {
  return response.text()
}

const loadIntouchHeaderAndFooterPromises = () => {
  checkIntouchUser().then(
    Promise.all([
      renderIntouchHeaderHTML(),
      renderIntouchFooterHTML()
    ]).then(function () {
      window.td?.deferred?.$htmlLoaded?.resolve();
    })
  )
}

const loadIntouchHeaderAndFooterLoop = () => {
  let authorMode = !(typeof Granite === 'undefined' || typeof Granite.author === 'undefined');
  if (authorMode) return;

  let tries = 0;
  loadIntouchHeaderAndFooterPromises();

  const intervalId = setInterval(() => {
    // Check if the innerHTML length of the element is 0
    if (document.getElementById('intouch-headerhtml').innerHTML.length === 0) {
      // Call the function
      loadIntouchHeaderAndFooterPromises();
      tries += 1;
    }

    // Stop the interval if max tries reached or if the condition is met
    if (tries >= REPEAT_PROMISES || document.getElementById('intouch-headerhtml').innerHTML.length > 0) {
      clearInterval(intervalId);
    }
  }, REPEAT_INTERVAL);
}

export const loadIntouchHeaderAndFooter = () => {
  if (document.readyState !== 'loading') {
    loadIntouchHeaderAndFooterLoop();
  } else {
    document.addEventListener(
      'DOMContentLoaded',
      function () {
        loadIntouchHeaderAndFooterLoop();
      },
      false
    );
  }
}