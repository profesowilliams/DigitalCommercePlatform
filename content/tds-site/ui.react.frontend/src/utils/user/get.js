import { uiServiceDomain, getUserEndpoint } from "../intouchUtils";

export const headerInfo = getHeaderInfo();
let userDataPromise = null;
let cachedUserData = null;
let cacheExpiration = null;
const CACHE_DURATION = 600; // TODO: value should be configurable

export async function getSessionInfo() {
    let authorMode = !(typeof Granite === 'undefined' || typeof Granite.author === 'undefined');
    if (authorMode)
        return [false, null];

    let isLoggedIn;
    let userData;
    let data;

    try {
        data = await getUserData();
    } catch (error) {
        data = null;
    }

    isLoggedIn = !!data;
    userData = data;

    return [isLoggedIn, userData];
}

export function getHeaderInfo() {
    let authorMode = !(typeof Granite === 'undefined' || typeof Granite.author === 'undefined');
    if (authorMode)
        return {
            site: "UK",
            language: "en",
            acceptLanguage: "en-GB",
            salesLogin: undefined
        };

    try {
        const pathName = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);
        const lowerCaseParams = new URLSearchParams();
        for (const [name, value] of urlParams) {
            lowerCaseParams.append(name.toLowerCase(), value);
        }

        let countryIndex = 1; // uat/stage/prod
        let languageIndex = 2;
        const pathArray = pathName?.split("/");
        if (pathArray && pathArray.length >= 5 && pathArray[1] === "content") {
            countryIndex = 4; // dit/sit
            languageIndex = 5;
        }

        const country = pathArray[countryIndex].toUpperCase();
        const language = pathArray[languageIndex];
        const salesLogin = lowerCaseParams.has('saleslogin') ? lowerCaseParams.get('saleslogin') : undefined;

        return {
            site: country,
            language: language.toUpperCase(),
            acceptLanguage: resolveAcceptLanguage(language, country),
            salesLogin: salesLogin
        };
    } catch (error) {
        console.log("Exception while getting country and language from url: " + error);
    }
}

async function getUserData() {
    let authorMode = !(typeof Granite === 'undefined' || typeof Granite.author === 'undefined');
    if (authorMode)
        return null;

    if (cachedUserData && Date.now() < cacheExpiration) {
        console.log(
            "Returning user data from local cache cacheExpiration = " +
            new Date(cacheExpiration)
        );
        return cachedUserData;
    }

    if (userDataPromise) {
        return await userDataPromise;
    }

    try {
        let headers = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": headerInfo.acceptLanguage,
            "Consumer": "AEM",
            "Site": headerInfo.site,
            "TraceId": new Date().toISOString()
        };
        headerInfo.salesLogin && (headers["SalesLogin"] = headerInfo.salesLogin);

        let userDataPromise = fetch(
            uiServiceDomain() + getUserEndpoint(),
            {
                headers: headers,
                body: null,
                method: "GET",
                credentials: "include",
            }
        );

        const response = await userDataPromise;

        if (response.ok) {
            const data = await response.json();
            cachedUserData = data.content.user;
            cacheExpiration = Date.now() + CACHE_DURATION * 1000;
            console.log("Returned user data from API call");
            return cachedUserData;
        } else {
            console.log("HTTP-Error: " + response.status);
            throw new Error(response.status);
        }
    } catch (error) {
        console.log("Exception while getting user data: " + error);
        throw new Error(401);
    }

    throw new Error(401);
}

function resolveAcceptLanguage(language, country) {
    let authorMode = !(typeof Granite === 'undefined' || typeof Granite.author === 'undefined');
    if (authorMode)
        return "en-GB";

    const collectiveCountry = country === "UK" ? "GB" : country;
    return language + "-" + collectiveCountry;
}