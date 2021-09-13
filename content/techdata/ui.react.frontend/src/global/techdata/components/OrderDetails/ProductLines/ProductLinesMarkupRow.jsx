import React, { useEffect, useState, forwardRef, useRef } from "react";

const ProductLinesMarkupRow = (props) => {
  const { labels, initialMarkup, resellerUnitPrice, onMarkupValueChanged } =
    props;

  const UNITS = Object.freeze({
    percentage: { key: "percentage", label: labels?.percentageLabel || "%" },
    currency: { key: "currency", label: labels?.currencyLabel || "$" },
  });

  const [activeUnit, setActiveUnit] = useState(UNITS.currency);
  const [markupValue, setMarkupValue] = useState(initialMarkup || 0);
  const [externalMarkup, setExternalMarkup] = useState(null);
  const isExternal = useRef(false);

  function externalMarkupChange({ detail }) {
    setExternalMarkup(detail);
  }

  useEffect(() => {
    document.addEventListener(
      "ProductLinesMarkupGlobal.markupChanged",
      externalMarkupChange
    );
    return () => {
      document.removeEventListener(
        "ProductLinesMarkupGlobal.markupChanged",
        externalMarkupChange
      );
    };
  }, []);

  useEffect(() => {
    if (typeof onMarkupValueChanged === "function") {
      onMarkupValueChanged({
        value: Number(markupValue),
        unit: activeUnit,
        source: isExternal?.current ? "external" : "internal",
      });
    }
  }, [markupValue, activeUnit]);

  useEffect(() => {
    if (externalMarkup) {
      isExternal.current = true;
      const clientUnitPrice = Number(resellerUnitPrice);
      let markup = externalMarkup.value;
      externalMarkup.unit.key === "percentage"
        ? (markup = (clientUnitPrice * externalMarkup.value) / 100)
        : (markup = externalMarkup.value);
      setMarkupValue(Math.round(markup * 100) / 100);
      setExternalMarkup(null);
    }
  }, [externalMarkup]);

  return (
    <section className="cmp-product-lines-grid__markup">
      <div className="cmp-product-lines-grid__markup__currency">
        {UNITS.currency.label}
      </div>
      <input
        className="cmp-product-lines-grid__markup__input"
        type="number"
        value={markupValue.toFixed(2)}
        onChange={(e) => {
          isExternal.current = false;
          setMarkupValue(Number(e.target.value));
        }}
      />
    </section>
  );
};

export default ProductLinesMarkupRow;
