import React, { useRef } from "react";


function QuantityColumn(props) {
    console.log('🚀props >>',props);
    const { value, setValue, isEditing, rowIndex, data } = props;
    const refInput = useRef(); 
    const MIN_VAL = 1;
    const MAX_VAL = 999999;

    // Return simple render label when edit flag is false
    if (!isEditing) return <>{value}</>;
    
    const handleBtnClick = (addFlag = false) => {
        addFlag ? refInput.current.stepUp() : refInput.current.stepDown();
        setValue(refInput.current.valueAsNumber);
        const total = data.totalPrice * refInput.current.valueAsNumber;    
    }

    const handleInputValue = (e) => {
        setValue(clampNumber(Number(e.target.value)));
    }

    const handleFocus = (e) => e.target.select();

    const clampNumber = (number) => {
        if (number < MIN_VAL) return MIN_VAL;
        if (number > MAX_VAL) return MAX_VAL;
        return number;
    }

    return (
        <div className="cmp-quantity-column">
            <div 
                className={`cmp-quantity-column__btn${value >= MAX_VAL ? "--disabled" : "" }`}
                onClick={() => handleBtnClick(true)}
            >
                <i className="cmp-quantity-column__btn-icon fas fa-plus" />
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
            <div 
                className={`cmp-quantity-column__btn${value <= MIN_VAL ? "--disabled" : "" }`}
                onClick={() => handleBtnClick()}
            >
                <i className="cmp-quantity-column__btn-icon fas fa-minus" />
            </div>
        </div>
    );
}

export default QuantityColumn;
