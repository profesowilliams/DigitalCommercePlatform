import axios from '../../utils/axios';
import {randomCode} from '../../utils/randomCodeGenrator';
import * as actionTypes from './actionType';
import {nanoid} from "nanoid";

export const signInAsynAction = () => {
	let code = localStorage.getItem("signInCode");
	const signInUrl = localStorage.getItem('signin');
	console.log(`signin url is ${signInUrl}`);
	// return (dispatch) => {
	// 	axios
	// 		.get(signInUrl)
	// 		.then((response) => {
	// 			// console.log(response.data.user);
	// 			// console.log("response=====>", response);
	// 			if (!response.data.isError) {
	// 				dispatch(signInAction(response.data.user));
	// 				localStorage.setItem('user', JSON.stringify(response.data.user));
	// 			} else {
	// 				dispatch(erroWithCode());
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };

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
			"RedirectUri": window.location.href,
			"applicationName": "AEM"
		}
	};

	return (dispatch) => {
		let headerJson = prepareSignInHeader();
		let postData = prepareSignInBody();
		console.log(headerJson);
		console.log(postData);
		axios
			.post(signInUrl, postData, {headers:headerJson})
			.then((response) => {

				console.log(response.data.user);
				console.log("response=====>", response);
				if (!response.data.isError) {
					dispatch(signInAction(response.data.user));
					localStorage.setItem('user', JSON.stringify(response.data.user));
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
