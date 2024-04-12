import axios from 'axios';
import { getConsumerRequestHeader } from '../utils';
import { getHeaderInfo } from "./headers/get";

const isHttpOnlyEnabled = () =>
  document.body.hasAttribute('data-signin-httponly');

const headerInfo = getHeaderInfo();
const consumer = getConsumerRequestHeader();
const traceId = crypto.randomUUID();

const headers = {
  common: {
    'TraceId': traceId,
    'Accept-Language': headerInfo.acceptLanguage,
    'Consumer': consumer,
    'Content-Type': 'application/json',
    'Site': headerInfo.site
  }
};
headerInfo.salesLogin && (headers.common['SalesLogin'] = headerInfo.salesLogin);

export const USaxios = axios.create({
  headers
});

axios.defaults.headers.common['TraceId'] = traceId;
axios.defaults.headers.common['Accept-Language'] = headerInfo.acceptLanguage;
axios.defaults.headers.common['Consumer'] = consumer;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Site'] = headerInfo.site;
headerInfo.salesLogin && (axios.defaults.headers.common['SalesLogin'] = headerInfo.salesLogin);

if(isHttpOnlyEnabled()) {
  axios.defaults.withCredentials = true;
  USaxios.defaults.withCredentials = true;
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
