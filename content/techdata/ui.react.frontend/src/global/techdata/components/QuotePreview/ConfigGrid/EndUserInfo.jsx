import React, { useState, useEffect } from 'react';
import Info from '../../common/quotes/DisplayItemInfo';
import Button from '../../Widgets/Button';
import { validateRequiredEnduserFields } from "../QuoteTools";
import { ANALYTICS_TYPES, pushEvent } from "../../../../../utils/dataLayerUtils";

function EndUserInfo({endUser, info, onValueChange, isEndUserMissing, flagDeal, quickQuoteWithVendorFlag}) {
    endUser = endUser && endUser[0];
    const initialState = {
        companyName: endUser?.companyName || '',
        name: endUser?.name || '',
        line1: endUser?.line1 || '',
        line2: endUser?.line2 || '',
        city: endUser?.city || '',
        state: endUser?.state || '',
        postalCode: endUser?.postalCode || '',
        country: endUser?.country || '',
        email: endUser?.email || '',
        phoneNumber: endUser?.phoneNumber || ''
    };
    const [editMode, setEditMode] = useState(false);
    const [infoState, setInfoState] = useState(initialState);
    
    const handleModelChange = (e) => setInfoState({
        ...infoState,
        [e.target.name]: e.target.value,
    });
 
const handleEditModeChange = () => {
      
      if (flagDeal) {
        handleEndUserAnalytics();
        setEditMode(prevEditMode => !prevEditMode);
      }
    };


    const handleEndUserAnalytics = () => {
      pushEvent(
        ANALYTICS_TYPES.events.click,
        {
          name: ANALYTICS_TYPES.name.endUserInformation,
          type: ANALYTICS_TYPES.types.button,
          category: ANALYTICS_TYPES.category.quotePreviewTableInteractions,
        },
      );
    }

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

    useEffect(() => {
      if (endUser?.companyName) {
        setInfoState({
          ...infoState,
          companyName: endUser?.companyName,
        })
      }
    }, [endUser?.companyName]);

    const isValidEndUserInfo = validateRequiredEnduserFields(infoState, quickQuoteWithVendorFlag);

    const handleRequiredElements = () => {
        if (!isValidEndUserInfo){
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
        <p
          onClick={handleEditModeChange}
          className={flagDeal ? "cmp-qp__enduser-info--title" : 'cmp-qp__enduser-info--title-nodeal'}
        >
          {info.endUserHeaderLabel}
        </p>

        {!editMode && (
          <>   
            {flagDeal && !isValidEndUserInfo ?
                <span className="errorEndUser">
                    Please fill all fields
                </span>
                : ""
            }
            <p
              label={info.companyLabel}
              className="cmp-qp__enduser-info--sub-title"
            >
              {infoState.companyName}
            </p>
            <div className="cmp-qp__enduser-info--address-group">
              {infoState.name}<br/>
              {infoState.line1}<br />
              {infoState.line2}<br />
              {infoState.city}<br />
              {infoState.state}<br />
              {infoState.postalCode}<br />
              {infoState.country}<br />
              <p>
                {infoState.email}<br />
                {infoState.phoneNumber}<br />
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
                    className={
                      infoState.companyName.trim() === ""
                        ? "field element errorInput"
                        : "field element"
                    }
                    value={infoState.companyName}
                    name="companyName"
                    id="companyName"
                    onChange={handleModelChange}
                    type="text"
                  />
                </div>
                <div className="form-check">
                  <label htmlFor="name">{info.nameLabel}</label>
                  <input
                    className={
                      infoState.name.trim() === "" && quickQuoteWithVendorFlag
                        ? "field element errorInput"
                        : "field element"
                    }
                    value={infoState.name}
                    name="name"
                    id="name"
                    onChange={handleModelChange}
                    type="text"
                  />
                </div>
                <div className="form-check">
                  <label htmlFor="line1">{info.addressLabel + " 1"}</label>
                  <input
                    className={
                      infoState.line1.trim() === "" && quickQuoteWithVendorFlag
                        ? "field element errorInput"
                        : "field element"
                    }
                    value={infoState.line1}
                    name="line1"
                    id="line1"
                    onChange={handleModelChange}
                    type="text"
                  />
                </div>
                <div className="form-check">
                  <label htmlFor="line2">{info.addressLabel + " 2"}</label>
                  <input
                    className="field element"
                    value={infoState.line2}
                    name="line2"
                    id="line2"
                    onChange={handleModelChange}
                    type="text"
                  />
                </div>
                <div className="form-check">
                  <label htmlFor="city">{info.cityLabel}</label>
                  <input
                    className={
                      infoState.city.trim() === "" && quickQuoteWithVendorFlag
                        ? "field element errorInput"
                        : "field element"
                    }
                    value={infoState.city}
                    name="city"
                    id="city"
                    onChange={handleModelChange}
                    type="text"
                  />
                </div>
                <div className="form-check">
                  <label htmlFor="state">{info.stateLabel}</label>
                  <input
                    className={
                      infoState.state.trim() === "" && quickQuoteWithVendorFlag
                        ? "field element errorInput"
                        : "field element"
                    }
                    value={infoState.state}
                    name="state"
                    id="state"
                    onChange={handleModelChange}
                    type="text"
                  />
                </div>
                <div className="form-check">
                  <label htmlFor="postalCode">{info.zipLabel}</label>
                  <input
                    className={
                      infoState.postalCode.trim() === "" && quickQuoteWithVendorFlag
                        ? "field element errorInput"
                        : "field element"
                    }
                    value={infoState.postalCode}
                    name="postalCode"
                    id="postalCode"
                    onChange={handleModelChange}
                    type="text"
                  />
                </div>
                <div className="form-check">
                  <label htmlFor="country">{info.countryLabel}</label>
                  <input
                    className="field element"
                    value={infoState.country}
                    name="country"
                    id="country"
                    onChange={handleModelChange}
                    type="text"
                  />
                </div>
                <div className="form-check">
                  <label htmlFor="email">{info.emailLabel}</label>
                  <input
                    className="field element"
                    value={infoState.email}
                    name="email"
                    id="email"
                    onChange={handleModelChange}
                    type="text"
                  />
                </div>
                <div className="form-check">
                  <label htmlFor="phoneNumber">{info.phoneLabel}</label>
                  <input
                    className="field element"
                    value={infoState.phoneNumber}
                    name="phoneNumber"
                    id="phoneNumber"
                    onChange={handleModelChange}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <Button
                    btnClass="cmp-quote-button cmp-qp--save-information"
                    disabled={!isValidEndUserInfo ? true : false}
                    onClick={handleSaveChanges}
                  >
                    {info.submitLabel}
                  </Button>
                  <Button
                    btnClass="cmp-quote-button cmp-qp--cancel-information"
                    disabled={false}
                    onClick={handleCancelChanges}
                  >
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

