import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

function PlaceOrderDialog({
  data,
  onClose,
  open,
  bottomContent,
  config,
  buttonSection,
  setEnablePlaceOrder,
}) {
  const [confirmPurchaseChecked, setConfirmPurchaseChecked] = useState(false);
  const [confirmTermsChecked, setConfirmTermsChecked] = useState(false);
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState('');
  const BottomContent = () => bottomContent('footer');

  useEffect(() => {
    if (
      confirmPurchaseChecked &&
      confirmTermsChecked &&
      purchaseOrderNumber?.length > 0
    ) {
      setEnablePlaceOrder(true);
    } else {
      setEnablePlaceOrder(false);
    }
  }, [confirmPurchaseChecked, confirmTermsChecked, purchaseOrderNumber]);
  return (
    <Dialog
      className="place-order-dialog"
      onClose={onClose}
      open={open}
      sx={{
        '& .MuiPaper-root.MuiDialog-paper': {
          position: 'absolute',
          bottom: 0,
          right: 0,
          margin: 0,
          width: '948px',
          maxWidth: '948px',
        },
      }}
    >
      <div className="place-order-dialog__content">
        <p className="place-order-dialog__content__title">
          {getDictionaryValueOrKey(config?.placeOrder)}
        </p>
        <p className="place-order-dialog__content__description">
          {getDictionaryValueOrKey(config?.toCompletePlacingYourOrderFor)}{' '}
          <span className="place-order-dialog__content__bold">
            {data?.endUser?.name?.text}
          </span>{' '}
          {getDictionaryValueOrKey(
            config?.pleaseProvideTheFollowingInformation
          )}
        </p>
        <div className="place-order-dialog__content__input">
          <TextField
            required
            id="new-purchase-confirm-purchase-input"
            label={getDictionaryValueOrKey(config?.purchaseOrderNumber)}
            helperText={getDictionaryValueOrKey(config?.max35Characters)}
            variant="standard"
            value={purchaseOrderNumber}
            onChange={(event) => {
              setPurchaseOrderNumber(event.target.value);
            }}
            fullWidth
          />
        </div>
        <div className="place-order-dialog__content__checkbox">
          <Checkbox
            id="new-purchase-confirm-purchase-checkbox"
            checked={confirmPurchaseChecked}
            onChange={(e) => setConfirmPurchaseChecked(e.target.checked)}
          />
          {''}
          <label className="place-order-dialog__content__text">
            {getDictionaryValueOrKey(config?.iConfirmIAmAuthorizedByAdobe)}
          </label>
        </div>
        <div className="place-order-dialog__content__checkbox--single-line">
          <Checkbox
            id="new-purchase-confirm-terms-checkbox-single-line"
            checked={confirmTermsChecked}
            onChange={(e) => setConfirmTermsChecked(e.target.checked)}
          />
          <label className="place-order-dialog__content__text">
            {getDictionaryValueOrKey(config?.iHaveReadAndAcceptThe)}{' '}
            <a
              href={getDictionaryValueOrKey(config?.termsAndConditionsLink)}
              target="_blank"
              className="place-order-dialog__content__link"
            >
              {getDictionaryValueOrKey(config?.techDataTermsConditions)}
            </a>{' '}
            {getDictionaryValueOrKey(config?.the)}{' '}
            <a
              href={getDictionaryValueOrKey(
                config?.adobeResellerTermsAndConditionsLink
              )}
              target="_blank"
              className="place-order-dialog__content__link"
            >
              {getDictionaryValueOrKey(config?.adobeTermsConditions)}.
            </a>
          </label>
        </div>
      </div>

      <DialogActions>
        <div className="place-order-dialog__footer">
          <BottomContent />
          {buttonSection}
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default PlaceOrderDialog;
