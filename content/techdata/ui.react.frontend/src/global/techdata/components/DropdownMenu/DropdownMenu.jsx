import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { signOut } from '../../../../utils';
import SubHeaderMenuContainer from '../ProfileMegaMenu/SubHeaderMenuContainer';
import SecondaryMenu from '../ProfileMegaMenu/SecondaryMenu';

const DropdownMenu = ({ items, userDataCheck, config, dropDownData }) => {
  const [showSecondary, setShowSecondary] = useState(false);
  const [secondaryItems, setSecondaryItems] = useState(null);
	const { id: userId, firstName: userName } = userDataCheck;

    const handlePrimaryClick = (obj) => {
        if (obj.secondaryMenus) {
            setSecondaryItems(obj);
            setShowSecondary(prevSecondary => !prevSecondary);
        }
    }

    const handleBackBtnClick = () => {
        setShowSecondary(prevSecondary => !prevSecondary);
    }

    return (
      <>
        <button
          data-component="DropdownMenu"
          className={`cmp-sign-in-button clicked ${userId ? "active" : ""}`}
        >
          <svg width="26px" height="26px" viewBox="0 0 23 28" version="1.1">
            <g
              id="Symbols"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <g
                id="---Nav----MASTHEAD----HOT"
                transform="translate(-1277.000000, -24.000000)"
              >
                <g id="Group" transform="translate(10.000000, 19.000000)">
                  <g id="Sign-in" transform="translate(1268.000000, 6.000000)">
                    <g id="User-icon" transform="translate(0.000000, 0.000000)">
                      <path
                        d="M14.1066628,13.8666667 C13.2718607,14.4886235 12.3106118,14.8720486 11.2851279,14.8720486 L9.51487209,14.8720486 C8.48964109,14.8720486 7.52839218,14.4886235 6.69333722,13.8666667 C3.06937068,14.6983245 0.311059235,17.7376334 0,21.4427615 C2.5479039,24.2373782 6.26190059,26 10.4,26 C14.5383523,26 18.2520961,24.2373782 20.8,21.4427615 C20.4889408,17.7376334 17.7306293,14.6983245 14.1066628,13.8666667 Z"
                        id="Stroke-1"
                        stroke="#000C21"
                        stroke-width="0.866666667"
                        fill="#000C21"
                      ></path>
                      <path
                        d="M11.2465116,13 L9.55348837,13 C7.14915349,13 5.2,9.79684906 5.2,7.35849057 L5.2,4.41509434 C5.2,1.97673585 7.14915349,0 9.55348837,0 L11.2465116,0 C13.6508465,0 15.6,1.97673585 15.6,4.41509434 L15.6,7.35849057 C15.6,9.79684906 13.6508465,13 11.2465116,13"
                        id="Fill-3"
                        fill="#000C21"
                      ></path>
                      <path
                        d="M11.2465116,13 L9.55348837,13 C7.14915349,13 5.2,9.79684906 5.2,7.35849057 L5.2,4.41509434 C5.2,1.97673585 7.14915349,0 9.55348837,0 L11.2465116,0 C13.6508465,0 15.6,1.97673585 15.6,4.41509434 L15.6,7.35849057 C15.6,9.79684906 13.6508465,13 11.2465116,13 Z"
                        id="Stroke-5"
                        stroke="#000C21"
                        stroke-width="0.866666667"
                      ></path>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </svg>
          {userName}
        </button>
        <div className="cmp-sign-in-list cmp-sign-in--container">
            {!showSecondary ? (
              <>
                <p className="user-greet">
                  <span>{config?.welcomeLabel} {userName}!</span>
                </p>
                <p className="ec-id">
                  <span>EC ID: {userId}</span>
                </p>
                <ul className="cmp-sign-in-list-content">
                  {items.map(({ linkTitle, linkUrl, iconUrl }) => (
                    <li
                      key={Symbol(linkTitle).toString()}
                      className="cmp-sign-in-list-content--item"
                    >
                      <a
                        href={linkUrl}
                        className="cmp-sign-in-list-content--item-link"
                      >
                        <i
                          className={`cmp-sign-in-list-content--item-link--icon ${iconUrl}`}
                        ></i>
                        <span>{linkTitle}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <SubHeaderMenuContainer
                  data={dropDownData}
                  handlePrimaryClick={handlePrimaryClick}
                />
                <button
                  className="cmp-sign-in-signout"
                  onClick={() => {
                    signOut(
                      config?.logoutURL ?? null,
                      config?.pingLogoutURL ?? null,
                      config?.errorPageUrl ?? null,
                      config?.shopLogoutRedirectUrl ?? null,
                      config?.aemAuthUrl ?? null
                    );
                  }}
                >
                  Log Out
                </button>
              </>
            ) : (
              <SecondaryMenu
                secondaryData={secondaryItems}
                handleBackBtnClick={handleBackBtnClick}
              />
            )}
          </div>
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

