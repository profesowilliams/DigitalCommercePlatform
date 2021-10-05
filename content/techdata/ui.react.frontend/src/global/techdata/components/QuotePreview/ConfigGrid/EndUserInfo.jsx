import React, { useState } from 'react';
import Button from '../../Widgets/Button';

function EndUserInfo({endUser, info, onValueChange}) {
    const initialState = {
        companyName: endUser?.companyName || '',
        name: endUser?.name || '',
        line1: endUser?.line1 || '',
        line2: endUser?.line2 || '',
        city: endUser?.city || '',
        state: endUser?.state || '',
        zip: endUser?.postalCode | '',
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
        onValueChange(infoState);
        closeEditMode();
    };

    const handleCancelChanges = () => {
        setInfoState(initialState);
        closeEditMode();
    };
    return (
        <div className="cmp-qp__enduser-info">
            <p onClick={handleEditModeChange} className="cmp-qp__enduser-info--title">{info.endUserHeaderLabel}</p>
            {!editMode && (
                <>
                    <p className="cmp-qp__enduser-info--sub-title">{infoState.companyName}</p>
                    <div className="cmp-qp__enduser-info--address-group">
                        <span>{infoState.name}</span>
                        <span>{infoState.line1}</span>
                        <span>{infoState.line2}</span>
                        <span>{infoState.city}, {infoState.state} {infoState.zip}</span>
                        <span>{infoState.country}</span>
                        <p>
                            <span>{info.emailLabel}: {infoState.email || 'NA'}</span>
                            <span>{info.phoneLabel}: {infoState.phone || 'NA'}</span>
                        </p>
                    </div>
                </>
            )}
            {editMode && (
                <div className="cmp-qp__edit-mode">
                    <form>
                        <div className="form-check">
                            <label htmlFor="companyName">{info.companyLabel}</label>
                            <input
                                className="field element"
                                value={infoState.companyName}
                                name="companyName"
                                id="companyName"
                                onChange={handleModelChange}
                                type="text"/>
                        </div>
                        <div className="form-check">
                            <label htmlFor="name">{info.nameLabel}</label>
                            <input
                                className="field element"
                                value={infoState.name}
                                name="name"
                                id="name"
                                onChange={handleModelChange}
                                type="text"/>
                        </div>
                        <div className="form-check">
                            <label htmlFor="line1">{info.addressLabel + ' 1'}</label>
                            <input
                                className="field element"
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
                                className="field element"
                                value={infoState.city}
                                name="city"
                                id="city"
                                onChange={handleModelChange}
                                type="text"/>
                        </div>
                        <div className="form-check">
                            <label htmlFor="state">{info.stateLabel}</label>
                            <input
                                className="field element"
                                value={infoState.state}
                                name="state"
                                id="state"
                                onChange={handleModelChange}
                                type="text"/>
                        </div>
                        <div className="form-check">
                            <label htmlFor="zip">{info.zipLabel}</label>
                            <input
                                className="field element"
                                value={infoState.zip}
                                name="zip"
                                id="zip"
                                onChange={handleModelChange}
                                type="text"/>
                        </div>
                        <div className="form-check">
                            <label htmlFor="country">{info.countryLabel}</label>
                            <input
                                className="field element"
                                value={infoState.country}
                                name="country"
                                id="country"
                                onChange={handleModelChange}
                                type="text"/>
                        </div>
                        <div className="form-check">
                            <label htmlFor="email">{info.emailLabel}</label>
                            <input
                                className="field element"
                                value={infoState.email}
                                name="email"
                                id="email"
                                onChange={handleModelChange}
                                type="text"/>
                        </div>
                        <div className="form-check">
                            <label htmlFor="phone">{info.phoneLabel}</label>
                            <input
                                className="field element"
                                value={infoState.phone}
                                name="phone"
                                id="phone"
                                onChange={handleModelChange}
                                type="text"/>
                        </div>
                        <div className="form-group">
                            <Button btnClass="cmp-qp--save-information" disabled={false} onClick={handleSaveChanges}>
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

