import React from 'react'

const Button = ({ disabled, onClick, children }) => (
  <button disabled={disabled} className="cmp-quote-button" onClick={onClick}>{children}</button>
);

export default Button;