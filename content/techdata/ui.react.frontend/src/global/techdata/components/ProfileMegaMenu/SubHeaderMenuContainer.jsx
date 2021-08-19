import React from 'react';

function SubHeaderMenuContainer({data, handlePrimaryClick}) {
    return (
        <ul className='cmp-sign-in-sub-header'>
            {data.items.map((item) => {
                return (
                    <li onClick={() => handlePrimaryClick(item)} key={Symbol(item.primaryLabel).toString()}>{item.primaryLabel}</li>
                )
            })}
        </ul>
    )
}

export default SubHeaderMenuContainer;
