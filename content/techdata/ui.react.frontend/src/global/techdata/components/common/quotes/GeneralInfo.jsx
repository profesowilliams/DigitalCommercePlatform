import React, { useState, useEffect } from 'react';
import useGet from "../../../hooks/useGet";
import axios from "axios";
import Button from '../../Widgets/Button';
import Loader from '../../Widgets/Loader';
import { ANALYTICS_TYPES, pushData, pushEvent } from '../../../../../utils/dataLayerUtils';
import { QUOTE_PREVIEW_TECH_DATA_TYPE_VALUE,
         QUOTE_PREVIEW_AVT_TYPE_VALUE,
         QUOTE_PREVIEW_AVT_GET_DEAL_PARAM,
         QUOTE_PREVIEW_TD_GET_DEAL_PARAM
         } from '../../../../../utils/constants';

function GeneralInfo({quoteDetails, gridProps, hideDealSelector, isDealRequired, isPricingOptionsRequired, info, onValueChange, readOnly}) {
    const [pricingConditions, isLoading] = useGet(gridProps.pricingConditionsEndpoint);
    const source = quoteDetails.source;
    const initialGeneralInfoState = () => ({
        deal: quoteDetails.deal || {},
        endUserName: '',
        spaId: quoteDetails.spaId || '',
        quoteReference: 
            quoteDetails.quoteReference ||
            quoteDetails.configurationName ||
            quoteDetails.configurationId || '',
            tier: quoteDetails.tier || '',
            vendor: quoteDetails?.vendor || '',
            buyMethod: () => getBuyMethodParameter(quoteDetails?.buyMethod)
    });

    const [editMode, setEditMode] = useState(false);
    const [generalInfoState, setGeneralInfoState] = useState(initialGeneralInfoState);
    const [isTiersDropDownFocused, setIsTiersDropDownFocused] = useState(false);
    const [isLoadingDeals, setIsLoadingDeals] = useState(false);
    const [dealsFound, setDealsFound] = useState([]);
    const [characterError, setCharacterError] = useState(false);
    const [noDealsFound, setNoDealsFound] = useState(false);
    const [errorGettingDeals, setErrorGettingDeals] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(-1);

    useEffect(() => {
        updateTierFriendlyLabel(generalInfoState.tier);
    }, [pricingConditions]);

    const updateTierFriendlyLabel = (currentTier) => {
        setGeneralInfoState((previousInfo) => (
            {
                ...previousInfo,
                tierUserFriendlyLabel: getPricingConditionLabel(currentTier)
            }
        ));
    }

    const getPricingConditionLabel = (tier) => {
        const pricingConditionsItems = pricingConditions?.content?.pricingConditions?.items;

        return pricingConditionsItems?.find((orderLevel) => orderLevel.value === tier)?.key;
    }

    const getBuyMethodParameter = (buyMethod) => {
        if(buyMethod === QUOTE_PREVIEW_TECH_DATA_TYPE_VALUE) {
            return QUOTE_PREVIEW_AVT_GET_DEAL_PARAM;
        } else if (buyMethod === QUOTE_PREVIEW_AVT_TYPE_VALUE) {
            return QUOTE_PREVIEW_TD_GET_DEAL_PARAM;
        }
        return '';
    }

    const clearDealsFound = () => {
        setSelectedDeal(-1);

        setDealsFound([]);
    }
    
    const handleModelChange = (e) => {
        generalInfoState.quoteReference.length > 99 
            ? setCharacterError(true) 
            : setCharacterError(false) 
        setGeneralInfoState({
            ...generalInfoState,
            [e.target.name]: e.target.value,
        });
    }
    
    const handleTierChange = (e) => {
        setGeneralInfoState({
            ...generalInfoState,
            [e.target.name]: e.target.value,
            tierUserFriendlyLabel: getPricingConditionLabel(e.target.value),
        });

        setIsTiersDropDownFocused(false);
    }
    
    const handleEndUserNameKeyPress = (e) => {
        if (e.key === "Enter") {
            loadDeals();
        }
    };

    const handleClearSelectedDeal = (e) => {
        setSelectedDeal(-1);

        setGeneralInfoState((previousInfo) => (
            {
                ...previousInfo,
                deal: {},
                spaId: '',
                endUserName: '',
            }
        ));
    }

    const handleDealsChange = (e, index) => {
        setSelectedDeal(index);

        const spaId = dealsFound[index].dealId;
        setGeneralInfoState((previousInfo) => (
            {
                ...previousInfo,
                deal: {
                    ...dealsFound[index],
                    spaId
                },
                spaId
            }
        ));
    };

    const handleEditModeChange = () => {
        handleEditModeChangeAnalytics();
        setGeneralInfoState(initialGeneralInfoState);
        updateTierFriendlyLabel(quoteDetails.tier);
        setEditMode(prevEditMode => !prevEditMode);
    };

    const handleEditModeChangeAnalytics = () => {
        pushEvent(
            ANALYTICS_TYPES.events.click,
            {
                name: ANALYTICS_TYPES.name.generalInformation,
                type: ANALYTICS_TYPES.types.button,
                category: ANALYTICS_TYPES.category.quotePreviewTableInteractions,
            },
        );
    };

    const closeEditMode = () => {
        setEditMode(false);
    };

    const handleSaveChanges = () => {
        onValueChange(generalInfoState);

        clearDealsFound();
        closeEditMode();
    };

    const handleCancelChanges = () => {
        setGeneralInfoState(initialGeneralInfoState);

        updateTierFriendlyLabel(quoteDetails.tier);

        closeEditMode();
    };

    const displayDealsFound = () => {
        if (errorGettingDeals) {
            return <div>{info.errorGettingDealsLabel}</div>;
        }
        else if (isLoadingDeals) {
            return (
                <>
                    <Loader visible={isLoadingDeals} />
                    {info.searchingDealsLabel}
                </>
            );
        }
        else if (noDealsFound) {
            return <div>{info.noDealsFoundLabel}</div>;
        }
        else {
            return (
                <div className="cmp-qp-deals-container">
                    {dealsFound?.length > 0 &&
                        <>
                            {info.dealsFoundLabel}
                            <ul className="cmp-qp-dealslist">
                                {dealsFound.map((dealInfo, index) => 
                                    <li key={dealInfo.dealId} className="cmp-qp-dealslist__item">
                                        <input type="radio" name={`deal${index}`}
                                                value={index}
                                                checked={selectedDeal == index} 
                                                onChange={(e) => handleDealsChange(e, index)} />
                                        <div onClick={(e) => handleDealsChange(e, index)}>
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
                                                    {dealInfo.dealId}
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
                            <div className="cmp-qp-dealslist-note">
                                {info.dealsPricingNote}
                            </div>
                        </>
                    }
                </div>
            )
        }
    }

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
        let productIds = quoteDetails.items?.map((lineItem) => {
            const childProductIds = lineItem.children.map((children) => children.vendorPartNo);
            return lineItem.mfrNumber + "," + childProductIds.join(',');
        });
        productIds = productIds.join(',').replace(/(,)\1+/g, ',');
        return originalStr
            .replace("{end-user-name}", searchTerm)
            .replace("{manufacturer-parts-id-array}", productIds)
            .replace("{order-level}", generalInfoState.tier)
            .replace("{vendor}", generalInfoState.vendor)
            .replace("{buy-method}", generalInfoState.buyMethod);
    }

    const loadDeals = async (searchTerm) => {
       
        pushData({
            event: ANALYTICS_TYPES.events.qpDealSearch,
            quote: {}
        });

        setIsLoadingDeals(true);
        setNoDealsFound(false);
        setErrorGettingDeals(false);

        const endpointUrl = replaceSearchTerm(gridProps.dealsForEndpoint, generalInfoState.endUserName);
        axios.get(endpointUrl)
            .then((response) => {
                setIsLoadingDeals(false);

                if (!response.data?.content?.items || response.data.content.items.length == 0) {
                    setNoDealsFound(true);
                }
                clearSelectedDeal();

                setDealsFound(response.data.content.items);
            })
            .catch((error) => {
                setErrorGettingDeals(true);
            });
    };

    const showSourceInformation = () => {
        if (source.length) {
            return (
                <div>
                    {source.map((option, index) =>
                        <div key={index}>
                            {option.type} {option.value}
                        </div>
                    )}
                </div>
            )
        }
        return (
            <div>
                {source.type} {source.value}
            </div>
        )
    };

    return (
        <div className="cmp-qp__general-info">
            <p onClick={!readOnly ? handleEditModeChange : undefined} className="cmp-qp__general-info--title">{info.generalHeaderLabel}</p>
            <div className="cmp-qp__general-info--address-group">
                {source &&
                    <div className="cmp-qp__information-row--readonly">
                        <span>
                            {info.sourceLabel}:
                        </span>
                        {showSourceInformation()}
                    </div>
                }
                {!editMode && (
                    <>
                        {(isPricingOptionsRequired || generalInfoState.tier) &&
                            <div className="cmp-qp__information-row--readonly">
                                <span>
                                    {info.tierLabel}:
                                </span>
                                <div>
                                    <span className={isPricingOptionsRequired ? 'cmp-qp__pricing-required' : ''}>
                                        {isPricingOptionsRequired ? 'Please select a Pricing Option' : null}
                                    </span>
                                    {generalInfoState.tierUserFriendlyLabel ? generalInfoState.tierUserFriendlyLabel : generalInfoState.tier }
                                </div>
                            </div>
                        }
                        {generalInfoState.quoteReference &&
                            <div className="cmp-qp__information-row--readonly">
                                <span>
                                    {info.referenceLabel}:
                                </span>
                                <div>
                                    {generalInfoState.quoteReference}
                                </div>
                            </div>
                        }
                        {(isDealRequired || generalInfoState.deal.spaId) &&
                            <div className="cmp-qp__information-row--readonly">
                                <span>
                                    {info.dealLabel}:
                                </span>
                                <div>
                                    <div>
                                        <span className={isDealRequired ? 'errorDeal' : ''}>
                                            {isDealRequired ? 'Please select a Deal' : null}
                                        </span>
                                        {generalInfoState.deal.spaId}
                                    </div>
                                    <div>
                                        {generalInfoState.deal.vendor}
                                    </div>
                                    <div>
                                        {generalInfoState.deal.expiryDate}
                                    </div>
                                </div>
                            </div>
                        }
                    </>
                )}
            </div>
            {!readOnly && editMode && (
                <div className="cmp-qp__edit-mode">
                    <div className="form-check">
                        <label htmlFor="tier">{info.tierLabel}</label>
                        <div className="cmp-qp__dropdown">
                            <select
                                className="field element"
                                name="tier"
                                id="tier"
                                value={generalInfoState.tier}
                                onChange={handleTierChange}
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
                    <span className={`characterError ${characterError ? `characterError--show` : `characterError--hide`}`}>
                        {info.referenceMaxCharacterError}
                    </span>
                        <div className="form-check cmp-qp__edit-deal">
                            {(!hideDealSelector || generalInfoState.deal.spaId) && <label htmlFor="endUserName">{info.dealLabel}</label>}
                            <div>

                                {generalInfoState.deal.spaId && (
                                    <div className="cmp-qp__edit-deal--selected">
                                        <div>
                                            {generalInfoState.deal.spaId}
                                        </div>
                                        <div>
                                            {generalInfoState.deal.vendor}
                                        </div>
                                        <div>
                                            {generalInfoState.deal.expiryDate}
                                        </div>

                                        {!hideDealSelector && <button
                                            className="cmp-qp__edit-deal-remove--selected"
                                            onClick={handleClearSelectedDeal}>
                                            <i
                                                className="fas fa-times"
                                                data-cmp-hook-search="icon"
                                            ></i>
                                        </button>}
                                    </div>
                                )}
                                {!hideDealSelector && <>
                                    <input
                                        className="field element"
                                        value={generalInfoState.endUserName}
                                        placeholder={info.searchDealsPlaceholder}
                                        name="endUserName"
                                        id="endUserName"
                                        onChange={handleModelChange}
                                        onKeyPress={handleEndUserNameKeyPress}
                                        type="text"/>
                                    <button className="cmp-qp__edit-deal__button" onClick={loadDeals}>
                                        <i className="cmp-qp__edit-deal__icon fas fa-search" data-cmp-hook-search="icon"></i>
                                    </button>
                                    {displayDealsFound()}
                                </>}
                            </div>
                        </div>
                    <div className="form-group">
                        <Button btnClass="cmp-quote-button cmp-qp--save-information" disabled={false} onClick={handleSaveChanges}>
                            {info.submitLabel}
                        </Button>
                        <Button btnClass="cmp-quote-button cmp-qp--cancel-information" disabled={false} onClick={handleCancelChanges}>
                            {info.cancelLabel}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GeneralInfo;
