import React from 'react';

const InputText = ({onChange, inputValue, label, onFocus, bottomSpace = false}) => {
  return <input
    className={`cmp-text-input ${bottomSpace?'cmp-text-input_bottom-margin':''}`}
    type="text"
    placeholder={label}
    onFocus={onFocus}
    onChange={(e)=>onChange(e)}
    value={inputValue}
  />
}

export default InputText;
