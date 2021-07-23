import React from 'react';

// underline = {'none' || 'always' || 'hover'}
// href = {url}
// variant = {'custom class'}

const Link = ({ href, variant, children, underline }) => (
  <a href={href} className={`tdr-link ${variant || ''} ${underline || ''}`}>{children}</a>
);

export default Link;