import React, { useState, useEffect, useRef, Fragment } from "react";
import { thousandSeparator } from "../../../helpers/formatting";

const AncillaryItems = ({ labels, currencySymbol, onCollectionChanged }) => {
  const [expanded, setExpanded] = useState(false);
  const [amount, setAmount] = useState(null);
  const [items, setItems] = useState([]);
  const newItem = useRef({ description: null, value: null });
  const [inputVisible, setInputVisible] = useState(false);

  function itemAdded() {
    if (newItem.current?.value && newItem.current?.description) {
      !isNaN(newItem.current?.value) &&
        setItems([...items, Object.assign({}, newItem.current)]);
    }
    newItem.current = { description: null, value: null };
    setInputVisible(false);
  }

  function removeIndex(index) {
    const _ = [...items];
    _.splice(index, 1);
    setItems(_);
  }

  function handleChange(target, value) {
    newItem.current[target] = value;
  }

  useEffect(() => {
    const amount = items
      .map((item) => Number(item.value))
      .reduce((prev, curr) => prev + curr, 0);

    setAmount(amount);

    onCollectionChanged && onCollectionChanged({ total: amount, items: items });
  }, [items]);

  return (
    <div className="cmp-td-quote-subtotal__section__line">
      <div
        className="cmp-td-quote-subtotal__section__line__label"
        onClick={() => setExpanded(!expanded)}
      >
        <span
          className={`cmp-td-quote-subtotal__section__line__label__icon ${
            expanded
              ? "cmp-td-quote-subtotal__section__line__label__icon--expanded"
              : ""
          }`}
        ></span>
        <span>{labels?.ancillaryItemsLabel || "Ancillary items"}</span>
      </div>
      <div className="cmp-td-quote-subtotal__section__line__value">
        {currencySymbol}
        {thousandSeparator(amount)}
      </div>
      {expanded && (
        <>
          {items?.map((item, index) => {
            return (
              <Fragment key={index}>
                <div className="cmp-td-quote-subtotal__section__line__label cmp-td-quote-subtotal__section__line__label__ancillary">
                  <div
                    className="cmp-td-quote-subtotal__section__line__label cmp-td-quote-subtotal__section__line__label__ancillary__remove"
                    onClick={(el) => {
                      removeIndex(index);
                    }}
                  ></div>
                  {item.description}:
                </div>
                <div className="cmp-td-quote-subtotal__section__line__value cmp-td-quote-subtotal__section__line__value__ancillary">
                  {currencySymbol}
                  {thousandSeparator(item.value)}
                </div>
              </Fragment>
            );
          })}

          <div
            className="cmp-td-quote-subtotal__section__line cmp-td-quote-subtotal__section__line__add"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                itemAdded();
              }
            }}
          >
            {inputVisible ? (
              <>
                <div className="cmp-td-quote-subtotal__section__line__add__value">
                  <input
                    placeholder={labels?.description || "Description"}
                    maxLength="50"
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className="cmp-td-quote-subtotal__section__line__add__value__input"
                  ></input>
                </div>
                <div className="cmp-td-quote-subtotal__section__line__add__value">
                  <input
                    placeholder={labels?.value || "Value"}
                    type="number"
                    onChange={(e) => handleChange("value", e.target.value)}
                    className="cmp-td-quote-subtotal__section__line__add__value__input"
                  ></input>
                </div>
                <div className="cmp-td-quote-subtotal__section__line__add__value">
                  <button
                    className="cmp-td-quote-subtotal__section__line__add__value__button"
                    onClick={itemAdded}
                  >
                    <i className="fas fa-check"></i>
                  </button>
                </div>
              </>
            ) : (
              <div
                className="cmp-td-quote-subtotal__section__line__add__new"
                onClick={() => setInputVisible(true)}
              >
                {labels?.addNew || "Add Ancillary Item"}:
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AncillaryItems;
