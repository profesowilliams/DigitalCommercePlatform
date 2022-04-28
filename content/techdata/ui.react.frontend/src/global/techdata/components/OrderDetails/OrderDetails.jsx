import React, { useEffect, useState } from "react";
import OrderSubHeader from "./OrderDetailsSubHeader/OrderSubHeader";
import OrderDetailsInfo from "./OrderDetailsInfo/OrderDetailsInfo";
import Loader from "../Widgets/Loader";
import FullScreenLoader from "../Widgets/FullScreenLoader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import ProductLinesGrid from "./ProductLines/ProductLinesGrid";
import { getUrlParams } from "../../../../utils";
import useGet from "../../hooks/useGet";
import {useStore} from "../../../../utils/useStore"
import {isExtraReloadDisabled} from "../../../../utils/featureFlagUtils"

const OrderDetails = ({ componentProp }) => {
  const {
      headerConfig,
      infoConfig,
      uiServiceEndPoint,
      agGridLicenseKey,
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
  const isLoggedIn = useStore(state => state.isLoggedIn)
  
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
    if((isExtraReloadDisabled() && isLoggedIn) || !isExtraReloadDisabled()){
      if (response !== null && response.content !== null) {
        response?.content && setOrderDetails(response.content);
      } else {
        if (response && response.error.code != 0 && !isLoading) {
          setOrderDetails(defaultContentObject);
        }
      }
    }
  }, [response, isExtraReloadDisabled(), isLoggedIn]);

  productLines.agGridLicenseKey = agGridLicenseKey;

  return orderDetails ? (
    <div className="cmp-order-details">
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
    </div>
  ) : error ? (
    <ErrorMessage
      error={error}
      messageObject={{"message401" : "You need to be logged in to view this"}}
    /> 
  ) : isLoading && (
    <FullScreenLoader>
      <Loader visible={true}></Loader>
    </FullScreenLoader>
  );
};


export default OrderDetails;
