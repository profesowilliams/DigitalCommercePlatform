import axios from 'axios';
import { getSessionId } from './index';

const API_URL = 'https://api.npoint.io/4070e20470046901e130';
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['TraceId'] = 'NA';
axios.defaults.headers.common['Site'] = 'NA';
axios.defaults.headers.common['Accept-Language'] = 'en-us';
axios.defaults.headers.common['Consumer'] = 'NA';
axios.defaults.headers.common['SessionId'] = getSessionId();
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const { get, post } = axios;