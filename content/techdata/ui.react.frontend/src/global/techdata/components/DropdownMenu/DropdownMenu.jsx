import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { signOut } from '../../../../utils';

const DropdownMenu = ({ items, userDataCheck, config }) => {
	const [isActive, setDropdown] = useState(false);
	const userDropDown = () => setDropdown(!isActive);
	const { id: userId, firstName: userName } = userDataCheck;
	return (
		<>
			<button
				data-component='DropdownMenu'
				className={
					`cmp-sign-in-button ${userId ? 'active' : ''} ${isActive ? 'clicked' : ''}`
				}
				onClick={userDropDown}
			>
				<i className='fas fa-user-alt'></i>
				{userName}
			</button>
			{isActive ? (
				<div className='cmp-sign-in-list'>
					<p className='user-greet'>
						<span>Welcome {userName}!</span>
					</p>
					<p className='ec-id'>
						<span>EC ID: {userId}</span>
					</p>
					<ul className='cmp-sign-in-list-content'>
						{items.map(({ linkTitle, linkUrl, iconUrl }) => (
							<li key={Symbol().toString()} className='cmp-sign-in-list-content--item'>
								<a href={linkUrl} className='cmp-sign-in-list-content--item-link'>
									<i className={`cmp-sign-in-list-content--item-link--icon ${iconUrl}`}></i>
									<span>{linkTitle}</span>
								</a>
							</li>
						))}
					</ul>
					<button
						className='cmp-sign-in-signout'
						onClick={() => {
							signOut(config?.logoutURL ?? null);
						}}
					>
						Log Out
					</button>
				</div>
			) : (
				''
			)}
		</>
	);
};

export default DropdownMenu;

DropdownMenu.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			linkTitle: PropTypes.string,
			LinkUrl: PropTypes.string,
			iconUrl: PropTypes.string,
		})
	).isRequired,
	userDataCheck: PropTypes.shape({
		id: PropTypes.string,
		firstName: PropTypes.string,
	}).isRequired,
};
