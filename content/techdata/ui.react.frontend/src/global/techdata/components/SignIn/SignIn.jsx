import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {signInAsynAction} from '../../../../store/action/authAction';

const FA = require('react-fontawesome');

const SignIn = (props) => {
	const dispatch = useDispatch();
	const [user, setUser] = useState({undefined});
	const [showSignIN, setShowSignIN] = useState(false);
	const configDataAEM = JSON.parse(props.componentProp);
	const {auth} = useSelector((state) => {
		return state;
	});
	const codeQueryParam = "code";
	const redirectQueryParam = "redirect";

	const [authUrl, uiServiceEndPoint, clientId] = [configDataAEM.["authenticationURL"], configDataAEM.["uiServiceEndPoint"],  configDataAEM.["clientId"]];

	console.log(" authUrl = " + authUrl);
	console.log("uiServiceEndPoint = "+ uiServiceEndPoint);
	console.log("clientId = "+ clientId);


	useEffect(() => {
		console.log("auth useeffect");
		setUser(localStorage.getItem("user"));
	}, [auth]);

	useEffect(() => {
		console.log("signin url  useeffect");
		localStorage.setItem('signin', uiServiceEndPoint);
		routeChange();
	}, []);


	const isAlreadySignedIn = () => {
		console.log("inside isAlreadySignedIn")
		if (user === undefined)
		{
			console.log("!user === undefined");
			return false;
		}else {
			console.log(user);
			console.log("returning Object.keys(user).length === 0");
			console.log(Object.keys(user).length === 0);
			return !(Object.keys(user).length === 0);
		}
	}

	const showIcon = () => {

		let search = window.location.search.split("=")[1];
		let params = new URLSearchParams(search);
		let code = params.get(codeQueryParam);

		if (code) {
		//	if the code is present, we need to sign-in
			localStorage.setItem('signin', uiServiceEndPoint);
			dispatch(signInAsynAction());
			setShowSignIN(true);
		} else if (isAlreadySignedIn())
		{
			setShowSignIN(true);
			console.log("show fas fa-user-alt")
			return <i className='fas fa-user-alt'></i>
		}else{
			console.log("show fas fa-user")
			return <i className='far fa-user'></i>
		}

	}

	const constructSignInURL = () => {
		let signInURL = "";
		signInURL = signInURL + uiServiceEndPoint;
		return signInURL;

	}

	const onSignIn = () =>{
		console.log("first line in sign-in")
		let redirectAuthUrl = constructAuthUrl();
		if (isAlreadySignedIn()) {
			document.querySelector('.cmp-sign-in-list').classList.toggle('active');
		} else {
			console.log(constructAuthUrl());
			window.location.href= redirectAuthUrl;
		}

	}


	const constructAuthUrl = () =>{
		let authUrlLocal = authUrl + "?redirect_uri=" + window.location.href;
		authUrlLocal = authUrlLocal + "&client_id=" + clientId;
		authUrlLocal = authUrlLocal + "&response_type=code";
		authUrlLocal = authUrlLocal + "&pfidpadapterId=ShieldBaseAuthnAdaptor";
		console.log("auth Url " + authUrlLocal);

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
					{user && showSignIN ? (user?.firstName) : configDataAEM.label}
				</button>
				{user && showSignIN ? (
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
