import React from 'react';

const Counter = ({ value = 0, onChange }) => {
  return (
    <div className="counter">
      <div className="minus" onClick={() => onChange(value - 1)}>
        −
      </div>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <div className="plus" onClick={() => onChange(value + 1)}>
        +
      </div>
    </div>
  );
};

export default Counter;
