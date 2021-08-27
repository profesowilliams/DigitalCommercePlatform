import React, { useEffect, useState } from "react";

function ProductLinesQuantityWidget({
  initialValue,
  selectedValue,
  onValueChanged,
}) {
  const [value, setValue] = useState(selectedValue);
  const [shouldUpdate, setShouldUpdate] = useState(false);

  useEffect(() => {
    if (shouldUpdate && typeof onValueChanged === "function") {
      onValueChanged(value);
      setShouldUpdate(false);
    }
  }, [value]);

  return (
    <section>
      <div className="cmp-product-lines-grid__quantity-widget">
        <div className={`cmp-product-lines-grid__quantity-widget__buttons
        `}> 
          <button className={`cmp-product-lines-grid__quantity-widget__buttons__button
           ${value === initialValue && "cmp-product-lines-grid__quantity-widget__buttons__button--disabled"}
          `}
            onClick={() => {
              setValue(value < initialValue ? value + 1 : value);
              setShouldUpdate(true);
            }}
          >
            +
          </button>
          <button className={`cmp-product-lines-grid__quantity-widget__buttons__button
           ${value <= 1 && "cmp-product-lines-grid__quantity-widget__buttons__button--disabled"}
          `}
            onClick={() => {
              setValue(value > 1 ? value - 1 : value);
              setShouldUpdate(true);
            }}
          >
            -
          </button>
        </div>
        <div className="cmp-product-lines-grid__quantity-widget__value">
          {value}
        </div>
      </div>
    </section>
  );
}

export default ProductLinesQuantityWidget;
