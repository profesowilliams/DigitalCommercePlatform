import { Checkbox, CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import React, { useMemo } from "react";
import { Dismiss } from "../../../../../fluentIcons/FluentIcons";
import { PlaceOrderMaterialUi } from "./PlacerOrderMaterialUi";
import usePlaceOrderDialogHook from "./hooks/usePlaceOrderDialogHook";
import { useEffect } from "react";
import { thousandSeparator } from "../../../helpers/formatting";



function PlaceOrderDialog({
  orderingFromDashboard,
  renewalData,
  isDialogOpen,
  onClose,
  closeOnBackdropClick,
  orderEndpoints,
  isDetails = false,
  store  
}) {
  const { endUser, POAllowedLength } = renewalData;
  const {
    placeOrderDialogTitle,
    termsAndConditions,
    termsAndConditionsLink,
    successSubmission,
    failedSubmission,
    noResponseMessage
  } = orderingFromDashboard;

  const {
    max30Characters,
    purchaseOrderNumber,
    onTextFieldChange,
    termsServiceChecked,
    submitted,  
    setTermsServiceChecked,
    OrderButtonComponent,
    resetDialogStates   
  } = usePlaceOrderDialogHook({successSubmission, failedSubmission, noResponseMessage, orderEndpoints, renewalData, onClose, isDetails, store, POAllowedLength});   

  const handleClose = (isSuccess = false) => onClose(isSuccess); 

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
        <a href={termsAndConditionsLink} key={index} target="_blank" className="cmp-place-order-link">
          {_text}
        </a>
      ) : (
        _text
      )
    );
  };

  const handleCloseDialog = (event, reason) => {
    if (reason === "backdropClick" && !closeOnBackdropClick) return;
    resetDialogStates();
    handleClose();
  };

  const setHelperText = useMemo(() => POAllowedLength ? `Max ${thousandSeparator(POAllowedLength, 0)} characters` : '',[POAllowedLength]);
  
  return (
    <>
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{zIndex:'10000'}}
      >
        <div className="place-cmp-order-dialog-container">
          <div className="place-cmp-order-dialog-container__closeIcon">
            {!submitted ? (
              <Dismiss onClick={handleCloseDialog} />
            ) : (
              <Dismiss
                fill="#c6c6c6"
                style={{ pointerEvents: "none" }}
              />
            )}
          </div>
          <p className="cmp-place-order-title">
            {showEnuserCompanyName(placeOrderDialogTitle)}
          </p>
          <div className="cmp-place-order-content">
            <TextField
              error={max30Characters}
              value={purchaseOrderNumber}
              className="cmp-order-purchase-order-number"
              onChange={onTextFieldChange}
              helperText={setHelperText}
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
              <OrderButtonComponent> Submitting </OrderButtonComponent>
            ) : (
              <OrderButtonComponent> Order </OrderButtonComponent>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default PlaceOrderDialog;
