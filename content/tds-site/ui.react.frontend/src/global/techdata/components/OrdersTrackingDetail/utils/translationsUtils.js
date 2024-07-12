import { usGet } from "../../../../../utils/api";
import { buildQueryString } from '../../OrdersTrackingGrid/utils/gridUtils'; // move to common
import { getHeaderInfo } from '../../../../../utils/headers/get';

// Define the dictionaries that need to be translated
const translationDictionaries = [
  'OrderTracking.Details',
  'OrderTracking.Details.Export',
  'OrderTracking.Details.Cards'
];

/**
 * Fetches UI translations from the localization service.
 * @param {Object} config - Configuration object containing the domain information.
 * @returns {Object} - The fetched translation data.
 */
export async function fetchTranslations(config) {
  // Make a GET request to the localization service
  const results = await usGet(
    `${config.uiLocalizeServiceDomain}/v1` +
    buildQueryString(translationDictionaries) +
    `&cacheInSec=900&country=` + getHeaderInfo().acceptLanguage
  );

  // Return the translation data from the response
  return results.data;
};

export function setDocumentTitle(translations) {
  document.title = translations['OrderTracking.Details']?.Title;
}