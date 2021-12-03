import React, { useEffect, useState } from "react";
import OrderSubHeader from "./OrderDetailsSubHeader/OrderSubHeader";
import OrderDetailsInfo from "./OrderDetailsInfo/OrderDetailsInfo";
import Loader from "../Widgets/Loader";
import FullScreenLoader from "../Widgets/FullScreenLoader";
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
      searchCriteria,
      downloadOrderDetailsEndpoint,
      downloadInvoicesEndpoint,
      exportColumnList
  } = JSON.parse(componentProp);
  const { id } = getUrlParams();
  const [iconList, setIconList] = useState([]);
  const [response, isLoading, error] = useGet(`${uiServiceEndPoint}?details=true&id=${id}`);
  const [orderDetails, setOrderDetails] = useState(null);
  const [quoteWithMarkup, setQuoteWithMarkup] = useState(null);
  const [quoteOption, setQuoteOption] = useState(null);
  useEffect(() => {
    if (iconList.length === 0) {
      productLines?.iconList && setIconList(productLines.iconList);
    }
  }, []);

  const defaultContentObject = {
    shipTo: '',
    endUser: '',
    paymentDetails: '',
    customer: '',
    items: '',
    orderNumber: '',
    poNumber: '',
    endUserPO: '',
    poDate: '',
    blindPackaging: '',
    shipComplete: '',
    canBeExpedited: '',
    status: '',    
  };

  useEffect(() => {
    if (response !== null && response.content !== null) {
      response?.content && setOrderDetails(response.content);
    } else {
      if (response && response.error.code != 0) {
        setOrderDetails(defaultContentObject);
      }
    }
  }, [response]);

  return orderDetails ? (
    <>
      <OrderSubHeader
        headerConfig={headerConfig}
        orderDetails={orderDetails}
        columnList={productLines.columnList}
        exportUrl={downloadOrderDetailsEndpoint}
        exportColumnList={exportColumnList}
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
        iconList={iconList}
        searchCriteria={searchCriteria}
        downloadInvoicesEndpoint={downloadInvoicesEndpoint}
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
