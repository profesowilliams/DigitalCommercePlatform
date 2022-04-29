import React, { useState, useEffect } from "react";
import ConfigGrid from "./ConfigGrid/ConfigGrid";
import RenewalPreviewGrid from "./RenewalPreviewGrid/RenewalPreviewGrid";
import useGet from "../../hooks/useGet";
import Loader from "../Widgets/Loader";
import Modal from '../Modal/Modal';
import { getUrlParams } from "../../../../utils";
import { ACCESS_TYPES, hasAccess } from "../../../../utils/user-utils";
import { LOCAL_STORAGE_KEY_USER_DATA } from "../../../../utils/constants";

import { useStore } from "../../../../utils/useStore"
import { isExtraReloadDisabled } from "../../../../utils/featureFlagUtils";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

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

  const [renewalsDetails, setRenewalsDetails] = useState(null);

  componentProp.productLines.agGridLicenseKey = componentProp.agGridLicenseKey;

  const redirectToShop = () => {
    window.location = shopURL;
  };

  useEffect(() => {
    // In case of don't have access redirect to shop
    if(process.env.NODE_ENV === "development") return;
    !hasAccess({user: USER_DATA, accessType: ACCESS_TYPES.RENEWALS_ACCESS}) && redirectToShop()
  }, [USER_DATA, ACCESS_TYPES]);

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

  return (
    <div className="cmp-quote-preview cmp-renewal-preview">
      {renewalsDetails ? (
        <section>
          <ConfigGrid data={renewalsDetails} gridProps={componentProp} />
          <RenewalPreviewGrid
            data={renewalsDetails}
            gridProps={{...componentProp.productLines, excelFileUrl: componentProp?.exportXLSRenewalsEndpoint}}
            shopDomainPage={componentProp.shopDomainPage}
          />
        </section>
      ) : isLoading && (
        <Loader visible={isLoading} />
      )
      }
      {error &&       
        <ErrorMessage
          error={error}
          messageObject={{"message401" : "You need to be logged in to view this"}}
        /> 
      }
      {modal && <Modal
            modalAction={modal.action}
            modalContent={modal.content}
            modalProperties={modal.properties}
            modalAction={modal.modalAction}
            actionErrorMessage={modal.errorMessage}
            onModalClosed={modal.onModalClosed}
        ></Modal>}
    </div>
  );
}

export default RenewalsDetails;


