import React from "react";
import thousandSeparator from "../../helpers/thousandSeparator";

function QuotePreviewSubTotal({ currencySymbol, subTotal, subtotalLabel }) {
  return (
    <div className="cmp-qp__subtotal">
      <p>
        {subtotalLabel}:{" "}
        <span>
          {currencySymbol}
          {thousandSeparator(subTotal) || 0}
        </span>
      </p>
    </div>
  );
}

export default QuotePreviewSubTotal;
