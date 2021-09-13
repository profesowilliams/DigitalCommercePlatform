import React, { useEffect, useState } from "react";

import Loader from "../Widgets/Loader";
import FullScreenLoader from "../Widgets/FullScreenLoader";
import PDFWindow from "../PDFWindow/PDFWindow";
import { getUrlParams } from "../../../../utils";
import useGet from "../../hooks/useGet";

const OrderDetails = ({ componentProp }) => {
  const {
    uiServiceEndPoint
  } = JSON.parse(componentProp);

  const { id } = getUrlParams();
  const [response, isLoading] = useGet(`${uiServiceEndPoint}?id=${id}`);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    response && setOrderDetails(response);
  }, [response]);

  return orderDetails ? (
      <div className="cmp-td-order-details">
        Hello World1
      </div>
  ) : (
    <FullScreenLoader>
      <Loader visible={true}></Loader>
    </FullScreenLoader>
  );
};

export default OrderDetails;
