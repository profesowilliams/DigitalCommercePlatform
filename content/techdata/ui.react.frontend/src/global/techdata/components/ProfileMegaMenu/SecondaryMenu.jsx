import React, { useState } from "react";
import TertiaryMenu from "../ProfileMegaMenu/TertiaryMenu";
import FontIcon from "../Widgets/FontIcon";
import { hasDCPAccess } from "../../../../utils/user-utils";
import * as DataLayerUtils from "../../../../utils/dataLayerUtils";

function SecondaryMenu({ secondaryData, userData, handleBackBtnClick, addToRefs, handleKeyDown, refBackButton }) {
  const [isOpen, setIsOpen] = useState(null);

  const handleSecondaryClick = (event, index, hasChild) => {
    if (hasChild) event.preventDefault();
    event.stopPropagation();
    setIsOpen((prevIsOpen) => {
      if (prevIsOpen === index) return null;
      return (prevIsOpen = index);
    });
  };

  const handleSecondaryLinkClick = (linkUrl, dcpLink, linkTitle) => {
    let finalLinkUrl = hasDCPAccess(userData) ? dcpLink : linkUrl;
    if (finalLinkUrl != undefined) {
      DataLayerUtils.pushEvent(
        "click",
        {
          name: linkTitle,
          selectionDepth: "",
          type: "link",
          category: "profile dropdown",
        }
      );
      window.location.href = finalLinkUrl;
    }
  };

  return (
    <div className="cmp-sign-in-secondary">
      <div className="cmp-sign-in-secondary--title">
        {secondaryData.primaryLabel}
      </div>
      <div className="cmp-sign-in-secondary--sub-title">
        {secondaryData.primaryLabel + " home"}
      </div>
      <span
        className="cmp-sign-in-secondary__back"
        onClick={handleBackBtnClick} ref={refBackButton}
        tabIndex="0"  onKeyDown={(e) => handleKeyDown({e})}
      >
        <FontIcon iconClassName="fa-chevron-left" />
      </span>
      <ul className="cmp-sign-in-group">
        {secondaryData.secondaryMenus.items.map((item, index) => {
          return (
            <li
              onClick={() =>
                handleSecondaryClick(event, index, item.tertiaryMenus)
              }
              key={Symbol(item.secondaryLabel).toString()}
              className={`cmp-sign-in__item cmp-sign-in__level-1 ${
                item.tertiaryMenus ? "has-child" : ""
              } ${isOpen === index ? "active" : ""}`}
            >
              <a onClick={() =>
                  handleSecondaryLinkClick(
                    item.secondaryLink,
                    item.secondaryDcpLink,
                    item.secondaryLabel
                  )
                } tabIndex="0" ref={addToRefs} onKeyDown={(e) => handleKeyDown({e})}>
                {item.secondaryLabel}
              </a>
              {item.tertiaryMenus ? (
                <TertiaryMenu
                  userData={userData}
                  tertiaryData={item.tertiaryMenus}
                  innerRef={addToRefs}
                  handleKeyDown={handleKeyDown}
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SecondaryMenu;
