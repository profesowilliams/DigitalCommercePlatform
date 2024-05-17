import { intouchHeaderAPIUrl, intouchFooterAPIUrl } from "../intouchUtils";
import { headerInfo, checkIntouchUser } from "../user/get";

const renderIntouchHeaderHTML = () => {
  const url = intouchHeaderAPIUrl();
  const element = document.getElementById('intouch-headerhtml');

  if (!element) return;

  return fetch(url, {
    method: 'GET',
    credentials: "include",
    redirect: "follow"
  })
    .then(checkStatus)
    .then(parseResponse)
    .then(function (data) {
      element.innerHTML = data;
    }).catch(function (error) {
      console.log('Request failed', error);
    });
};

const renderIntouchFooterHTML = () => {
  const url = intouchFooterAPIUrl();
  const element = document.getElementById('intouch-footerhtml');

  if (!element) return;

  return fetch(url, {
    method: 'GET',
    credentials: "include",
    redirect: "follow"
  })
    .then(checkStatus)
    .then(parseResponse)
    .then(function (data) {
      element.innerHTML = data;
    }).catch(function (error) {
      console.log('Request failed', error);
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

export const loadIntouchHeaderAndFooter = () => {
  document.addEventListener(
    'DOMContentLoaded',
    function () {
      let authorMode = !(typeof Granite === 'undefined' || typeof Granite.author === 'undefined');
      if (!authorMode) {
        Promise.all([
          checkIntouchUser(),
          renderIntouchHeaderHTML(),
          renderIntouchFooterHTML()
        ]).then(function () {
          window.td?.deferred?.$htmlLoaded?.resolve();
        })
      } 
    },
    false
  );
}