import React from 'react';

const ErrorMessage = (props) => {
  const {msgBeforelink, msgAfterlink, linklabel, linkFunction, errorMsg, isActive} = props;
  return isActive &&
    (
    <>
      <p className="cmp-error-message cmp-error-message__red">
        {errorMsg}
      </p>
      <p className="cmp-error-message cmp-error-message__gray">
        {msgBeforelink}
        <a className="cmp-error-message__link" onClick={linkFunction}>{linklabel}</a>
        {msgAfterlink}
      </p>
    </>
    );
};

export default ErrorMessage;
