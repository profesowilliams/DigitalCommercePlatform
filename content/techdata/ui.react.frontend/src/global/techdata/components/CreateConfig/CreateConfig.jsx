import React, { useEffect, useState } from 'react';
import WidgetTitle from '../Widgets/WidgetTitle';
import Dropdown from '../Widgets/Dropdown';
import RadioButtons from '../Widgets/RadioButtons';
import { usPost } from "../../../../utils/api";

const CreateConfig = ({ componentProp }) => {
  const { label, buttonTitle, optionsList, dropdownLabel, punchOutUrl, placeholderText }  = JSON.parse(componentProp);
  const [methodSelected, setMethodSelected] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(false);s
  const [loading, setLoading] = useState(false);
  const POST_BACK_URL = "https://shop.techdata.com";

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
      if (result?.data?.content?.url)
        window.open(result.data.content.url);
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
