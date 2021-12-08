import axios from 'axios';
import uuid from 'react-native-uuid';
import { nanoid } from 'nanoid';

const sessionId = localStorage.getItem('sessionId');
const userData = JSON.parse(localStorage.getItem('userData') || '{ "id": "NoAuth" }');
const traceId = `${userData.id}_${new Date().toISOString()}`;
const correlationId = nanoid(20);
const operationId = nanoid(18);

const USaxios = axios.create({
  headers:{
    common: { 
      'TraceId': traceId,
      'Site': 'US',
      'Accept-Language': 'en-us',
      'Consumer': 'AEM',
      'SessionId': sessionId,
      'x-correlation-id' : correlationId,
			'x-operation-id' : operationId,
      'Content-Type': 'application/json',
    }
  }
});

axios.defaults.headers.common['TraceId'] = traceId;
axios.defaults.headers.common['Accept-Language'] = 'en-us';
axios.defaults.headers.common['Consumer'] = 'AEM';
axios.defaults.headers.common['SessionId'] = sessionId;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Site'] = 'NA';
axios.defaults.headers.common['x-correlation-id'] = correlationId;
axios.defaults.headers.common['x-operation-id'] = operationId;

export const { get: usGet, post: usPost, put: usPut } = USaxios;

export const { get, post, put } = axios;

export const checkApiErrorMessage = (apiResponse) => {
  const errorMessagesList = apiResponse?.data?.error?.messages;
  if (!errorMessagesList.length){  
    return false;
  } 
  return [...errorMessagesList];
}
