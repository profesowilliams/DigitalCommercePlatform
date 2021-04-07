import { SIGN_IN_REQUEST, SIGN_IN_RESPONSE, SIGN_IN_ERROR, SIGN_OUT_REQUEST } from '../constants/auth';
import axios from '../../utils/axios';
import {nanoid} from "nanoid";

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
		return {
			"TraceId" : "NA",
			"Site": "NA",
			"Accept-Language" : "en-us",
			"Consumer" : "NA",
			"SessionId" : nanoid(16),
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
        dispatch(signInResponse(response.data.user));
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      })
      .catch(err => {
        dispatch(signInError(err));
      });
  };
};

export const getLocalStorageUser = () => {
	return dispatch => {
		let user = JSON.parse(localStorage.getItem("userData"));
		if(user)
			dispatch(signInResponse(user));
		else
			dispatch(signInError({ message: 'no login information' }));
	}
}