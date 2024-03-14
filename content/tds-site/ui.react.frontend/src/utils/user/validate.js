import { getHeaderInfo } from "../headers/get";

/* 
    Entry point for user-url validation

    Function validates:
        existing user (properties country & language) 
    and 
        url (country & language)

    When country or language is different redirect to correct url is triggered.
*/
export const validateCountryAndLanguage = (userData) => {
  // handle country redirection
  return redirectBasedOnCountry(userData);
}

const redirectBasedOnCountry = (userData) => {
  if (userData?.country && userData?.language) {
    let countryCodeFromAPI = '/' + userData?.country.toLowerCase() + '/' + userData?.language.toLowerCase();
    if (window.location.href.toLowerCase().indexOf(countryCodeFromAPI.toLowerCase()) < 0) {
      return validateCountryFromUrlAndAPI(countryCodeFromAPI);
    }
  } else {
    console.log("RedirectBasedOnCountry missing required data");
  }
  return false;
}

const validateCountryFromUrlAndAPI = (countryCodeFromAPI) => {
  let infoFromUrl = getHeaderInfo();
  console.log("validateCountryFromUrlAndAPI country = " + infoFromUrl.site + ", language = " + infoFromUrl.language);
  let countryCodeFromUrl = '/' + infoFromUrl.site + '/' + infoFromUrl.language;
  return performRedirect(countryCodeFromUrl, countryCodeFromAPI);
}

const performRedirect = (countryCodeFromUrl, countryCodeFromAPI) => {
  if (countryCodeFromAPI.toLowerCase().indexOf(countryCodeFromUrl.toLowerCase()) < 0) {
    let resultantRedirectUrl = window.location.href.toLowerCase().replace(countryCodeFromUrl.toLowerCase(), countryCodeFromAPI);
    console.log("performRedirect = " + resultantRedirectUrl);
    window.location.href = resultantRedirectUrl;
    return true;
  } else {
    console.log("performRedirect = skip");
    return false;
  }
}