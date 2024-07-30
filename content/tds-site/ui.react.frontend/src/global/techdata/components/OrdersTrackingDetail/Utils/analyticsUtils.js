import { pushDataLayerGoogle } from '../../OrdersTrackingCommon/Utils/analyticsUtils';

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

export { pushDataLayerGoogle };

/**
 * Generates analytics data for order details.
 *
 * @param {string} number - The order number.
 * @param {string} orderDate - The date the order was created.
 * @returns {object} An object containing analytics data.
 */
export const getOrderDetailsAnalyticsGoogle = (number, orderDate) => {
  // Get the current date
  const today = new Date();

  // Parse the order creation date
  const created = new Date(orderDate);

  // Calculate the difference in days between today and the order creation date
  const daysDiff = Math.round((today - created) / MILLISECONDS_IN_DAY);

  // Return the analytics data object
  return {
    event: 'Order tracking - Order Details',
    orderTracking: `Order Details: ${number}`,
    order_age_in_days: daysDiff,
    order_date: created,
  };
};

/**
 * Generates analytics data for navigating to the previous or next order.
 *
 * @param {string} type - The type of navigation, either 'prev' or 'next'.
 * @param {string} id - The order ID.
 * @returns {object} An object containing analytics data.
 */
export const prevNextOrder = (type, id) => {
  // Return the analytics data object for previous or next order navigation
  return {
    event: 'Order tracking - Order Details - PrevNext',
    orderTracking: `Order Details: ${type} - ${id}`
  };
};
