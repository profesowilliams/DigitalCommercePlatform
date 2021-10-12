import React, {useState} from 'react';
const  WhitelabelExportConfiguration = ({ titleLabel, subtitleLabel, checkboxItems, information, base64LogoHandler, optionsHandeler, logoUploadHandler }) => {
      const logoLabel = information['yourWhiteLogoLabel'] ? information['yourWhiteLogoLabel'] : '';
      const optionItems = checkboxItems ? Object.values(checkboxItems) : []
      const wexcTitle = titleLabel ? titleLabel : ''
      const wexcSubitle = subtitleLabel ? subtitleLabel : ''
      const [selectedFile, setFile] = useState('')
      let filterOptions = [...optionItems]
      const index = filterOptions.indexOf("Part number- Tech data");
      filterOptions.splice(index,1)
      const [options, setOptions] = useState([...filterOptions])
      const onChangeLogoHandler = (event) => {

            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setFile(reader.result);
                logoUploadHandler(reader.result);
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
                        {optionItems.map((option, index)=>(
                            <li key={`${index}`}><label><input defaultChecked={filterOptions.includes(option)} type='checkbox'  onChange={()=>onChangeHandler(option)}/>{option}</label></li>
                        ))}
                    </ul>
                </div>
                <div className={`${excClassName}__base-logo`}>
                    <div className={`${excClassName}__base-logo-upload`}>
                        {logoLabel.length > 0 && (<><img src={selectedFile} alt="logo" /><div className={`${excClassName}__base-logo-upload-file`}>
                            <input type="file" id="file" className={`${excClassName}__base-logo-upload-file-input`} accept="image/png,image/jpeg,image/jpg" onChange={(event) => onChangeLogoHandler(event)} />
                            <label htmlFor="file">{logoLabel}</label>
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