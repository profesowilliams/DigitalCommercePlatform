import React, { useState } from 'react';
import Button from '../../Widgets/Button';

function GeneralInfo({data, info, onValueChange}) {
    const initialState = {
        companyName: data.content.quotePreview.quoteDetails.reseller[0].companyName || '',
        name: data.content.quotePreview.quoteDetails.reseller[0].name || '',
    };

    const [editMode, setEditMode] = useState(false);
    const [infoState, setInfoState] = useState(initialState);

    const source = data.content.quotePreview.quoteDetails.source;
    
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
                <div>
                    <div>{info.nameLabel} {infoState.name}</div>
                    <div>{info.companyLabel} {infoState.companyName}</div>
                </div>
            )}
            {editMode && (
                <div>
                    <div>
                        <label htmlFor="name">{info.nameLabel}</label>
                        <input
                            className="field element"
                            value={infoState.name}
                            name="name"
                            id="name"
                            onChange={handleModelChange}
                            type="text"/>
                    </div>
                    <div>
                        <label htmlFor="companyName">{info.companyLabel}</label>
                        <input
                            className="field element"
                            value={infoState.companyName}
                            name="companyName"
                            id="companyName"
                            onChange={handleModelChange}
                            type="text"/>
                    </div>
                    <div className="form-group">
                        <Button btnClass={"cmp-qp--save-address"} disabled={false} onClick={handleSaveChanges}>
                            {"Submit"}
                        </Button>
                        <Button btnClass={"cmp-qp--cancel-address"} disabled={false} onClick={handleCancelChanges}>
                            {"Cancel"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GeneralInfo;
