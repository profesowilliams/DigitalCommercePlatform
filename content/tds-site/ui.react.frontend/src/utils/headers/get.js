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

function resolveAcceptLanguage(language, country) {
    const collectiveCountry = country === "UK" ? "GB" : country;
    return language + "-" + collectiveCountry;
}