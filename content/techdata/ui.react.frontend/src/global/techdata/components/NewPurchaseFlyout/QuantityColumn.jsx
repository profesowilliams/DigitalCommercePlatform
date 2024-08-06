import React, { useRef } from 'react';
import { AddIcon, SubtractIcon } from '../../../../fluentIcons/FluentIcons';

function QuantityColumn({ value, setValue, item }) {
  const refInput = useRef();
  const MIN_VAL = Number(item?.minimumQuantity) || 0;
  const MAX_VAL = Number(item?.maximumQuantity) || 999998;
  const MAX_DIGITS = MAX_VAL?.toString()?.length;

  const handleBtnClick = (addFlag = false) => {
    const newValue = addFlag
      ? refInput.current.valueAsNumber + 1
      : refInput.current.valueAsNumber - 1;

    const clampedValue = clampNumber(newValue);
    setValue(clampedValue);
  };

  const handleChange = (e) => {
    const stringInput = e.target.value;
    const clampedValue = clampNumber(Number(stringInput));
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
        type="number"
        step={1}
        min={MIN_VAL}
        max={MAX_VAL}
      />
    </div>
  );
}

export default QuantityColumn;
