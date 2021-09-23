import React, { useState } from 'react';
import Button from '../../Widgets/Button';

function EndUserInfo({endUser, info, onValueChange}) {
    const initialState = {
        companyName: endUser?.companyName || '',
        name: endUser?.name || '',
        line1: endUser?.line1 || '',
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
                <div className="cmp-qp__enduser-info--address-group">
                    <div>{info.nameLabel} {infoState.name}</div>
                    <div>{info.companyLabel} {infoState.companyName}</div>
                    <div>{info.addressLabel} {infoState.line1}</div>
                </div>
            )}
            {editMode && (
                <div className="cmp-qp__edit-mode">
                    <form>
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
                            <label htmlFor="line1">{info.addressLabel}</label>
                            <input
                                className="field element"
                                value={infoState.line1}
                                name="line1"
                                id="line1"
                                onChange={handleModelChange}
                                type="text"/>
                        </div>
                        <div className="form-group">
                            <Button btnClass="cmp-qp--save-information" disabled={false} onClick={handleSaveChanges}>
                                {"Submit"}
                            </Button>
                            <Button btnClass="cmp-qp--cancel-information" disabled={false} onClick={handleCancelChanges}>
                                {"Cancel"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default EndUserInfo;
