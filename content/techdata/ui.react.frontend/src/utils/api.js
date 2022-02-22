import axios from 'axios';

const sessionId = localStorage.getItem('sessionId');
const userData = JSON.parse(localStorage.getItem('userData') || '{ "id": "NoAuth" }');
const traceId = `${userData.id}_${new Date().toISOString()}`;

const USaxios = axios.create({
  headers:{
    common: { 
      'TraceId': traceId,
      'Site': 'US',
      'Accept-Language': 'en-us',
      'Consumer': 'AEM',
      'SessionId': sessionId,
      'Content-Type': 'application/json',
    }
  }
});

axios.defaults.headers.common['TraceId'] = traceId;
axios.defaults.headers.common['Accept-Language'] = 'en-us';
axios.defaults.headers.common['Consumer'] = 'AEM';

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Site'] = 'NA';


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
