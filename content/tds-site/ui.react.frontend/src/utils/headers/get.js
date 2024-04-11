export function getHeaderInfo() {
  return getHeaderInfoFromUrl(window.location.pathname);
}

export function getHeaderInfoFromUrl(pathName) {
  const authorMode = !(
    typeof Granite === 'undefined' || typeof Granite.author === 'undefined'
  );
  const isLocalhost = window.location.href.includes('localhost');

  if (authorMode || isLocalhost)
    return {
      site: 'UK',
      language: 'en',
      acceptLanguage: 'en-GB',
      salesLogin: undefined,
    };

  try {
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
    const language = pathArray[languageIndex].toLowerCase();
    const salesLogin = lowerCaseParams.has('saleslogin') ? lowerCaseParams.get('saleslogin') : undefined;

    return {
      site: country,
      language: language,
      acceptLanguage: resolveAcceptLanguage(language, country),
      salesLogin: salesLogin
    };
  } catch (error) {
    console.log("Exception while getting country and language from url: " + error);
  }
}

export function resolveAcceptLanguage(language, country) {
  language = language.toLowerCase();
  country = country.toUpperCase();

  const collectiveCountry = country === 'UK' ? 'GB' : country;

  let collectiveLanguage = language;
  if (country === 'BE')
    collectiveLanguage = 'en';
  else if (country === 'NO' && language === 'no')
    collectiveLanguage = 'nn';

  return collectiveLanguage + '-' + collectiveCountry;
}