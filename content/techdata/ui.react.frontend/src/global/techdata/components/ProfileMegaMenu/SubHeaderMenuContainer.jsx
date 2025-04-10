import React from 'react';

function SubHeaderMenuContainer({data, handlePrimaryClick, addToRefs, handleKeyDown}) {
    if (data) {
        return (
            <ul className='cmp-sign-in-sub-header'>
                {data.items.map((item) => {
                    return (
                        <li className={`${item.secondaryMenus ? 'has-child' : ''}`} onClick={() => handlePrimaryClick(item)} key={Symbol(item.primaryLabel).toString()} tabIndex="0" ref={addToRefs} onKeyDown={(e) => handleKeyDown({e})}>{item.primaryLabel}</li>
                    )
                })}
            </ul>
        )
    } else {
        console.error("Please author data-dropdown values in AEM");
        return null;
    }
}

export default SubHeaderMenuContainer;
