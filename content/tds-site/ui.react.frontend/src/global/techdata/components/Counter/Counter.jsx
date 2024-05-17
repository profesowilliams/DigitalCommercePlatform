import React from 'react';

const Counter = ({
  value = 0,
  onChange,
  minVal = 0,
  maxVal = null,
}) => {
  const increase = () => {
    if (maxVal === null || value < maxVal) {
      onChange(Number(value) + 1);
    }
  };

  const decrease = () => {
    if (minVal === null || value > minVal) {
      onChange(Number(value) - 1);
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
      />
      <div className="plus" onClick={increase}>
        +
      </div>
    </div>
  );
};

export default Counter;
