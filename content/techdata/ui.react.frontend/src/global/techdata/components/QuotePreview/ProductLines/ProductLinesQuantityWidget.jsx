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
        {value}
        <button
          onClick={() => {
            setValue(value < initialValue ? value + 1 : value);
            setShouldUpdate(true);
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            setValue(value > 0 ? value - 1 : value);
            setShouldUpdate(true);
          }}
        >
          -
        </button>
      </div>
    </section>
  );
}

export default ProductLinesQuantityWidget;
