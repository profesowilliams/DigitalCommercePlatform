import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {signInAsynAction} from '../../../../store/action/authAction';

const FA = require('react-fontawesome');

const SignIn = (props) => {
	const dispatch = useDispatch();
	const [user, setUser] = useState({});
	const [showSignIN, setShowSignIN] = useState(true);
	const {auth} = useSelector((state) => {
		return state;
	});

	let cmpProps = '';

	if (props) {
		cmpProps = JSON.parse(props.componentProp);
	}

	//useDispatch({type: 'SIGN_IN', payload: 'DATA'});

	useEffect(() => {
		console.log(auth);
		auth ? setUser(auth.user) : null;
		console.log(user);
	}, [auth]);

	useEffect(() => {
		localStorage.setItem('signin', 'https://api.npoint.io/4070e20470046901e130');
		localStorage.setItem('signout', 'https://www.google.com');
	}, []);

	const onSignIn = () => {
		localStorage.setItem('signin', 'https://api.npoint.io/4070e20470046901e130');
		localStorage.setItem('signout', 'https://www.google.com');
		dispatch(signInAsynAction());
		setShowSignIN(true);
	};

	const onSignOut = () => {
		// clearing out local storage
		localStorage.removeItem('signin');
		localStorage.removeItem('signout');
		setShowSignIN(false);
	};
	return (
		<div className='sign-in-container'>
			<div>
				<button onClick={onSignIn}>
					<i class='fa fa-user' aria-hidden='true'></i>
					{user && showSignIN ? JSON.stringify(user?.name) : 'Sign In'}
				</button>
				{user && showSignIN ? (
					<div>
						<p>
							<b>{JSON.stringify(user?.name)}</b>
						</p>
						<p>{JSON.stringify(user?.name)}</p>
						<p>{JSON.stringify(user?.phone)}</p>
						<p>{JSON.stringify(user?.email)}</p>
						<button onClick={onSignOut}>
							Sign Out<i class='fa fa-user-circle-o' aria-hidden='true'></i>
						</button>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default SignIn;
