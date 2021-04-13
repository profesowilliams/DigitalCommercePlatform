import React from 'react';

const userMenu = (props) => {

  const onSignOut = () => {
    // clearing out local storage
    localStorage.removeItem('signin');
    localStorage.removeItem('signout');
    localStorage.removeItem('userData');
    localStorage.removeItem('signInCode');
    window.location.href = window.location.protocol + "//" + window.location.hostname + window.location.pathname;
  };
  const userDropDown = () => {
    document.querySelector('.cmp-sign-in-list').classList.toggle('active');
  }

  return (
    <React.Fragment>
      <button data-component="userMenu" className="cmp-sign-in-button" onClick={userDropDown}>
        <i className='fas fa-user-alt'></i>
        {props.firstName}
      </button>
      <div className='cmp-sign-in-list'>
        <p className='ec-id'>
          <span>MY EC ID: {props.id}</span>
        </p>
        <p>{props.firstName}</p>
        <p>{props.lastName}</p>
        <p>{props.email}</p>
        <p>{props.phone}</p>
        <button className='cmp-sign-in-signout' onClick={onSignOut}>
          Log Out
        </button>
      </div>
    </React.Fragment>
  )
}

export default userMenu;
