import React from 'react';

// underline = {'none' || 'always' || 'hover'}
// href = {url}
// variant = {'custom class'}
// callback = {callback || false}

const Link = ({ href, variant, children, underline, callback }) => (
  <a
    href={href}
    onClick={callback || (() => null)}
    className={`tdr-link ${variant || ''} ${underline || ''}`}>
      {children}
  </a>
);

export default Link;
