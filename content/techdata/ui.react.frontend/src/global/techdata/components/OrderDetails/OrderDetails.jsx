import React, { useEffect, useState } from "react";
import OrderSubHeader from "./OrderDetailsSubHeader/OrderSubHeader";
import OrderDetailsInfo from "./OrderDetailsInfo/OrderDetailsInfo";
import Loader from "../Widgets/Loader";
import FullScreenLoader from "../Widgets/FullScreenLoader";
import { getUrlParams } from "../../../../utils";
import useGet from "../../hooks/useGet";


const OrderDetails = ({ componentProp }) => {

    const {
        headerConfig,
        infoConfig,
        uiServiceEndPoint
    } = JSON.parse(componentProp);


  const { id } = getUrlParams();
  const [response, isLoading] = useGet(`${uiServiceEndPoint}?details=true&id=${id}`);
  const [orderDetails, setOrderDetails] = useState(null);


  useEffect(() => {
    response?.content && setOrderDetails(response.content);
  }, [response]);

  return orderDetails ? (
    <>
      <OrderSubHeader
        headerConfig={headerConfig}
        orderDetails={orderDetails}
        id={id}
      />
      <OrderDetailsInfo
        infoConfig={infoConfig}
        orderDetails={orderDetails}
      />
    </>
  ) : (
    <FullScreenLoader>
      <Loader visible={true}></Loader>
    </FullScreenLoader>
  );
};


export default OrderDetails;
