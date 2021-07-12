import { getUser } from "./index";

export const redirectUnauthenticatedUser = (authUrl, clientId) => {
    let authUrlLocal = authUrl + "?redirect_uri=" + window.location.href;
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
    console.log(`signinCode is ${signinCode}`);
    console.log(`user is ${user}`);
    console.log(`isPrivatePage is ${isPrivatePage}`);
    console.log(`isEditMode is ${isEditMode}`);

    return user || signinCode || !isPrivatePage || isEditMode
        ? refreshPage()
        : redirectUnauthenticatedUser(authUrl, clientId);
};

export const refreshPage = () => {
    const { search, origin, pathname } = window.location;
    if (search) window.location.href = `${origin}${pathname}`;
    return true;
};
