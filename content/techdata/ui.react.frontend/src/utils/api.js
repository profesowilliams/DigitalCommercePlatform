import axios from 'axios';
import { getHeaderInfoFromUrl, getConsumerRequestHeader } from '../utils';

const sessionId = localStorage.getItem('sessionId');
const userData = JSON.parse(localStorage.getItem('userData') || '{ "id": "NoAuth" }');
const traceId = `${userData.id}_${new Date().toISOString()}`;
const headerInfo = getHeaderInfoFromUrl(window.location.pathname);
const consumer = getConsumerRequestHeader();

const USaxios = axios.create({
  headers:{
    common: { 
      'TraceId': traceId,
      'Site': headerInfo.site,
      'Accept-Language': headerInfo.acceptLanguage,
      'Consumer': consumer,
      'SessionId': sessionId,
      'Content-Type': 'application/json',
    }
  }
});

axios.defaults.headers.common['TraceId'] = traceId;
axios.defaults.headers.common['Accept-Language'] = headerInfo.acceptLanguage;
axios.defaults.headers.common['Consumer'] = consumer;

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Site'] = headerInfo.site;

const isHttpOnlyEnabled = () => document.body.hasAttribute("data-signin-httponly");
if(isHttpOnlyEnabled()) {
  axios.defaults.withCredentials = true;
  USaxios.defaults.withCredentials = true;
}
else {
  axios.defaults.headers.common['SessionId'] = sessionId;
}

export const { get: usGet, post: usPost, put: usPut } = USaxios;

export const { get, post, put } = axios;

export const checkApiErrorMessage = (apiResponse) => {
  const errorMessagesList = apiResponse?.data?.error?.messages;
  if (!errorMessagesList.length){  
    return false;
  } 
  return [...errorMessagesList];
}
