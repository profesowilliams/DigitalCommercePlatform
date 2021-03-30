import { combineReducers } from 'redux';
import { authReducer } from './reducer/auth';

const rootReducer = combineReducers({
	auth: authReducer,
});

export default rootReducer;
