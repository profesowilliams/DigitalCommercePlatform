import React from 'react';

const FullScreenLoader = ({children}) => (
  <div className="full-screen-loader">
      <div className="loader-text">
          {children}
      </div>
  </div>
);

export default FullScreenLoader;