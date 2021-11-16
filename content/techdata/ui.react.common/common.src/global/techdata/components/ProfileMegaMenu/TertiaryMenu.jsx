import React from 'react';

function TertiaryMenu({tertiaryData}) {
    const handleTertiaryClick = (e) => {
        e.stopPropagation();
    }

    return (
        <ul className="cmp-sign-in-group">
            {tertiaryData.items.map(item => {
                return (
                    <li key={Symbol(item.tertiaryLabel).toString()} onClick={(e) => handleTertiaryClick(e)} className={`cmp-sign-in--item ${item.tertiaryMenus ? 'has-child' : ''}`}>
                        <a href={item.tertiaryLink}>
                            {item.tertiaryLabel}
                        </a>
                    </li>
                )
            })}
        </ul>
    )
}

export default TertiaryMenu;
