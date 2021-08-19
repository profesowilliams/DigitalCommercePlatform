import React from 'react';

function TertiaryMenu({tertiaryData}) {
    return (
        <ul className="cmp-sign-in-group">
            {tertiaryData.items.map(item => {
                return (
                    <li key={Symbol(item.tertiaryLabel).toString()} className={`cmp-sign-in--item ${item.tertiaryMenus ? 'has-child' : ''}`}>
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
