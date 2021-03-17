import axios from '../../utils/axios';
import {randomCode} from '../../utils/randomCodeGenrator';
import * as actionTypes from './actionType';

export const signInAsynAction = () => {
	const signInUrl = localStorage.getItem('signin');
	return (dispatch) => {
		axios
			.get(signInUrl)
			.then((response) => {
				console.log(response.data.user);
				if (response.data.payload.WithUserData) {
					dispatch(signInAction(response.data.user));
				} else {
					dispatch(erroWithCode());
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
};

export const signInAction = (userData) => {
	return {type: actionTypes.SIGN_IN, payload: userData};
};

export const erroWithCode = () => {
	return {type: actionTypes.ERROR_WITH_CODE};
};
