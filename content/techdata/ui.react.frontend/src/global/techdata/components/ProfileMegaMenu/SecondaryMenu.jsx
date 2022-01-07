import React, { useState } from "react";
import TertiaryMenu from "../ProfileMegaMenu/TertiaryMenu";
import FontIcon from "../Widgets/FontIcon";
import { hasDCPAccess } from "../../../../utils/user-utils";

function SecondaryMenu({ secondaryData, userData, handleBackBtnClick }) {
  const [isOpen, setIsOpen] = useState(null);

  const handleSecondaryClick = (event, index, hasChild) => {
    if (hasChild) event.preventDefault();
    event.stopPropagation();
    setIsOpen((prevIsOpen) => {
      if (prevIsOpen === index) return null;
      return (prevIsOpen = index);
    });
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
        onClick={handleBackBtnClick}
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
              <a href={hasDCPAccess(userData) ? item.secondaryDcpLink : item.secondaryLink}>
                {item.secondaryLabel}
              </a>
              {item.tertiaryMenus ? (
                <TertiaryMenu
                  userData={userData}
                  tertiaryData={item.tertiaryMenus}
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
