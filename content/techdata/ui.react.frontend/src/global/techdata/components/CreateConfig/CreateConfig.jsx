import React, { useState } from 'react';
import WidgetTitle from '../Widgets/WidgetTitle';
import Dropdown from '../Widgets/Dropdown';
import RadioButtons from '../Widgets/RadioButtons';

const CreateConfig = ({ componentProp }) => {
  const { label, buttonTitle, optionsList, dropdownLabel }  = JSON.parse(componentProp);
  const [methodSelected, setMethodSelected] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(false);
  const createConfig = () => {
    window.location.href = redirectUrl.url;
  }
  const getOptions = () =>{
    if( !methodSelected.urls.length > 0 ) return null;
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
  return (
    <div className="cmp-widget">
      <WidgetTitle>{ label }</WidgetTitle>
      <Dropdown 
        selected={methodSelected} 
        setValue={(v)=>{changeMethod(v)}} 
        options={optionsList}
        label={dropdownLabel} />
      { methodSelected ? getOptions() : null }
      <button disabled={!redirectUrl} className="cmp-quote-button" onClick={createConfig}>
        { redirectUrl ? "Next" : buttonTitle }
      </button>
    </div>
  )
}

export default CreateConfig;