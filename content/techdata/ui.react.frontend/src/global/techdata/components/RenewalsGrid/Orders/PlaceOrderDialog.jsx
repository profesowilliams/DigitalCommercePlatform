import { Checkbox, CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import React, { useState, Suspense } from "react";
import { CartIcon, Dismiss } from "../../../../../fluentIcons/FluentIcons";
import { teal } from "@mui/material/colors";
import RenewalOrder from "./RenewalOrder";
import Loader from "../../Widgets/Loader";
import { PlaceOrderMaterialUi } from "./PlacerOrderMaterialUi";

const HOCButton = (properties) => {
  return function ({ children }) {
    return (
      <Button {...PlaceOrderMaterialUi.orderButtonProps} {...properties}>
        {children}
      </Button>
    );
  };
};

const LazyToaster = React.lazy(() => import("../../Widgets/Toaster"));

function PlaceOrderDialog({
  orderingFromDashboard,
  renewalData,
  isDialogOpen,
  onClose,
  closeOnBackdropClick,
  ToasterDataVerification,
  orderEndpoints
}) {
  const { endUser } = renewalData;
  const {
    placeOrderDialogTitle,
    termsAndConditions,
    termsAndConditionsLink,
    successSubmission,
    failedSubmission
  } = orderingFromDashboard;

  const [max30Characters, setMax30Characters] = useState(false);
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState(""); 
  const [termsServiceChecked, setTermsServiceChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isToasterOpen, setIsToasterOpen] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState("");

  const handleClose = () => onClose();

  const handleToggleToaster = (isToggle, transactionNumber) => {
    setIsToasterOpen(isToggle);
    setTransactionNumber(transactionNumber);
  };

  const resetDialogStates = () => {
    // later with time refactor with zustand
    setIsToasterOpen(false);
    setSubmitted(false);
    setPurchaseOrderNumber("");
    setMax30Characters(false);
    onClose();
    setTransactionNumber(false);
  };

  const showEnuserCompanyName = (text) => {
    if (!!text && text.includes("({enduser-companyname})")) {
      const splitted = text
        .split(/\({enduser-companyname}\)/gim)
        .map((_text) => _text);
      splitted.splice(
        1,
        0,
        <>
          <span>
            <b>{endUser?.name}</b>
          </span>
        </>
      );
      return splitted;
    }
    console.log(
      "⚠ ({enduser-companyname}) placeholder missing on textfield dialog"
    );
    return null;
  };

  const constructTermsCondLink = (text) => {
    if (!text) return null;
    const splitted = text.split(/\b(?=terms .+ conditions)/gi);
    return splitted.map((_text, index) =>
      index === 1 ? (
        <a href={termsAndConditionsLink} className="cmp-place-order-link">
          {_text}
        </a>
      ) : (
        _text
      )
    );
  };

  const handleErrorOnMax = (valueLength) => {
    if (valueLength > 30) {
      setMax30Characters(true);
    } else {
      setMax30Characters(false);     
    }
  };

  const onMaxPOChange = (event) => {
    const value = event?.target?.value;
    setPurchaseOrderNumber(value);
    handleErrorOnMax(value.length);
    if (value.length > 30) {
      setMax30Characters(true);
    }
  };

  const checkButtonDisabled = () => {
    return !(
      purchaseOrderNumber.length <= 30 &&
      termsServiceChecked &&
      purchaseOrderNumber
    );
  };

  const OrderButton = submitted
    ? HOCButton({
        startIcon: (
          <CircularProgress
            size={20}
            sx={{ color: "white", fontSize: "14px" }}
          />
        ),
      })
    : HOCButton({
        disabled: checkButtonDisabled(),
        onClick: () => setSubmitted((submitted) => !submitted),
      });

  const handleCloseDialog = (event, reason) => {
    if (reason === "backdropClick" && !closeOnBackdropClick) return;
    handleClose();
  };

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="place-cmp-order-dialog-container">
          <div className="place-cmp-order-dialog-container__closeIcon">
            <Dismiss onClick={handleClose} />
          </div>
          <p className="cmp-place-order-title">
            {showEnuserCompanyName(placeOrderDialogTitle)}
          </p>
          <div className="cmp-place-order-content">
            <TextField
              error={max30Characters}
              value={purchaseOrderNumber}
              onChange={onMaxPOChange}
              helperText="Max 30 characters"
              {...PlaceOrderMaterialUi.textfieldsStyles}
            />
          </div>
          <div className="cmp-place-order-terms">
            <Checkbox
              id="cmp-place-order-checkbox"
              checked={termsServiceChecked}
              onChange={(e) => setTermsServiceChecked(e.target.checked)}
              sx={{ ...PlaceOrderMaterialUi.checkbox }}
            />
            {""}
            <label htmlFor="cmp-place-order-checkbox">
              {constructTermsCondLink(termsAndConditions)}
            </label>
          </div>
          <div className="cmp-place-order-actions">
            {submitted ? (
              <RenewalOrder
                handleToggleToaster={handleToggleToaster}
                handleClose={handleClose}
                renewalData={renewalData}
                customerPO={purchaseOrderNumber}
                orderEndpoints={orderEndpoints}
              >
                {" "}
                <OrderButton> Submitting </OrderButton>{" "}
              </RenewalOrder>
            ) : (
              <OrderButton> Order </OrderButton>
            )}
          </div>
        </div>
      </Dialog>
      <Suspense fallback={<Loader />}>
        <LazyToaster
          isToasterOpen={isToasterOpen}
          onClose={resetDialogStates}
          isSuccess={true}
          message={{ successSubmission,failedSubmission }}
        >          
          <ToasterDataVerification data={transactionNumber}/>          
        </LazyToaster>
      </Suspense>
    </>
  );
}

export default PlaceOrderDialog;
