import React from 'react';
import PropTypes from 'prop-types';

const QuoteSubtotal = ({ componentProp }) => {
    const { label, subtotal } = JSON.parse(componentProp);
    return (
        <div>
            <div class="cmp-td-quote-subtotal">
                <div class="cmp-td-quote-subtotal__price-area">
                    <div class="cmp-td-quote-subtotal__price-area--title">
                    {label}
                    </div>
                    <div class="cmp-td-quote-subtotal__price-area--price">
                    {subtotal}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default QuoteSubtotal;

QuoteSubtotal.propTypes = {
    componentProp: PropTypes.shape({
        label: PropTypes.string.isRequired,
        subtotal: PropTypes.string.isRequired,
    }),
};