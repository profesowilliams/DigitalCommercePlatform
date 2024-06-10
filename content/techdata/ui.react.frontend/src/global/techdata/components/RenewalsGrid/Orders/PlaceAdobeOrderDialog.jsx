import { Checkbox } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import React, { useMemo } from 'react';
import { Dismiss } from '../../../../../fluentIcons/FluentIcons';
import { PlaceOrderMaterialUi } from './PlacerOrderMaterialUi';
import usePlaceOrderDialogHook from './hooks/usePlaceOrderDialogHook';
import { thousandSeparator } from '../../../helpers/formatting';
import useComputeBranding from '../../../hooks/useComputeBranding';

function PlaceAdobeOrderDialog({
  orderingFromDashboard,
  renewalData,
  isDialogOpen,
  onClose,
  closeOnBackdropClick,
  orderEndpoints,
  isDetails = false,
  store,
}) {
  const { endUser, POAllowedLength } = renewalData;
  const {
    placeOrderDialogTitle,
    termsAndConditions,
    termsAndConditionsLink,
    successSubmission,
    failedSubmission,
    noResponseMessage,
  } = orderingFromDashboard;

  const {
    max30Characters,
    purchaseOrderNumber,
    onTextFieldChange,
    termsServiceChecked,
    submitted,
    setTermsServiceChecked,
    OrderButtonComponent,
    resetDialogStates,
  } = usePlaceOrderDialogHook({
    successSubmission,
    failedSubmission,
    noResponseMessage,
    orderEndpoints,
    renewalData,
    onClose,
    isDetails,
    store,
    POAllowedLength,
  });

  const { computeClassName } = useComputeBranding(store);
  const handleClose = (isSuccess = false) => onClose(isSuccess);

  const showEnuserCompanyName = (text) => {
    if (!!text && text.includes('({enduser-companyname})')) {
      const splitted = text.split(/\({enduser-companyname}\)/gim);
      splitted.splice(
        1,
        0,
        <span key="end-user-company-name">
          <b>{endUser?.name}</b>
        </span>
      );
      return splitted;
    }
    console.log(
      '⚠ ({enduser-companyname}) placeholder missing on textfield dialog'
    );
    return null;
  };

  const constructTermsCondLink = (text) => {
    if (!text) return null;
    const [label, terms = ''] = text.split(/\b(?=terms .+ conditions)/gi);
    return (
      <>
        <span>{label}</span>
        <a
          href={termsAndConditionsLink}
          target="_blank"
          className="cmp-place-order-link"
        >
          {terms}
        </a>
        <span>, applicable </span>
        <a
          href={termsAndConditionsLink}
          target="_blank"
          className="cmp-place-order-link"
        >
          Country Specific Terms & Conditions
        </a>
        <span> & the </span>
        <a
          href={termsAndConditionsLink}
          target="_blank"
          className="cmp-place-order-link"
        >
          Adobe Terms & Conditions
        </a>
      </>
    );
  };

  const handleCloseDialog = (event, reason) => {
    if (reason === 'backdropClick' && !closeOnBackdropClick) return;
    resetDialogStates();
    handleClose();
  };

  const setHelperText = useMemo(
    () =>
      POAllowedLength
        ? `Max ${thousandSeparator(POAllowedLength, 0)} characters`
        : '',
    [POAllowedLength]
  );

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ zIndex: '10000' }}
      >
        <div className="place-cmp-adobe-order-dialog-container">
          <div className="place-cmp-order-dialog-container__closeIcon">
            {!submitted ? (
              <Dismiss onClick={handleCloseDialog} />
            ) : (
              <Dismiss fill="#c6c6c6" style={{ pointerEvents: 'none' }} />
            )}
          </div>
          <p className="cmp-place-order-main-title">Place order</p>
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
              className={computeClassName('cmp-place-order-checkbox')}
            />
            {''}
            <label htmlFor="cmp-place-order-checkbox">
              {constructTermsCondLink(termsAndConditions)}
            </label>
          </div>
          <div className="cmp-place-adobe-order-actions">
            {submitted ? (
              <OrderButtonComponent> Submitting </OrderButtonComponent>
            ) : (
              <OrderButtonComponent> Continue </OrderButtonComponent>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default PlaceAdobeOrderDialog;
