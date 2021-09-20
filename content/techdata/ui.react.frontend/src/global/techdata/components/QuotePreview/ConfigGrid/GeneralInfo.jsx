import React, { useState } from 'react';
import axios from "axios";
import Button from '../../Widgets/Button';

function GeneralInfo({data, info, onValueChange}) {
    const source = data.content.quotePreview.quoteDetails.source;
    const initialState = {
        deal: {
            spaId: data.content.quotePreview.quoteDetails.spaId || '',
        },
        reference: data.content.quotePreview.quoteDetails.configurationName || '',
        tier: data.content.quotePreview.quoteDetails.tier || '',
        endUserName: '',
    };

    const [editMode, setEditMode] = useState(false);
    const [infoState, setInfoState] = useState(initialState);
    const [dealsFound, setDealsFound] = useState([]);
    const [selectedDeal, setSelectedDeal] = useState(-1);

    const clearDealsFound = () => {
        setDealsFound([]);
    }
    
    const handleModelChange = (e) => setInfoState({
        ...infoState,
        [e.target.name]: e.target.value,
    });


    const handleDealsChange = (e, index) => {
        setSelectedDeal(index);

        setInfoState((previousInfo) => {
            return {
                ...previousInfo,
                deal: dealsFound[index]
            }
        });

        clearDealsFound();

        setInfoState((previousInfo) => {
            return {
                ...previousInfo,
                endUserName: ''
            }
        });
    };

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

    const displayDealsFound = () => {
        if(!dealsFound || dealsFound.length == 0) {
            return '';
        }
        return (
            <div>
                Deals found - cancel
                <ul>
                    {dealsFound.map((dealInfo, index) => {
                        return (
                            <li key={dealInfo.dealId}>
                                <input type="radio" name={`deal${index}`}
                                        value={index}
                                        checked={selectedDeal.index == index} 
                                        onChange={(e) => handleDealsChange(e, index)} />
                                <div>{dealInfo.bid}</div>
                                <div>{dealInfo.version}</div>
                                <div>{dealInfo.dealId}</div>
                                <div>{dealInfo.endUserName}</div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )
    }
    const handleCancelChanges = () => {
        setInfoState(initialState);

        closeEditMode();
    };

    const replaceSearchTerm = (originalStr, searchTerm) => {
        return originalStr.replace("{end-user-name}", searchTerm);
    }
    const loadDeals = async (searchTerm) => {
        const response = await axios.get(replaceSearchTerm('http://localhost:3000/ui-config/v1/getdealsFor?endUserName={end-user-name}', infoState.endUserName));

        setSelectedDeal(-1);

        setDealsFound(response.data.content.items);
    };

    return (
        <div className="cmp-qp__general-info">
            <p onClick={handleEditModeChange} className="cmp-qp__general-info--title">{info.generalHeaderLabel}</p>
            <div>{info.sourceLabel} {source.type} {source.value}</div>
            {!editMode && (
                <div>
                    <div>{info.tierLabel} {infoState.tier}</div>
                    {infoState.reference && <div>{info.referenceLabel} {infoState.reference}</div>}
                    {infoState.deal.dealId && <div>
                        {info.dealLabel} 
                        <div>
                            {infoState.deal.bid}
                            {infoState.deal.dealId}
                            {infoState.deal.version}
                        </div>
                    </div>}
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
                        <label htmlFor="endUserName">{info.dealLabel}</label>
                        <input
                            className="field element"
                            value={infoState.endUserName}
                            name="endUserName"
                            id="endUserName"
                            onChange={handleModelChange}
                            type="text"/>
                        <button className="cmp-searchbar__button" onClick={loadDeals}>
                
                            <i className="cmp-searchbar__icon fas fa-search" data-cmp-hook-search="icon"></i>
                        </button>
                        <div>
                            {infoState.deal.dealId}
                        </div>
                        {displayDealsFound()}
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
