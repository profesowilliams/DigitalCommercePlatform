import React, {useState} from 'react';
const  WhitelabelExportConfiguration = ({ title, subtitle, items, information, base64LogoHandler, optionsHandeler }) => {
      /*const { id } = getUrlParams();
      const {response, loading, error} = useGet(`${uiServiceEndPoint}?id=${id}`);
      console.log("response ::", response, loading, error);*/
      const logoLabel = information ? information['yourLogoLabel'] : ''
      const defaultOptions = items ? Object.values(items) : []
      const wexcTitle = title ? title : ''
      const wexcSubitle = subtitle ? subtitle : ''
      const [selectedFile, setFile] = useState('')
      const [options, setOptions] = useState([])
      const onChangeLogoHandler = (event) => {
            console.log(event.target.files[0])
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setFile(reader.result);
                base64LogoHandler(reader.result)
            });
            reader.readAsDataURL(event.target.files[0]); 
      }
      const onChangeHandler = (option) => {
         let selectedOptions = []
         if(options.includes(option)) {
            selectedOptions = [...options];
            const index = selectedOptions.indexOf(option)
            if(index > -1){
                selectedOptions.splice(index, 1)
            }
        } else {
            selectedOptions = [
                ...options,
                option
            ]
        }
        setOptions(selectedOptions)
        optionsHandeler(selectedOptions)
      }
      const excClassName = 'cmp-whiltelabelexportconfig'
    return (
        <div className={excClassName}>
            <label className={`${excClassName}__title`}>{wexcTitle}</label>
            {wexcTitle.length > 0 && <hr/>}
            <h4 className={`${excClassName}__subtitle`}>{wexcSubitle}</h4>
            <div className={`${excClassName}__base`}>
                <div className={`${excClassName}__base-quote`}>        
                    <ul>
                        {defaultOptions.map(option=>(
                            <li><label><input type='checkbox'  onChange={()=>onChangeHandler(option)}/>{option}</label></li>
                        ))}
                    </ul>
                </div>
                <div className={`${excClassName}__base-logo`}>
                    <div className={`${excClassName}__base-logo-upload`}>
                        {logoLabel.length > 0 && (<><img src={selectedFile} alt="logo" /><div className={`${excClassName}__base-logo-upload-file`}>
                            <input type="file" id="file" className={`${excClassName}__base-logo-upload-file-input`} accept="image/png" onChange={onChangeLogoHandler} />
                            <label for="file">{logoLabel}</label>
                        </div><div className={`${excClassName}__base-logo-upload-suggested`}>
                                {`Suggested:
                            500px x350px`}
                            </div></>)}
                    </div>  
                </div>
            </div>
        </div>
    )
}
export default WhitelabelExportConfiguration;