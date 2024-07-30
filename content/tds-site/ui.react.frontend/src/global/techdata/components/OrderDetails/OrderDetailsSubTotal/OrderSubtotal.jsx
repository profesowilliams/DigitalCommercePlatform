import React from "react";
import PropTypes from "prop-types";

const OrderSubtotal = ({ label, amount, currencySymbol }) => {
  return (
    <div>
      <div className="cmp-td-quote-subtotal cmp-widget">
        <div className="cmp-td-quote-subtotal__price-area">
          <div className="cmp-td-quote-subtotal__price-area--title">
            {label}:
          </div>
          <div className="cmp-td-quote-subtotal__price-area--price">
            {`${currencySymbol}${amount}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSubtotal;

OrderSubtotal.propTypes = {
  label: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  currencySymbol: PropTypes.string.isRequired,
};
