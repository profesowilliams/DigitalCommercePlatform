import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { signOut } from "../../../../utils";
import SubHeaderMenuContainer from "../ProfileMegaMenu/SubHeaderMenuContainer";
import SecondaryMenu from "../ProfileMegaMenu/SecondaryMenu";
import { hasDCPAccess } from "../../../../utils/user-utils";
import * as DataLayerUtils from "../../../../utils/dataLayerUtils";
import useOutsideClick from "../../hooks/useOutsideClick";
import { triggerEvent } from "../../../../utils/events";
import { useStore } from "../../../../utils/useStore";
import { isExtraReloadDisabled, isHttpOnlyEnabled } from "../../../../utils/featureFlagUtils";

const DropdownMenu = ({ items, userDataCheck, config, dropDownData }) => {
  const isLoggedIn = useStore(state => state.isLoggedIn);
  const [showSecondary, setShowSecondary] = useState(false);
  const [secondaryItems, setSecondaryItems] = useState(null);
  const { id: userId, firstName: userName } = userDataCheck;
  const [isSelected, setIsSelected] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [screenSize, setScreenSize] = useState(null);
  const refs = useRef([]);
  const refCursor = useRef(0);
  const refLogOff = useRef(null);
  const refLogIn = useRef(null);
  const refBackButton = useRef(null);
  const refContainer = useRef(null);
  const [flagDropdown, setFlagDropdown] = useState(true);

  useEffect(() => {
    window.addEventListener('resize', updateWindowDimensions);
    updateWindowDimensions();
    
    return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    }
  }, []);

  useEffect(() => {
    const headerContainerEle = document.querySelector('#cmp-techdata-header');
    if (showMenu) {
        headerContainerEle?.classList.add('signin-menu-active');
    document
    } else {
        headerContainerEle?.classList.remove('signin-menu-active');
    }
  }, [showMenu]);

  useOutsideClick(refContainer, () => {
    if (flagDropdown) {
      setIsSelected(false);
      setShowMenu(false);
      setFlagDropdown(false)
    }
  });

  const updateWindowDimensions = () => {
    setScreenSize({ width: window.innerWidth, height: window.innerHeight });
  };

  const handlePrimaryClick = (obj) => {
    if (obj.secondaryMenus) {
      setSecondaryItems(obj);
      setShowSecondary((prevSecondary) => !prevSecondary);
    }
  };
  const handleLinkClick = (linkUrl, dcpLink, linkTitle, linkTarget ) => {
      let finalLinkUrl = hasDCPAccess(userDataCheck) ? dcpLink : linkUrl 
      if(finalLinkUrl != undefined){
        DataLayerUtils.pushEvent(DataLayerUtils.ANALYTICS_TYPES.events.click, {
          name: linkTitle,
          selectionDepth: "",
          type: DataLayerUtils.ANALYTICS_TYPES.types.link,
          category: DataLayerUtils.ANALYTICS_TYPES.category.profileDropdown,
        });
        linkTarget ?
          window.open(finalLinkUrl, 'blank') :
          window.location.href = finalLinkUrl;
      }
  }

  const addToRefs = (el) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
      if (refs.current.length === 1) {
        refCursor.current = 0
        refs.current[refCursor.current].focus();
      }
    }
  };

  const handleKeyDown = (request) => {
    const {e, linkUrl, dcpLink, linkTitle, linkTarget} = request
    let parentRefs = refs.current.filter(r => (!r.className && r.offsetParent) || (r.className && screenSize?.width < 1024) || (r.className && r.className != 'has-child' && screenSize?.width >= 1024));
    switch (true) {
      case (e.keyCode === 38 && refCursor.current === 0) && e.currentTarget.className === '':
        e.preventDefault();
        setRefBackButton();
        break;

      case (e.keyCode === 37 && refCursor.current === 0) && e.currentTarget.className === 'cmp-sign-in-secondary__back':
        e.currentTarget.click();
        refs.current = [];
        setShowMenu(true);
        break;

      case e.keyCode === 38 && refCursor.current === 0:
        e.preventDefault();
        setIsSelected(false);
        setShowMenu(false);
        setRefLogIn();
        break;

      case e.keyCode === 38 && refCursor.current > 0:
        e.preventDefault();
        parentRefs[--refCursor.current].focus();
        break;

      case e.keyCode === 40 && refCursor.current === parentRefs.length - 1:
        e.preventDefault();
        setRefLogOff();
        break;

      case e.keyCode === 40 && refCursor.current < parentRefs.length - 1:
        e.preventDefault();
        parentRefs[++refCursor.current].focus();
        break;

      case e.shiftKey && e.keyCode === 9:
        refCursor.current--;
        break;

      case e.keyCode === 9:
        refCursor.current++;
        break;

      case e.keyCode === 27:
        setIsSelected(false);
        setShowMenu(false);
        setRefLogIn();
        break;

      case e.keyCode === 13 && e.currentTarget.className === 'cmp-sign-in-list-content--item':
        handleLinkClick(linkUrl, dcpLink, linkTitle, linkTarget );
        break;

      case ((e.keyCode === 39 && refCursor.current <= refs.current.length - 1) || e.keyCode === 13) && (e.currentTarget.className === 'has-child' || e.currentTarget.className === 'cmp-sign-in-secondary__back'):
        refCursor.current = -1;
        refs.current = [];
        e.currentTarget.click();
        break;

      case (e.keyCode === 38 && refCursor.current === 0) && (e.currentTarget.className === 'cmp-sign-in-secondary__back'):
        refCursor.current = -1;
        refs.current = [];
        e.currentTarget.click();
        break;

      case (e.keyCode === 37 || e.keyCode === 13) && (e.currentTarget.offsetParent.className === 'cmp-sign-in-list cmp-sign-in--container selected showMenu' || e.currentTarget.offsetParent.className === 'cmp-sign-in__item cmp-sign-in__level-1 has-child active'):
        e.currentTarget.click();
        break;

      case (e.keyCode === 39 || e.keyCode === 13) && e.currentTarget.className === '':
        e.currentTarget.click();
        break;

      case e.keyCode === 13 && e.currentTarget.className === 'cmp-sign-in-signout':
        handleSignOut();
        break;

      default: // Do nothing
    }
  };

  const setRefLogOff = () => {
    refLogOff.current.focus();
  };

  const setRefLogIn = () => {
    refLogIn.current.focus();
  };

  const handleBackBtnClick = () => {
    setShowSecondary((prevSecondary) => !prevSecondary);
  };

  const handleSignOut = () => {
    DataLayerUtils.pushEvent(DataLayerUtils.ANALYTICS_TYPES.events.click, {
      carouselName: "",
      mastheadlevel: "",
      name: DataLayerUtils.ANALYTICS_TYPES.name.logOut,
      selectionDepth: "",
      type: DataLayerUtils.ANALYTICS_TYPES.types.button,
      category: DataLayerUtils.ANALYTICS_TYPES.category.logOut,
    });
    signOut(
      config?.logoutURL ?? null,
      config?.pingLogoutURL ?? null,
      config?.errorPageUrl ?? null,
      config?.shopLogoutRedirectUrl ?? null,
      config?.aemAuthUrl ?? null,
      config?.isPrivatePage ?? null,
      isHttpOnlyEnabled() ? isLoggedIn : localStorage.getItem("sessionId"),
      isExtraReloadDisabled() || isHttpOnlyEnabled(),
    );

    triggerEvent('user:loggedOut');
  };

  const setRefBackButton = () => {
    refBackButton.current.focus();
  };

  return (
    <div>
      <div ref={refContainer}>
      <button
        data-component="DropdownMenu"
        className={`cmp-sign-in-button authenticated clicked ${userId ? "active" : ""}`}
        ref={(o) => (refLogIn.current = o)}
        onClick={(e) => {
          if ( e.type === 'click') {
            setIsSelected(e.type === 'click');
            setShowMenu(!showMenu);
            setFlagDropdown(!showMenu)
          }
        }}
        
        onKeyDown={(e) => {
          refCursor.current = -1;
          handleKeyDown({e})
        }}
      >
        {userName}
      </button>
      <div className={`cmp-sign-in-list cmp-sign-in--container ${isSelected ? "selected" : ""} ${showMenu ? "showMenu" : ""}`}>
        {!showSecondary ? (
          <>
            <p className="user-greet">
              <span>
                {config?.welcomeLabel} {userName}!
              </span>
            </p>
            <p className="ec-id">
              <span>EC ID: {userId}</span>
            </p>
            <ul className="cmp-sign-in-list-content">
              {items.map(({ linkTitle, dcpLink, linkUrl, iconUrl, linkTarget }) => (
                <li
                  key={Symbol(linkTitle).toString()}
                  className="cmp-sign-in-list-content--item"
                  onBlur={(e) => {
                    
                    if (!e.relatedTarget) {
                      setIsSelected(false);
                      refCursor.current = 0;
                    }                                        
                  }}
                  onKeyDown={(e) => {
                    const request = {
                      e,
                      linkUrl,
                      dcpLink,
                      linkTitle,
                      linkTarget
                    }
                    handleKeyDown(request)
                  }}
                >
                  <a
                    onClick={() => handleLinkClick(linkUrl, dcpLink, linkTitle, linkTarget )}
                    className="cmp-sign-in-list-content--item-link" tabIndex="0"
                    ref={addToRefs}
                  >
                    <i
                      className={`cmp-sign-in-list-content--item-link--icon ${iconUrl}`}
                    ></i>
                    <span>{linkTitle}</span>
                  </a>
                </li>
              ))}
            </ul>
            <SubHeaderMenuContainer
              data={dropDownData}
              handlePrimaryClick={handlePrimaryClick}
              addToRefs={addToRefs}
              handleKeyDown={handleKeyDown}
            />
            <button
              className="cmp-sign-in-signout"
              onClick={() => handleSignOut()}
              onBlur={(e) => {
                if (!(e.relatedTarget.className === 'cmp-sign-in-list-content--item-link' || e.relatedTarget.className === 'has-child')) {
                      setIsSelected(false);
                      refCursor.current = 0;
                    }
              }}
              ref={(o) => (refLogOff.current = o)}
              onKeyDown={(e) => {
                let parentRefs = refs.current.filter(r => (!r.className && r.offsetParent) || (r.className && screenSize?.width < 1024) || (r.className && r.className != 'has-child' && screenSize?.width >= 1024));
                refCursor.current = parentRefs.length;
                handleKeyDown({e});
              }}
            >
              Log Out
            </button>
          </>
        ) : (
          <SecondaryMenu
            userData={userDataCheck}
            secondaryData={secondaryItems}
            handleBackBtnClick={handleBackBtnClick}
            addToRefs={addToRefs}
            handleKeyDown={handleKeyDown}
            refBackButton={refBackButton}
          />
        )}
      </div>
    </div>
  </div>
  );
};

export default DropdownMenu;

DropdownMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      linkTitle: PropTypes.string,
      LinkUrl: PropTypes.string,
      dcpLink: PropTypes.string,
      iconUrl: PropTypes.string,
      linkTarget: PropTypes.bool
    })
  ).isRequired,
  userDataCheck: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
  }).isRequired,
};
