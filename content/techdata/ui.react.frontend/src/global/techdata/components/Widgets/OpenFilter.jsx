import React from 'react';
import { ANALYTICS_TYPES, pushEvent } from '../../../../utils/dataLayerUtils';

/**
 * @param {Object} props
 * @param {({query}) => void} props.handleChange
 * @param {() => void} props.onSearch
 * @param {() => void} props.onClear
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setExpanded
 * @param {() => void} props.handleClickOptionsButton
 * @returns 
 */
 const OpenFilter = ({handleChange, onSearch, onClear, setExpanded, handleClickOptionsButton, labelFilterGrid}) =>{
    return (
        <div  className="cmp-search-criteria__header__button"
            onClick={() => { 
                if (labelFilterGrid) {
                   return; 
                }
                pushEvent(ANALYTICS_TYPES.events.click, {
                  type: ANALYTICS_TYPES.types.button,
                  category: ANALYTICS_TYPES.category.orderTableInteractions,
                  name: ANALYTICS_TYPES.name.openOrderFilterApplied,
                });
                handleClickOptionsButton(false, handleChange, onSearch, onClear, true);
                setExpanded(false);
            }}
        >
            <div className="cmp-search-criteria__header__filter__title">
                <i className={`cmp-search-criteria__icon-button fas  fa-box-open fs-16`} title="Select Open Orders" ></i>
            </div>
        </div>
    )
};

export default OpenFilter;