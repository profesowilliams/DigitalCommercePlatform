import React, {useEffect, useState} from "react";
import { bindActionCreators } from "redux";
import {connect, useDispatch, useSelector} from "react-redux";
import {isAlreadySignedIn, signInAsynAction} from "../../../../store/action/authAction";
import {getQueryStringValue, toggleLangNavigation} from "../../../../utils/utils";
import {
	isAuthenticated,
	redirectUnauthenticatedUser,
} from "../../../../utils/policies";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import SpinnerCode from "../spinner/spinner";
import {usPost} from "../../../../utils/api";
import { signOutBasedOnParam } from '../../../../utils';

const FA = require('react-fontawesome');

const SignIn = (props) => {
	const ACTION_QUERY_PARAM = "action";
	const ACTION_QUERY_PARAM_LOGOUT_VALUE = "logout";
	const REDIRECT_URL_QUERY_PARAM = "redirectUrl";
	const dispatch = useDispatch();
	const [user, setUser] = useState(null);
	const configDataAEM = JSON.parse(props.componentProp);
	let dropDownData = undefined;
	if(props.aemDataSet && props.aemDataSet.dropdownlinks) {
        dropDownData = JSON.parse(props.aemDataSet.dropdownlinks);
    }
	const { auth } = useSelector((state) => {
		return state;
	});

	const codeQueryParam = 'code';
	const { authenticationURL: authUrl, uiServiceEndPoint, clientId, logoutURL, items, isPrivatePage, editMode, shopLoginRedirectUrl, pingLogoutURL, errorPageUrl, shopLogoutRedirectUrl } = configDataAEM;
	const requested = props.data.auth.requested;
	const isError = props.data.auth.showError;
	const isLoading = props.data.auth.loading;
	const userData = props.data.auth.userData;
	let userDataCheck = populateLoginData();

    function populateLoginData () {
        let userDataCheck = Object.keys(userData).length ? userData : JSON.parse(localStorage.getItem('userData'));
        if(window.SHOP && window.SHOP.authentication) {
            // call SHOP redirectAuth API on load to makesure to refresh login in SHOP
//             window.SHOP.authentication.redirectToLoginIfNeeded();
            if(window.SHOP.authentication.isAuthenticated()) {
                // read from shop datalayer window.SHOP.dataLayer.User
                userDataCheck = {
                    email: window.SHOP.dataLayer.User.email,
                    firstName: window.SHOP.dataLayer.User.contactFirstName,
                    id: window.SHOP.dataLayer.User.ecid,
                    lastName: window.SHOP.dataLayer.User.contactLastName,
                    phone: null
                };
            }
        }
        return userDataCheck;
    }

    const redirectIfActionParameter = (pingLogoutURL, errorPageUrl,logoutURL) => {
		//ideally this would call the signout button, but due to seeing inconsistency in how the
		// flow is handled, going to include this method for temporarily.
		//This will only get triggered if the query params are sent via shop
		if (window.location.search) {
			let actionParam = getQueryStringValue(ACTION_QUERY_PARAM);
			if (actionParam)
			{
				let redirectUrl = getQueryStringValue(REDIRECT_URL_QUERY_PARAM);
				if (actionParam ===ACTION_QUERY_PARAM_LOGOUT_VALUE && redirectUrl)
				{
					let logOutCompleteUrl = `${pingLogoutURL}?TargetResource=${redirectUrl}&InErrorResource=${errorPageUrl}`;
					signOutBasedOnParam(logoutURL, pingLogoutURL, errorPageUrl, redirectUrl);
				}
			}
		}
	}

    /**
     *
     * SessionMaxTimeout - MAX_TIMEOUT on PING that keeps the active logged-in user alive
     * SessionIdleTimeout - IDLE_TIMEOUT on PING that keeps the inactive logged-in user alive
     *
     * If user sessionId exist then
     *      if sessionMaxTimeout is before currentTime or sessionIdleTimeout is before currentTime
     *          then initiate user logout
    */
	const isSessionExpired = () => {
	    try {
	        let sessionId = localStorage.getItem("sessionId");
	        if(sessionId) {
                let sessionMaxTimeout = localStorage.getItem("sessionMaxTimeout");
                let sessionIdleTimeout = localStorage.getItem("sessionIdleTimeout");
                // Below is added for missing sessionMaxTimeout/sessionIdleTimeout localstorage esp for existing login sessions
                if(!sessionMaxTimeout) return true;
                var sessionMaxTimeoutInt = parseInt(sessionMaxTimeout);
                var sessionIdleTimeoutInt = parseInt(sessionIdleTimeout);
                var currentTime = new Date().valueOf();
                // checking if session expiration is before curr time
                if(sessionMaxTimeout < currentTime || (sessionIdleTimeoutInt && sessionIdleTimeoutInt < currentTime)) {
                    return true;
                }
            }
        } catch (e) {
            console.error("invalid login session expiration", e);
            return true;
        }
        return false;
	}

	function showHideElements() {
		toggleLangNavigation(isAlreadySignedIn());
	}

	useEffect(() => {
	    if(isSessionExpired()) {
           signOutBasedOnParam(logoutURL, pingLogoutURL, errorPageUrl, shopLogoutRedirectUrl);
        }
		redirectIfActionParameter(pingLogoutURL, errorPageUrl, logoutURL);
		localStorage.setItem('signin', constructSignInURL());
		isCodePresent();
		routeChange();
		isAuthenticated(authUrl, clientId, isPrivatePage, shopLoginRedirectUrl);
		showHideElements();
	}, []);

	const isCodePresent = () => {
		let signInCode = null;
		// SigIn Code Check from Local Storage
		let codeFromLocalStorage = localStorage.getItem('signInCode');
		if (codeFromLocalStorage) {
			signInCode = codeFromLocalStorage;
		}
		// SigIn Code Check from URL
		if (window.location.search) {
			let getCode = getQueryStringValue(codeQueryParam);
			localStorage.setItem('signInCode', getCode);
			signInCode = getCode;
		}
		return signInCode;
	};

	const constructSignInURL = () => {
		let signInURL = '';
		signInURL = signInURL + uiServiceEndPoint;
		return signInURL;
	};

	const onSignIn = () => {
		redirectUnauthenticatedUser(authUrl, clientId, shopLoginRedirectUrl);
	};

	const routeChange = () => {
		let params = getQueryStringValue(codeQueryParam);
		if (params) {
			localStorage.setItem('signin', constructSignInURL());
			if(!isAlreadySignedIn())
			{
				dispatch(signInAsynAction(constructSignInURL()));
			}

		} else {

		}
	};

	const signInButton = () => {
		return (
			<button className='cmp-sign-in-button' onClick={onSignIn}>
				<i className='far fa-user'></i>
				{configDataAEM.label}
			</button>
		);
	};

	return (
		<div className='cmp-sign-in'>
			<div className='cmp-sign-in-option'>
				{requested ? (
					'Loading...'
				) : userDataCheck !== null ? (
					<DropdownMenu userDataCheck={userDataCheck} dropDownData={dropDownData} items={items} config={configDataAEM} />
				) : (
					signInButton()
				)}
				{isError && isLoading ? <SpinnerCode /> : null}
			</div>
		</div>
	);
};

// Pushing states into props
const mapStateToProps = (state) => {
	return {
		data: state,
	};
};

// The Data coming from Action is getting added into props by the below function
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			signInAsynAction,
		},
		dispatch
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
