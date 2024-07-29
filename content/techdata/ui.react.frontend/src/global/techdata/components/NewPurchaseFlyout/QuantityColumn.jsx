import React, { useRef } from 'react';
import { AddIcon, SubtractIcon } from '../../../../fluentIcons/FluentIcons';

function QuantityColumn({ value, setValue, data }) {
  const refInput = useRef();
  const MIN_VAL = 0;
  const MAX_VAL = 999998;
  const MAX_DIGITS = MAX_VAL?.toString()?.length;

  const handleBtnClick = (addFlag = false) => {
    addFlag ? refInput.current.stepUp() : refInput.current.stepDown();
    setValue(refInput.current.valueAsNumber);
    const total = data.totalPrice * refInput.current.valueAsNumber;
  };

  const handleInputValue = (e) => {
    const stringInput = e.target.value;
    if (stringInput.length <= MAX_DIGITS)
      setValue(clampNumber(Number(stringInput)));
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
        value={value}
        onFocus={handleFocus}
        onChange={handleInputValue}
        type="number"
        step={1}
        min={MIN_VAL}
        max={MAX_VAL}
      />
    </div>
  );
}

export default QuantityColumn;
