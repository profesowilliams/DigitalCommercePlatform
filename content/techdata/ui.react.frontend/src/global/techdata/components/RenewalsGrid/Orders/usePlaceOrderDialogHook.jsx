import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import { PlaceOrderMaterialUi } from "./PlacerOrderMaterialUi";

const CustomOrderButton = (properties) => ({ children }) =>
  <Button {...PlaceOrderMaterialUi.orderButtonProps} {...properties}>
    {children}
  </Button>;

function usePlaceOrderDialogHook({successSubmission, failedSubmission}) {
  const [max30Characters, setMax30Characters] = useState(false);
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");
  const [termsServiceChecked, setTermsServiceChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isToasterOpen, setIsToasterOpen] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState(false);
  const [onRequestSuccess, setOnRequestSuccess] = useState(true);
  const [toasterMessage, setToasterMessage] = useState({successSubmission, failedSubmission});

  function resetDialogStates() {
    // later with time refactor with zustand
    setIsToasterOpen(false);
    setSubmitted(false);
    setPurchaseOrderNumber("");
    setTermsServiceChecked(false);
    setMax30Characters(false);
    onClose();
    setTransactionNumber(false);
  }

  function handleErrorOnMax(valueLength) {
    if (valueLength > 30) {
      setMax30Characters(true);
    } else {
      setMax30Characters(false);
    }
  }

  function onMaxPOChange(event) {
    const value = event?.target?.value;
    setPurchaseOrderNumber(value);
    handleErrorOnMax(value.length);
    if (value.length > 30) {
      setMax30Characters(true);
    }
  }

  function handleToggleToaster({isToggle, transactionNumber, onError = false}) {
    setIsToasterOpen(isToggle);
    if (onError) return setOnRequestSuccess(false);
    setTransactionNumber(transactionNumber);
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
        onClick: () => setSubmitted((submitted) => !submitted),
      });

    function passEmailOnToastMessage(email = ''){
      const replaceEmail = (messageStr) => messageStr.replace(/\({email}\)/igm, email);
      if (!email) return setToasterMessage(prev => ({...prev, failedSubmission: "We are sorry, your order could not be processed, please try again later."}));
      setToasterMessage(prev => ({...prev, failedSubmission: replaceEmail(prev.failedSubmission)}))
    }

  return {
    max30Characters,
    purchaseOrderNumber,
    termsServiceChecked,
    onRequestSuccess,
    setOnRequestSuccess,
    submitted,
    isToasterOpen,
    transactionNumber,
    toasterMessage,
    resetDialogStates,
    onMaxPOChange,
    handleToggleToaster,
    setTermsServiceChecked,
    OrderButtonComponent,
    passEmailOnToastMessage
  };
}

export default usePlaceOrderDialogHook;
