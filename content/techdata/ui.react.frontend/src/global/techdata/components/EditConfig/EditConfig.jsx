import React, { useEffect, useState, useCallback } from "react";
import { checkApiErrorMessage, get, usPost } from "../../../../utils/api";
import WidgetTitle from "../Widgets/WidgetTitle";
import InputText from "../Widgets/TextInput";
import Button from "../Widgets/Button";
import Loader from '../Widgets/Loader';
import { waitFor } from "../../../../utils/utils";
import axios from 'axios';

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
        setLoadingGetUrl(false);
        const {url} = result?.data?.content;
        window.open(
                url,
            '_blank' 
            );
        return result.data;         
    }
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
