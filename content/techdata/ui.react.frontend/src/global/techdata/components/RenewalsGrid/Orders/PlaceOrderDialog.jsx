import { Checkbox } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import React from "react";
import { CartIcon } from "../../../../../fluentIcons/fluentIcons";
import { teal } from "@mui/material/colors";

function PlaceOrderDialog({ orderingFromDashboard, agreementNumber, canPlaceOrder = false }) {
    
  const {showOrderingIcon,placeOrderDialogTitle,termsAndConditions,termsAndConditionsLink} = orderingFromDashboard;
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const PurchaseOrderNumberTextField = styled(TextField)({
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
  });

  const showAgreementNumber = (text) => {   
    if (text.includes("_")){
      const splitted = text.split("_").map(_text => _text);
      splitted.splice(1,0,(<>
        <span><b>Agreement No: {agreementNumber}</b></span>
        </>))
      return splitted
    }
    return null;
  };

  const constructTermsCondLink = (text) => {
    const splitted = text.split(/\b(?=terms .+ conditions)/gi);  
    return splitted.map((_text, index) => 
        index === 1 ? (<a href={termsAndConditionsLink} className="cmp-place-order-link">{_text}</a>) : _text
    )
  }
  
  return (
    <>
      {showOrderingIcon && canPlaceOrder ? <CartIcon onClick={handleOpen} /> : <CartIcon fill="#c6c6c6" style={{ pointerEvents: "none"}} onClick={handleOpen} />}
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
            <PurchaseOrderNumberTextField
              label="Purchase Order Number"
              sx={{ width: "100%" }}
              variant="standard"
              helperText="Max 30 characters"
            />
          </p>
          <p className="cmp-place-order-terms">
            <Checkbox id="cmp-place-order-checkbox" sx={{color: teal[800],"&.Mui-checked": { color: teal[600] },paddingLeft: "0px",}}/>{""}
            <label htmlFor="cmp-place-order-checkbox">
              {constructTermsCondLink(termsAndConditions)}           
            </label>
          </p>
          <p className="cmp-place-order-actions">
            <Button
              sx={{background: teal[800],"&:hover": { background: teal[600] }}}
              onClick={handleClose}
              variant="contained"
              autoFocus
            >
              Order
            </Button>
          </p>
        </div>
      </Dialog>
    </>
  );
}

export default PlaceOrderDialog;
