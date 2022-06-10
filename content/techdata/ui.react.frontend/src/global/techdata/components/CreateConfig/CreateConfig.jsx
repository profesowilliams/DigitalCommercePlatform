import React, { useEffect, useState } from 'react';
import WidgetTitle from '../Widgets/WidgetTitle';
import Dropdown from '../Widgets/Dropdown';
import RadioButtons from '../Widgets/RadioButtons';
import { usPost } from "../../../../utils/api";
import { ANALYTICS_TYPES, pushData } from "../../../../utils/dataLayerUtils";
import { isExtraReloadDisabled } from "../../../../utils/featureFlagUtils";
import {useStore} from "../../../../utils/useStore"
import { isNotEmptyValue } from '../../../../utils/utils';
import { QUOTE_PREVIEW_BROADCAST_CHANNEL_ID } from '../../../../utils/constants';

const CreateConfig = ({ componentProp }) => {
  const { label, buttonTitle, optionsList, dropdownLabel, punchOutUrl, placeholderText, nodePath }  = JSON.parse(componentProp);
  const [methodSelected, setMethodSelected] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const isLoggedIn = useStore(state => state.isLoggedIn)
  const POST_BACK_URL = "https://shop.techdata.com";
  const [quoteIDAnalityc, setquoteIDAnalityc] = useState(null);

  /**
   * Function that validate and push the information of analytics
   * @param {string} vendorName 
   * @param {boolean} complete 
   * @param {string} id 
   */
  const analyticsData = (vendorName, complete, id = '') => {
      const localStorageVendorName = localStorage.getItem('vendorName');
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

      if (complete) {
        analyticsObj.configuration.configComplete = '1';
        analyticsObj.configuration.vendorName = localStorageVendorName || vendorName;
        localStorage.removeItem('vendorName');
      } else {
        localStorage.setItem('vendorName', vendorName);
        localStorage.setItem('createConfig', 'true');
      }
      pushData(analyticsObj);
  }

  const channel = new BroadcastChannel(QUOTE_PREVIEW_BROADCAST_CHANNEL_ID);
  useEffect(() =>{
    channel.addEventListener('message', event => {
      if (isNotEmptyValue( event.data) && !isNotEmptyValue(quoteIDAnalityc)) {
        setquoteIDAnalityc(event.data);
      }
    });
  }, [channel, quoteIDAnalityc]);

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
      if((isExtraReloadDisabled() && isLoggedIn) || !isExtraReloadDisabled()){
        if (result?.data?.content?.url) {
          analyticsData(methodSelected.label, false);
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
    if (localStorage.getItem('createConfig') == 'true' && document.referrer.indexOf('apps.cisco.com') > -1 && window.location.search.indexOf('RequestType') > -1) {
        analyticsData(methodSelected.label, true, quoteIDAnalityc);
        localStorage.removeItem('createConfig');
    }
  }, [methodSelected, quoteIDAnalityc]);

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
