import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
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
import { isEnableEntitlementCountryValidation, isExtraReloadDisabled, isHttpOnlyEnabled } from "../../../../utils/featureFlagUtils";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import SpinnerCode from "../spinner/spinner";
import { usPost, USaxios, generateTraceId } from "../../../../utils/api";
import {
  signOutBasedOnParam,
  signOutForExpiredSession,
} from "../../../../utils";
import * as DataLayerUtils from "../../../../utils/dataLayerUtils";
import {useStore} from "../../../../utils/useStore";
import { triggerEvent } from "../../../../utils/events";
import axios from 'axios';
import Modal from '../Modal/Modal';
import { initializeSession } from "./ecommerceAuthentication";
import { hasDCPAccess } from "../../../../utils/user-utils";

const FA = require("react-fontawesome");

const ExposeSigninStatus = forwardRef((props, ref) => {
  const isLoggedIn = useStore(state => state.isLoggedIn);
  const userData = useStore(state => state.userData);
  useImperativeHandle(ref, () => ({
      getLoginStatus() {
        return isLoggedIn;
      },
      getUserId() {
        return userData.id;
      }
  }));
  return (
      null
  );
});

const SignIn = (props) => {
  const ACTION_QUERY_PARAM = "action";
  const ACTION_QUERY_PARAM_LOGOUT_VALUE = "logout";
  const ACTION_QUERY_PARAM_LOGIN_VALUE = "login";
  const ACTION_QUERY_PARAM_DELIMITER = "|";
  const REDIRECT_URL_QUERY_PARAM = "redirectUrl";
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [modelComponent, setModelComponent] = useState(null);
  let tempProperties = {
    title:  'Error'
  };

  const configDataAEM = JSON.parse(props.componentProp);
  let dropDownData = undefined;
  if (props.aemDataSet && props.aemDataSet.dropdownlinks) {
    dropDownData = JSON.parse(props.aemDataSet.dropdownlinks);
  }
  const { auth } = useSelector((state) => {
    return state;
  });

  const isLoggedIn = useStore(state => state.isLoggedIn);
  const setUserData = useStore((state) => state.setUserData);
  const changeLoggedInState = useStore((state) => state.changeLoggedInState)

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
    errorMessage,
    shopLogoutRedirectUrl,
    hideWhenNotLoggedIn,
    hideWhenLoggedIn,
    showLabel,
    userEndpoint,
    ecommerceAuthenticationLoginEndpoint,
  } = configDataAEM;
  const requested = props.data.auth.requested;
  const [isError, setIsError] = useState(isHttpOnlyEnabled() || isExtraReloadDisabled() ? false : props.data.auth.showError);
  const [isLoading, setIsLoading] = useState(isHttpOnlyEnabled() || isExtraReloadDisabled() ? false : props.data.auth.loading);
  const userDataLS = props.data.auth.userData;
  const userData = useStore(state => state.userData);
  const [userDataCheck, setUserDataCheck] = useState(populateLoginData());

  useEffect(() => {
    if (!isHttpOnlyEnabled() && !isExtraReloadDisabled()) {
      setIsError(props.data.auth.showError);
    }
  }, [props.data.auth.showError]);

  useEffect(() => {
    if (!isHttpOnlyEnabled() && !isExtraReloadDisabled()) {
      setIsLoading(props.data.auth.loading);
    }
  }, [props.data.auth.loading]);


  function removeParam(key) {
    const newUrl = new URL(window.location);

    newUrl.searchParams.delete(key)

    window.history.pushState({}, "", newUrl);
  }

  function populateLoginData() {
    let userDataCheck = Object.keys(userDataLS).length
      ? userDataLS
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
      console.log('🚀actionParam >>',actionParam);
      if (
        actionParam &&
        actionParam.startsWith(ACTION_QUERY_PARAM_LOGOUT_VALUE)
      ) {
        handleLogoutAction(actionParam, logoutURL, pingLogoutURL, errorPageUrl);
      } else if (actionParam && actionParam.startsWith(ACTION_QUERY_PARAM_LOGIN_VALUE)) {
        handleLoginAction(actionParam, authUrl, clientId);
      }
    }
  };
  function handleLogoutAction(actionParam, logoutURL, pingLogoutURL, errorPageUrl) {
    let actionParamValues = actionParam.split(ACTION_QUERY_PARAM_DELIMITER);
    if (actionParamValues.length > 0) {
      let redirectUrl =
        actionParamValues.length > 1 ? actionParamValues[1] : "";
      if (redirectUrl) {
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

  function handleLoginAction(actionParam, authUrl, clientId) {
    let actionParamValues = actionParam.split(ACTION_QUERY_PARAM_DELIMITER);
    if (actionParamValues.length > 0) {
      let redirectUrl = actionParamValues.length > 1 ? actionParamValues[1] : "";
      if(redirectUrl) {
          if(!localStorage.getItem("sessionId")) {
            localStorage.setItem("redirectUrl", redirectUrl);
            // for not logged in user - then authenticate and store redirectUrl(shop) to localStorage
            redirectUnauthenticatedUser(authUrl, clientId, shopLoginRedirectUrl);
          }
      }
    }
  }

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
      //If we have http only enabled on feature flags, the expiring is being controlled via backend with the cookie 
      if (isHttpOnlyEnabled()) return false;  
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
      } else {
        return window.location.href?.indexOf('/dashboard.html') > 0; // if sessionId does not exist then return isSessionExpired = true for dashboard components
      }
    } catch (e) {
      console.error("invalid login session expiration", e);
      return true;
    }
    return false;
  };

  function showHideElements() {
    toggleLangNavigation(isAlreadySignedIn(userData));
  }

  function hideDropdownButton() {
    const hideDropdownEle = document.querySelectorAll('.cmp-button__dropdown[data-hide-dropdown="true"]');
    hideDropdownEle && hideDropdownEle.forEach(function(val){
        val.closest('.dropdownbutton').classList.add('hidden');
    })
  }

  const handleLoginResponse = (userData) => {
    changeLoggedInState(true);

    triggerEvent('user:loggedIn');

    if(!isEnableEntitlementCountryValidation()) {
      // handle country redirection
      redirectBasedOnCountry(userData);
    }
  }

  const updateLoginStyles = () => {
    document.querySelector('.cmp-tds-site-header')?.classList.add('loggedin');
    hideDropdownButton();
  }

  const handleLoginRedirection = () => {
    if (isSessionExpired()) {
      signOutForExpiredSession(authUrl, clientId);
    }
    console.log('🚀pingLogoutURL, errorPageUrl, logoutURL >>',pingLogoutURL, errorPageUrl, logoutURL);
    redirectIfActionParameter(pingLogoutURL, errorPageUrl, logoutURL);
    localStorage.setItem("signin", constructSignInURL());
    isCodePresent();
    routeChange(handleLoginResponse);

    if (isHttpOnlyEnabled() || isExtraReloadDisabled()) {
      if (isLoggedIn) {
        updateLoginStyles();
      }
    }
    else {
      const isLoggedInLS = isAuthenticated(authUrl, clientId, isPrivatePage, shopLoginRedirectUrl);

      if (isLoggedInLS === null  && localStorage.getItem("sessionId")) {
        updateLoginStyles();
      }
    }

    if(isExtraReloadDisabled()){
      let sessionId = localStorage.getItem("sessionId");

      if(sessionId) {
        axios.defaults.headers.common['SessionId'] = sessionId;
        USaxios.defaults.headers.common['SessionId'] = sessionId;
      }
    }

    //if isExtraReloadDisabled or isHttpOnlyEnabled is true then use the isloggedin and userData from the store, if not then use the localstorage
    const currentLoggedInState = isExtraReloadDisabled() || isHttpOnlyEnabled() ? isLoggedIn : localStorage.getItem("isLoggedIn");
    const currentUserData = isExtraReloadDisabled() || isHttpOnlyEnabled() ? userData : localStorage.getItem("userData") ? JSON.parse(localStorage.getItem('userData')) : null;

    // redirecting the non-dcp logged in user to home page
    if(isPrivatePage && currentLoggedInState && currentUserData) {
      console.log("LOGIN_>", currentUserData, hasDCPAccess(currentUserData));
        if(hasDCPAccess(currentUserData)) {
            //  ----.indexOf('"dcpAccess":true') < 0) {
            window.location.replace(window.location.origin);
        }
    }

    if(!isEnableEntitlementCountryValidation()) {
      // handle country redirection
      redirectBasedOnCountry();
    }
    showHideElements();
  }

  //if(!isEnableEntitlementCountryValidation()) { START
  const redirectBasedOnCountry = (userData) => {
    let currentUserData;
    if (isExtraReloadDisabled() || isHttpOnlyEnabled()) {
      currentUserData = userData;
    }
    else {
      currentUserData = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem('userData')) : null
    }
    if(currentUserData?.country) {
        let countryCodeFromAPI = "/" + currentUserData?.country.toLowerCase() + '/' + "en";
        if(window.location.href.indexOf(countryCodeFromAPI) < 0) {
            validateCountryFromUrlAndAPI(countryCodeFromAPI);
        }
    }
  }
  const validateCountryFromUrlAndAPI = (countryCodeFromAPI) => {
    let urlSplitStrings = window.location.href.replace(window.location.origin,"").split('/');
    let countryCodeFromUrl = "/" + urlSplitStrings[1] + "/" + urlSplitStrings[2];
    if(window.location.href.indexOf("/content") >= 0) { // added this to support sit/dit envs
        performRedirectForCmsPath(countryCodeFromAPI, countryCodeFromUrl, urlSplitStrings);
    } else {
        performRedirectForAbsPath(countryCodeFromAPI, countryCodeFromUrl, urlSplitStrings);
    }
  }
  const performRedirectForAbsPath = (countryCodeFromAPI, countryCodeFromUrl, urlSplitStrings) => {
    if(urlSplitStrings.length <= 3) { // add .html to the url
        if(urlSplitStrings[2] === undefined) {
            countryCodeFromUrl = "/" + urlSplitStrings[1];
        }
        countryCodeFromAPI =  countryCodeFromAPI + ".html";
    }
    performRedirect(countryCodeFromUrl, countryCodeFromAPI);
  }
  const performRedirectForCmsPath = (countryCodeFromAPI, countryCodeFromUrl, urlSplitStrings) => {
     countryCodeFromUrl = "/" + urlSplitStrings[4] + "/" + urlSplitStrings[5];
        if(urlSplitStrings.length === 6) { // add .html to the url
         countryCodeFromAPI =  countryCodeFromAPI + ".html";
    }
    performRedirect(countryCodeFromUrl, countryCodeFromAPI);
  }
  const performRedirect = (countryCodeFromUrl, countryCodeFromAPI) => {
      console.log("countryCodeFromUrl == " + countryCodeFromUrl);
      console.log("countryCodeFromAPI == " + countryCodeFromAPI);
      if(countryCodeFromAPI.indexOf(countryCodeFromUrl) < 0) {
          let resultantRedirectUrl = window.location.href.replace(countryCodeFromUrl, countryCodeFromAPI);
          window.location.href = resultantRedirectUrl;
      }
  }
  //if(!isEnableEntitlementCountryValidation()) { END

  const checkSessionStatus = async (shouldLogin) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const userData = await initializeSession(
        userEndpoint,
        ecommerceAuthenticationLoginEndpoint,
        shouldLogin
      );
      if (userData) {
        handleLoginResponse(userData);
        handleLoginRedirection();
        setUserDataCheck(userData);
        setUserData(userData);
        updateLoginStyles();

        const traceId = generateTraceId(userData);

        axios.defaults.headers.common['TraceId'] = traceId;
        USaxios.defaults.headers.common['TraceId'] = traceId;
      }

      setIsLoading(false);
    } catch (error) {
      setIsError(true);
    }
  };

  useEffect(() => {
    if (isExtraReloadDisabled() || isHttpOnlyEnabled()) {
      checkSessionStatus(isPrivatePage);
    } else {
      handleLoginRedirection();
      const originalURL = window.location.href;

      if (isExtraReloadDisabled() && originalURL.indexOf(codeQueryParam) > -1) {
        const originalURL = window.location.href;
        removeParam(codeQueryParam, originalURL);
        handleLoginRedirection();
      }
    }
  }, []);

  const isCodePresent = () => {
    let signInCode = null;
    // SigIn Code Check from Local Storage
    let codeFromLocalStorage = localStorage.getItem("signInCode");
    if (codeFromLocalStorage) {
      signInCode = codeFromLocalStorage;
    }
    // SigIn Code Check from URL
    let searchValue = window.location.search;
    if (searchValue) {
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
    DataLayerUtils.pushEvent(DataLayerUtils.ANALYTICS_TYPES.events.click, {
      carouselName: "",
      mastheadlevel: "",
      name: DataLayerUtils.ANALYTICS_TYPES.name.logIn,
      selectionDepth: "",
      type: DataLayerUtils.ANALYTICS_TYPES.types.button,
      category: DataLayerUtils.ANALYTICS_TYPES.category.logIn,
    });
    if(isExtraReloadDisabled() || isHttpOnlyEnabled()) {
      checkSessionStatus(true);
    }
    else {
      redirectUnauthenticatedUser(authUrl, clientId, shopLoginRedirectUrl);
    }
  };

  const routeChange = (handleLoginResponse) => {
    let params = getQueryStringValue(codeQueryParam);
    if (params) {
      localStorage.setItem("signin", constructSignInURL());
      if (!isAlreadySignedIn(userData)) {
        dispatch(signInAsynAction(constructSignInURL(), handleLoginResponse));
      }
    }
  };
  
  const displayModel = () => {
    setModelComponent(
      <Modal
        modalContent={errorMessage}
        modalProperties={tempProperties}
        onModalClosed={() => setModelComponent(null)}
      >
      </Modal>
    )
  }

  const signInButton = () => {
    const currentLoggedInState = isHttpOnlyEnabled() || isExtraReloadDisabled() ? isLoggedIn : localStorage.getItem("sessionId");
    if(hideWhenNotLoggedIn === "true" && !currentLoggedInState) {
        return;
    } else
    return (
      <button className={isAuthenticated === null ? 'cmp-sign-in-button authenticated' : 'cmp-sign-in-button'} onClick={onSignIn}>
        <span className={showLabel === "true" ? '' : 'cmp-sign-in-button-hiddenLabel'}>{configDataAEM.label}</span>
      </button>
    );
  };

  return (
    <div className="cmp-sign-in">
      <div className="cmp-sign-in-option">
      <div className="cmp-sign-in-middle-div"></div>
      <ExposeSigninStatus ref={(exposeSigninStatus) => {window.exposeSigninStatus = exposeSigninStatus}}/>
      
        {requested ? (
          "Loading..."
        ) : userDataCheck !== null ? (
          !hideWhenLoggedIn && <DropdownMenu
            userDataCheck={userDataCheck}
            dropDownData={dropDownData}
            items={items}
            config={configDataAEM}
          />
        ) : (
          signInButton()
        )}       
        <Modal
          isModalVisible={isError && isLoading}
          modalContent={errorMessage}
          modalProperties={tempProperties}
      />
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