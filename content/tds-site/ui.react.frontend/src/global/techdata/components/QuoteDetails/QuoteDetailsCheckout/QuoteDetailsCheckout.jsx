import React, { useEffect, useState } from "react";
import Dropdown from "../../Widgets/Dropdown";

/**
 * 
 * @param {Object} props
 * @param {any} props.labels
 * @param {() => void} props.onQuoteCheckout
 * @param {(option: any) => void} props.onQuoteOptionChanged
 * @param {any} props.quoteDetails
 * @param {boolean} props.whiteLabelModeParam
 * @returns 
 */
function QuoteDetailsCheckout({
  labels,
  onQuoteCheckout,
  onQuoteOptionChanged,
  quoteDetails
}) {
  const checkoutLabel = labels?.checkoutLabel || "Checkout";
  const dropdownLabel = labels?.dropdownLabel || "Quote Options";

  const quoteOptions = [
    { key: "exportToCSV", label: labels?.exportToCSV ?? "Export to CSV" },
    { key: "exportToPDF", label: labels?.exportToPDF ?? "Export to PDF" },
    {
      key: "whiteLabelQuote",
      label: labels?.whiteLabelQuote ?? "White Label Quote",
    },
  ];
  const [selectedOption, setSelectedOption] = useState(null);
  const [isWhiteLabelMode, setIsWhiteLabelMode] = useState(false);

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
    selectedOption?.key === "whiteLabelQuote" && setIsWhiteLabelMode(true);
    onOptionChanged(selectedOption);
    setSelectedOption(null);
  }, [selectedOption]);

  return (
    <section>
      <div className="cmp-td-quote-checkout">
        <div
          id="pdfDownloadLink"
          className="cmp-td-quote-checkout__pdf-download-link"
        ></div>
        <div className="cmp-td-quote-checkout__button cmp-widget">
          <button className="cmp-quote-button" onClick={onCheckout} disabled={!quoteDetails.canCheckOut}>
            <div className="cmp-td-quote-checkout__button__title">
              {checkoutLabel}
            </div>
          </button>
        </div>
        <div className="cmp-td-quote-checkout__dropdown cmp-widget">
          <Dropdown
            selected={selectedOption || { label: dropdownLabel }}
            setValue={setSelectedOption}
            options={
              isWhiteLabelMode
                ? [...quoteOptions].filter((el) => el.key !== "whiteLabelQuote")
                : quoteOptions
            }
            label={dropdownLabel}
          />
        </div>
      </div>
    </section>
  );
}

export default QuoteDetailsCheckout;
