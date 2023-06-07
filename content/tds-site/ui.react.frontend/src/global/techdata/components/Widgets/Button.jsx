import React from 'react'
import { pushDataLayer } from '../Analytics/analytics.js';
import { isDataLayerEnabled } from '../../../../utils/dataLayerUtils';

const Button = ({ btnClass, disabled, onClick, children, analyticsCallback }) => {
  const handleClick = (e) => {
    let analytics = analyticsCallback !== undefined ? analyticsCallback() : undefined;
    if (isDataLayerEnabled() && analytics) {
      pushDataLayer(analytics);
    };
    if (onClick) {
      onClick();
    }
  };
  return (
    <button disabled={disabled} className={`btn-common ${btnClass || ''}`} onClick={ handleClick }>{children}</button>
  );
}

export default Button;
