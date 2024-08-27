import React, { useRef } from 'react';
import { AddIcon, SubtractIcon } from '../../../../fluentIcons/FluentIcons';

function QuantityColumn({ value, setValue, item }) {
  const refInput = useRef();
  const MIN_VAL = Number(item?.minimumQuantity) || 0;
  const MAX_VAL = Number(item?.maximumQuantity) || 999998;
  const MAX_DIGITS = MAX_VAL?.toString()?.length;

  const handleBtnClick = (addFlag = false) => {
    let newValue = addFlag
      ? refInput.current.valueAsNumber + 1
      : refInput.current.valueAsNumber - 1;

    // Only clamp after the operation, allowing for proper increment/decrement
    if (newValue < MIN_VAL) newValue = MIN_VAL;
    if (newValue > MAX_VAL) newValue = MAX_VAL;

    setValue(newValue);
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    let newValue = inputValue === '' ? '' : Number(inputValue);
    if (newValue !== '') {
      newValue = clampNumber(newValue);
    }
    setValue(newValue);
  };
  const handleBlur = () => {
    // Clamp the value when the input field loses focus
    let clampedValue = clampNumber(value);
    setValue(clampedValue);
  };
  const handleFocus = (e) => e.target.select();

  const clampNumber = (number) => {
    if (number < MIN_VAL) return MIN_VAL;
    if (number > MAX_VAL) return MAX_VAL;
    return number;
  };

  return (
    <div className="cmp-quantity-column">
      <div className="cmp-quantity-column__btn--column">
        <div
          className={`cmp-quantity-column__btn${
            value >= MAX_VAL ? '--disabled' : ''
          }`}
          onClick={() => handleBtnClick(true)}
        >
          <AddIcon className="cmp-add-icon" />
        </div>
        <div
          className={`cmp-quantity-column__btn${
            value <= MIN_VAL ? '--disabled' : ''
          }`}
          onClick={() => handleBtnClick()}
        >
          <SubtractIcon className="cmp-subtract-icon" />
        </div>
      </div>
      <input
        className="cmp-quantity-column__input"
        ref={refInput}
        name="quantity"
        value={value}
        style={{ width: `${Math.max(value.toString().length, 2)}ch` }}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        type="number"
        step={1}
        min={MIN_VAL}
        max={MAX_VAL}
      />
    </div>
  );
}

export default QuantityColumn;
