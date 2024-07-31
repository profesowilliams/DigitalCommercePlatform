import { buildQueryString } from './urlUtils';
import { getHeaderInfo } from '../../../../../utils/headers/get';
import { usGet } from "../../../../../utils/api";

// Define the dictionaries that need to be translated
const translationDictionaries = [
  'OrderTracking.Common.ErrorMessages',
  'OrderTracking.Common.InvoicesFlyout',
  'OrderTracking.Common.DnoteFlyout'
];

/**
 * Fetches UI translations from the localization service.
 *
 * @param {string} baseUrl - The base URL of the localization service.
 * @param {Array} dictionaries - An array of dictionaries to fetch translations for.
 * @returns {Promise<Object>} A promise that resolves to the translation data.
 */
export async function fetchTranslations(baseUrl, dictionaries) {
  // Make a GET request to the localization service with the constructed query string
  const results = await usGet(
    `${baseUrl}/v1` +
    buildQueryString(dictionaries.concat(translationDictionaries)) +
    `&cacheInSec=900&country=` + getHeaderInfo().acceptLanguage
  );

  // Return the translation data from the response
  return results.data;
};
