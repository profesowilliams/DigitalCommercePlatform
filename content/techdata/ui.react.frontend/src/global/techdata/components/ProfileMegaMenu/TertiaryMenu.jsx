import React from 'react';
import { hasDCPAccess } from "../../../../utils/user-utils";

function TertiaryMenu({tertiaryData, userData}) {
    const handleTertiaryClick = (e) => {
        e.stopPropagation();
    }

    const handleTertiaryLinkClick = (linkUrl, dcpLink, linkTitle) => {
        let finalLinkUrl = hasDCPAccess(userDataCheck) ? dcpLink : linkUrl;
        if(finalLinkUrl != undefined){
            DataLayerUtils.pushEvent("click", {
                name: linkTitle,
                selectionDepth: "",
                type: "link",
                category: "profile dropdown",
              });
            window.location.href = finalLinkUrl
          }
      };

    return (
        <ul className="cmp-sign-in-group">
            {tertiaryData.items.map(item => {
                return (
                    <li key={Symbol(item.tertiaryLabel).toString()} onClick={(e) => handleTertiaryClick(e)} className={`cmp-sign-in--item ${item.tertiaryMenus ? 'has-child' : ''}`}>
                        <a href={hasDCPAccess(userData) ? item.tertiaryDcpLink : item.tertiaryLink}
                        onClick={() =>
                            handleTertiaryLinkClick(
                              item.tertiaryLink,
                              item.tertiaryDcpLink,
                              item.tertiaryLabel
                            )
                          }>
                            {item.tertiaryLabel}
                        </a>
                    </li>
                )
            })}
        </ul>
    )
}

export default TertiaryMenu;
