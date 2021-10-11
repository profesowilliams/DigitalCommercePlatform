import React, { useEffect, useState } from "react";
import Dropdown from "../../Widgets/Dropdown";
import {downloadClicked} from "../../PDFWindow/PDFWindow";

function QuoteDetailsCheckout({
  labels,
  onQuoteCheckout,
  onQuoteOptionChanged,
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

  const triggerPDFDownload = () => {
    let downloadLinkDivTag = document.getElementById("pdfDownloadLink");
    let downloadLinkATagCollection = downloadLinkDivTag.getElementsByTagName("a");
    let downloadLinkATag = downloadLinkATagCollection.length > 0 ? downloadLinkATagCollection[0] : undefined;

    if (downloadLinkATag)
    {
      downloadLinkATag.click();
    }

  }

  useEffect(() => {
    // downloadClicked(quoteDetails, true, logoURL, fileName, downloadLinkText, null);
  },[])

  useEffect(() => {
    selectedOption && onOptionChanged(selectedOption);

    if (selectedOption && selectedOption.key === quoteOptions[1].key) {
      triggerPDFDownload();
    }

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
        {!isWhiteLabelMode && (
          <div className="cmp-td-quote-checkout__button cmp-widget">
            <button className="cmp-quote-button" onClick={onCheckout}>
              <div className="cmp-td-quote-checkout__button__title">
                {checkoutLabel}
              </div>
            </button>
          </div>
        )}
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
