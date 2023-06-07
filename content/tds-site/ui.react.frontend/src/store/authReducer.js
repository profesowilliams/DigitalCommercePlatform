import * as actionTypes from '../store/action/actionType';

const INITIAL_STATE = {
	user: {},
	showError: false,
};

export const authReducer = (state = INITIAL_STATE, action) => {
	if ((action.type = actionTypes.SIGN_IN)) {
		return {...state, user: action.payload};
	}
	if ((action.type = actionTypes.ERROR_WITH_CODE)) {
		return {...state, showError: true};
	}
	return state;
};
