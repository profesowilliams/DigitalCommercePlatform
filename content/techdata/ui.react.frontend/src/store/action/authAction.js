import { SIGN_IN_REQUEST, SIGN_IN_RESPONSE, SIGN_IN_ERROR, SIGN_OUT_REQUEST } from '../constants/auth';
import axios from '../../utils/axios';
import { createSessionId, setSessionId } from '../../utils';

export const signInRequest = () => {
	return {
		type: SIGN_IN_REQUEST
	};
};

export const signInResponse = userData => {
	return {
		type: SIGN_IN_RESPONSE,
		payload: userData
	};
};

export const signInError = () => {
	return {
		type: SIGN_IN_ERROR
	};
};

export const signOutRequest = () => {
	return {
		type: SIGN_OUT_REQUEST
	};
};

export const signInAsynAction = (apiUrl) => {

	let code = localStorage.getItem("signInCode");
	const signInUrl = apiUrl;

	const  prepareSignInHeader = () => {
		let code = localStorage.getItem("signInCode");
		const sessionId = createSessionId();
		setSessionId(sessionId);
		return {
			"TraceId" : "NA",
			"Site": "NA",
			"Accept-Language" : "en-us",
			"Consumer" : "NA",
			"SessionId" : sessionId,
			"Content-Type": "application/json"
		}
	};

	const  prepareSignInBody = () => {
		let code = localStorage.getItem("signInCode");
		return {
			"code": code,
			"RedirectUri": window.location.protocol + "//" + window.location.hostname  + window.location.pathname,
			"applicationName": "AEM"
		}
	};

	let headerJson = prepareSignInHeader();
	let postData = prepareSignInBody();
	return dispatch => {
		dispatch(signInRequest());
		axios
			.post(signInUrl, postData, {headers:headerJson})
			.then(response => {
				dispatch(signInResponse(response.data.content.user));
				localStorage.setItem('userData', JSON.stringify(response.data.content.user));
			})
			.catch(err => {
				dispatch(signInError(err));
			});
	};
};

export const processSignInRedirect =  (signInCode, signInUrl) => {
	console.log(`inside processSignInRedirect`);
	if (signInCode) {

	}
	setTimeout('', 10000);
	console.log(`after wait`)
	return false;
}

export const isAlreadySignedIn = () => {
	// TODO this needs to check if user is alreday signed in, and return accordingly
	let userData = localStorage.getItem('userData');
	return userData;
}
export const getLocalStorageUser = () => {
	return dispatch => {
		let user = JSON.parse(localStorage.getItem("userData"));
		if(user)
			dispatch(signInResponse(user));
		else
			dispatch(signInError());
	}
}