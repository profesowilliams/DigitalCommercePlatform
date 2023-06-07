import React from 'react';

const RadioButton = ({ option, onSelect, selected }) => {
  const inputId = Symbol(option.name).toString();

  return (
    <div key={inputId} className="cmp-radio-buttons__input">
      <input 
        checked={selected.id === option.id}
        onChange={() => onSelect(option)} 
        type="radio" id={inputId} value={option.id} />
      <label htmlFor={inputId}>{option.name}</label>
    </div>
  )
}

const RadioButtons = ({options, onSelect, selected}) => (
  <div className="cmp-radio-buttons">
    { options.map(option => {
      const key = Symbol(`radio ${option.id}`).toString();
      return <RadioButton key={key} selected={selected} onSelect={(val) => onSelect(val)} option={option} />;
    } ) }
  </div>
);

export default RadioButtons;