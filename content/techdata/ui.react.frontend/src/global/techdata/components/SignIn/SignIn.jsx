import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {signInAsynAction} from '../../../../store/action/authAction';

const FA = require('react-fontawesome');

const SignIn = (props) => {
	const dispatch = useDispatch();
	const [user, setUser] = useState({});
	const [showSignIN, setShowSignIN] = useState(false);
	const configDataAEM = JSON.parse(props.componentProp);
	const {auth} = useSelector((state) => {
		return state;
	});

	let cmpProps = '';

	if (props) {
		cmpProps = JSON.parse(props.componentProp);
	}

	useEffect(() => {
		auth ? setUser(auth.user) : null;
	}, [auth]);

	useEffect(() => {
		localStorage.setItem('signin', 'https://api.npoint.io/1b16a4437f6cb83338cf');
		routeChange();
	}, []);

	const showIcon = () => {
		let search = window.location.search.split("=")[1];
		let params = new URLSearchParams(search);
		let foo = params.get('query');
		if(search == '1234567890000'){
			return <i className='fas fa-user-alt'></i>
		}
		else{
			return <i className='far fa-user'></i>
		}
	}

	const onSignIn = () =>{
		let search = window.location.search.split("=")[1];
		let params = new URLSearchParams(search);
		let foo = params.get('query');
		if(search == '1234567890000'){
			localStorage.setItem('signin', 'https://api.npoint.io/1b16a4437f6cb83338cf');
			dispatch(signInAsynAction());
			setShowSignIN(true);
			document.querySelector('.cmp-sign-in-list').classList.toggle('active');
			}
			else{
				window.location.href="http://localhost:3000/?redirect=http://localhost:8080/signin"
			}
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
					{user && showSignIN ? (user?.firstName) : configDataAEM.dataLabel}
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
