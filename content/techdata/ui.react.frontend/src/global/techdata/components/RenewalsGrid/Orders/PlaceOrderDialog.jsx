import { Checkbox, CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import React, { Suspense } from "react";
import { Dismiss } from "../../../../../fluentIcons/FluentIcons";
import RenewalOrder from "./RenewalOrder";
import Loader from "../../Widgets/Loader";
import { PlaceOrderMaterialUi } from "./PlacerOrderMaterialUi";
import usePlaceOrderDialogHook from "./usePlaceOrderDialogHook";

const LazyToaster = React.lazy(() => import("../../Widgets/Toaster"));

function PlaceOrderDialog({
  orderingFromDashboard,
  renewalData,
  isDialogOpen,
  onClose,
  closeOnBackdropClick,
  ToasterDataVerification,
  orderEndpoints,
}) {
  console.log('🚀renewalData >>',renewalData);
  const { endUser } = renewalData;
  const {
    placeOrderDialogTitle,
    termsAndConditions,
    termsAndConditionsLink,
    successSubmission,
    failedSubmission,
  } = orderingFromDashboard;

  const {
    max30Characters,
    purchaseOrderNumber,
    onMaxPOChange,
    termsServiceChecked,
    submitted,
    isToasterOpen,
    transactionNumber,
    toasterMessage,
    resetDialogStates,
    setTermsServiceChecked,
    handleToggleToaster,
    OrderButtonComponent,
    onRequestSuccess,
    passEmailOnToastMessage
  } = usePlaceOrderDialogHook({successSubmission, failedSubmission});   


  const handleClose = () => onClose(); 

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
                passEmailOnToastMessage={passEmailOnToastMessage}
              >
                {" "}
                <OrderButtonComponent> Submitting </OrderButtonComponent>{" "}
              </RenewalOrder>
            ) : (
              <OrderButtonComponent> Order </OrderButtonComponent>
            )}
          </div>
        </div>
      </Dialog>
      <Suspense fallback={<Loader />}>
        <LazyToaster
          isToasterOpen={isToasterOpen}
          onClose={resetDialogStates}
          isSuccess={onRequestSuccess}
          message={toasterMessage}
        >
          <ToasterDataVerification data={transactionNumber} />
        </LazyToaster>
      </Suspense>
    </>
  );
}

export default PlaceOrderDialog;
