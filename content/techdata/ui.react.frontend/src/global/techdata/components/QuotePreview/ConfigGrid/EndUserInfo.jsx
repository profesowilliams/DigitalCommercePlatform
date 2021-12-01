import React, { useState } from 'react';
import Info from '../../common/quotes/DisplayItemInfo';
import Button from '../../Widgets/Button';


function EndUserInfo({endUser, info, onValueChange, handleQuickQuote}) {
    endUser = endUser && endUser[0];
    const initialState = {
        companyName: endUser?.companyName || '',
        name: endUser?.name || '',
        line1: endUser?.line1 || '',
        line2: endUser?.line2 || '',
        city: endUser?.city || '',
        state: endUser?.state || '',
        zip: endUser?.postalCode || '',
        country: endUser?.country || '',
        email: endUser?.email || '',
        phone: endUser?.phoneNumber || ''
    };
    const [editMode, setEditMode] = useState(false);
    const [infoState, setInfoState] = useState(initialState);
    
    const handleModelChange = (e) => setInfoState({
        ...infoState,
        [e.target.name]: e.target.value,
    });

    const handleEditModeChange = () => {
        setEditMode(prevEditMode => !prevEditMode);
    };

    const closeEditMode = () => {
        setEditMode(false);
    };

    const handleSaveChanges = () => {
        closeEditMode();
        onValueChange(infoState);
    };

    const handleCancelChanges = () => {
        setInfoState(initialState);
        closeEditMode();
    };

    const requiredValues = infoState
    // Removing line2 from this validation since is an optional Value.
    if(infoState.line2 === ''){
        delete infoState.line2
    } else {
        null
    }
   
    const values = Object.values(requiredValues).some(value => value === null || value === '')

    const handleRequiredElements = () => {
        if (values){
            return (
                <>
                    <span className='errorInput__label'>Please complete the missing fields</span> 
                </>)
        } else {
            null
        }
    }

    return (
        <div className="cmp-qp__enduser-info">
            <p onClick={handleEditModeChange} className="cmp-qp__enduser-info--title">{info.endUserHeaderLabel}</p>
                {!editMode && (
                    <>
                        <p label={info.companyLabel} className="cmp-qp__enduser-info--sub-title">{infoState.companyName}</p>
                        <div className="cmp-qp__enduser-info--address-group">
                            <Info label={info.nameLabel}>{infoState.name}</Info>
                            <Info label={`${info.addressLabel} 1`}>{infoState.line1}</Info>
                            <Info label={`${info.addressLabel} 2`}>{infoState.line2}</Info>
                            <Info label={info.cityLabel}>{infoState.city}</Info>
                            <Info label={info.stateLabel}>{infoState.state}</Info>
                            <Info label={info.zipLabel}>{infoState.zip}</Info>
                            <Info label={info.countryLabel}>{infoState.country}</Info>
                            <p>
                                <Info label={info.emailLabel}>{infoState.email}</Info>
                                <Info label={info.phoneLabel}>{infoState.phone}</Info>
                            </p>
                        </div>
                    </>
                )}
                {editMode && (
                    <div className="cmp-qp__edit-mode">
                        {handleRequiredElements()}
                        <form>
                            <div className="form-check">
                                <label htmlFor="companyName">{info.companyLabel}</label>
                                <input
                                    className={infoState.companyName === '' ? "field element errorInput" : "field element"}
                                    value={infoState.companyName}
                                    name="companyName"
                                    id="companyName"
                                    onChange={handleModelChange}
                                    type="text"/>
                            </div>
                            <div className="form-check">
                                <label htmlFor="name">{info.nameLabel}</label>
                                <input
                                    className={infoState.name === '' ? "field element errorInput" : "field element"}
                                    value={infoState.name}
                                    name="name"
                                    id="name"
                                    onChange={handleModelChange}
                                    type="text"/>
                            </div>
                            <div className="form-check">
                                <label htmlFor="line1">{info.addressLabel + ' 1'}</label>
                                <input
                                    className={infoState.line1 === '' ? "field element errorInput" : "field element"}
                                    value={infoState.line1}
                                    name="line1"
                                    id="line1"
                                    onChange={handleModelChange}
                                    type="text"/>
                            </div>
                            <div className="form-check">
                                <label htmlFor="line2">{info.addressLabel + ' 2'}</label>
                                <input
                                    className="field element"
                                    value={infoState.line2}
                                    name="line2"
                                    id="line2"
                                    onChange={handleModelChange}
                                    type="text"/>
                            </div>
                            <div className="form-check">
                                <label htmlFor="city">{info.cityLabel}</label>
                                <input
                                    className={infoState.city === '' ? "field element errorInput" : "field element"}
                                    value={infoState.city}
                                    name="city"
                                    id="city"
                                    onChange={handleModelChange}
                                    type="text"/>
                            </div>
                            <div className="form-check">
                                <label htmlFor="state">{info.stateLabel}</label>
                                <input
                                    className={infoState.state === '' ? "field element errorInput" : "field element"}
                                    value={infoState.state}
                                    name="state"
                                    id="state"
                                    onChange={handleModelChange}
                                    type="text"/>
                            </div>
                            <div className="form-check">
                                <label htmlFor="zip">{info.zipLabel}</label>
                                <input
                                    className={infoState.zip === '' ? "field element errorInput" : "field element"}
                                    value={infoState.zip}
                                    name="zip"
                                    id="zip"
                                    onChange={handleModelChange}
                                    type="text"/>
                            </div>
                            <div className="form-check">
                                <label htmlFor="country">{info.countryLabel}</label>
                                <input
                                    className={infoState.country === '' ? "field element errorInput" : "field element"}
                                    value={infoState.country}
                                    name="country"
                                    id="country"
                                    onChange={handleModelChange}
                                    type="text"/>
                            </div>
                            <div className="form-check">
                                <label htmlFor="email">{info.emailLabel}</label>
                                <input
                                    className={infoState.email === '' ? "field element errorInput" : "field element"}
                                    value={infoState.email}
                                    name="email"
                                    id="email"
                                    onChange={handleModelChange}
                                    type="text"/>
                            </div>
                            <div className="form-check">
                                <label htmlFor="phone">{info.phoneLabel}</label>
                                <input
                                    className={infoState.phone === '' ? "field element errorInput" : "field element"}
                                    value={infoState.phone}
                                    name="phone"
                                    id="phone"
                                    onChange={handleModelChange}
                                    type="text"/>
                            </div>
                            <div className="form-group">
                                <Button btnClass="cmp-qp--save-information" disabled={values ? true : false} onClick={handleSaveChanges}>
                                    {info.submitLabel}
                                </Button>
                                <Button btnClass="cmp-qp--cancel-information" disabled={false} onClick={handleCancelChanges}>
                                    {info.cancelLabel}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
        </div>
    );
}

export default EndUserInfo;

