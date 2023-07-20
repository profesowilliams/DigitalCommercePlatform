import React, { useState, useEffect } from 'react';

const Counter = ({ value = 0, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value);

  const increase = () => {
    setCurrentValue((prevState) => prevState + 1);
  };

  const decrease = () => {
    if (currentValue > 0) {
      setCurrentValue((prevState) => prevState - 1);
    }
  };

  const handleChange = (event) => {
    setCurrentValue(event.target.value);
    onChange(event.target.value);
  };

  useEffect(() => {
    onChange(currentValue);
  }, [currentValue]);

  return (
    <div className="counter">
      <div className="minus" onClick={decrease}>
        −
      </div>
      <input
        type="number"
        min={0}
        value={currentValue}
        onChange={handleChange}
      />
      <div className="plus" onClick={increase}>
        +
      </div>
    </div>
  );
};

export default Counter;
