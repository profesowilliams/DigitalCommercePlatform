import React from "react";
import { getUrlParams } from "../../../../../utils";
import { If } from "../../../helpers/If";
import { dateToString } from "../../../helpers/dates";

const OrderSubHeader = ({
        headerConfig,
      orderDetails,
      id
}) => {


  return (
      <div className="cmp-td-order-details__header">
        <div className="cmp-td-order-details_header--details">
          <div className="order-number">{headerConfig.orderLabel} {id}</div>
          <div>{headerConfig.orderDateLabel} {orderDetails?.orderPlacedDate}</div>
          <div>{headerConfig.purchaseOrderLabel} {orderDetails?.purchaseOrder}</div>
        </div>

        <div className="cmp-td-order-details_header--status">
          <a href="#">{headerConfig.exportCSVLabel}</a>
          <div>800-237-8931</div>
          <button className="open">Open</button>
        </div>
      </div>
  );
};

export default OrderSubHeader;
