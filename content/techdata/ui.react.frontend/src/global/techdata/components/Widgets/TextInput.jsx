import React from 'react';

const InputText = ({onChange, inputValue, label}) => {
  return <input className="cmp-text-input" type="text" onChange={(e)=>onChange(e)} value={inputValue} placeholder={label} />
}

export default InputText;