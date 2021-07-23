import React from 'react'

const Button = ({ btnClass, disabled, onClick, children }) => (
  <button disabled={disabled} className={`cmp-quote-button ${btnClass || ''}`} onClick={onClick}>{children}</button>
);

export default Button;