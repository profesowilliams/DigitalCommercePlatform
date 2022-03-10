import React from 'react';
import { hasDCPAccess } from "../../../../utils/user-utils";
import * as DataLayerUtils from "../../../../utils/dataLayerUtils";

function TertiaryMenu({tertiaryData, userData, innerRef, handleKeyDown}) {
    const handleTertiaryClick = (e) => {
        e.stopPropagation();
    }

    const handleTertiaryLinkClick = (linkUrl, dcpLink, linkTitle) => {
      let finalLinkUrl = hasDCPAccess(userData) ? dcpLink : linkUrl;
      if (finalLinkUrl != undefined) {
        DataLayerUtils.pushEvent(
          DataLayerUtils.ANALYTICS_TYPES.events.click,
          {
            name: linkTitle,
            selectionDepth: "",
            type: DataLayerUtils.ANALYTICS_TYPES.types.link,
            category: DataLayerUtils.ANALYTICS_TYPES.category.profileDropdown,
          }
        );
        window.location.href = finalLinkUrl;
      }
    };

 return (
        <ul className="cmp-sign-in-group">
            {tertiaryData.items.map(item => {
                return (
                    <li key={Symbol(item.tertiaryLabel).toString()} onClick={(e) => handleTertiaryClick(e)} className={`cmp-sign-in--item ${item.tertiaryMenus ? 'has-child' : ''}`}>
                        <a onClick={() =>
                            handleTertiaryLinkClick(
                              item.tertiaryLink,
                              item.tertiaryDcpLink,
                              item.tertiaryLabel
                            )
                          } tabIndex="0" ref={innerRef} onKeyDown={(e) => handleKeyDown({e})}
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
