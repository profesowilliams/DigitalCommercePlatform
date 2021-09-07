import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { signOut } from '../../../../utils';
import SubHeaderMenuContainer from '../ProfileMegaMenu/SubHeaderMenuContainer';
import SecondaryMenu from '../ProfileMegaMenu/SecondaryMenu';

const DropdownMenu = ({ items, userDataCheck, config, dropDownData }) => {
	const [isActive, setDropdown] = useState(false);
	const [showSecondary, setShowSecondary] = useState(false);
    const [secondaryItems, setSecondaryItems] = useState(null);
	const userDropDown = () => setDropdown(!isActive);
	const { id: userId, firstName: userName } = userDataCheck;

    const handlePrimaryClick = (obj) => {
        setSecondaryItems(obj);
        setShowSecondary(prevSecondary => !prevSecondary);
    }

    const handleBackBtnClick = () => {
        setShowSecondary(prevSecondary => !prevSecondary);
    }

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
				<div className='cmp-sign-in-list cmp-sign-in--container'>
                    {
                        !showSecondary ? (
                            <>
                                <p className='user-greet'>
                                    <span>Welcome {userName}!</span>
                                </p>
                                <p className='ec-id'>
                                    <span>EC ID: {userId}</span>
                                </p>
                                <ul className='cmp-sign-in-list-content'>
                                    {items.map(({ linkTitle, linkUrl, iconUrl }) => (
                                        <li key={Symbol(linkTitle).toString()} className='cmp-sign-in-list-content--item'>
                                            <a href={linkUrl} className='cmp-sign-in-list-content--item-link'>
                                                <i className={`cmp-sign-in-list-content--item-link--icon ${iconUrl}`}></i>
                                                <span>{linkTitle}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <SubHeaderMenuContainer data={dropDownData} handlePrimaryClick={handlePrimaryClick} />
                                <button
                                    className='cmp-sign-in-signout'
                                    onClick={() => {
                                        signOut(config?.logoutURL ?? null, config?.pingLogoutURL ?? null,
                                        config?.errorPageUrl ?? null, config?.shopLogoutRedirectUrl ?? null,
                                        config?.aemAuthUrl ?? null);
                                    }}
                                >
                                    Log Out
                                </button>
                            </> ) : <SecondaryMenu secondaryData={secondaryItems} handleBackBtnClick={handleBackBtnClick}/>
                    }
				</div>
			) : null }
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

