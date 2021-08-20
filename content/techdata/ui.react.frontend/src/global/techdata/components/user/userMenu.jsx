import React, { useState } from 'react';

const userMenu = (props) => {
  const [isActive, setDropdown] = useState(false);
  const userDropDown = () => setDropdown(!isActive);

  const onSignOut = () => {
    // clearing out local storage
    localStorage.removeItem('signin');
    localStorage.removeItem('signout');
    localStorage.removeItem('userData');
    localStorage.removeItem('signInCode');
    if(window.SHOP && window.SHOP.authentication) {
        document.dispatchEvent(new Event('shop:user_loggedout'));
    }
    window.location.href = window.location.protocol +  "//" + window.location.hostname + (window.location.port === "80" ? "" : ":" + window.location.port) + window.location.pathname;
  };

  return (
    <React.Fragment>
      <button data-component="userMenu" className="cmp-sign-in-button" onClick={userDropDown}>
        <i className='fas fa-user-alt'></i>
        {props.firstName}
      </button>
      {isActive ? 
        <div className='cmp-sign-in-list'>
          <p className='ec-id'>
            <span>EC ID: {props.id}</span>
          </p>
          <p>{props.firstName}</p>
          <p>{props.lastName}</p>
          <p>{props.email}</p>
          <p>{props.phone}</p>
          <button className='cmp-sign-in-signout' onClick={onSignOut}>
            Log Out
          </button>
        </div>
        : ''
      }
    </React.Fragment>
  )
}

export default userMenu;
