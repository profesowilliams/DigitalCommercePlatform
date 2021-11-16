import React from 'react';

function FontIcon({iconClassName}) {
    return (
        <i className={`fas ${iconClassName || ''}`}></i>
    )
}

export default FontIcon;
