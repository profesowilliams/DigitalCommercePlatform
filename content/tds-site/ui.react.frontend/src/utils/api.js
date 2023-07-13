import axios from 'axios';
import {
  getHeaderInfoFromUrl,
  getConsumerRequestHeader,
  isEnvironmentEnabled,
  getEnvironmentHeader,
} from '../utils';

const isHttpOnlyEnabled = () =>
  document.body.hasAttribute('data-signin-httponly');

export const generateTraceId = (userData) =>
  `${userData?.id}_${new Date().toISOString()}`;

const sessionId = localStorage.getItem('sessionId');
const userData = JSON.parse(
  localStorage.getItem('userData') || '{ "id": "NoAuth" }'
);
const traceId = generateTraceId(userData);
const headerInfo = getHeaderInfoFromUrl(window.location.pathname);
const consumer = getConsumerRequestHeader();
const envHeader = getEnvironmentHeader();

const headers = {
  common: {
    TraceId: traceId,
    Site: headerInfo.site,
    'Accept-Language': headerInfo.acceptLanguage,
    Consumer: consumer,
    'Content-Type': 'application/json',
  },
};

if(!isHttpOnlyEnabled() && sessionId) {
  headers.common['SessionId'] = sessionId ?? '';
}

export const USaxios = axios.create({
  headers
});

axios.defaults.headers.common['TraceId'] = traceId;
axios.defaults.headers.common['Accept-Language'] = headerInfo.acceptLanguage;
axios.defaults.headers.common['Consumer'] = consumer;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Site'] = headerInfo.site;

if (isEnvironmentEnabled()) {
  axios.defaults.headers.common['Environment'] = envHeader;
  USaxios.defaults.headers.common['Environment'] = envHeader;
}

if(isHttpOnlyEnabled()) {
  axios.defaults.withCredentials = true;
  USaxios.defaults.withCredentials = true;
  axios.defaults.headers.common['SessionId'] = '';
} else {
  axios.defaults.headers.common['SessionId'] = sessionId ?? '';
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
