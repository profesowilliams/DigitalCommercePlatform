import React, { useEffect, useState } from "react";

function ProductLinesQuantityWidget({ initialValue, onValueChanged }) {
  const [value, setValue] = useState(initialValue);
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
            setValue(value + 1);
            setShouldUpdate(true);
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            setValue(value - 1);
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
