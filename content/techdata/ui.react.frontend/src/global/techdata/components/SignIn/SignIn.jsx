import React, { useEffect, useState } from "react";
import { bindActionCreators } from "redux";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  isAlreadySignedIn,
  signInAsynAction,
} from "../../../../store/action/authAction";
import {
  getQueryStringValue,
  toggleLangNavigation,
} from "../../../../utils/utils";
import {
  isAuthenticated,
  redirectUnauthenticatedUser,
} from "../../../../utils/policies";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import SpinnerCode from "../spinner/spinner";
import { usPost } from "../../../../utils/api";
import {
  signOutBasedOnParam,
  signOutForExpiredSession,
} from "../../../../utils";
import * as DataLayerUtils from "../../../../utils/dataLayerUtils";

const FA = require("react-fontawesome");

const SignIn = (props) => {
  const ACTION_QUERY_PARAM = "action";
  const ACTION_QUERY_PARAM_LOGOUT_VALUE = "logout";
  const ACTION_QUERY_PARAM_DELIMITER = "|";
  const REDIRECT_URL_QUERY_PARAM = "redirectUrl";
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const configDataAEM = JSON.parse(props.componentProp);
  let dropDownData = undefined;
  if (props.aemDataSet && props.aemDataSet.dropdownlinks) {
    dropDownData = JSON.parse(props.aemDataSet.dropdownlinks);
  }
  const { auth } = useSelector((state) => {
    return state;
  });

  const codeQueryParam = "code";
  const {
    authenticationURL: authUrl,
    uiServiceEndPoint,
    clientId,
    logoutURL,
    items,
    isPrivatePage,
    editMode,
    shopLoginRedirectUrl,
    pingLogoutURL,
    errorPageUrl,
    shopLogoutRedirectUrl,
  } = configDataAEM;
  const requested = props.data.auth.requested;
  const isError = props.data.auth.showError;
  const isLoading = props.data.auth.loading;
  const userData = props.data.auth.userData;
  let userDataCheck = populateLoginData();

  function populateLoginData() {
    let userDataCheck = Object.keys(userData).length
      ? userData
      : JSON.parse(localStorage.getItem("userData"));
    if (window.SHOP && window.SHOP.authentication) {
      // call SHOP redirectAuth API on load to makesure to refresh login in SHOP
      //             window.SHOP.authentication.redirectToLoginIfNeeded();
      if (window.SHOP.authentication.isAuthenticated()) {
        // read from shop datalayer window.SHOP.dataLayer.User
        userDataCheck = {
          email: window.SHOP.dataLayer.User.email,
          firstName: window.SHOP.dataLayer.User.contactFirstName,
          id: window.SHOP.dataLayer.User.ecid,
          lastName: window.SHOP.dataLayer.User.contactLastName,
          phone: null,
        };
      }
    }
    return userDataCheck;
  }

  const redirectIfActionParameter = (
    pingLogoutURL,
    errorPageUrl,
    logoutURL
  ) => {
    //ideally this would call the signout button, but due to seeing inconsistency in how the
    // flow is handled, going to include this method for temporarily.
    //This will only get triggered if the query params are sent via shop
    if (window.location.search) {
      let actionParam = getQueryStringValue(ACTION_QUERY_PARAM);
      if (
        actionParam &&
        actionParam.startsWith(ACTION_QUERY_PARAM_LOGOUT_VALUE)
      ) {
        let actionParamValues = actionParam.split(ACTION_QUERY_PARAM_DELIMITER);

        if (actionParamValues.length > 0) {
          let redirectUrl =
            actionParamValues.length > 1 ? actionParamValues[1] : "";
          if (redirectUrl) {
            //what if redirectUrl value is non existent? Then logout will not occurr???
            let logOutCompleteUrl = `${pingLogoutURL}?TargetResource=${redirectUrl}&InErrorResource=${errorPageUrl}`;
            signOutBasedOnParam(
              logoutURL,
              pingLogoutURL,
              errorPageUrl,
              redirectUrl,
              true /*ignore AEM round trip redirect*/
            );
          }
        }
      }
    }
  };

  /**
   *
   * SessionMaxTimeout - MAX_TIMEOUT on PING that keeps the active logged-in user alive
   * SessionIdleTimeout - IDLE_TIMEOUT on PING that keeps the inactive logged-in user alive
   *
   * If user sessionId exist then
   *      if sessionMaxTimeout is before currentTime or sessionIdleTimeout is before currentTime
   *          then initiate user logout
   */
  const isSessionExpired = () => {
    try {
      let sessionId = localStorage.getItem("sessionId");
      if (sessionId) {
        let sessionMaxTimeout = localStorage.getItem("sessionMaxTimeout");
        let sessionIdleTimeout = localStorage.getItem("sessionIdleTimeout");
        // Below is added for missing sessionMaxTimeout/sessionIdleTimeout localstorage esp for existing login sessions
        if (!sessionMaxTimeout) return true;
        var sessionMaxTimeoutInt = parseInt(sessionMaxTimeout);
        var sessionIdleTimeoutInt = parseInt(sessionIdleTimeout);
        var currentTime = new Date().valueOf();
        // checking if session expiration is before curr time
        if (
          sessionMaxTimeoutInt < currentTime ||
          (sessionIdleTimeoutInt && sessionIdleTimeoutInt < currentTime)
        ) {
          return true;
        }
      }
    } catch (e) {
      console.error("invalid login session expiration", e);
      return true;
    }
    return false;
  };

  function showHideElements() {
    toggleLangNavigation(isAlreadySignedIn());
  }

  useEffect(() => {
    if (isSessionExpired()) {
      signOutForExpiredSession();
    }
    redirectIfActionParameter(pingLogoutURL, errorPageUrl, logoutURL);
    localStorage.setItem("signin", constructSignInURL());
    isCodePresent();
    routeChange();
    isAuthenticated(authUrl, clientId, isPrivatePage, shopLoginRedirectUrl);

    // redirecting the non-dcp logged in user to home page
    if(isPrivatePage && localStorage.getItem("sessionId") && localStorage.getItem("userData")) {
        if(localStorage.getItem("userData").indexOf('"dcpAccess":true') < 0) {
            window.location.replace(window.location.origin);
        }
    }
    showHideElements();
  }, []);

  const isCodePresent = () => {
    let signInCode = null;
    // SigIn Code Check from Local Storage
    let codeFromLocalStorage = localStorage.getItem("signInCode");
    if (codeFromLocalStorage) {
      signInCode = codeFromLocalStorage;
    }
    // SigIn Code Check from URL
    if (window.location.search) {
      let getCode = getQueryStringValue(codeQueryParam);
      localStorage.setItem("signInCode", getCode);
      signInCode = getCode;
    }
    return signInCode;
  };

  const constructSignInURL = () => {
    let signInURL = "";
    signInURL = signInURL + uiServiceEndPoint;
    return signInURL;
  };

  const onSignIn = () => {
    DataLayerUtils.pushEvent("clickInfo", {
      carouselName: "",
      mastheadlevel: "",
      name: "Sign in",
      selectionDepth: "",
      type: "button",
    });
    redirectUnauthenticatedUser(authUrl, clientId, shopLoginRedirectUrl);
  };

  const routeChange = () => {
    let params = getQueryStringValue(codeQueryParam);
    if (params) {
      localStorage.setItem("signin", constructSignInURL());
      if (!isAlreadySignedIn()) {
        dispatch(signInAsynAction(constructSignInURL()));
      }
    } else {
    }
  };

  const signInButton = () => {
    return (
      <button className="cmp-sign-in-button" onClick={onSignIn}>
        {isAuthenticated === null ? (
          <svg width="26px" height="26px" viewBox="0 0 23 28" version="1.1">
            <g
              id="Symbols"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
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
                        stroke-width="0.866666667"
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
                        stroke-width="0.866666667"
                      ></path>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        ) : (
          <svg width="26px" height="26px" viewBox="0 0 23 28" version="1.1">
            <g
              id="Symbols"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <g
                id="---Nav----MASTHEAD----HOT"
                transform="translate(-1277.000000, -24.000000)"
                stroke="#000C21"
                stroke-width="0.866666667"
              >
                <g id="Group" transform="translate(10.000000, 19.000000)">
                  <g id="Sign-in" transform="translate(1268.000000, 6.000000)">
                    <g id="User-icon" transform="translate(0.000000, 0.000000)">
                      <path
                        d="M14.1066628,13.8666667 C13.2718607,14.4886235 12.3106118,14.8720486 11.2851279,14.8720486 L9.51487209,14.8720486 C8.48964109,14.8720486 7.52839218,14.4886235 6.69333722,13.8666667 C3.06937068,14.6983245 0.311059235,17.7376334 0,21.4427615 C2.5479039,24.2373782 6.26190059,26 10.4,26 C14.5383523,26 18.2520961,24.2373782 20.8,21.4427615 C20.4889408,17.7376334 17.7306293,14.6983245 14.1066628,13.8666667 Z"
                        id="Stroke-1"
                      ></path>
                      <path
                        d="M11.2465116,13 L9.55348837,13 C7.14915349,13 5.2,9.79684906 5.2,7.35849057 L5.2,4.41509434 C5.2,1.97673585 7.14915349,0 9.55348837,0 L11.2465116,0 C13.6508465,0 15.6,1.97673585 15.6,4.41509434 L15.6,7.35849057 C15.6,9.79684906 13.6508465,13 11.2465116,13 Z"
                        id="Stroke-5"
                      ></path>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        )}
        {configDataAEM.label}
      </button>
    );
  };

  return (
    <div className="cmp-sign-in">
      <div className="cmp-sign-in-option">
        {requested ? (
          "Loading..."
        ) : userDataCheck !== null ? (
          <DropdownMenu
            userDataCheck={userDataCheck}
            dropDownData={dropDownData}
            items={items}
            config={configDataAEM}
          />
        ) : (
          signInButton()
        )}
        {isError && isLoading ? <SpinnerCode /> : null}
      </div>
    </div>
  );
};

// Pushing states into props
const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

// The Data coming from Action is getting added into props by the below function
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      signInAsynAction,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
