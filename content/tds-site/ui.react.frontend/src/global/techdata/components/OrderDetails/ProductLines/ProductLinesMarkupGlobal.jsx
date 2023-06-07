import React, { useState, forwardRef, useEffect } from "react";

const ProductLinesMarkupGlobal = (props) => {
  const { labels, onMarkupValueChanged } = props;

  const UNITS = Object.freeze({
    percentage: { key: "percentage", label: labels?.percentageLabel || "%" },
    currency: { key: "currency", label: labels?.currencyLabel || "$" },
  });

  const [activeUnit, setActiveUnit] = useState(UNITS.percentage);
  const [markupValue, setMarkupValue] = useState(0);

  useEffect(() => {
    const markup = {
      value: Number(markupValue),
      unit: activeUnit,
      source: "external",
    };
    if (typeof onMarkupValueChanged === "function") {
      onMarkupValueChanged(markup);
    }
    const markupChangedEvent = new CustomEvent(
      "ProductLinesMarkupGlobal.markupChanged",
      { detail: markup }
    );
    document.dispatchEvent(markupChangedEvent);
  }, [markupValue, activeUnit]);

  return (
    <section className="cmp-product-lines-grid__markup cmp-product-lines-grid__markup--global">
      <div className="cmp-product-lines-grid__markup__label">
        {labels?.applyMarkupLabel || "Apply markup as"}:
      </div>
      <button
        className={`cmp-product-lines-grid__markup__button ${
          activeUnit.key === UNITS.percentage.key
            ? "cmp-product-lines-grid__markup__button--active"
            : ""
        }`}
        onClick={() => {
          setActiveUnit(UNITS.percentage);
        }}
      >
        {UNITS.percentage.label}
      </button>
      <button
        className={`cmp-product-lines-grid__markup__button ${
          activeUnit.key === UNITS.currency.key
            ? "cmp-product-lines-grid__markup__button--active"
            : ""
        }`}
        onClick={() => {
          setActiveUnit(UNITS.currency);
        }}
      >
        {UNITS.currency.label}
      </button>
      <input
        className="cmp-product-lines-grid__markup__input"
        type="number"
        value={markupValue}
        onChange={(e) => {
          setMarkupValue(e.target.value);
        }}
      />
    </section>
  );
};

export default ProductLinesMarkupGlobal;
