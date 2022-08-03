import { SIGN_IN_REQUEST, SIGN_IN_RESPONSE, SIGN_IN_ERROR, SIGN_OUT_REQUEST } from '../constants/auth';
import axios from '../../utils/axios';
import { createSessionId, setSessionId, createMaxTimeout, getHeaderInfoFromUrl, getConsumerRequestHeader } from '../../utils';
import {refreshPage} from '../../utils/policies';
import { isExtraReloadDisabled, isHttpOnlyEnabled } from "../../utils/featureFlagUtils"

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

export const signInError = (errorMessage) => {
	return {
		type: SIGN_IN_ERROR,
		payload: errorMessage
	};
};

export const signOutRequest = () => {
	return {
		type: SIGN_OUT_REQUEST
	};
};

export const signInAsynAction = (apiUrl) => {	
	
	let code = localStorage.getItem('signInCode');
	const signInUrl = apiUrl;
	const headerInfo = getHeaderInfoFromUrl(window.location.pathname);
	const consumer = getConsumerRequestHeader();

	const  prepareSignInHeader = () => {
		let code = localStorage.getItem('signInCode');
		const sessionId = !isHttpOnlyEnabled() ? createSessionId() : null;
		createMaxTimeout();
		if(!isHttpOnlyEnabled()){
			setSessionId(sessionId);
		}
		return {
			'TraceId': `AEM_${new Date().toISOString()}`,
			'Site': headerInfo.site,
			'Accept-Language': headerInfo.acceptLanguage,
			'Consumer': consumer,
			'SessionId': sessionId,
			'Content-Type': 'application/json'
		}
	};

	const  prepareSignInBody = () => {
		let code = localStorage.getItem('signInCode');
		return {
			'code': code,
			'RedirectUri': window.location.protocol + '//' + window.location.hostname  + window.location.pathname,
			'applicationName': consumer
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
				refreshPage();
			})
			.catch(err => {
				dispatch(signInError(err.message));
			});
	};
};

export const isAlreadySignedIn = () => {
	// TODO this needs to check if user is alreday signed in, and return accordingly
	let userData = localStorage.getItem('userData');

	if (!userData)
	{
		if(window.SHOP && window.SHOP.authentication) {
			return window.SHOP.authentication.isAuthenticated();
		}
	}

	return userData;
}
export const getLocalStorageUser = () => {
	return dispatch => {
		let user = JSON.parse(localStorage.getItem('userData'));
		if(user)
			dispatch(signInResponse(user));
		else
			dispatch(signInError());
	}
}