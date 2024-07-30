import { fetchTranslations } from '../../OrdersTrackingCommon/Utils/translationsUtils';

// Define the dictionaries that need to be translated
const translationDictionaries = [
  'OrderTracking.Details',
  'OrderTracking.Details.Export',
  'OrderTracking.Details.Cards',
];

/**
 * Fetches translations and returns the translation data.
 *
 * @param {string} baseUrl - The base URL of the localization service.
 * @returns {Promise<Object>} A promise that resolves to the translation data.
 */
export async function getTranslations(baseUrl) {
  // Fetch translations using the provided base URL and predefined translation dictionaries
  return await fetchTranslations(baseUrl, translationDictionaries);
};

/**
 * Sets the document title based on the provided translations.
 *
 * @param {Object} translations - The translations object containing various localized strings.
 */
export function setDocumentTitle(translations) {
  // Set the document title using the translation for 'OrderTracking.Details.Title'
  document.title = translations['OrderTracking.Details']?.Title;
}