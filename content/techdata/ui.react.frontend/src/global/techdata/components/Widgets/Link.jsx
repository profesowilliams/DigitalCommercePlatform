import React from 'react';
import { pushDataLayer } from '../Analytics/analytics.js';

// underline = {'none' || 'always' || 'hover'}
// href = {url}
// variant = {'custom class'}
// callback = {callback || false}

const Link = ({ href, variant, children, underline, callback, target, analytics }) => {
  const handleClick = (e) => {
    if ((isDataLayerEnabled() || window.dataLayer) && analytics) {
      pushDataLayer(analytics);
    };
    if (callback) {
      callback();
    }
  };
return (
  <a
    href={href}
    target = { target }
    onClick = { handleClick }
    className={`tdr-link ${variant || ''} ${underline || ''}`}>
      {children}
  </a>
  );
};

export default Link;
