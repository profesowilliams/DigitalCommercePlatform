import React, { useEffect, useState, useCallback } from "react";
import { checkApiErrorMessage, get, usPost } from "../../../../utils/api";
import WidgetTitle from "../Widgets/WidgetTitle";
import InputText from "../Widgets/TextInput";
import Button from "../Widgets/Button";
import Loader from '../Widgets/Loader';
import { waitFor } from "../../../../utils/utils";
import axios from 'axios';
import { ANALYTICS_TYPES, pushData } from "../../../../utils/dataLayerUtils";

const EditConfig = ({ componentProp }) => {
    // useEffect(() => {
    //     const params = { criteria, ignoreSalesOrganization, isDefault };
    //     const getData = async () => {
    //         const {
    //             data: {
    //                 content: { items },
    //             },
    //         } = await get(endpoint, params);
    //         if (items) setConfigurations(items);
    //     };
    //     getData();
    // }, []);
    const [configurationId, setConfigurationId] = useState("");
    const [configurations, setConfigurations] = useState(false);
    const [isLoadingGetUrl, setLoadingGetUrl] = useState(false);
    const {
        label,
        buttonTitle,
        endpoint,
        criteria,
        ignoreSalesOrganization,
        isDefault,
        placeholderText,
        puchOutEndpoint
    } = JSON.parse(componentProp);

    const handleConfigInput = ({ target: { value } }) => {
        setConfigurationId(value);
    };

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
        waitFor(3000);
        const result = await usPost(puchOutEndpoint,body)
        const errorMessagesList = checkApiErrorMessage(result);
        if (errorMessagesList){
            window.alert(errorMessagesList[0])
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
        </div>
    );
};

export default EditConfig;
