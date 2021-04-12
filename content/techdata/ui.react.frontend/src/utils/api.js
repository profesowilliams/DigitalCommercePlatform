import axios from 'axios';
import { getSessionId } from './index';

axios.defaults.headers.common['TraceId'] = 'NA';
axios.defaults.headers.common['Site'] = 'NA';
axios.defaults.headers.common['Accept-Language'] = 'en-us';
axios.defaults.headers.common['Consumer'] = 'NA';
axios.defaults.headers.common['SessionId'] = getSessionId();
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const { get, post } = axios;