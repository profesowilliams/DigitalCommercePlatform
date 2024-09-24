import React, { useState, useEffect, useRef } from 'react';
import ConfigGrid from './ConfigGrid/ConfigGrid';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import RenewalPreviewGrid from './RenewalPreviewGrid/RenewalPreviewGrid';
import NewPurchaseFlyout from '../NewPurchaseFlyout/NewPurchaseFlyout';
import useGet from '../../hooks/useGet';
import Loader from '../Widgets/Loader';
import Modal from '../Modal/Modal';
import { getUrlParams } from '../../../../utils';
import { ACCESS_TYPES, hasAccess } from '../../../../utils/user-utils';
import { LOCAL_STORAGE_KEY_USER_DATA } from '../../../../utils/constants';
import { useStore } from '../../../../utils/useStore';
import {
  isAuthormodeAEM,
  isExtraReloadDisabled,
  isHttpOnlyEnabled,
} from '../../../../utils/featureFlagUtils';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Saving from './Saving';
import CancelDialog from './Cancel/CancelDialog';
import { get, post } from '../../../../utils/api';
import {
  getStatusLoopUntilStatusIsActive,
  mapRenewalForUpdateDetails,
} from '../RenewalsGrid/Orders/orderingRequests';
import { useRenewalsDetailsStore } from './store/RenewalsDetailsStore';
import EditFlow from './ConfigGrid/Common/EditFlow';
import {
  getDictionaryValue,
  getDictionaryValueOrKey,
} from '../../../../utils/utils';
import useAuth from '../../hooks/useAuth';
import { getSessionInfo } from '../../../../utils/intouch/user/get';
import { enableIntouchLogin } from '../../../../utils/intouch/intouchUtils';
import {
  AddIcon,
  ProhibitedIcon,
  DismissFilledSmallIcon,
  BannerInfoIcon,
} from '../../../../fluentIcons/FluentIcons';
import GridSubTotal from './GridSubTotal';
import { Button } from '@mui/material';
import useComputeBranding from '../../hooks/useComputeBranding';
import useIsIconEnabled from '../RenewalsGrid/Orders/hooks/useIsIconEnabled';

let redBanner = false;

function RenewalsDetails(props) {
  const componentProp = JSON.parse(props.componentProp);
  const errorMessages = componentProp?.errorMessages;
  const effects = useRenewalsDetailsStore((state) => state.effects);
  const { setCustomState } = effects;
  const { id = 'U100000008378', type = 'renewal' } = getUrlParams();
  const [modal, setModal] = useState(null);
  let [apiResponse, isLoading, error] = useGet(
    `${componentProp.uiServiceEndPoint}?id=${id}&type=${type}`
  );
  const userData = useStore((state) => state.userData);

  const setUserData = useStore((state) => state.setUserData);

  const USER_DATA = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA)
  );
  const { computeClassName } = useComputeBranding(useRenewalsDetailsStore);
  const shopURL = componentProp.shopURL;
  const { isUserLoggedIn: isLoggedIn } = useAuth();
  const changeRefreshDetailApiState = useStore(
    (state) => state.changeRefreshDetailApiState
  );
  const isEditingDetails = useRenewalsDetailsStore(
    (state) => state.isEditingDetails
  );
  const gridItems = useRenewalsDetailsStore((state) => state.items);

  const [subtotal, setSubtotal] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [renewalsDetails, setRenewalsDetails] = useState(null);

  componentProp.productLines.agGridLicenseKey = componentProp.agGridLicenseKey;

  const adobeVendor = renewalsDetails?.vendor?.name === 'Adobe';
  const isRequestQuoteFlag =
    renewalsDetails?.canRequestQuote && componentProp?.enableRequestQuote;
  const isIconEnabled =
    useIsIconEnabled(
      renewalsDetails?.firstAvailableOrderDate,
      renewalsDetails?.canOrder,
      componentProp?.orderingFromDashboard?.showOrderingIcon
    ) && !isRequestQuoteFlag;
  const [isPODialogOpen, setIsPODialogOpen] = useState(false);
  const [isPAODialogOpen, setIsPAODialogOpen] = useState(false);
  const [orderIconDisable, setOrderIconDisable] = useState(!isIconEnabled);
  const onOrderButtonClicked = () => {
    effects.setCustomState({ key: 'toaster', value: { isOpen: false } });
    setIsPODialogOpen(true);
    setIsPAODialogOpen(true);
    setOrderIconDisable(true);
  };
  const [toggleEdit, setToggleEdit] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authenticated, setAuthenticated] = useState(true);

  const [redBannerShow, setRedBannerShow] = useState(true);
  const [blueBannerShow, setBlueBannerShow] = useState(false);

  // Keep grid reference to cancel edit changes
  const gridRef = useRef();

  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const [mutableData, setMutableData] = useState(null);
  const [errorMessagesUpdate, setErrorMessagesUpdate] = useState([]);

  const redirectToShop = () => {
    window.location = shopURL;
  };

  const renewalsRef = useRef();

  useEffect(() => {
    const renewalsNode = renewalsRef.current;
    const parentRenewalsStyle =
      renewalsNode?.parentNode?.parentNode?.parentNode;
    const isTDSynnex = parentRenewalsStyle?.classList.contains(
      'cmp-renewals-details__tds'
    );
    const isTechdata =
      parentRenewalsStyle?.classList.contains('cmp-grid-techdata');
    let branding = isTechdata
      ? 'cmp-grid-techdata'
      : isTDSynnex
      ? 'td-synnex'
      : '';
    effects.setCustomState({ key: 'branding', value: branding });
  }, []);

  useEffect(() => {
    if (enableIntouchLogin()) {
      getSessionInfo().then((data) => {
        setUserData(data[1]);
      });
    }
  }, []);

  useEffect(() => {
    // Remove Dashboard separator(s) from only Renewal Details page
    // In case of don't have access redirect to shop
    if (process.env.NODE_ENV === 'development') return;
    if (isAuthormodeAEM()) return; // Validation for Author ENV

    const currentUserData =
      isExtraReloadDisabled() || isHttpOnlyEnabled() ? userData : USER_DATA;

    // If user not logged in
    const access_message = document.querySelector('.renewals-errormessage');
    if (
      currentUserData &&
      !hasAccess({
        user: currentUserData,
        accessType: ACCESS_TYPES.CAN_ACCESS_RENEWALS,
      })
    ) {
      if (access_message) {
        setAuthenticated(false);
        access_message.style.display = 'block';
        document.querySelector('.subheader').style.display = 'none';
      }
    }
  }, [
    USER_DATA,
    userData,
    ACCESS_TYPES,
    isAuthormodeAEM,
    hasAccess,
    redirectToShop,
  ]);

  const getErrorMessage = (errorCode) => {
    if (errorCode === 404) {
      return errorMessages?.notFoundErrorMessage;
    }
    return errorMessages?.unexpectedErrorMessage;
  };

  const getDetailsAPI = () => {
    changeRefreshDetailApiState();
  };

  const showSimpleModal = (
    title,
    content,
    onModalClosed = closeModal,
    buttonLabel,
    modalAction
  ) =>
    setModal((previousInfo) => ({
      content: content,
      properties: {
        title: title,
        buttonLabel,
      },
      onModalClosed,
      ...previousInfo,
      modalAction,
    }));

  const closeModal = () => setModal(null);

  const showErrorModal = (title, message, redirectPage) =>
    showSimpleModal(title, <div>{message}</div>, redirectPage || undefined);

  useEffect(() => {
    if ((isExtraReloadDisabled() && isLoggedIn) || !isExtraReloadDisabled()) {
      if (apiResponse?.content?.details) {
        setRenewalsDetails(apiResponse?.content?.details[0]);
      } else if (apiResponse?.error?.isError) {
        // 200 Ok isError=true
        showErrorModal(
          errorMessages?.errorLoadingPageTitle,
          getErrorMessage(apiResponse.error?.code),
          () => (window.location.href = errorMessages?.errorLoadingPageRedirect)
        );
      }
    }
  }, [apiResponse, isExtraReloadDisabled(), isLoggedIn]);

  // Close Cancel Dialog logic, reset data if necessary
  const closeCancelDialog = (resetFlag) => {
    // Close dialog
    setOpenCancelDialog(false);

    if (resetFlag) {
      effects.clearItems();
      setLockedEdit(false);
      setToggleEdit(true);
      // Call cancel edit on grid to clean internal values
      gridRef.current.cancelEdit();
    } else {
      setEditMode(true);
    }
  };

  const handleCancel = () => {
    setOpenCancelDialog(true);
    setEditMode(true);
    effects.setCustomState({ key: 'toaster', value: { isOpen: false } });
  };

  const handleSave = () => {
    setSaving(true);
    redBanner = false;
    updateDetails()
      .then((result) => {
        if (result) {
          effects.setCustomState({ key: 'savedItems', value: gridItems });
          setLockedEdit(false);
          setToggleEdit(true);
          effects.clearItems();
          if (
            componentProp?.productLines?.enableActiveLicence === 'true' &&
            renewalsDetails?.itemsActive?.length > 0
          ) {
            changeRefreshDetailApiState();
          }
        }
      })
      .finally(() => setSaving(false));
  };

  const setLockedEdit = (flag) => {
    setToggleEdit(false);
    setEditMode(flag);
    effects.setCustomState({ key: 'isEditingDetails', value: flag });
  };

  const getUpdatedMutableGrid = (resultArr) => {
    setMutableData(resultArr);
  };

  const updateDetails = async (
    endUserDetails,
    resellerDetails,
    shipToDetails
  ) => {
    try {
      const data =
        mutableData &&
        JSON.stringify(gridRef.current.getMutableGridData()) !==
          JSON.stringify(mutableData)
          ? mutableData
          : gridRef.current.getMutableGridData();
      effects.setCustomState({ key: 'toaster', value: { isOpen: false } });
      renewalsDetails.endUser = endUserDetails || renewalsDetails.endUser;
      renewalsDetails.reseller = resellerDetails || renewalsDetails.reseller;
      renewalsDetails.shipTo = shipToDetails || renewalsDetails.shipTo;
      renewalsDetails.items = data?.filter(
        (item) => !item.id.includes('Agreement')
      );

      if (renewalsDetails.endUser?.eaNumber?.text) {
        renewalsDetails['EANumber'] = renewalsDetails.endUser?.eaNumber?.text;
      }

      const updated = await updateRenewalDetails(renewalsDetails);
      if (updated) {
        const isActiveQuote = await getStatusLoopUntilStatusIsActive({
          getStatusEndpoint: componentProp.getStatusEndpoint,
          id: renewalsDetails.source.id,
          delay: 2000,
          iterations: 7,
        });
        if (isActiveQuote) {
          const toaster = {
            isOpen: true,
            origin: 'fromUpdate',
            isAutoClose: true,
            isSuccess: true,
            message: componentProp.quoteEditing.successUpdate,
          };
          effects.setCustomState({ key: 'toaster', value: { ...toaster } });
          if (endUserDetails || resellerDetails) changeRefreshDetailApiState();
          return true;
        } else {
          const toaster = {
            isOpen: true,
            origin: 'fromUpdate',
            isAutoClose: true,
            isSuccess: false,
            message: componentProp.quoteEditing?.failedUpdate,
          };
          effects.setCustomState({ key: 'toaster', value: { ...toaster } });
        }
      }
    } catch (ex) {
      const errorTitle = 'Could not save changes.';
      let errorMessage =
        'We are sorry, your update could not be processed, please try again later.';
      if (ex.status === 200 && ex?.data?.salesContentEmail) {
        errorMessage = componentProp.quoteEditing?.failedUpdate?.replace(
          '{email}',
          ex.data.salesContentEmail
        );
      }
      const errorToaster = {
        isOpen: true,
        origin: 'fromUpdate',
        isSuccess: false,
        title: errorTitle,
        message: errorMessage,
      };
      effects.setCustomState({ key: 'toaster', value: { ...errorToaster } });
    }
    return false;
  };

  const updateRenewalDetails = async (details) => {
    const { POAllowedLength, ...payload } = mapRenewalForUpdateDetails(details);
    const updateResponse = await post(
      componentProp.updateRenewalOrderEndpoint,
      payload
    );
    const updateError = updateResponse?.data?.error;
    const updateErrorMessages = updateError?.messages || [];
    setErrorMessagesUpdate(updateErrorMessages);
    setRedBannerShow(true);
    if (updateError?.isError) throw updateResponse;
    return true;
  };

  const closeRedBanner = (e) => {
    // e.target.closest('.details-error-red-banner').remove();
    setRedBannerShow(false);
  };

  const setErrorBlueBanner = () => {
    setBlueBannerShow(true);
  };

  const openNewPurchaseFlyout = (e) => {
    e.stopPropagation();
    setCustomState({
      key: 'newPurchaseFlyout',
      value: {
        show: true,
      },
    });
  };

  const isEditable = ({ canEditLines }) => canEditLines && !saving;
  return (
    <div
      className={
        componentProp.productLines.enableActiveLicence === 'true' &&
        renewalsDetails?.itemsActive?.length > 0
          ? 'cmp-quote-preview cmp-renewal-preview cmp-renewal-preview-active'
          : 'cmp-quote-preview cmp-renewal-preview'
      }
      ref={renewalsRef}
    >
      {authenticated && renewalsDetails ? (
        <section>
          <ConfigGrid
            data={renewalsDetails}
            updateDetails={updateDetails}
            gridProps={{
              ...componentProp,
              excelFileUrl: componentProp?.exportXLSRenewalsEndpoint,
            }}
          />
          {componentProp?.productLines?.enableActiveLicence === 'true' &&
          renewalsDetails?.itemsActive?.length > 0 ? (
            <div className="details-bottom-wrapper">
              <Accordion defaultExpanded>
                <AccordionSummary>
                  <div className="details-container">
                    <span className="details-preview">
                      {componentProp?.productLines?.lineActiveLicenceLabel ||
                        'Details'}
                      <span className="details-price-level">
                        {renewalsDetails.renewalLevelActive}
                      </span>
                    </span>
                    {componentProp?.enableNewPurchaseAction &&
                      renewalsDetails?.canAddMore && (
                        <div
                          className="details-preview-add-more"
                          onClick={openNewPurchaseFlyout}
                        >
                          <AddIcon width="17" />
                          <span>
                            {getDictionaryValueOrKey(
                              componentProp?.productLines?.addMoreButton,
                              'Add More'
                            )}
                          </span>
                        </div>
                      )}
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <RenewalPreviewGrid
                    ref={gridRef}
                    data={renewalsDetails}
                    compProps={componentProp}
                    gridProps={{
                      ...componentProp.productLines,
                      ...componentProp.quoteEditing,
                      excelFileUrl: componentProp?.exportXLSRenewalsEndpoint,
                    }}
                    isEditing={false}
                    shopDomainPage={componentProp.shopDomainPage}
                    isActiveLicense={true}
                    getUpdatedMutableGrid={getUpdatedMutableGrid}
                    errorMessagesUpdate={errorMessagesUpdate}
                    subtotal={subtotal}
                    setSubtotal={setSubtotal}
                    adobeVendor={adobeVendor}
                    setOrderIconDisable={setOrderIconDisable}
                    isPODialogOpen={isPODialogOpen}
                    setIsPODialogOpen={setIsPODialogOpen}
                    isPAODialogOpen={isPAODialogOpen}
                    setIsPAODialogOpen={setIsPAODialogOpen}
                    isRequestQuoteFlag={isRequestQuoteFlag}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion defaultExpanded>
                <AccordionSummary>
                  <div className="details-container">
                    <span className="details-preview">
                      {componentProp?.productLines?.lineRenewalDetailsLabel ||
                        'Details'}
                      <span className="details-price-level">
                        {renewalsDetails.renewalLevel}
                      </span>
                    </span>
                    {isEditable(renewalsDetails) && (
                      <EditFlow
                        disabled={!editMode && isEditingDetails}
                        editValue={editMode}
                        setEdit={setLockedEdit}
                        saveHandler={handleSave}
                        cancelHandler={handleCancel}
                      />
                    )}
                    {saving && <Saving />}
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  {errorMessagesUpdate?.length !== 0 && (
                    <div
                      className={
                        redBannerShow
                          ? 'details-error-red-banner'
                          : 'details-error-red-banner hide'
                      }
                    >
                      <p>
                        <ProhibitedIcon />
                        {getDictionaryValueOrKey(
                          componentProp?.productLines?.changesNotSavedRedBanner,
                          'Changes didn`t save. Try again Banner Label'
                        )}
                      </p>
                      <div className="close-icon" onClick={closeRedBanner}>
                        <DismissFilledSmallIcon />
                      </div>
                    </div>
                  )}
                  {blueBannerShow && (
                    <div className="details-error-blue-banner">
                      <p>
                        <BannerInfoIcon />
                        {getDictionaryValueOrKey(
                          componentProp?.productLines?.zeroQuantityBlueBanner,
                          'Zero Quantity Blue Banner Label'
                        )}
                      </p>
                    </div>
                  )}
                  <RenewalPreviewGrid
                    ref={gridRef}
                    data={renewalsDetails}
                    compProps={componentProp}
                    gridProps={{
                      ...componentProp.productLines,
                      ...componentProp.quoteEditing,
                      excelFileUrl: componentProp?.exportXLSRenewalsEndpoint,
                    }}
                    setErrorBlueBanner={setErrorBlueBanner}
                    isEditing={!toggleEdit}
                    shopDomainPage={componentProp.shopDomainPage}
                    activeLicenseEdit={renewalsDetails?.itemsActive?.length > 0}
                    getUpdatedMutableGrid={getUpdatedMutableGrid}
                    errorMessagesUpdate={errorMessagesUpdate}
                    closeCancelDialog={closeCancelDialog}
                    subtotal={subtotal}
                    setSubtotal={setSubtotal}
                    adobeVendor={adobeVendor}
                    setOrderIconDisable={setOrderIconDisable}
                    isPODialogOpen={isPODialogOpen}
                    setIsPODialogOpen={setIsPODialogOpen}
                    isPAODialogOpen={isPAODialogOpen}
                    setIsPAODialogOpen={setIsPAODialogOpen}
                    isRequestQuoteFlag={isRequestQuoteFlag}
                  />
                </AccordionDetails>
              </Accordion>
            </div>
          ) : (
            <div div className="details-upper-wrapper">
              <div className="details-container">
                <span className="details-preview">
                  {componentProp?.productLines?.lineItemDetailsLabel ||
                    'Details'}
                  <span className="details-price-level">
                    {renewalsDetails.renewalLevel}
                  </span>
                </span>
                {isEditable(renewalsDetails) && (
                  <EditFlow
                    disabled={!editMode && isEditingDetails}
                    editValue={editMode}
                    setEdit={setLockedEdit}
                    saveHandler={handleSave}
                    cancelHandler={handleCancel}
                  />
                )}
                {saving && <Saving />}
              </div>
              <RenewalPreviewGrid
                ref={gridRef}
                data={renewalsDetails}
                compProps={componentProp}
                gridProps={{
                  ...componentProp.productLines,
                  ...componentProp.quoteEditing,
                  excelFileUrl: componentProp?.exportXLSRenewalsEndpoint,
                }}
                isEditing={!toggleEdit}
                shopDomainPage={componentProp.shopDomainPage}
                getUpdatedMutableGrid={getUpdatedMutableGrid}
                errorMessagesUpdate={errorMessagesUpdate}
                closeCancelDialog={closeCancelDialog}
                subtotal={subtotal}
                setSubtotal={setSubtotal}
                adobeVendor={adobeVendor}
                setOrderIconDisable={setOrderIconDisable}
                isPODialogOpen={isPODialogOpen}
                setIsPODialogOpen={setIsPODialogOpen}
                isPAODialogOpen={isPAODialogOpen}
                setIsPAODialogOpen={setIsPAODialogOpen}
                isRequestQuoteFlag={isRequestQuoteFlag}
              />
            </div>
          )}
        </section>
      ) : (
        isLoading && <Loader visible={isLoading} />
      )}
      {renewalsDetails ? (
        <>
          <GridSubTotal
            data={renewalsDetails}
            gridProps={{
              ...componentProp.productLines,
              ...componentProp.quoteEditing,
              excelFileUrl: componentProp?.exportXLSRenewalsEndpoint,
            }}
            subtotal={subtotal}
            compProps={componentProp}
            adobeVendor={adobeVendor}
          />
          <div className="place-cmp-order-dialog-container">
            <p className="cmp-place-order-actions">
              <Button
                disabled={orderIconDisable}
                className={computeClassName('cmp-detail-order-button')}
                onClick={onOrderButtonClicked}
                variant="contained"
              >
                {getDictionaryValue('button.common.label.order', 'Order')}
              </Button>
            </p>
          </div>
        </>
      ) : null}
      {error && (
        <ErrorMessage
          error={error}
          messageObject={{
            message401: 'You need to be logged in to view this',
          }}
        />
      )}
      {modal && (
        <Modal
          // modalAction={modal.action} /** Commenting as this is a duplicate prop */
          modalContent={modal.content}
          modalProperties={modal.properties}
          modalAction={modal.modalAction}
          actionErrorMessage={modal.errorMessage}
          onModalClosed={modal.onModalClosed}
        ></Modal>
      )}
      <CancelDialog
        branding={useRenewalsDetailsStore((state) => state.branding || '')}
        isDialogOpen={openCancelDialog}
        onClose={closeCancelDialog}
        labels={componentProp.quoteEditing}
      />
      <NewPurchaseFlyout
        store={useRenewalsDetailsStore}
        copyFlyout={componentProp.copyFlyout}
        newPurchaseFlyout={componentProp.newPurchaseFlyout}
        getStatusEndpoint={componentProp.getStatusEndpoint}
        subheaderReference={document.querySelector('.subheader > div > div')}
        userData={userData}
        data={renewalsDetails}
        activeStep={2}
        isAddMore={true}
        detailsEndUserType={renewalsDetails?.endUserType}
        getDetailsAPI={getDetailsAPI}
      />
    </div>
  );
}

export default RenewalsDetails;
