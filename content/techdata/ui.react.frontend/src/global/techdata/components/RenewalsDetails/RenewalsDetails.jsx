import React, { useState, useEffect, useRef } from "react";
import ConfigGrid from "./ConfigGrid/ConfigGrid";
import RenewalPreviewGrid from "./RenewalPreviewGrid/RenewalPreviewGrid";
import useGet from "../../hooks/useGet";
import Loader from "../Widgets/Loader";
import Modal from '../Modal/Modal';
import { getUrlParams } from "../../../../utils";
import { ACCESS_TYPES, hasAccess } from "../../../../utils/user-utils";
import { LOCAL_STORAGE_KEY_USER_DATA } from "../../../../utils/constants";
import { useStore } from "../../../../utils/useStore"
import { isAuthormodeAEM, isExtraReloadDisabled } from "../../../../utils/featureFlagUtils";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { If } from "../../helpers/If";
import Edit from "./Edit";
import CancelAndSave from "./CancelAndSave";
import Saving from "./Saving";
import CancelDialog from "./Cancel/CancelDialog";
import { get, post } from '../../../../utils/api';
import Toaster from '../Widgets/Toaster';

function RenewalsDetails(props) {
  const componentProp = JSON.parse(props.componentProp);
  const errorMessages = componentProp?.errorMessages;
  const { id = "U100000008378", type = "renewal" } = getUrlParams();
  const [modal, setModal] = useState(null);
  const [apiResponse, isLoading, error] = useGet(
    `${componentProp.uiServiceEndPoint}?id=${id}&type=${type}`
  );
  const USER_DATA = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA));
  const shopURL = componentProp.shopURL;
  const isLoggedIn = useStore(state => state.isLoggedIn)
  const [toggleOpen, setToggleOrder] = useState(false);

  const [renewalsDetails, setRenewalsDetails] = useState(null);

  componentProp.productLines.agGridLicenseKey = componentProp.agGridLicenseKey;

  const [toggleEdit, setToggleEdit] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isToasterOpen, setIsToasterOpen] = useState(false);

  // Keep grid reference to cancel edit changes
  const gridRef = useRef();

  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const redirectToShop = () => {
    window.location = shopURL;
  };

  useEffect(() => {
    // Remove Dashboard separator(s) from only Renewal Details page
    var separatorList = document.querySelector(".renewalsdetails")?.parentNode?.parentNode?.parentNode?.parentNode?.getElementsByClassName('separator dp-separator--hidden');
    separatorList && Object.prototype.toString.call(separatorList) === '[object HTMLCollection]' && separatorList.length && [...separatorList].forEach(div => div.style.display = "none");
    // In case of don't have access redirect to shop
    if(process.env.NODE_ENV === "development") return;
    if(isAuthormodeAEM()) return; // Validation for Author ENV
    !hasAccess({user: USER_DATA, accessType: ACCESS_TYPES.RENEWALS_ACCESS}) && redirectToShop()
  }, [
    USER_DATA,
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

  const handleIconEditClick = () => {
    setToggleEdit(false);
  };

  const handleIconCancelClick = () => {
    setOpenCancelDialog(true);
  };

  // Close Cancel Dialog logic, reset data if necessary
  const closeCancelDialog = (resetFlag) => {
    // Close dialog
    setOpenCancelDialog(false);

    if (resetFlag) {
      // Call cancel edit on grid to clean internal values
      gridRef.current.cancelEdit();
      // Toggle Edit mode
      setToggleEdit(true);
    }
  }
  
  const closeToaster = () => {
    setIsToasterOpen(false);
  }

  const handleIconSaveClick = () => {
    setSaving(true);
    updateDetails()
      .then(() => {
        const frequency = 2000;
        let n = 5,
        timer = setInterval(function() {
          getTransactionStatus()
          .then((isStatusActive) => {
            if(isStatusActive) {
              setIsToasterOpen(true);
              clearInterval(timer);
            } 
            if(n <= 1 && !isStatusActive) {     
              console.log(`getStatus timer completed. It ran 5 times, once every ${frequency/1000} seconds and still the status is not Active`); 
              clearInterval(timer);            
            }   
            setToggleEdit(true);
          })
          .catch((getStatusError) => {
            clearInterval(timer);  
            console.log('An unexpected error occurred getting transaction status: ', getStatusError);    
          })
          .finally(() => {
            setSaving(false);
          });
          n--;
        }, frequency);
      })
      .catch((updateDetailsError) => {   
        console.log('An unexpected error occurred updating details: ', updateDetailsError);  
        setSaving(false);        
        setToggleEdit(true);
      })
  };

  const updateDetails = async () => {
    const source = {id: renewalsDetails?.source?.id};
    const customerPO = renewalsDetails.customerPO;
    const reseller = {
      contact: {
        name: renewalsDetails?.reseller?.contact[0]?.name?.text,
        email: renewalsDetails?.reseller?.contact[0]?.email?.text,
        phone: renewalsDetails?.reseller?.contact[0]?.phone?.text
      },
      address: {
        line1: renewalsDetails?.reseller?.address?.line1?.text,
        line2: renewalsDetails?.reseller?.address?.line2?.text,
        line3: renewalsDetails?.reseller?.address?.line3?.text,
        city: renewalsDetails?.reseller?.address?.city?.text,
        state: renewalsDetails?.reseller?.address?.state?.text,
        postalCode: renewalsDetails?.reseller?.address?.postalCode?.text,
        country: renewalsDetails?.reseller?.address?.country?.text,
        county: renewalsDetails?.reseller?.address?.county?.text,
        countryCode: renewalsDetails?.reseller?.address?.countryCode?.text
      }
    };
    const endUser = {
      name: renewalsDetails?.endUser?.name.text,
      contact: {
        name: renewalsDetails?.endUser?.contact[0]?.name?.text,
        email: renewalsDetails?.endUser?.contact[0]?.email?.text,
        phone: renewalsDetails?.endUser?.contact[0]?.phone?.text
      },
      address: {
        line1: renewalsDetails?.endUser?.address?.line1?.text,
        line2: renewalsDetails?.endUser?.address?.line2?.text,
        line3: renewalsDetails?.endUser?.address?.line3?.text,
        city: renewalsDetails?.endUser?.address?.city?.text,
        state: renewalsDetails?.endUser?.address?.state?.text,
        postalCode: renewalsDetails?.endUser?.address?.postalCode?.text,
        country: renewalsDetails?.endUser?.address?.country?.text,
        county: renewalsDetails?.endUser?.address?.county?.text,
        countryCode: renewalsDetails?.endUser?.address?.countryCode?.text
      }
    };    
    const items = renewalsDetails?.items.map((item) => {
      return {
        id: item.id,
        product: {
          type: item?.product[0]?.type,
          id: item?.product[0].id
        },
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }
    });

    const payload = { source, customerPO, reseller, endUser, items };    
    const updateresponse = await post(componentProp.updateRenewalOrderEndpoint, payload);           
    const updateError = updateresponse?.data?.error;

    if(updateError?.isError) throw new Error(`error: ${updateError?.code} ${updateError?.messages[0] || ''}`); 

    return updateresponse;
  }

  const getTransactionStatus = async () => {
    const getStatusResponse = await get(`${componentProp.getStatusEndpoint}?id=${renewalsDetails.source.id}`);             
    const statusError = getStatusResponse?.data?.error;
    if(statusError?.isError) throw new Error(`error: ${statusError?.code} ${statusError?.messages[0] || ''}`);    
    return getStatusResponse.data?.content?.status === 'Active';
  }

  const EditFlow = () => {
    return (
      <If
        condition={toggleEdit}
        Then={<Edit handler={handleIconEditClick} />}
        Else={
          <CancelAndSave
            cancelHandler={handleIconCancelClick}
            saveHandler={handleIconSaveClick}
          />
        }
      />
    )
  };

  const isEditable = ({ canEditLines }) => canEditLines && !saving;
  return (
    <div className="cmp-quote-preview cmp-renewal-preview">
      {renewalsDetails ? (
        <section>
          <ConfigGrid
            data={renewalsDetails}
            gridProps={{
              ...componentProp,
              excelFileUrl: componentProp?.exportXLSRenewalsEndpoint,
            }}
          />
          <div className="details-container">
            <span className="details-preview">Details</span>
            {isEditable(renewalsDetails) && <EditFlow />}
            {saving && <Saving />}
          </div>
          <RenewalPreviewGrid
            ref={gridRef}
            data={renewalsDetails}
            compProps={componentProp}
            gridProps={{
              ...componentProp.productLines,
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
      <Toaster
        autoClose={true}
        isToasterOpen={isToasterOpen}
        onClose={closeToaster}
        isSuccess={true}
        message={{successSubmission: componentProp?.quoteEditing?.successUpdate}}
      ></Toaster>      
      <CancelDialog
        isDialogOpen={openCancelDialog}
        onClose={closeCancelDialog}
        labels={componentProp.quoteEditing}
      />
    </div>
  );
}

export default RenewalsDetails;


