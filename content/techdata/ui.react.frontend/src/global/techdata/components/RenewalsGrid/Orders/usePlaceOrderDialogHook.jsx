import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import { PlaceOrderMaterialUi } from "./PlacerOrderMaterialUi";
import { GET_STATUS_FAILED, PROCESS_ORDER_FAILED, TOASTER_LOCAL_STORAGE_KEY, UPDATE_FAILED } from "../../../../../utils/constants";
import TransactionNumber from "./TransactionNumber";
import { handleOrderRequesting } from "./orderingRequests";

const CustomOrderButton = (properties) => ({ children }) =>
  <Button {...PlaceOrderMaterialUi.orderButtonProps} {...properties}>
    {children}
  </Button>;

function usePlaceOrderDialogHook({ successSubmission, failedSubmission, orderEndpoints, renewalData, onClose, isDetails, store }) {
  const [max30Characters, setMax30Characters] = useState(false);
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");
  const [termsServiceChecked, setTermsServiceChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const effects = store(state => state.effects);
  const resetGrid = store(state => state?.resetGrid || false );

  function resetDialogStates() {
    setSubmitted(false);
    setPurchaseOrderNumber("");
    setTermsServiceChecked(false);
    setMax30Characters(false);    
  }

  function handleErrorOnMax(valueLength) {
    if (valueLength > 30) {
      setMax30Characters(true);
    } else {
      setMax30Characters(false);
    }
  }

  function onTextFieldChange(event) {
    const value = event?.target?.value;
    setPurchaseOrderNumber(value);
    handleErrorOnMax(value.length);
    if (value.length > 30) {
      setMax30Characters(true);
    }
  }

  function handleToggleToaster({ transactionNumber, isSuccess = false, failedReason = '', salesContentEmail }) {
    const replaceEmail = (messageStr) => messageStr.replace(/\({email}\)/igm, salesContentEmail);
    const title = 'Your order submission has failed.'
    let toaster = {isOpen:true, isSuccess, isAutoClose:false, title };
    let message;   
    if(isSuccess) {
      const toasterChild = <TransactionNumber data={transactionNumber}/>
      message = successSubmission;
      toaster = {...toaster, message, Child: toasterChild};    
      if (isDetails) return onClose({toaster,isSuccess})   
    }
    if (failedReason == GET_STATUS_FAILED){
      message = "We are sorry, your order could not be processed, please try again later.";
    }
    if (failedReason == PROCESS_ORDER_FAILED){
      message = replaceEmail(failedSubmission);
    }
    if (failedReason == UPDATE_FAILED){
      message = "We are sorry, your order could not be processed, please try again later.";
    }
    toaster = {...toaster, isSuccess, message };

    effects.setCustomState({ key: 'toaster', value: { ...toaster } });
    resetDialogStates();
    onClose();
  }

  async function processOrder(){
    setSubmitted((submitted) => !submitted);
    const operationResponse = await handleOrderRequesting({orderEndpoints,renewalData,purchaseOrderNumber});
    handleToggleToaster({...operationResponse});   
    typeof resetGrid === 'function' && setTimeout(() => resetGrid(), 1600);
  }
  
  function checkButtonDisabled() {
    return !(
      purchaseOrderNumber.length <= 30 &&
      termsServiceChecked &&
      purchaseOrderNumber
    );
  }
  const OrderButtonComponent = submitted
    ? CustomOrderButton({
      startIcon: (
        <CircularProgress
          size={20}
          sx={{ color: "white", fontSize: "14px" }}
        />
      ),
    })
    : CustomOrderButton({
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
