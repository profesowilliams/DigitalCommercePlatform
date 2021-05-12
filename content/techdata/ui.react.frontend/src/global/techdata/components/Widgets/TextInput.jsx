import React from 'react';

const InputText = ({onChange, inputValue, label, onFocus}) => {
  return <input 
    className="cmp-text-input" 
    type="text" 
    placeholder={label} 
    onFocus={onFocus} 
    onChange={(e)=>onChange(e)} 
    value={inputValue} 
  />
}

export default InputText;