import React from 'react';
import { pushDataLayer } from '../Analytics/analytics.js';
import { isDataLayerEnabled } from '../../../../utils/dataLayerUtils';

// underline = {'none' || 'always' || 'hover'}
// href = {url}
// variant = {'custom class'}
// callback = {callback || false}

const Link = ({ href, variant, children, underline, callback, target, analyticsCallback }) => {
  const handleClick = (e) => {
    if (isDataLayerEnabled() && analyticsCallback) {
      pushDataLayer(analyticsCallback());
    };
    if (callback) {
      callback();
    }
  };
return (
  <a
    target = { target }
    href = { href }
    onClick = { handleClick }
    className={`tdr-link ${variant || ''} ${underline || ''}`}>
      {children}
  </a>
  );
};

export default Link;
