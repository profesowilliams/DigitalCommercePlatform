import React from "react";
import  { orderStatusValues } from "../orderStatus";

const OrderSubHeader = ({
        headerConfig,
      orderDetails,
      id
}) => {

const {status} = orderDetails;

const orderButton = (status) => {
    switch (status.toLowerCase()) {
        case orderStatusValues.OPEN:
            return (
                <button className="cmp-td-order-details__header__status__open">Open</button>
            );
            break;
        case orderStatusValues.OPEN_IN_PROCESS:
            return (
                <button className="cmp-td-order-details__header__status__open">Open and in Process</button>
            );
        case orderStatusValues.CANCELLED:
            return (
                <button className="cmp-td-order-details__header__status__cancelled">Cancelled</button>
            );
            break;
        case orderStatusValues.CREDIT_REVIEW:
            return (
                <button className="cmp-td-order-details__header__status__in-review">In Review</button>
            );
            break;
        case orderStatusValues.SALES_REVIEW:
            return (
                <button className="cmp-td-order-details__header__status__in-review">In Review</button>
            );
            break;
        case orderStatusValues.SHIPPED:
            return (
                <button className="cmp-td-order-details__header__status__shipped">Shipped</button>
            );
            break;
        default :
            return (
                <button className="cmp-td-order-details__header__status__error">Status Not Found</button>
            );
            break;
    }
}

  return (
      <div className="cmp-td-order-details__header">
        <div className="cmp-td-order-details__header__details">
          <div className="cmp-td-order-details__header__details__order-number">{headerConfig.orderLabel} {id}</div>
          <div>{headerConfig.orderDateLabel} {orderDetails?.orderPlacedDate ? orderDetails?.orderPlacedDate : "Order Date Not Found" }</div>
          <div>{headerConfig.purchaseOrderLabel} {orderDetails?.purchaseOrder ? orderDetails?.purchaseOrder : "Purchase Order Not Found"}</div>
        </div>

        <div className="cmp-td-order-details__header__status">
          <a href="#">{headerConfig.exportCSVLabel}</a>
          <div>{headerConfig.phoneNumberLabel}</div>
            {orderButton(status)}
        </div>
      </div>
  );
};

export default OrderSubHeader;
