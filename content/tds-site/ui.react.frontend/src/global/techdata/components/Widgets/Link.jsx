import React from 'react';
import { pushDataLayer } from '../Analytics/analytics.js';
import { isDataLayerEnabled } from '../../../../utils/dataLayerUtils';

// underline = {'none' || 'always' || 'hover'}
// href = {url}
// variant = {'custom class'}
// callback = {callback || false}

const Link = ({ href, variant, children, underline, callback, target, analyticsCallback }) => {
  const handleClick = (e) => {
    let analytics = analyticsCallback !== undefined ? analyticsCallback() : undefined;
    if (isDataLayerEnabled() && analytics) {
      pushDataLayer(analytics);
    };
    if (callback) {
      callback();
    } else if (href) {
      if (target) {
        window.open(href);
      } else {
        window.location.href = href;
      }
    }
  };
return (
  <a
    target = { target }
    onClick = { handleClick }
    className={`tdr-link ${variant || ''} ${underline || ''}`}>
      {children}
  </a>
  );
};

export default Link;
