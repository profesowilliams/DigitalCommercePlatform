import React, { useState, useEffect, useRef } from "react";
import ConfigGrid from "./ConfigGrid/ConfigGrid";
import RenewalPreviewGrid from "./RenewalPreviewGrid/RenewalPreviewGrid";
import usePost from "../../hooks/usePost";
import Loader from "../Widgets/Loader";
import Modal from '../Modal/Modal';
import { getUrlParams } from "../../../../utils";
import { ACCESS_TYPES, hasAccess } from "../../../../utils/user-utils";
import { LOCAL_STORAGE_KEY_USER_DATA } from "../../../../utils/constants";
import { useStore } from "../../../../utils/useStore"
import { isAuthormodeAEM, isExtraReloadDisabled, isHttpOnlyEnabled } from "../../../../utils/featureFlagUtils";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { If } from "../../helpers/If";
import Edit from "./Edit";
import CancelAndSave from "./CancelAndSave";
import Saving from "./Saving";
import CancelDialog from "./Cancel/CancelDialog";
import { get, post } from '../../../../utils/api';
import { getStatusLoopUntilStatusIsActive, mapRenewalForUpdateDetails } from '../RenewalsGrid/Orders/orderingRequests';
import { useRenewalsDetailsStore } from "./store/RenewalsDetailsStore";
import EditFlow from './ConfigGrid/Common/EditFlow';
import { removeDashboardSeparator } from "../../../../utils/utils";
import useAuth from "../../hooks/useAuth";
import { getSessionInfo } from "../../../../utils/intouch/user/get";
import { enableIntouchLogin } from "../../../../utils/intouch/intouchUtils";

function RenewalsDetails(props) {
  const componentProp = JSON.parse(props.componentProp);
  const errorMessages = componentProp?.errorMessages;
  const effects = useRenewalsDetailsStore(state => state.effects);
  const { id = "U100000008378", type = "renewal" } = getUrlParams();
  const [modal, setModal] = useState(null);
  const params = {
    id: id
  };
  const [apiResponse, isLoading, error] = usePost(
    `${componentProp.uiServiceEndPoint}`, params
  );
  const userData = useStore((state) => state.userData);

  const setUserData = useStore((state) => state.setUserData);

  const USER_DATA = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA));
  const shopURL = componentProp.shopURL;
  const { isUserLoggedIn:isLoggedIn } = useAuth();
  const changeRefreshDetailApiState = useStore((state) => state.changeRefreshDetailApiState)  
  const isEditingDetails = useRenewalsDetailsStore( state => state.isEditingDetails);
  const gridItems = useRenewalsDetailsStore(state => state.items);

  const [editMode, setEditMode] = useState(false);
  const [renewalsDetails, setRenewalsDetails] = useState(null);

  componentProp.productLines.agGridLicenseKey = componentProp.agGridLicenseKey;

  const [toggleEdit, setToggleEdit] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authenticated, setAuthenticated] = useState(true);

  // Keep grid reference to cancel edit changes
  const gridRef = useRef();

  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const redirectToShop = () => {
    window.location = shopURL;
  };

  const renewalsRef = useRef();

  useEffect(()=>{
    const renewalsNode = renewalsRef.current;
    const parentRenewalsStyle = renewalsNode?.parentNode?.parentNode?.parentNode;
    const isTDSynnex = parentRenewalsStyle?.classList.contains("cmp-renewals-details__tds");
    const isTechdata = parentRenewalsStyle?.classList.contains("cmp-grid-techdata");
    let branding = isTechdata ? 'cmp-grid-techdata' : (isTDSynnex ? 'td-synnex' : '');    
    effects.setCustomState({key:'branding', value:branding});
  },[])

  useEffect(() => {
    if(enableIntouchLogin()) {
      getSessionInfo().then((data) => {
        setUserData(data[1]);
      });
    }
  }, []);

  useEffect(() => {
    // Remove Dashboard separator(s) from only Renewal Details page
    // In case of don't have access redirect to shop
    if(process.env.NODE_ENV === "development") return;
    if(isAuthormodeAEM()) return; // Validation for Author ENV

    const currentUserData = isExtraReloadDisabled() || isHttpOnlyEnabled() ? userData : USER_DATA;

    // If user not logged in
    const access_message = document.querySelector('.renewals-errormessage');
    if(currentUserData &&
    !hasAccess({ user: currentUserData, accessType: ACCESS_TYPES.CAN_ACCESS_RENEWALS })) {
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
    redirectToShop
  ]);

  const getErrorMessage = (errorCode) => {
    if(errorCode === 404) {
      return errorMessages?.notFoundErrorMessage;
    }
    return errorMessages?.unexpectedErrorMessage;
  }

  const showSimpleModal = (title, content, onModalClosed=closeModal, buttonLabel, modalAction) =>
    setModal((previousInfo) => ({
      content: content,
      properties: {
          title:  title,
          buttonLabel
      },
      onModalClosed,
      ...previousInfo,
      modalAction
    })
  );

  const closeModal = () => setModal(null);

  const showErrorModal = (title, message, redirectPage) =>
    showSimpleModal(title, <div>{message}</div>, redirectPage || undefined);

  useEffect(() => {
    if((isExtraReloadDisabled() && isLoggedIn) || !isExtraReloadDisabled()){
      if (apiResponse?.content?.details) {
        setRenewalsDetails(apiResponse?.content?.details[0]);
      } else if(apiResponse?.error?.isError) {// 200 Ok isError=true
          showErrorModal(errorMessages?.errorLoadingPageTitle, getErrorMessage(apiResponse.error?.code),
            () => window.location.href = errorMessages?.errorLoadingPageRedirect);
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
  }  
  
  const handleCancel = () => {
    setOpenCancelDialog(true);
    setEditMode(true);
    effects.setCustomState({ key: 'toaster', value: { isOpen: false } });
  };

  const handleSave = () => {
    setSaving(true);
    updateDetails()
      .then((result) => {
        if(result) {
          effects.setCustomState({key: 'savedItems', value: gridItems});
          setLockedEdit(false);
          setToggleEdit(true);
          effects.clearItems();
        }
      })
      .finally(() => setSaving(false));
  };

  const setLockedEdit = (flag) => {
    setToggleEdit(false);
    setEditMode(flag);
    effects.setCustomState({ key: 'isEditingDetails', value: flag });
  };

  const updateDetails = async (endUserDetails, resellerDetails, shipToDetails) => {
    try {      
      effects.setCustomState({ key: 'toaster', value: { isOpen: false } });
      renewalsDetails.endUser = endUserDetails || renewalsDetails.endUser;
      renewalsDetails.reseller = resellerDetails || renewalsDetails.reseller;
      renewalsDetails.shipTo = shipToDetails || renewalsDetails.shipTo;
      renewalsDetails.items = (gridRef.current.getMutableGridData())?.filter(item => !(item.id.includes('Agreement')));
      
      if (renewalsDetails.endUser?.eaNumber?.text) {
        renewalsDetails['EANumber'] = renewalsDetails.endUser?.eaNumber?.text;
      }

      const updated = await updateRenewalDetails(renewalsDetails);
      if(updated) {
        const isActiveQuote = await getStatusLoopUntilStatusIsActive({
          getStatusEndpoint: componentProp.getStatusEndpoint,
          id: renewalsDetails.source.id, 
          delay: 2000,
          iterations: 7})
        if(isActiveQuote) {            
          const toaster = {isOpen:true, origin:'fromUpdate', isAutoClose:true, isSuccess: true, message:componentProp.quoteEditing.successUpdate}
          effects.setCustomState({ key: 'toaster', value: { ...toaster } });
          if (endUserDetails || resellerDetails)
            changeRefreshDetailApiState();
          return true;          
        } else {
          const toaster = {isOpen:true, origin:'fromUpdate', isAutoClose:true, isSuccess: false, message:componentProp.quoteEditing?.failedUpdate}
          effects.setCustomState({ key: 'toaster', value: { ...toaster } });
        }
      }
    } catch (ex) {      
      const errorTitle = "Could not save changes.";
      let errorMessage = 'We are sorry, your update could not be processed, please try again later.';
      if(ex.status === 200 && ex?.data?.salesContentEmail) {
        errorMessage = componentProp.quoteEditing?.failedUpdate?.replace('{email}', ex.data.salesContentEmail)
      }
      const errorToaster = {isOpen:true, origin:'fromUpdate', isSuccess: false, title: errorTitle, message: errorMessage}
      effects.setCustomState({ key: 'toaster', value: { ...errorToaster } });
    }
    return false;
  }

  const updateRenewalDetails = async (details) => {
    const { POAllowedLength, ...payload} = mapRenewalForUpdateDetails(details);
    const updateResponse = await post(componentProp.updateRenewalOrderEndpoint, payload);  
    const updateError = updateResponse?.data?.error;
    if(updateError?.isError) throw updateResponse; 
    return true;
  }

  const isEditable = ({ canEditLines }) => canEditLines && !saving;
  return (
    <div className="cmp-quote-preview cmp-renewal-preview" ref={renewalsRef}>
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
          <div className="details-container">
            <span className="details-preview">{componentProp?.productLines?.lineItemDetailsLabel || "Details"}<span class="details-price-level">{renewalsDetails.renewalLevel}</span></span>
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
          />
        </section>
      ) : (
        isLoading && <Loader visible={isLoading} />
      )}
      {error && (
        <ErrorMessage
          error={error}
          messageObject={{
            message401: "You need to be logged in to view this",
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
        branding={useRenewalsDetailsStore(state => state.branding || '')}
        isDialogOpen={openCancelDialog}
        onClose={closeCancelDialog}
        labels={componentProp.quoteEditing}
      />
    </div>
  );
}

export default RenewalsDetails;


