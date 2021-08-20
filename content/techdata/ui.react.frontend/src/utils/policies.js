import { getUser } from "./index";

export const redirectUnauthenticatedUser = (authUrl, clientId) => {

    let incomingHostname = window.location.host;
    // colon separated shop domain names
    let shopDomainNamesList = "shop.cstenet.com:shop.techdata.com:shop.dev.web.us.tdworldwide.com:shop-rc.cstenet.com:pilot.techdata.com";
    let redirectUri = window.location.href;
    if((incomingHostname.indexOf("shop") >= 0 || incomingHostname.indexOf("pilot") >= 0) && shopDomainNamesList.indexOf(incomingHostname) >= 0) {
        redirectUri = "https://" + incomingHostname + "/oauth";
    }
    let authUrlLocal = authUrl + "?redirect_uri=" + redirectUri;
    authUrlLocal = authUrlLocal + "&client_id=" + clientId;
    authUrlLocal = authUrlLocal + "&response_type=code";
    authUrlLocal = authUrlLocal + "&pfidpadapterId=ShieldBaseAuthnAdaptor";

    window.location.href = authUrlLocal;
};

export const isAuthenticated = (authUrl, clientId, isPrivatePage) => {
    const user = getUser();
    const signinCode = localStorage.getItem("signInCode");

    const getIsEditMode = () => {
        return window.location.href.includes("editor.html");
    }

    const isEditMode = getIsEditMode();

    return user || signinCode || !isPrivatePage || isEditMode
        ? null
        : redirectUnauthenticatedUser(authUrl, clientId);
};

export const refreshPage = () => {
    const { search, origin, pathname } = window.location;
    if (search) window.location.href = `${origin}${pathname}`;
    return true;
};
