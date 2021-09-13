import React, { useState, useEffect } from "react";
import thousandSeparator from "../../../helpers/thousandSeparator";

const QuoteSubtotal = ({
  labels,
  amount,
  currencySymbol,
  quoteOption,
  quoteWithMarkup,
}) => {
  const [whiteLabelMode, setWhiteLabelMode] = useState(false);
  const [markups, setMarkups] = useState(null);

  useEffect(() => {
    quoteOption &&
      setWhiteLabelMode(quoteOption.key === "whiteLabelQuote" ? true : false);
  }, [quoteOption]);

  function sum(array, field) {
    if (!array) return 0;
    return array.reduce(
      (previous, current) =>
        Number(previous[field] || 0) + Number(current[field] || 0)
    );
  }

  function markupReducer(store, action) {
    if (!store) return;
    switch (action.type) {
      case "getMSRP":
        return [...store].reduce(
          (previous, current) =>
            Number(previous.msrp || 0) +
            sum(previous.children, "msrp") +
            Number(current.msrp || 0) +
            sum(current.children, "msrp")
        );
      case "getYourCost":
        return [...store].reduce(
          (previous, current) =>
            Number(previous.calculatedCost || 0) +
            sum(previous.children, "calculatedCost") +
            Number(current.calculatedCost || 0) +
            sum(current.children, "calculatedCost")
        );
      case "getYourMarkup":
        return [...store].reduce(
          (previous, current) =>
            Number(previous.appliedMarkup || 0) +
            sum(previous.children, "appliedMarkup") +
            Number(current.appliedMarkup || 0) +
            sum(current.children, "appliedMarkup")
        );
      case "getSubtotal":
        return amount;
      case "getEndUserTotal":
        return [...store].reduce(
          (previous, current) =>
            Number(previous.clientExtendedPrice || 0) +
            sum(previous.children, "clientExtendedPrice") +
            Number(current.clientExtendedPrice || 0) +
            sum(current.children, "clientExtendedPrice")
        );
      case "getSavings":
        return (
          markupReducer(store, { type: "getMSRP" }) -
          markupReducer(store, { type: "getEndUserTotal" })
        );

      default:
        return "-";
    }
  }

  useEffect(() => {
    setMarkups(quoteWithMarkup);
  }, [quoteWithMarkup]);

  function line(store, label, reducer, isBold) {
    return (
      <div
        className={`cmp-td-quote-subtotal__section__line ${
          isBold ? "cmp-td-quote-subtotal__section__line--bold" : ""
        } `}
      >
        <div className="cmp-td-quote-subtotal__section__line__label">
          {label}:
        </div>
        <div className="cmp-td-quote-subtotal__section__line__value">
          {currencySymbol}
          {thousandSeparator(markupReducer(store, { type: reducer }))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {whiteLabelMode ? (
        <div className="cmp-td-quote-subtotal cmp-widget">
          <section className="cmp-td-quote-subtotal__section">
            {line(markups, labels?.MSRPLabel || "MSRP", "getMSRP")}
            {line(markups, labels?.yourCostLabel || "Your cost", "getYourCost")}
            {line(
              markups,
              labels?.yourMarkupLabel || "Your markup",
              "getYourMarkup",
              true
            )}
          </section>
          <section className="cmp-td-quote-subtotal__section">
            {line(markups, labels?.subtotalLabel || "Subtotal", "getSubtotal")}
          </section>
          <section className="cmp-td-quote-subtotal__section">
            {line(
              markups,
              labels?.ancillaryItemsLabel || "Ancillary items",
              "N/A"
            )}
          </section>
          <section className="cmp-td-quote-subtotal__section">
            {line(
              markups,
              labels?.endUserTotalLabel || "End user's total",
              "getEndUserTotal",
              true
            )}
            {line(
              markups,
              labels?.savingsLabel || "Savings over MSRP",
              "getSavings"
            )}
          </section>
        </div>
      ) : (
        <div className="cmp-td-quote-subtotal cmp-widget">
          <div className="cmp-td-quote-subtotal__price-area">
            <div className="cmp-td-quote-subtotal__price-area--title">
              {labels?.subtotalLabel || "Subtotal"}:
            </div>
            <div className="cmp-td-quote-subtotal__price-area--price">
              {`${currencySymbol}${thousandSeparator(amount)}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteSubtotal;
