import React, { useState, useEffect } from "react";
import ConfigGrid from "./ConfigGrid/ConfigGrid";
import RenewalPreviewGrid from "./RenewalPreviewGrid/RenewalPreviewGrid";
import useGet from "../../hooks/useGet";
import Loader from "../Widgets/Loader";
import Modal from '../Modal/Modal';
import { getUrlParams } from "../../../../utils";

function RenewalsDetails(props) {
  const componentProp = JSON.parse(props.componentProp);
  const errorMessages = componentProp?.errorMessages;
  const { id = "U100000008378", type = "renewal" } = getUrlParams();
  const [modal, setModal] = useState(null);
  const [apiResponse, isLoading] = useGet(
    `${componentProp.uiServiceEndPoint}?id=${id}&type=${type}`
  );

  const [renewalsDetails, setRenewalsDetails] = useState(null);

  componentProp.productLines.agGridLicenseKey = componentProp.agGridLicenseKey;


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
    if (apiResponse?.content?.details) {
      setRenewalsDetails(apiResponse?.content?.details[0]);
    } else if(apiResponse?.error?.isError) {// 200 Ok isError=true
        showErrorModal(errorMessages?.errorLoadingPageTitle, getErrorMessage(apiResponse.error?.code),
          () => window.location.href = errorMessages?.errorLoadingPageRedirect);
      }
  }, [apiResponse]);

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
      ) : (
        <Loader visible={isLoading} />
      )}
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


