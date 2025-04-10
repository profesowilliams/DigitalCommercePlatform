import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { ArrowBackIcon, CircularArrowIcon } from '../../../../fluentIcons/FluentIcons';
import { createOrder } from './api';
import Button from '@mui/material/Button';
import { getStatusLoopUntilStatusIsActive } from '../RenewalsGrid/Orders/orderingRequests';

function PlaceOrderDialog({
  userData,
  externalUser,
  detailsData,
  data,
  itemsPayload,
  onClose,
  open,
  bottomContent,
  config,
  getStatusEndpoint,
  store,
  resellerId,
  resellerName,
  formPart1States,
  closeFlyout,
  onQueryChanged,
  isAddMore,
  detailsEndUserType,
  getDetailsAPI,
}) {
  const [confirmPurchaseChecked, setConfirmPurchaseChecked] = useState(false);
  const [confirmTermsChecked, setConfirmTermsChecked] = useState(false);
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState('');
  const [enablePlaceOrder, setEnablePlaceOrder] = useState(false);
  const [completeBtnValidating, setCompleteBtnValidating] = useState(false);
  const effects = store((st) => st.effects);

  const {
    firstName,
    lastName,
    email,
    endUserCompanyName,
    endUserCompanyFirstName,
    endUserCompanyLastName,
    endUserEmail,
    endUserType,
    endUserAddress1,
    endUserAddress2,
    endUserCity,
    endUserAreaCode,
    endUserCountry,
  } = formPart1States;

  const enableFirstCheckbox =
    (endUserType || detailsEndUserType) === 'Education';

  // Add manufacturer: 'Adobe',and format quantity to int

  const programName = `VIP MP ${endUserType}`;

  const transformItemsPayload = (payload) => {
    return payload.map((item) => {
      const quantity = parseInt(item.quantity);

      const updatedProduct = item.product.map((product) => {
        if (product.type === 'MANUFACTURER') {
          return {
            ...product,
            manufacturer: 'Adobe',
          };
        }
        return product;
      });

      return {
        ...item,
        quantity,
        product: updatedProduct,
        programName: detailsData ? detailsData?.programName : programName,
      };
    });
  };
  const transformedPayload = transformItemsPayload(itemsPayload);
  // Create order

  const handleCreateOrder = async () => {
    setCompleteBtnValidating(true);
    const renewalDetailsPayload = {
      quoteId: detailsData?.source?.id,
      reseller: {
        id: detailsData?.reseller?.id,
        name: externalUser
          ? userData?.activeCustomer?.customerName
          : detailsData?.reseller?.name,
        contact: {
          name: externalUser
            ? `${userData?.firstName} ${userData?.lastName}`
            : detailsData?.reseller?.contact[0]?.name?.text,
          email: externalUser
            ? userData?.email
            : detailsData?.reseller?.contact[0]?.email?.text,
        },
      },
      endUser: {
        name: detailsData?.endUser?.name?.text,
        contact: {
          name: detailsData?.endUser?.contact[0]?.name?.text,
          email: detailsData?.endUser?.contact[0]?.email?.text,
        },
        address: {
          line1: detailsData?.endUser?.address?.line1?.text,
          line2: detailsData?.endUser?.address?.line2?.text,
          city: detailsData?.endUser?.address?.city?.text,
          postalCode: detailsData?.endUser?.address?.postalCode?.text,
          country: detailsData?.endUser?.address?.countryCode?.text,
          countryCode: detailsData?.endUser?.address?.countryCode?.text,
        },
        alternateIdentifier: {
          type: 'EANumber',
          value: detailsData?.endUser?.eaNumber?.text,
        },
      },
      VendorReference: {
        Type: 'QuoteId',
        Value: detailsData?.vendorReference[0]?.value,
      },
      items: transformedPayload,
      customerPo: purchaseOrderNumber,
    };
    const renewalPayload = {
      reseller: {
        id: resellerId || '',
        name: externalUser
          ? userData?.activeCustomer?.customerName
          : resellerName,
        contact: {
          name: externalUser
            ? `${userData?.firstName} ${userData?.lastName}`
            : `${firstName} ${lastName}`,
          email: externalUser ? userData?.email : email,
        },
      },
      endUser: {
        name: endUserCompanyName,
        contact: {
          name: `${endUserCompanyFirstName} ${endUserCompanyLastName}`,
          email: endUserEmail,
        },
        address: {
          line1: endUserAddress1,
          line2: endUserAddress2,
          city: endUserCity,
          postalCode: endUserAreaCode,
          country: endUserCountry,
          countryCode: endUserCountry,
        },
      },
      items: transformedPayload,
      customerPo: purchaseOrderNumber,
    };
    const toasterSuccess = {
      isOpen: true,
      origin: 'placeNewPurchaseOrderFlyout',
      isAutoClose: true,
      isSuccess: true,
      message: `${getDictionaryValueOrKey(
        config?.yourOrderFor
      )} ${purchaseOrderNumber} ${getDictionaryValueOrKey(
        config?.hasBeenSuccessfullySubmittedForProcessing
      )}`,
    };
    const toasterFail = {
      isOpen: true,
      origin: 'placeNewPurchaseOrderFlyout',
      isAutoClose: true,
      isSuccess: false,
      message: getDictionaryValueOrKey(config?.unknownErrorNewPurchase),
    };

    try {
      const response = await createOrder(
        config?.createNewPurchaseOrderEndpoint,
        isAddMore ? renewalDetailsPayload : renewalPayload
      );
      if (response?.error?.isError) {
        effects.setCustomState({
          key: 'toaster',
          value: { ...toasterFail },
        });
        setCompleteBtnValidating(false);
      } else {
        if (isAddMore) {
          const isActiveQuote = await getStatusLoopUntilStatusIsActive({
            getStatusEndpoint: getStatusEndpoint,
            id: detailsData.source.id,
            delay: 2000,
            iterations: 7,
          });
          if (isActiveQuote) {
            effects.setCustomState({
              key: 'toaster',
              value: { ...toasterSuccess },
            });
            onClose();
            closeFlyout();
            getDetailsAPI();
          }
        } else {
          effects.setCustomState({
            key: 'toaster',
            value: { ...toasterSuccess },
          });
          onClose();
          closeFlyout();
          onQueryChanged();
        }
        return response;
      }
    } catch (error) {
      effects.setCustomState({
        key: 'toaster',
        value: { ...toasterFail },
      });
      setCompleteBtnValidating(false);
    } finally {
    }
  };

  const handleCompleteOrder = () => {
    handleCreateOrder();
  };

  const handleOnBack = () => {
    setConfirmPurchaseChecked(false);
    setConfirmTermsChecked(false);
    setPurchaseOrderNumber('');
    onClose();
  };

  const BottomContent = () => bottomContent('footer');
  const buttonSection = (
    <div className="cmp-flyout__footer-buttons order-modification">
      {completeBtnValidating ? (
        <Button
          startIcon={<CircularArrowIcon className="circular-arrow-icon" />}
          sx={{
            textTransform: 'none',
          }}
          disabled={true}
          className="primary"
          onClick={handleCompleteOrder}
        >
          {getDictionaryValueOrKey(config?.completeOrder)}
        </Button>
      ) : (
        <button
          disabled={!enablePlaceOrder}
          className="primary"
          onClick={handleCompleteOrder}
        >
          {getDictionaryValueOrKey(config?.completeOrder)}
        </button>
      )}
      <button className="secondary" onClick={handleOnBack}>
        <ArrowBackIcon />
        {getDictionaryValueOrKey(config?.modifyOrder)}
      </button>
    </div>
  );
  useEffect(() => {
    if (
      (enableFirstCheckbox ? confirmPurchaseChecked : true) &&
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
            id="new-purchase-confirm-purchase-input"
            label={getDictionaryValueOrKey(config?.purchaseOrderNumber)}
            helperText={getDictionaryValueOrKey(config?.max35Characters)}
            variant="standard"
            value={purchaseOrderNumber}
            inputProps={{ maxLength: 35 }}
            onChange={(event) => {
              setPurchaseOrderNumber(event.target.value);
            }}
            fullWidth
          />
        </div>
        {enableFirstCheckbox && (
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
        )}
        <div className="place-order-dialog__content__checkbox--single-line">
          <Checkbox
            id="new-purchase-confirm-terms-checkbox-single-line"
            checked={confirmTermsChecked}
            onChange={(e) => setConfirmTermsChecked(e.target.checked)}
          />
          <label className="place-order-dialog__content__text">
            {getDictionaryValueOrKey(config?.iHaveReadAndAcceptThe)}{' '}
            <a
              href={getDictionaryValueOrKey(
                config?.termsAndConditionsLinkNewPurchase
              )}
              target="_blank"
              className="place-order-dialog__content__link"
            >
              {getDictionaryValueOrKey(config?.techDataTermsConditions)}
            </a>{' '}
            {getDictionaryValueOrKey(config?.the)}{' '}
            <a
              href={getDictionaryValueOrKey(
                config?.adobeResellerTermsAndConditionsLinkNewPurchase
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
