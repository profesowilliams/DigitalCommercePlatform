import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { signOut } from "../../../../utils";
import SubHeaderMenuContainer from "../ProfileMegaMenu/SubHeaderMenuContainer";
import SecondaryMenu from "../ProfileMegaMenu/SecondaryMenu";
import { hasDCPAccess } from "../../../../utils/user-utils";
import * as DataLayerUtils from "../../../../utils/dataLayerUtils";

const DropdownMenu = ({ items, userDataCheck, config, dropDownData }) => {
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

  useEffect(() => {
    window.addEventListener('resize', updateWindowDimensions);
    updateWindowDimensions();
    
    return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    }
  }, []);

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
      config?.isPrivatePage ?? null
    );
  };

  const setRefBackButton = () => {
    refBackButton.current.focus();
  };

  return (
    <>
      <button
        data-component="DropdownMenu"
        className={`cmp-sign-in-button clicked ${userId ? "active" : ""}`}
        ref={(o) => (refLogIn.current = o)}
        onClick={(e) => {
          setIsSelected(e.type === 'click' && !showMenu);
          setShowMenu(!showMenu);
        }}
        onKeyDown={(e) => {
          refCursor.current = -1;
          handleKeyDown({e})
        }}
      >
        <svg width="26px" height="26px" viewBox="0 0 23 28" version="1.1">
          <g
            id="Symbols"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="---Nav----MASTHEAD----HOT"
              transform="translate(-1277.000000, -24.000000)"
            >
              <g id="Group" transform="translate(10.000000, 19.000000)">
                <g id="Sign-in" transform="translate(1268.000000, 6.000000)">
                  <g id="User-icon" transform="translate(0.000000, 0.000000)">
                    <path
                      d="M14.1066628,13.8666667 C13.2718607,14.4886235 12.3106118,14.8720486 11.2851279,14.8720486 L9.51487209,14.8720486 C8.48964109,14.8720486 7.52839218,14.4886235 6.69333722,13.8666667 C3.06937068,14.6983245 0.311059235,17.7376334 0,21.4427615 C2.5479039,24.2373782 6.26190059,26 10.4,26 C14.5383523,26 18.2520961,24.2373782 20.8,21.4427615 C20.4889408,17.7376334 17.7306293,14.6983245 14.1066628,13.8666667 Z"
                      id="Stroke-1"
                      stroke="#000C21"
                      strokeWidth="0.866666667"
                      fill="#000C21"
                    ></path>
                    <path
                      d="M11.2465116,13 L9.55348837,13 C7.14915349,13 5.2,9.79684906 5.2,7.35849057 L5.2,4.41509434 C5.2,1.97673585 7.14915349,0 9.55348837,0 L11.2465116,0 C13.6508465,0 15.6,1.97673585 15.6,4.41509434 L15.6,7.35849057 C15.6,9.79684906 13.6508465,13 11.2465116,13"
                      id="Fill-3"
                      fill="#000C21"
                    ></path>
                    <path
                      d="M11.2465116,13 L9.55348837,13 C7.14915349,13 5.2,9.79684906 5.2,7.35849057 L5.2,4.41509434 C5.2,1.97673585 7.14915349,0 9.55348837,0 L11.2465116,0 C13.6508465,0 15.6,1.97673585 15.6,4.41509434 L15.6,7.35849057 C15.6,9.79684906 13.6508465,13 11.2465116,13 Z"
                      id="Stroke-5"
                      stroke="#000C21"
                      strokeWidth="0.866666667"
                    ></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
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
    </>
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
