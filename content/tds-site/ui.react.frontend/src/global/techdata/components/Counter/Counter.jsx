import React from 'react';

const Counter = ({ value = 0, onChange }) => {
  const increase = () => {
    onChange(value + 1);
  };

  const decrease = () => {
    onChange(value - 1);
  };

  return (
    <div className="counter">
      <div className="minus" onClick={decrease}>
        −
      </div>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="plus" onClick={increase}>
        +
      </div>
    </div>
  );
};

export default Counter;
