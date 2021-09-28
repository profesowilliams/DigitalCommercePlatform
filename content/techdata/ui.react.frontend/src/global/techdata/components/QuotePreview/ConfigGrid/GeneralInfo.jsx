import React, { useState } from 'react';
import useGet from "../../../hooks/useGet";
import axios from "axios";
import Button from '../../Widgets/Button';
import Loader from '../../Widgets/Loader';

function GeneralInfo({quoteDetails, gridProps, info, onValueChange}) {
    const [pricingConditions, isLoading] = useGet(gridProps.pricingConditionsEndpoint);

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
    const [isTiersDropDownFocused, setIsTiersDropDownFocused] = useState(false);
    const [isLoadingDeals, setIsLoadingDeals] = useState(false);
    const [dealsFound, setDealsFound] = useState([]);
    const [selectedDeal, setSelectedDeal] = useState(-1);

    const clearDealsFound = () => {
        setDealsFound([]);
    }
    
    const handleModelChange = (e) => {
        setGeneralInfoState({
            ...generalInfoState,
            [e.target.name]: e.target.value,
        });

        setIsTiersDropDownFocused(false);
    }
    
    const handleEndUserNameKeyPress = (e) => {
        if (e.key === "Enter") {
            loadDeals();
        }
    };

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
    };

    const handleEditModeChange = () => {
        setEditMode(prevEditMode => !prevEditMode);
    };

    const closeEditMode = () => {
        setEditMode(false);
    };

    const handleSaveChanges = () => {
        onValueChange(generalInfoState);

        clearDealsFound();
        closeEditMode();
    };

    const displayDealsFound = () => {
        return (
            <div>
                {isLoadingDeals &&
                    <>
                        <Loader visible={isLoadingDeals} />
                        {info.searchingDealsLabel}
                    </>
                }
                {dealsFound?.length > 0 &&
                    <>
                        {info.dealsFoundLabel}
                        <ul className="cmp-qp-dealslist">
                            {dealsFound.map((dealInfo, index) => 
                                <li key={dealInfo.spaId} className="cmp-qp-dealslist__item">
                                    <input type="radio" name={`deal${index}`}
                                            value={index}
                                            checked={selectedDeal == index} 
                                            onChange={(e) => handleDealsChange(e, index)} />
                                    <div>
                                        <div className="cmp-qp-dealslist__item-data">
                                            <div>
                                                {info.bidLabel}
                                            </div>
                                            <div>
                                                {dealInfo.bid}
                                            </div>
                                        </div>
                                        <div className="cmp-qp-dealslist__item-data">
                                            <div>
                                                {info.versionLabel}
                                            </div>
                                            <div>
                                                {dealInfo.version}
                                            </div>
                                        </div>
                                        <div className="cmp-qp-dealslist__item-data">
                                            <div>
                                                {info.spaIdLabel}
                                            </div>
                                            <div>
                                                {dealInfo.spaId}
                                            </div>
                                        </div>
                                        <div className="cmp-qp-dealslist__item-data">
                                            <div>
                                                {info.endUserNameLabel}
                                            </div>
                                            <div>
                                                {dealInfo.endUserName}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </>
                }
            </div>
        )
    }
    const handleCancelChanges = () => {
        setGeneralInfoState(initialGeneralInfoState);

        closeEditMode();
    };

    const handleDropDownFocus = () => {
        setIsTiersDropDownFocused(true);
    };

    const handleDropDownBlur = () => {
        setIsTiersDropDownFocused(false);
    };

    const clearSelectedDeal = () => {
        setSelectedDeal(-1);
    }

    const replaceSearchTerm = (originalStr, searchTerm) => {
        const productIds = quoteDetails.items?.map((lineItem) => lineItem.mfrNumber);

        return originalStr
            .replace("{end-user-name}", searchTerm)
            .replace("{manufacturer-parts-id-array}", productIds.join(','))
            .replace("{order-level}", generalInfoState.tier);
    }

    const loadDeals = async (searchTerm) => {
        setIsLoadingDeals(true);

        const endpointUrl = replaceSearchTerm(gridProps.dealsForEndpoint, generalInfoState.endUserName);
        const response = axios.get(endpointUrl)
            .then((response) => {
                setIsLoadingDeals(false);

                clearSelectedDeal();

                setDealsFound(response.data.content.items);
            })
            .catch((error) => {
                console.log("OOPS!");
            });

    };

    return (
        <div className="cmp-qp__general-info">
            <p onClick={handleEditModeChange} className="cmp-qp__general-info--title">{info.generalHeaderLabel}</p>
            <div className="cmp-qp__general-info--address-group">
                {source &&
                    <div className="cmp-qp__information-row--readonly">
                        <div>
                            {info.sourceLabel}
                        </div>
                        <div>
                            {source.type} {source.value}
                        </div>
                    </div>
                }
                {!editMode && (
                    <>
                        {generalInfoState.tier &&
                            <div className="cmp-qp__information-row--readonly">
                                <div>
                                    {info.tierLabel}
                                </div>
                                <div>
                                    {generalInfoState.tier}
                                </div>
                            </div>
                        }
                        {generalInfoState.quoteReference &&
                            <div className="cmp-qp__information-row--readonly">
                                <div>
                                    {info.referenceLabel}
                                    </div>
                                <div>
                                    {generalInfoState.quoteReference}
                                </div>
                            </div>
                        }
                        {generalInfoState.deal.spaId &&
                            <div className="cmp-qp__information-row--readonly">
                                <div>
                                    {info.dealLabel}
                                </div>
                                <div>
                                    <div>
                                        {generalInfoState.deal.spaId}
                                    </div>
                                    <div>
                                        {generalInfoState.deal.endUserName}
                                    </div>
                                </div>
                            </div>
                        }
                    </>
                )}
            </div>
            {editMode && (
                <div className="cmp-qp__edit-mode">
                    <div className="form-check">
                        <label htmlFor="tier">{info.tierLabel}</label>
                        <div className="cmp-qp__dropdown">
                            <select
                                className="field element"
                                name="tier"
                                id="tier"
                                value={generalInfoState.tier}
                                onChange={handleModelChange}
                                onFocus={handleDropDownFocus}
                                onBlur={handleDropDownBlur}>
                                {!generalInfoState.tier && <option value="">Select an Option</option>}
                                {pricingConditions?.content?.pricingConditions && pricingConditions.content.pricingConditions.items.map((option, index) => 
                                    <option key={index} value={option.value}>{option.key}</option>
                                )}
                            </select>
                            <div className={`cmp-qp__dropdown-icon cmp-qp__dropdown-icon--${isTiersDropDownFocused ? 'visible': 'invisible'}`}>
                                <i className="fas fa-chevron-down"></i>
                            </div>
                            <div className={`cmp-qp__dropdown-icon cmp-qp__dropdown-icon--${!isTiersDropDownFocused ? 'visible': 'invisible'}`}>
                                <i className="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                    <div className="form-check">
                        <label htmlFor="quoteReference">{info.referenceLabel}</label>
                        <input
                            className="field element"
                            value={generalInfoState.quoteReference}
                            name="quoteReference"
                            id="quoteReference"
                            onChange={handleModelChange}
                            type="text"/>
                    </div>
                    <div className="form-check cmp-qp__edit-deal">
                        <label htmlFor="endUserName">{info.dealLabel}</label>
                        <div>
                            <input
                                className="field element"
                                value={generalInfoState.endUserName}
                                name="endUserName"
                                id="endUserName"
                                onChange={handleModelChange}
                                onKeyPress={handleEndUserNameKeyPress}
                                type="text"/>
                            <button className="cmp-qp__edit-deal__button" onClick={loadDeals}>
                                <i className="cmp-qp__edit-deal__icon fas fa-search" data-cmp-hook-search="icon"></i>
                            </button>
                            {displayDealsFound()}
                        </div>
                    </div>
                    <div className="form-group">
                        <Button btnClass="cmp-qp--save-information" disabled={false} onClick={handleSaveChanges}>
                            {"Submit"}
                        </Button>
                        <Button btnClass="cmp-qp--cancel-information" disabled={false} onClick={handleCancelChanges}>
                            {"Cancel"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GeneralInfo;
