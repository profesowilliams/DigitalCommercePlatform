const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

export const pushDataLayerGoogle = (analyticsData) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(analyticsData);
};

export const getOrderDetailsAnalyticsGoogle = (number, orderDate) => {
  const today = new Date();
  const created = new Date(orderDate);
  const daysDiff = Math.round((today - created) / MILLISECONDS_IN_DAY);
  return {
    event: 'Order tracking - Order Details',
    orderTracking: `Order Details: ${number}`,
    order_age_in_days: daysDiff,
    order_date: created,
  };
};