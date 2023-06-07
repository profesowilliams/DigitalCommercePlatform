import { CircularProgress } from "@mui/material";

import Button from "@mui/material/Button";
import React, { useState } from "react";
import { PlaceOrderMaterialUi } from "../PlacerOrderMaterialUi";
import { GET_STATUS_FAILED, PROCESS_ORDER_FAILED, TOASTER_LOCAL_STORAGE_KEY, UPDATE_FAILED } from "../../../../../../utils/constants";
import TransactionNumber from "../TransactionNumber";
import { handleOrderRequesting } from "../orderingRequests";
import useComputeBranding from "../../../../hooks/useComputeBranding";
import { AutoRenewIcon } from "../../../../../../fluentIcons/FluentIcons";
import { useStore } from "../../../../../../utils/useStore";
import { pushDataLayer, getRowAnalytics, ANALYTIC_CONSTANTS } from '../../../Analytics/analytics.js';

const CustomOrderButton = (properties) => ({ children }) =>
  <Button {...PlaceOrderMaterialUi.orderButtonProps} {...properties}>
    {children}
  </Button>;

function usePlaceOrderDialogHook({ successSubmission, failedSubmission, noResponseMessage, orderEndpoints, renewalData, onClose, isDetails, store, POAllowedLength }) {
  const [max30Characters, setMax30Characters] = useState(false);
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");
  const [termsServiceChecked, setTermsServiceChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const effects = store(state => state.effects);
  const resetGrid = store(state => state?.resetGrid || false );  
  const endUserState = store( state => state.endUser || false);
  const resellerState = store( state => state.reseller || false);
  const itemsState = store( state => state.items || false);
  const { computeClassName, isTDSynnex } = useComputeBranding(store);
  const userData = useStore(state => state.userData);
  const analyticsCategory = store(state => state.analyticsCategory);

  function resetDialogStates() {
    setSubmitted(false);
    setPurchaseOrderNumber("");
    setTermsServiceChecked(false);
    setMax30Characters(false);    
  }

  function onTextFieldChange(event) {
    const value = event?.target?.value;
    if (!!POAllowedLength && value.length > POAllowedLength) return;
    setPurchaseOrderNumber(value);   
  }

  function handleToggleToaster({ transactionNumber, isSuccess = false, failedReason = '', salesContentEmail }) {
    const replaceEmail = (messageStr) => messageStr.replace(/\({email}\)/igm, salesContentEmail);
    const title = 'Your order submission has failed.'
    let toaster = {isOpen:true, isSuccess, isAutoClose:false, title, Child: null };
    let message;   
    if(isSuccess) {
      const toasterChild = <TransactionNumber data={transactionNumber}/>
      message = successSubmission;
      toaster = {...toaster, message, Child: toasterChild};    
      if (isDetails) return onClose({toaster,isSuccess})   
    }

    if (failedReason == GET_STATUS_FAILED){
      message = noResponseMessage;
    }
    if (failedReason == PROCESS_ORDER_FAILED){
      message = replaceEmail(failedSubmission);
    }
    if (failedReason == UPDATE_FAILED){
      message = noResponseMessage;
    }
    toaster = {...toaster, isSuccess, message };

    effects.setCustomState({ key: 'toaster', value: { ...toaster } });
    resetDialogStates();
    onClose();
  }

  async function processOrder(){
    setSubmitted((submitted) => !submitted);
    if(isDetails) {
      if(endUserState) renewalData.endUser = endUserState;
      if(resellerState) renewalData.reseller = resellerState;
      if (itemsState) renewalData.items = itemsState;  
    }
    pushDataLayer(
      getRowAnalytics(
        analyticsCategory,
        renewalData.orderSource === 'Grid' ? ANALYTIC_CONSTANTS.Grid.RowActions.Order :
          renewalData.orderSource === 'Details' ? ANALYTIC_CONSTANTS.Detail.Actions.OrderDetail :
            ANALYTIC_CONSTANTS.Grid.RowActions.OrderExpanded,
        renewalData));

    const operationResponse = await handleOrderRequesting({orderEndpoints, renewalData, purchaseOrderNumber, isDetails, userData});
    handleToggleToaster({...operationResponse});   
    typeof resetGrid === 'function' && operationResponse?.isSuccess && setTimeout(() => resetGrid(), 1600);
  }
  
  function checkButtonDisabled() {
    return !(
      purchaseOrderNumber.length <= 30 &&
      termsServiceChecked &&
      purchaseOrderNumber
    );
  }

  const renderIconComponent = (isTDSynnex) => {
    return isTDSynnex ? (<CircularProgress
      size={20}      
      sx={{ color: "white", fontSize: "14px" }}
    />) : (
      <AutoRenewIcon
          size={20}
          fill='white'   
          className='cmp-progress-icon'       
        />
    )
  }

  const OrderButtonComponent = submitted
    ? CustomOrderButton({
      className: computeClassName('cmp-order-button-component'),
      startIcon: renderIconComponent(isTDSynnex),
    })
    : CustomOrderButton({
      className: computeClassName('cmp-order-button-component'),
      disabled: checkButtonDisabled(),
      onClick: () => processOrder(),
    });

  return {
    max30Characters,
    purchaseOrderNumber,
    onTextFieldChange,
    termsServiceChecked,
    submitted,  
    setTermsServiceChecked,
    OrderButtonComponent,
    resetDialogStates     
  };
}

export default usePlaceOrderDialogHook;
