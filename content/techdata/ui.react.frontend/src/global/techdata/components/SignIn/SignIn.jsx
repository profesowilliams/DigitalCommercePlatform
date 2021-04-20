import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import { signInAsynAction } from '../../../../store/action/authAction';
import { getQueryStringValue } from "../../../../utils/utils";
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import SpinnerCode from '../spinner/spinner'

const FA = require('react-fontawesome');

const SignIn = (props) => {
	const dispatch = useDispatch();
	const [user, setUser] = useState(null);
	const configDataAEM = JSON.parse(props.componentProp);
	const {auth} = useSelector((state) => {
		return state;
	});

	const codeQueryParam = "code";
	const {
		authenticationURL: authUrl, 
		uiServiceEndPoint, 
		clientId,
		items
	} = configDataAEM;
	const requested = props.data.auth.requested;
	const isError = props.data.auth.showError;
	const isLoading = props.data.auth.loading;
	const userData = props.data.auth.userData;
	const userDataCheck = Object.keys(userData).length ? userData : JSON.parse(localStorage.getItem("userData"));

	useEffect(() => {
		localStorage.setItem('signin', constructSignInURL());
		isCodePresent();
		routeChange();
	}, []);

	const isCodePresent = () => {
		let signInCode = null;
		// SigIn Code Check from Local Storage
		let codeFromLocalStorage = localStorage.getItem('signInCode');
		if(codeFromLocalStorage){
			signInCode = codeFromLocalStorage;
		}
		// SigIn Code Check from URL
		if(window.location.search){
			let getCode = getQueryStringValue(codeQueryParam);
			// let params = new URLSearchParams(getCode);
			localStorage.setItem('signInCode', getCode);
			signInCode = getCode;
		}
		return signInCode;
	}

	const constructSignInURL = () => {
		let signInURL = "";
		signInURL = signInURL + uiServiceEndPoint;
		return signInURL;
	}

	const onSignIn = () => {
		let authUrlLocal = authUrl + '?redirect_uri=' + window.location.href;
		authUrlLocal = authUrlLocal + '&client_id=' + clientId;
		authUrlLocal = authUrlLocal + '&response_type=code';
		authUrlLocal = authUrlLocal + '&pfidpadapterId=ShieldBaseAuthnAdaptor';

		window.location.href = authUrlLocal;
	}

	const routeChange= () =>{
		let params = getQueryStringValue(codeQueryParam);
		if(params){
			localStorage.setItem('signin', constructSignInURL());
			dispatch(signInAsynAction(constructSignInURL()));
			}else{
			console.log("no query param in browser URL");
		}
  }

  const signInButton = () => {
		return (
			<button className='cmp-sign-in-button' onClick={onSignIn}>
			<i className='far fa-user'></i>
			{configDataAEM.label}
		</button>
		)
	}

	return (
		<div className='cmp-sign-in'>
			<div className='cmp-sign-in-option'>
				{requested ?
					'Loading...'
				: (userDataCheck !== null) ?
					<DropdownMenu userDataCheck={userDataCheck} items={items}/>
				: signInButton()}
				{ (isError && isLoading)? <SpinnerCode /> : null }
			</div>
		</div>
	);
};

// Pushing states into props
const mapStateToProps = state => {
  return {
    data: state
  }
};

// The Data coming from Action is getting added into props by the below function
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
      signInAsynAction
  	}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
