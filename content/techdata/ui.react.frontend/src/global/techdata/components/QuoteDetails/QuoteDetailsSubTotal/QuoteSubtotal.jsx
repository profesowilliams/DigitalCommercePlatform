import React, { useState, useEffect } from "react";
import { thousandSeparator } from "../../../helpers/formatting";

import AncillaryItems from "./AncillaryItems";

const QuoteSubtotal = ({
  labels,
  amount,
  currencySymbol,
  quoteOption,
  quoteWithMarkup,
  onMarkupChanged,
}) => {
  const [whiteLabelMode, setWhiteLabelMode] = useState(false);
  const [markups, setMarkups] = useState(null);

  function onAncillaryItemsChanged(items) {
    setMarkups((markup) => {
      return { ...markup, ancillaryItems: items };
    });
  }

  function getSingleIntValue(data, field) {
    return Number(data[field] || 0);
  }

  function getSingleIntValueByQuantity(data, field) {
    return Number(data[field] || 0) * data.quantity;
  }

  function sum(array, field, getValue = getSingleIntValue) {
    if (!array) return 0;
    return array
      .map((x) => getValue(x, field))
      .reduce((previous, current) => previous + current, 0);
  }

  function markupReducer(store, action) {
    if (!store) return;
    switch (action.type) {
      case "getMSRP":
        return [...store.quotes]
          .map((x) => getSingleIntValueByQuantity(x, "unitListPrice") + sum(x.children, "unitListPrice", getSingleIntValueByQuantity))
          .reduce((previous, current) => previous + current, 0);
      case "getYourCost":
        return [...store.quotes]
          .map(
            (x) =>
              Number(x.calculatedCost || 0) + sum(x.children, "calculatedCost")
          )
          .reduce((previous, current) => previous + current, 0);
      case "getYourMarkup":
        return [...store.quotes]
          .map(
            (x) =>
              Number(x.appliedMarkup || 0) + sum(x.children, "appliedMarkup")
          )
          .reduce((previous, current) => previous + current, 0);
      case "getSubtotal":
        return amount;
      case "getEndUserTotal": {
        return (
          [...store.quotes]
            .map(
              (x) =>
                Number(x.clientExtendedPrice || 0) +
                sum(x.children, "clientExtendedPrice")
            )
            .reduce((previous, current) => previous + current, 0) +
            store.ancillaryItems?.total || 0
        );
      }
      case "getSavings":
        return (
          markupReducer(store, { type: "getMSRP" }) -
          markupReducer(store, { type: "getEndUserTotal" })
        );
      default:
        return 0;
    }
  }

  useEffect(() => {
    if (typeof onMarkupChanged === "function" && markups?.quotes) {
      const summary = {
        msrp: markupReducer(markups, { type: "getMSRP" }),
        subtotal: markupReducer(markups, { type: "getSubtotal" }),
        yourCost: markupReducer(markups, { type: "getYourCost" }),
        yourMarkup: markupReducer(markups, { type: "getYourMarkup" }),
        endUserTotal: markupReducer(markups, { type: "getEndUserTotal" }),
        endUserSavings: markupReducer(markups, { type: "getSavings" }),
      };
      onMarkupChanged({
        quotes: [...markups.quotes],
        summary: {
          ...summary,
          ancillaryItems: { ...markups.ancillaryItems },
        },
        ancillaryItems: markups.ancillaryItems ? markups.ancillaryItems : null,
      });
    }
  }, [markups]);

  useEffect(() => {
    quoteOption &&
      setWhiteLabelMode(quoteOption.key === "whiteLabelQuote" ? true : false);
  }, [quoteOption]);

  useEffect(() => {
    setMarkups((markup) => {
      return { ...markup, quotes: quoteWithMarkup };
    });
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
            <AncillaryItems
              labels={labels}
              currencySymbol={currencySymbol}
              onCollectionChanged={onAncillaryItemsChanged}
            ></AncillaryItems>
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
