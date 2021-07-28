import React from 'react';

function QuotePreviewSubTotal({
    currencySymbol, 
    subTotal, 
    subtotalLabel
}) {
    return (
        <div className="cmp-qp__subtotal">
            <p>{subtotalLabel}: <span>{currencySymbol}{subTotal || 0}</span></p>
        </div>
    )
}

export default QuotePreviewSubTotal;