import React from 'react';

/**
 * @param {Object} props
 * @param {({query}) => void} props.handleChange
 * @param {() => void} props.onSearch
 * @param {() => void} props.onClear
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setExpanded
 * @param {() => void} props.handleClickOptionsButton
 * @returns 
 */
 const OpenFilter = ({handleChange, onSearch, onClear, setExpanded, handleClickOptionsButton}) =>{
    return (
        <div  className="cmp-search-criteria__header__button"
            onClick={() => { 
                handleClickOptionsButton(false, handleChange, onSearch, onClear)
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