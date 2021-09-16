import React, { useState } from 'react';
import Button from '../../Widgets/Button';

function GeneralInfo({data, info, onValueChange}) {
    const initialState = {
        spaId: data.content.quotePreview.quoteDetails.spaId || '',
        reference: data.content.quotePreview.quoteDetails.reference || '',
        tier: data.content.quotePreview.quoteDetails.tier || '',
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
        <div className="cmp-qp__general-info">
            <p onClick={handleEditModeChange} className="cmp-qp__general-info--title">{info.generalHeaderLabel}</p>
            <div>{info.sourceLabel} {source.type} {source.value}</div>
            {!editMode && (
                <div>
                    <div>{info.tierLabel} {infoState.tier}</div>
                    <div>{info.referenceLabel} {infoState.reference}</div>
                    <div>{info.dealLabel} {infoState.spaId}</div>
                </div>
            )}
            {editMode && (
                <div>
                    <div>
                        <label htmlFor="tier">{info.tierLabel}</label>
                        <input
                            className="field element"
                            value={infoState.tier}
                            name="tier"
                            id="tier"
                            onChange={handleModelChange}
                            type="text"/>
                    </div>
                    <div>
                        <label htmlFor="reference">{info.referenceLabel}</label>
                        <input
                            className="field element"
                            value={infoState.reference}
                            name="reference"
                            id="reference"
                            onChange={handleModelChange}
                            type="text"/>
                    </div>
                    <div>
                        <label htmlFor="spaId">{info.dealLabel}</label>
                        <input
                            className="field element"
                            value={infoState.spaId}
                            name="spaId"
                            id="spaId"
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
