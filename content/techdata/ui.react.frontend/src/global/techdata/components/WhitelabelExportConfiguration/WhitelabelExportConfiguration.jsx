import React, {useState} from 'react';
const defaultLabel = "logo.png"
const imageURI =  "https://cdn.pixabay.com/photo/2017/09/14/11/07/water-2748640_1280.png"
const defaultOptions = [
    { fieldset:"1", label:"Your logo", isChecked:true },
    { fieldset:"2", label:"Product images", isChecked:true},
    { fieldset:"3", label:"Part number- manufacturer", isChecked:false},
    { fieldset:"4", label:"Part number- Tech data", isChecked:true},
    { fieldset:"5", label:"UPC number", isChecked:true},
    { fieldset:"6", label:"MSRP", isChecked:true}
];

const  WhitelabelExportConfiguration = ({ componentProp, logoLabel = defaultLabel, logoDefaultImage = imageURI , dOptions = defaultOptions }) => {
    const { 
        title, 
        subtitle,
      } = JSON.parse(componentProp);
      const [selectedFile, setFile] = useState(logoDefaultImage)
      const [options, setOptions] = useState(dOptions)
      const onChangeLogoHandler = (event) => {
            console.log(event.target.files[0])
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setFile(reader.result);
            });
            reader.readAsDataURL(event.target.files[0]); 
      }

      const onChangeHandler = (option) => {
        const selectedOption = {
            ...option,
            isChecked:!option.isChecked
        }
        let fillterObjects = options.filter(item => item.fieldset !== option.fieldset)
        setOptions([...fillterObjects, selectedOption])
      }
      const excClassName = 'cmp-whiltelabelexportconfig'

    return (
        <div className={excClassName}>
            <label className={`${excClassName}__title`}>{title}</label>
            <hr/>
            <h4 className={`${excClassName}__subtitle`}>{subtitle}</h4>
            <div className={`${excClassName}__base`}>
                <div className={`${excClassName}__base-quote`}>        
                    <ul>
                        {dOptions.map(option=>(
                            <li><label><input type='checkbox' defaultChecked={option.isChecked} onChange={()=>onChangeHandler(option)}/>{option.label}</label></li>
                        ))}
                    </ul>
                </div>
                <div className={`${excClassName}__base-logo`}>
                    <div className={`${excClassName}__base-logo-upload`}>
                        <img src={selectedFile} alt="logo"/>
                        <div className={`${excClassName}__base-logo-upload-file`}>
                            <input type="file" id="file"  className={`${excClassName}__base-logo-upload-file-input`} accept="image/png" onChange={onChangeLogoHandler}/>
                            <label for="file">{logoLabel}</label>
                        </div>
                        <div className={`${excClassName}__base-logo-upload-suggested`}>
                            {`Suggested:
                            500px x350px`}
                        </div>
                    </div>  
                </div>
            </div>
        </div>
    )
}

export default WhitelabelExportConfiguration;

