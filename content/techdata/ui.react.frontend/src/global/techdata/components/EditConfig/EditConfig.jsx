import React, { useEffect, useState, useCallback } from "react";
import { usPost } from "../../../../utils/api";
import WidgetTitle from "../Widgets/WidgetTitle";
import InputText from "../Widgets/TextInput";
import Button from "../Widgets/Button";
import Loader from '../Widgets/Loader';
import { isNotEmptyValue, waitFor } from "../../../../utils/utils";
import { ANALYTICS_TYPES, pushData } from "../../../../utils/dataLayerUtils";
import Modal from "../Modal/Modal";
import { ERROR_TITLE_DEFAULT } from "../../../../utils/constants";

const EditConfig = ({ componentProp }) => {
    const [configurationId, setConfigurationId] = useState("");
    const [isLoadingGetUrl, setLoadingGetUrl] = useState(false);
    const [modal, setModal] = useState(null);
    const {
        label,
        buttonTitle,
        endpoint,
        criteria,
        ignoreSalesOrganization,
        isDefault,
        placeholderText,
        puchOutEndpoint,
        errorTitle,
        error404Message,
        error428Message,
        errorGenericMessage,
    } = JSON.parse(componentProp);
    /**
     * 
     * @param {string} title 
     * @param {*} content 
     * @param {*} onModalClosed 
     * @param {string} buttonLabel 
     * @param {() => void } modalAction 
     * @returns 
     */
    const showSimpleModal = (title, content, onModalClosed=closeModal) =>
        setModal((previousInfo) => ({
            content: content,
            properties: {
                title:  title,
            },
            ...previousInfo,
            onModalClosed,
        })
    );

    const closeModal = () => setModal(null);
  
    /**
     * Function that execute and set the message for the error modal
     * @param {string} message 
     */
    const modalEventError = (message) =>{
        showSimpleModal(isNotEmptyValue(errorTitle) ? errorTitle :  ERROR_TITLE_DEFAULT, (<div className="cmp-quote-error-modal">{message}</div>));
    };

    const handleConfigInput = ({ target: { value } }) => {
        setConfigurationId(value);
    };

    
    const getErrorMessage = (errorCode) => {
        if(errorCode === 404) {
          return error404Message;
        } else if(errorCode === 428) {
          return error428Message;
        }
        return errorGenericMessage;
      }
    

    const analyticsData = (vendorName, configID, complete) => {
      let analyticsObj = {
           event: ANALYTICS_TYPES.events.editConfigStart,
           configuration: {
               configID: configID,
               vendorName: vendorName,
               configType: 'Estimate'
           }
      }

      if (complete) {
        analyticsObj.configuration.editConfigComplete  = '1';
        analyticsObj.configuration.configID = localStorage.getItem('configID') || configID;
        localStorage.removeItem('configID');
      } else {
        localStorage.setItem('configID', configID);
        localStorage.setItem('editConfig', 'true');
      }
      pushData(analyticsObj);
    }

    const getRedirectUrl = async (e) => {
        var currentUrl = window.location.href.replace('.html', '.post2get.html');
        const body = { 
            "PostBackURL": currentUrl + "/",
            "Vendor": "Cisco",
            "ConfigurationId": configurationId,  
            "Function": "CCW_ESTIMATE",  
            "Action": "edit" 
        }
        setLoadingGetUrl(true);
        const result = await usPost(puchOutEndpoint,body)
        const errorObject = result.data?.error;
        
        if (errorObject) {
            modalEventError(getErrorMessage(errorObject?.code));
            setLoadingGetUrl(false);
            return;
        }
        analyticsData("Cisco", configurationId, false);
        setLoadingGetUrl(false);
        const {url} = result?.data?.content;
        window.open(
                url,
            '_blank' 
            );
        return result.data;         
    }

    useEffect(() => {
        if (localStorage.getItem('editConfig') == 'true' && document.referrer.indexOf('apps.cisco.com') > -1 && window.location.search.indexOf('RequestType') > -1) {
            analyticsData("Cisco", configurationId, true);
            localStorage.removeItem('editConfig');
        }
    }, [])

    const handleGetUrl = useCallback(getRedirectUrl, [configurationId, isLoadingGetUrl]);
    return (
        <div className='cmp-widget'>
            <Loader visible={isLoadingGetUrl} />
            <WidgetTitle>{label}</WidgetTitle>
            <>
                <InputText
                    onChange={handleConfigInput}
                    inputValue={configurationId}
                    label={placeholderText}
                />
                <Button btnClass="cmp-quote-button" disabled={!configurationId} onClick={handleGetUrl}>
                    {buttonTitle}
                </Button>
            </>
            {modal && <Modal
                modalContent={modal.content}
                modalProperties={modal.properties}
                actionErrorMessage={modal.errorMessage}
                onModalClosed={modal.onModalClosed}
            ></Modal>}
        </div>
    );
};

export default EditConfig;
