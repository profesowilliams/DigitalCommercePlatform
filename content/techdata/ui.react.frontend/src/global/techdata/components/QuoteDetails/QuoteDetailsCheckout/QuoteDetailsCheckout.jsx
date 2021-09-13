import React, { useEffect, useState } from "react";
import Dropdown from "../../Widgets/Dropdown";

function QuoteDetailsCheckout({
  config,
  onQuoteCheckout,
  onQuoteOptionChanged,
}) {
  const checkoutLabel = config?.checkoutLabel || "Checkout";
  const dropdownLabel = config?.dropdownLabel || "Quote Options";

  const applyLabel = (key, defaultValue) => {
    const label = config?.quoteOptions?.find((el) => el === key);
    return label ? label : defaultValue;
  };

  const quoteOptions = [
    { key: "exportToCSV", label: applyLabel("exportToCSV", "Export to CSV") },
    { key: "exportToPDF", label: applyLabel("exportToPDF", "Export to PDF") },
    {
      key: "whiteLabelQuote",
      label: applyLabel("whiteLabelQuote", "White Label Quote"),
    },
  ];
  const [selectedOption, setSelectedOption] = useState(null);

  function onCheckout() {
    if (typeof onQuoteCheckout === "function") {
      onQuoteCheckout();
    }
  }

  function onOptionChanged(option) {
    if (typeof onQuoteOptionChanged === "function") {
      onQuoteOptionChanged(option);
    }
  }

  useEffect(() => {
    selectedOption && onOptionChanged(selectedOption);
  }, [selectedOption]);

  return (
    <section>
      <div className="cmp-td-quote-checkout">
        <div className="cmp-td-quote-checkout__button cmp-widget">
          <button className="cmp-quote-button" onClick={onCheckout}>
            <div className="cmp-td-quote-checkout__button__title">
              {checkoutLabel}
            </div>
          </button>
        </div>
        {selectedOption?.key !== "whiteLabelQuote" && (
          <div className="cmp-td-quote-checkout__dropdown cmp-widget">
            <Dropdown
              selected={selectedOption || { label: dropdownLabel }}
              setValue={setSelectedOption}
              options={quoteOptions}
              label={dropdownLabel}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default QuoteDetailsCheckout;
