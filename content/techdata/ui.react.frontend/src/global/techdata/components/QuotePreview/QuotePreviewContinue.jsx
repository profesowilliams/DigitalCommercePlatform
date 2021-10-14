import React, { useState } from "react";
import Button from "../Widgets/Button";
import Link from "../Widgets/Link";

function QuotePreviewContinue({
  gridProps,
  disableQuickQuoteButton,
  handleQuickQuote,
  handleQuickQuoteWithoutDeals,
}) {
  const [isDefault, setIsDefault] = useState(false);

  const handleInputChange = () => {
    setIsDefault(!isDefault);
  };

  return (
    <div className="cmp-qp-continue">
      <Button
        btnClass={"cmp-qp-continue__btn"}
        disabled={disableQuickQuoteButton}
        onClick={handleQuickQuote}
      >
        {gridProps.confirmButtonLabel}
      </Button>
      <div className="cmp-qp-continue__checkbox">
        <input
          type="checkbox"
          name="make-default"
          checked={isDefault}
          onChange={handleInputChange}
        />
        <label htmlFor="make-default">{gridProps.defaultChoiceLabel}</label>
      </div>
      <Link
        href="#"
        callback={handleQuickQuoteWithoutDeals}
        variant={"cmp-qp-continue__link"}
        underline={"always"}
      >
        {gridProps.continueWithStandardPriceLabel}
      </Link>
    </div>
  );
}

export default QuotePreviewContinue;
