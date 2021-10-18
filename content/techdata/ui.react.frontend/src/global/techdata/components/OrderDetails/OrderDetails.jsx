import React, { useEffect, useState } from "react";
import OrderSubHeader from "./OrderDetailsSubHeader/OrderSubHeader";
import OrderDetailsInfo from "./OrderDetailsInfo/OrderDetailsInfo";
import Loader from "../Widgets/Loader";
import FullScreenLoader from "../Widgets/FullScreenLoader";
import OrdersGrid from "../OrdersGrid/OrdersGrid";
import ProductLinesGrid from "./ProductLines/ProductLinesGrid";
import { getUrlParams } from "../../../../utils";
import useGet from "../../hooks/useGet";


const OrderDetails = ({ componentProp }) => {
  const {
      headerConfig,
      infoConfig,
      uiServiceEndPoint,
      productLines,
      whiteLabel,
  } = JSON.parse(componentProp);
  const { id } = getUrlParams();
  const [response, isLoading, error] = useGet(`${uiServiceEndPoint}?details=true&id=${id}`);
  const [orderDetails, setOrderDetails] = useState(null);
  const [quoteWithMarkup, setQuoteWithMarkup] = useState(null);
  const [quoteOption, setQuoteOption] = useState(null);
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
      <ProductLinesGrid
        gridProps={productLines}
        data={orderDetails}
        labels={whiteLabel}
        quoteOption={quoteOption}
        onMarkupChanged={(quote) => {
          setQuoteWithMarkup([...quote]);
        }}
      />
    </>
  ) : error ? (
      <div className="cmp-error">
        <div className="cmp-error__header">
          Error {error.code && error.code} {error.status && error.status}.
        </div>
        <div className="cmp-error__message">
          {" "}
          {error.code === 401 || error.status === 401
            ? "You have to be logged in to use this feature."
            : "Contact your site administrator."}
        </div>
      </div>
  ) : (
    <FullScreenLoader>
      <Loader visible={true}></Loader>
    </FullScreenLoader>
  );
};


export default OrderDetails;
