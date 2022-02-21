import React from 'react';

/**
   * @param {Object} props
   * @param {boolean} props.expanded
   * @param {({query}) => void} props.handleChange
   * @param {() => void} props.onSearch
   * @param {() => void} props.onClear
   * @param {() => void} props.handleClickOptionsButton
   * @param {string} props.labelFilterGrid
   * 
   * @returns 
   */
 const ButtonLabelFilter = ({expanded, handleChange, onSearch, onClear, handleClickOptionsButton, labelFilterGrid}) => {
    return (
        <div
            className={` ${expanded ? 'hidden' : ''}`}
            onClick={() => {
                handleClickOptionsButton(false, handleChange, onSearch, onClear)
            }}
        >
            <div className='cmp-search-criteria__header__filter'>
                <div className='cmp-search-criteria__header__filter__title'>
                    {labelFilterGrid}
                </div>
                <i className={`cmp-search-criteria__icon fas fa-times-circle`}></i>
            </div>
        </div>
    );
};

export default ButtonLabelFilter
