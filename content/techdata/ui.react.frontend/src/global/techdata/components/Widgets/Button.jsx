import React from 'react'

const Button = ({ btnClass, disabled, onClick, children }) => (
  <button disabled={disabled} className={`btn-common ${btnClass || ''}`} onClick={onClick}>{children}</button>
);

export default Button;
