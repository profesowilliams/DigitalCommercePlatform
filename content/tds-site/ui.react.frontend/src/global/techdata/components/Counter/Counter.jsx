import React from 'react';

const Counter = ({
  value = 0,
  onChange,
  minVal = 0,
  maxVal = null,
  onBlur,
}) => {
  const increase = () => {
    if (maxVal === null || value < maxVal) {
      onChange(value + 1);
    }
  };

  const decrease = () => {
    if (minVal === null || value > minVal) {
      onChange(value - 1);
    }
  };

  return (
    <div className="counter">
      <div className="minus" onClick={decrease}>
        −
      </div>
      <input
        type="number"
        min={minVal}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onBlur={(e) => onBlur(e.target.value)}
      />
      <div className="plus" onClick={increase}>
        +
      </div>
    </div>
  );
};

export default Counter;
