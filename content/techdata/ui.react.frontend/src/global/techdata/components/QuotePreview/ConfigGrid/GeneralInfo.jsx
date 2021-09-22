import React, { useState } from 'react';
import axios from "axios";
import Button from '../../Widgets/Button';

function GeneralInfo({quoteDetails, info, onValueChange}) {
    console.log('quoteDetails', quoteDetails);
    const source = quoteDetails.source;
    const initialGeneralInfoState = {
        deal: {},
        endUserName: '',
        spaId: quoteDetails.spaId || '',
        quoteReference: 
            quoteDetails.quoteReference ||
            quoteDetails.configurationName ||
            quoteDetails.configurationId || '',
        tier: quoteDetails.tier || '',
    };

    const [editMode, setEditMode] = useState(false);
    const [generalInfoState, setGeneralInfoState] = useState(initialGeneralInfoState);
    const [dealsFound, setDealsFound] = useState([]);
    const [selectedDeal, setSelectedDeal] = useState(-1);

    const clearDealsFound = () => {
        setDealsFound([]);
    }
    
    const handleModelChange = (e) => setGeneralInfoState({
        ...generalInfoState,
        [e.target.name]: e.target.value,
    });


    const handleDealsChange = (e, index) => {
        setSelectedDeal(index);

        setGeneralInfoState((previousInfo) => (
            {
                ...previousInfo,
                deal: dealsFound[index],
                endUserName: '',
                spaId: dealsFound[index].spaId
            }
        ));

        clearDealsFound();
    };

    const handleEditModeChange = () => {
        setEditMode(prevEditMode => !prevEditMode);
    };

    const closeEditMode = () => {
        setEditMode(false);
    };

    const handleSaveChanges = () => {
        onValueChange(generalInfoState);

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
                    {dealsFound.map((dealInfo, index) => 
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
                    )}
                </ul>
            </div>
        )
    }
    const handleCancelChanges = () => {
        setGeneralInfoState(initialGeneralInfoState);

        closeEditMode();
    };

    const clearSelectedDeal = () => {
        setSelectedDeal(-1);
    }

    const replaceSearchTerm = (originalStr, searchTerm) =>
        originalStr.replace("{end-user-name}", searchTerm);

    const loadDeals = async (searchTerm) => {
        const response = await axios.get(replaceSearchTerm('http://localhost:3000/ui-config/v1/getdealsFor?endUserName={end-user-name}', generalInfoState.endUserName));

        clearSelectedDeal();

        setDealsFound(response.data.content.items);
    };

    return (
        <div className="cmp-qp__general-info">
            <p onClick={handleEditModeChange} className="cmp-qp__general-info--title">{info.generalHeaderLabel}</p>
            {source && <div>{info.sourceLabel} {source.type} {source.value}</div>}
            {!editMode && (
                <div>
                    <div>{info.tierLabel} {generalInfoState.tier}</div>
                    {generalInfoState.reference && <div>{info.referenceLabel} {generalInfoState.reference}</div>}
                    {generalInfoState.deal.dealId && <div>
                        {info.dealLabel} 
                        <div>
                            {generalInfoState.deal.bid}
                            {generalInfoState.deal.dealId}
                            {generalInfoState.deal.version}
                        </div>
                    </div>}
                </div>
            )}
            {editMode && (
                <div>
                    <div>
                        <label htmlFor="tier">{info.tierLabel}</label>
                        <select
                            className="field element"
                            name="tier"
                            id="tier"
                            value={generalInfoState.tier}
                            onChange={handleModelChange}>
                            {info.tierOptions.map((option, index) => 
                                <option key={index} value={option.value}>{option.label}</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="reference">{info.referenceLabel}</label>
                        <input
                            className="field element"
                            value={generalInfoState.reference}
                            name="reference"
                            id="reference"
                            onChange={handleModelChange}
                            type="text"/>
                    </div>
                    <div>
                        <label htmlFor="endUserName">{info.dealLabel}</label>
                        <input
                            className="field element"
                            value={generalInfoState.endUserName}
                            name="endUserName"
                            id="endUserName"
                            onChange={handleModelChange}
                            type="text"/>
                        <button className="cmp-searchbar__button" onClick={loadDeals}>
                
                            <i className="cmp-searchbar__icon fas fa-search" data-cmp-hook-search="icon"></i>
                        </button>
                        <div>
                            {generalInfoState.deal.dealId}
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
