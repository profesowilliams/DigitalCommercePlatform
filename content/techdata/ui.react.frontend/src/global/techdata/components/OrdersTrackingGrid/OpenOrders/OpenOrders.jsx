import React from 'react';

function OpenOrders() {
  return (
    <div className="cmp-order-tracking-grid__open-orders">
      <input type="checkbox" id="cmp-order-tracking-select-orders" />
      <label htmlFor="cmp-order-tracking-select-orders">Open orders</label>
    </div>
  );
}

export default OpenOrders;
