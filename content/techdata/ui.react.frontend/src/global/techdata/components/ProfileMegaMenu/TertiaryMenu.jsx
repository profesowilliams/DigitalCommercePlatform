import React from 'react';
import { hasDCPAccess } from "../../../../utils/user-utils";

function TertiaryMenu({tertiaryData, userData}) {
    const handleTertiaryClick = (e) => {
        e.stopPropagation();
    }

    
    return (
        <ul className="cmp-sign-in-group">
            {tertiaryData.items.map(item => {
                return (
                    <li key={Symbol(item.tertiaryLabel).toString()} onClick={(e) => handleTertiaryClick(e)} className={`cmp-sign-in--item ${item.tertiaryMenus ? 'has-child' : ''}`}>
                        <a href={hasDCPAccess(userData) ? item.tertiaryDcpLink : item.tertiaryLink}
                       >
                            {item.tertiaryLabel}
                        </a>
                    </li>
                )
            })}
        </ul>
    )
}

export default TertiaryMenu;
