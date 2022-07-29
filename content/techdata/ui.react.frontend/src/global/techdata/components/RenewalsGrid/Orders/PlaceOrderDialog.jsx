import { Checkbox, CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import React, { useState } from "react";
import {
  CartIcon,
  CheckmarkCircle,
  Dismiss,
} from "../../../../../fluentIcons/fluentIcons";
import { teal } from "@mui/material/colors";
import RenewalOrder from "./RenewalOrder";

const HOCButton = (properties) => {
  return function ({ children }) {
    return (
      <Button
        sx={{
          background: teal[800],
          "&:hover": { background: teal[600] },
        }}
        variant="contained"
        autoFocus
        {...properties}
      >
        {children}
      </Button>
    );
  };
};

function PlaceOrderDialog({
  orderingFromDashboard,
  agreementNumber,
  canPlaceOrder = false,
  distiQuote,
}) {
  const {
    showOrderingIcon,
    placeOrderDialogTitle,
    termsAndConditions,
    termsAndConditionsLink,
    successSubmission
  } = orderingFromDashboard;
  const [open, setOpen] = useState(false);
  const [max30Characters, setMax30Characters] = useState(false);
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [termsServiceChecked, setTermsServiceChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isToasterOpen, setIsToasterOpen] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggleToaster = (isToggle, transactionNumber) => {
    setIsToasterOpen(isToggle);
    setTransactionNumber(transactionNumber);
  };

  // const textfieldsStyles = styled(TextField)({
  const textfieldsStyles = {
    "& label.Mui-focused": {
      color: "#a6aaab",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#a6aaab",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#a6aaab",
      },
      "&:hover fieldset": {
        borderColor: "#a6aaab",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#a6aaab",
      },
    },
  };

  const showAgreementNumber = (text) => {
    if (!!text && text.includes("_")) {
      const splitted = text.split("_").map((_text) => _text);
      splitted.splice(
        1,
        0,
        <>
          <span>
            <b>Agreement No: {agreementNumber}</b>
          </span>
        </>
      );
      return splitted;
    }
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
      setButtonDisabled(false);
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

  return (
    <>
      {showOrderingIcon && canPlaceOrder ? (
        <CartIcon onClick={handleOpen} />
      ) : (
        <CartIcon
          fill="#c6c6c6"
          style={{ pointerEvents: "none" }}
          onClick={handleOpen}
        />
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="place-cmp-order-dialog-container">
          <p className="cmp-place-order-title">
            {showAgreementNumber(placeOrderDialogTitle)}
          </p>
          <p className="cmp-place-order-content">
            <TextField
              error={max30Characters}
              label="Purchase Order Number"
              sx={{ width: "100%", ...textfieldsStyles }}
              // value={purchaseOrderNumber}
              variant="standard"
              value={purchaseOrderNumber}
              onChange={onMaxPOChange}
              helperText="Max 30 characters"
            />
          </p>
          <p className="cmp-place-order-terms">
            <Checkbox
              id="cmp-place-order-checkbox"
              checked={termsServiceChecked}
              onChange={(e) => {
                console.log(e);
                setTermsServiceChecked(e.target.checked);
              }}
              sx={{
                color: teal[800],
                "&.Mui-checked": { color: teal[600] },
                paddingLeft: "0px",
              }}
            />
            {""}
            <label htmlFor="cmp-place-order-checkbox">
              {constructTermsCondLink(termsAndConditions)}
            </label>
          </p>
          <p className="cmp-place-order-actions">
            {submitted ? (
              <RenewalOrder
                handleToggleToaster={handleToggleToaster}
                handleClose={handleClose}
                id={distiQuote}
                CustomerPO={purchaseOrderNumber}
              >
                {" "}
                <OrderButton> Submitting </OrderButton>{" "}
              </RenewalOrder>
            ) : (
              <OrderButton> Order </OrderButton>
            )}
          </p>
        </div>
      </Dialog>

      <Drawer
        anchor="right"
        open={isToasterOpen}
        hideBackdrop={true}
        className="toaster-modal"
        sx={{ height: "max-content" }}
        onClose={() => setIsToasterOpen(false)}
      >
        <div className="cmp-toaster-content">
          <div className="cmp-toaster-content__icon">
            <CheckmarkCircle fill={teal[800]} />
          </div>
          <div className="cmp-toaster-content__message">
            <p>
              {successSubmission}
            </p>
            <b>Transaction number : {transactionNumber}</b>
          </div>
          <div className="cmp-toaster-content__closeIcon">
            <Dismiss onClick={() => setIsToasterOpen(false)} />
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default PlaceOrderDialog;
