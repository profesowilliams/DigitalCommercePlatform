import React, { useEffect, useState } from "react";
import { put, get, post } from "../../../../../utils/api";
import { useRenewalGridState } from "../store/RenewalsStore";

function RenewalOrder({
  children,
  customerPO,
  renewalData,
  handleClose,
  handleToggleToaster,
  orderEndpoints,
  passEmailOnToastMessage
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
      const updateresponse = await put(updateRenewalOrderEndpoint, payload);
      if (updateresponse.status === 200) {
        const getStatusResponse = await get(`${getStatusEndpoint}/${id}`);
        if (getStatusResponse.status === 200) {
          const orderPayload = {
            soruce: {
              id: id,
            },
          };
          const orderResponse = await post(orderRenewalEndpoint, orderPayload);
          if (orderResponse.status === 200) {
            handleClose();
            const isToggle = true;
            const transactionNumber = orderResponse.data.content.confirmationNumber;           
            handleToggleToaster({isToggle, transactionNumber, onError:false});
          }
        }
      } else {
        throw updateresponse;
      }
    } catch (error) {
      console.log("🚀error >>", error);
      const response = error?.response?.data;
      if (response) {
        const salesContentEmail = response?.content?.salesContentEmail;
        passEmailOnToastMessage(salesContentEmail)
        console.log('error.response >> ',error.response);
      }
      handleToggleToaster({isToggle:true, transactionNumber:'', onError:true});
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
