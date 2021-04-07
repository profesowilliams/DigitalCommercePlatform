import { combineReducers } from 'redux';
import { authReducer } from './reducer/auth';
import { quoteReducer } from './reducer/quote';

const rootReducer = combineReducers({
	auth: authReducer,
	quote: quoteReducer,
});

export default rootReducer;
