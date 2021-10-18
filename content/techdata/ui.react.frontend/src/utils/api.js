import axios from 'axios';

const sessionId = localStorage.getItem('sessionId')

const USaxios = axios.create({
  headers:{
    common: { 
      'TraceId': 'NA',
      'Site': 'US',
      'Accept-Language': 'en-us',
      'Consumer': 'NA',
      'SessionId': sessionId,
      'Content-Type': 'application/json',
    }
  }
});

axios.defaults.headers.common['TraceId'] = 'NA';
axios.defaults.headers.common['Accept-Language'] = 'en-us';
axios.defaults.headers.common['Consumer'] = 'NA';
axios.defaults.headers.common['SessionId'] = sessionId;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Site'] = 'NA';

export const { get: usGet, post: usPost } = USaxios;

export const { get, post } = axios;

export const checkApiErrorMessage = (apiResponse) => {
  const errorMessagesList = apiResponse?.data?.error?.messages;
  if (!errorMessagesList.length){  
    return false;
  } 
  return [...errorMessagesList];
}