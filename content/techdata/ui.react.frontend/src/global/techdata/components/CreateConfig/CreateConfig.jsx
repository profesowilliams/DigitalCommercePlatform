import React, { useEffect, useState } from 'react';
import WidgetTitle from '../Widgets/WidgetTitle';
import Dropdown from '../Widgets/Dropdown';
import RadioButtons from '../Widgets/RadioButtons';
import { usPost } from "../../../../utils/api";
import { pushData } from "../../../../utils/dataLayerUtils";

const CreateConfig = ({ componentProp }) => {
  const { label, buttonTitle, optionsList, dropdownLabel, punchOutUrl, placeholderText }  = JSON.parse(componentProp);
  const [methodSelected, setMethodSelected] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const POST_BACK_URL = "https://shop.techdata.com";

  const analyticsData = (vendorName, complete) => {
      let analyticsObj = {
           event: "configStart",
           configuration: {
               configID: '',
               vendorName: vendorName,
               configType: 'Estimate'
           }
      }

      if (complete) {
        analyticsObj.configuration.configComplete = '1';
        analyticsObj.configuration.vendorName = localStorage.getItem('vendorName') || vendorName;
        localStorage.removeItem('vendorName');
      } else {
        localStorage.setItem('vendorName', vendorName);
        localStorage.setItem('createConfig', 'true');
      }
      pushData(analyticsObj);
  }

  const createConfig = async (e) => {
    e.preventDefault();
    setLoading(true);
    var currentUrl = window.location.href.replace('.html', '.post2get.html');
    const params = {
      "PostBackURL": (currentUrl || POST_BACK_URL) + "/",
      "Vendor": methodSelected.label,
      "ConfigurationId": "",
      "Function": "CCW_ESTIMATE",
      "Action": "CREATE"
    };

    try {
      const result = await usPost(punchOutUrl, params);
      if (result?.data?.content?.url) {
        analyticsData(methodSelected.label, false);
        window.open(result.data.content.url);
      }
      return result.data;
    } catch( error ) {
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
        analyticsData(methodSelected.label, true);
        localStorage.removeItem('createConfig');
    }
  }, [])

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
