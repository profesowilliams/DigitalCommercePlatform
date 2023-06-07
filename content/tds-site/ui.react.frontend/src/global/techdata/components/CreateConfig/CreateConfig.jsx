import React, { useEffect, useState } from 'react';
import WidgetTitle from '../Widgets/WidgetTitle';
import Dropdown from '../Widgets/Dropdown';
import RadioButtons from '../Widgets/RadioButtons';
import { usPost } from "../../../../utils/api";
import { ANALYTICS_TYPES, getDataLayer, pushData, deleteAndPushData } from "../../../../utils/dataLayerUtils";
import { isExtraReloadDisabled } from "../../../../utils/featureFlagUtils";
import {useStore} from "../../../../utils/useStore"
import { isNotEmptyValue } from '../../../../utils/utils';
import { QUOTE_PREVIEW_BROADCAST_CHANNEL_ID } from '../../../../utils/constants';
import useAuth from '../../hooks/useAuth';

const CreateConfig = ({ componentProp }) => {
  const { label, buttonTitle, optionsList, dropdownLabel, punchOutUrl, placeholderText, nodePath }  = JSON.parse(componentProp);
  const [methodSelected, setMethodSelected] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { isUserLoggedIn: isLoggedIn } = useAuth();
  const POST_BACK_URL = "https://shop.techdata.com";
  const [quoteIDAnalytic, setQuoteIDAnalytic] = useState(null);
  const [flagUpdate, setFlagUpdate] = useState(false);

  const updateDataLayer = (id, localStorageVendorName) => {
    /**@type {any[]} */
    const dataLayer = getDataLayer();
    dataLayer.forEach(layerElement => {
      if (layerElement?.configuration?.configID === '') {
        layerElement.configuration.configID = id;
        layerElement.configuration.configComplete = '1';
        layerElement.configuration.vendorName = localStorageVendorName || vendorName;
        localStorage.removeItem('vendorName');
        deleteAndPushData(layerElement)
      }
    });
  };

  /**
   * Function that validate and push the information of analytics
   * @param {string} vendorName 
   * @param {boolean} complete 
   * @param {string} id 
   */
  const analyticsData = (vendorName, complete, id = '') => {
      const localStorageVendorName = localStorage.getItem('vendorName');
      const flagComplete = id !== '';
      const vendorNameConst =  isNotEmptyValue(vendorName) ? vendorName :
          isNotEmptyValue(localStorageVendorName) 
          ? localStorageVendorName : '';
      let analyticsObj = {
           event: ANALYTICS_TYPES.events.configStart,
           configuration: {
               configID: id,
               vendorName: vendorNameConst,
               configType: 'Estimate'
           }
      }      
      flagComplete && updateDataLayer(id, localStorageVendorName);
      
      if (!flagComplete) {
        localStorage.setItem('vendorName', vendorName);
        localStorage.setItem('createConfig', 'true');
        pushData(analyticsObj);
      }
  }

  const channel = new BroadcastChannel(QUOTE_PREVIEW_BROADCAST_CHANNEL_ID);
  useEffect(() =>{
    channel.addEventListener('message', event => {
      if (isNotEmptyValue( event.data) && !isNotEmptyValue(quoteIDAnalytic) && event.data !== quoteIDAnalytic) {
        setQuoteIDAnalytic(event.data);
      }
    });
  }, [channel, quoteIDAnalytic]);

  const createConfig = async (e) => {
    e.preventDefault();
    setLoading(true);
    var currentUrl = `${window.location.origin}${nodePath}.post2get.html`;
    const params = {
      "PostBackURL": (currentUrl || POST_BACK_URL) + "/",
      "Vendor": methodSelected.label,
      "ConfigurationId": "",
      "Function": "CCW_ESTIMATE",
      "Action": "CREATE"
    };

    try {
      const result = await usPost(punchOutUrl, params);
      if(isLoggedIn){
        if (result?.data?.content?.url) {
          analyticsData(methodSelected.label, false);
          setFlagUpdate(true);
          window.open(result.data.content.url);
        }
      }
      return result.data;
    } catch( error ) {
      setError(true)
      return error;
    } finally {
      resetStates();
    }
  }

  const resetStates = () => {
    setLoading(false);
    setMethodSelected(false);
    setRedirectUrl(false);
  };

  const getOptions = () => {
    if( !methodSelected.urls || methodSelected.urls.length === 0 || methodSelected.extendedOption === false ){
      return null;
    }

    let types = methodSelected.urls.map((item,i) => {
      const {label:name,url} = item;
      const id = Symbol(`${i}-${name}`).toString();
      return { id, key: id , name, url };
    })

    return <>
      <RadioButtons 
        selected={redirectUrl} 
        options={types} 
        onSelect={(val) => setRedirectUrl(val)} />
    </> 
  }

  const changeMethod = (val) => {
    setMethodSelected(val);
    setRedirectUrl(false);
  }

  useEffect(() => {
    if (isNotEmptyValue(quoteIDAnalytic) && flagUpdate) {
        setFlagUpdate(false);
        analyticsData(methodSelected.label, true, quoteIDAnalytic);
        localStorage.removeItem('createConfig');
    }
  }, [methodSelected, quoteIDAnalytic, flagUpdate]);

  useEffect(()=>{
    if( methodSelected && (!methodSelected.urls || methodSelected.urls.length === 0 || methodSelected.extendedOption === false ))
      setRedirectUrl({url: methodSelected.url});
  },[methodSelected])

  return (
    <div className="cmp-widget">
      <WidgetTitle>{ label }</WidgetTitle>
      <Dropdown 
        selected={methodSelected} 
        setValue={(v)=>{changeMethod(v)}} 
        options={optionsList}
        label={dropdownLabel}
        placeholderText={placeholderText}/>
      { methodSelected ? getOptions() : null }
      <button disabled={!redirectUrl || loading} className="cmp-quote-button" onClick={createConfig}>
        { redirectUrl ? (loading ? 'creating config...' : 'Next') : buttonTitle }
      </button>
    </div>
  )
}

export default CreateConfig;
