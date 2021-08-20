import React, {useEffect, useState} from "react";
import { bindActionCreators } from "redux";
import {connect, useDispatch, useSelector} from "react-redux";
import {isAlreadySignedIn, signInAsynAction} from "../../../../store/action/authAction";
import { getQueryStringValue } from "../../../../utils/utils";
import {
	isAuthenticated,
	redirectUnauthenticatedUser,
} from "../../../../utils/policies";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import SpinnerCode from "../spinner/spinner";

const FA = require('react-fontawesome');

const SignIn = (props) => {
	const dispatch = useDispatch();
	const [user, setUser] = useState(null);
	const configDataAEM = JSON.parse(props.componentProp);
	const { auth } = useSelector((state) => {
		return state;
	});

	const codeQueryParam = 'code';
	const { authenticationURL: authUrl, uiServiceEndPoint, clientId, logoutURL, items, isPrivatePage, editMode } = configDataAEM;
	const requested = props.data.auth.requested;
	const isError = props.data.auth.showError;
	const isLoading = props.data.auth.loading;
	const userData = props.data.auth.userData;
	let userDataCheck = populateLoginData();

    function populateLoginData () {
        let userDataCheck = Object.keys(userData).length ? userData : JSON.parse(localStorage.getItem('userData'));
        if(window.SHOP && window.SHOP.authentication) {
            if(window.SHOP.authentication.isAuthenticated()) {
                // read from shop datalayer window.SHOP.datalayer.User
                userDataCheck = {
                    email: window.SHOP.datalayer.User.email,
                    firstName: window.SHOP.datalayer.User.custName,
                    id: window.SHOP.datalayer.User.ecid,
                    lastName: '',
                    phone: null
                };
            }
        }
        return userDataCheck;
    }

	useEffect(() => {
		localStorage.setItem('signin', constructSignInURL());
		isCodePresent();
		routeChange();
		isAuthenticated(authUrl, clientId, isPrivatePage);
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
		redirectUnauthenticatedUser(authUrl, clientId);
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
					<DropdownMenu userDataCheck={userDataCheck} items={items} config={configDataAEM} />
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
