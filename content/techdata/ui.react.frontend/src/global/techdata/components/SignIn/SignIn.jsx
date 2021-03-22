import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {signInAsynAction} from '../../../../store/action/authAction';

const FA = require('react-fontawesome');

const SignIn = (props) => {
	const dispatch = useDispatch();
	const [user, setUser] = useState(null);
	const [showSignIN, setShowSignIN] = useState(false);
	const configDataAEM = JSON.parse(props.componentProp);
	const {auth} = useSelector((state) => {
		return state;
	});
	const codeQueryParam = "code";
	// const redirectQueryParam = "redirect";

	const [authUrl, uiServiceEndPoint, clientId] = [configDataAEM.authenticationURL, configDataAEM.uiServiceEndPoint, configDataAEM.clientId];

	// console.log(" authUrl = " + authUrl);
	// console.log("uiServiceEndPoint = "+ uiServiceEndPoint);
	// console.log("clientId = "+ clientId);


	useEffect(() => {
		setUser(JSON.parse(localStorage.getItem("user")));
	}, [auth]);

	useEffect(() => {
		localStorage.setItem('signin', uiServiceEndPoint);
		routeChange();
	}, []);


	const isAlreadySignedIn = () => {
		if (user === undefined || user === null)
		{
			return false;
		}else {
			console.log("6");
		}
	}

	const showIcon = () => {
		if(window.location.search){
			let search = window.location.search.split("=")[1];
			let getCode = search.split("&")[0];
			let params = new URLSearchParams(getCode);
				if (getCode) {
				return <i className='fas fa-user-alt'></i>
				}
		}
		else{
		return <i className='far fa-user'></i>
		}
	}

	const constructSignInURL = () => {
		let signInURL = "";
		signInURL = signInURL + uiServiceEndPoint;
		return signInURL;
	}

	const onSignIn = () =>{
		let redirectAuthUrl = constructAuthUrl();
		if (user !== null) {
			document.querySelector('.cmp-sign-in-list').classList.toggle('active');
		} else {
			window.location.href= redirectAuthUrl;
		}
	}

	const constructAuthUrl = () =>{
		let authUrlLocal = authUrl + "?redirect_uri=" + window.location.href;
		authUrlLocal = authUrlLocal + "&client_id=" + clientId;
		authUrlLocal = authUrlLocal + "&response_type=code";
		authUrlLocal = authUrlLocal + "&pfidpadapterId=ShieldBaseAuthnAdaptor";
		// console.log("auth Url " + authUrlLocal);
		return authUrlLocal;

	}
	const routeChange= () =>{
		let search = window.location.search.split("=")[1];
		let params = new URLSearchParams(search);
		let foo = params.get('query');
		if(search == '1234567890000'){
			localStorage.setItem('signin', 'https://api.npoint.io/1b16a4437f6cb83338cf');
			dispatch(signInAsynAction());
			setShowSignIN(true);
			}
  }

	const onSignOut = () => {
		// clearing out local storage
		localStorage.removeItem('signin');
		localStorage.removeItem('signout');
		localStorage.removeItem('user');
		setShowSignIN(false);
		window.location.href="http://localhost:8080/signin"
	};

	return (
		<div className='cmp-sign-in'>
			<div className='cmp-sign-in-option'>
				<button className='cmp-sign-in-button' onClick={onSignIn}>
					{showIcon()}
					{/* <i className={`  ${user !== null ? 'fas fa-user-alt': 'far fa-user' } `}></i> */}
					{user ? (user?.firstName) : configDataAEM.label}
				</button>
				{user ? (
					<div className='cmp-sign-in-list'>
						<p>
							<span>MY EC ID: {(user?.id)}</span>
						</p>
						<p>{(user?.firstName)}</p>
						<p>{(user?.lastName)}</p>
						<p>{(user?.email)}</p>
						<p>{(user?.phone)}</p>
						<button className='cmp-sign-in-signout' onClick={onSignOut}>
							Log Out
						</button>
					</div>
				) : null}
				</div>
		</div>
	);
};

export default SignIn;
