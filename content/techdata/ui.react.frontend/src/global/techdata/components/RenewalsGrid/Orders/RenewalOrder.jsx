import React, { useEffect } from "react";
import { post } from "../../../../../utils/api";
import { GET_STATUS_FAILED, PROCESS_ORDER_FAILED } from "../../../../../utils/constants";
import { getStatusLoopUntilStatusIsActive, mapRenewalForUpdateDashboard } from "./orderingRequests";

function RenewalOrder({
  children,
  customerPO,
  renewalData,
  handleClose,
  handleToggleToaster,
  orderEndpoints,
  passEmailOnToastMessage,
}) {
  const id = renewalData.source.id;

  const {
    updateRenewalOrderEndpoint = "",
    getStatusEndpoint = "",
    orderRenewalEndpoint = "",
  } = orderEndpoints;

  const handleHttpRequest = async () => {
    if (
      !updateRenewalOrderEndpoint ||
      !getStatusEndpoint ||
      !orderRenewalEndpoint
    ) {
      console.log("⚠ please author renewal order endpoints");
      handleClose();
      return;
    }
    try {
      const { source, reseller, endUser } = renewalData;
      const payload = { source, reseller, endUser, customerPO };
      if (renewalData?.items) payload.items = renewalData.items;      
      const updateresponse = await post(updateRenewalOrderEndpoint, payload);      
      if (updateresponse.status === 200) {
        const getStatusResponse = await getStatusLoopUntilStatusIsActive({
          getStatusEndpoint,
          id,
          delay: 1000,
          iterations: 8,
        });
        if (getStatusResponse) {
          const orderPayload = { id };
          const orderResponse = await post(orderRenewalEndpoint, orderPayload);         
          if (orderResponse.status === 200) {
            handleClose();
            const isToggle = true;
            const transactionNumber =
              orderResponse.data.content.confirmationNumber;
            handleToggleToaster({
              isToggle,
              transactionNumber,
              onError: false,
            });
          } else
          throw PROCESS_ORDER_FAILED
        } else {
          throw GET_STATUS_FAILED;
        }
      } else {
        throw updateresponse;
      }
    } catch (error) {
      console.log("🚀error >>", error);
      const response = error?.response?.data;
      const salesContentEmail = response?.salesContactEmail;
      if (salesContentEmail && PROCESS_ORDER_FAILED) {
        passEmailOnToastMessage(salesContentEmail);
        console.log("error.response >> ", error.response);
      } else {
        passEmailOnToastMessage("");
      }
      if (error === GET_STATUS_FAILED) passEmailOnToastMessage(error);
      handleToggleToaster({
        isToggle: true,
        transactionNumber: "",
        onError: true,
      });
      handleClose();
    }
  };
  useEffect(() => {
    let timer1 = setTimeout(handleHttpRequest, 1400);
    return () => {
      clearTimeout(timer1);
    };
  }, [handleHttpRequest]);
  return <>{children}</>;
}

export default RenewalOrder;
