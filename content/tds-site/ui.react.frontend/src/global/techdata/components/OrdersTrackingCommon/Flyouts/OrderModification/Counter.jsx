import React from 'react';

const Counter = ({
  value = 0,
  onChange,
  minVal = 0,
  maxVal = null,
  enableAddLine,
  originalQuantity,
}) => {
  const disableButton = value >= originalQuantity;
  const disableChangeQuantity = enableAddLine === false;

  const increase = () => {
    if ((disableChangeQuantity && !disableButton) || !disableChangeQuantity) {
      if (maxVal === null || value < maxVal) {
        onChange(Number(value) + 1);
      }
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
        disabled={disableChangeQuantity}
      />
      <div
        className={`plus ${
          disableChangeQuantity && disableButton && 'disabled'
        }`}
        onClick={increase}
      >
        +
      </div>
    </div>
  );
};

export default Counter;
