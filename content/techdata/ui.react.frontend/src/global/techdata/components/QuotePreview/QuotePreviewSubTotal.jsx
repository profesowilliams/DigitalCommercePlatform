import React from 'react';

function QuotePreviewSubTotal({subTotal}) {
    return (
        <div className="cmp-qp__subtotal">
            <p>Subtotal of items selected for quote: <span>${subTotal || 0}</span></p>
        </div>
    )
}

export default QuotePreviewSubTotal;