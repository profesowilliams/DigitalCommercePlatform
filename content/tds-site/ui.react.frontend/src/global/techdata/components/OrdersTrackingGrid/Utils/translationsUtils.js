import { fetchTranslations } from '../../OrdersTrackingCommon/Utils/translationsUtils';

// Define the dictionaries that need to be translated
const translationDictionaries = [
  'OrderTracking.FreetextSearchFields',
  'OrderTracking.MainGrid',
  'OrderTracking.MainGrid.Items',
  'OrderTracking.MainGrid.OrderLineDropdown',
  'OrderTracking.MainGrid.Filters',
  'OrderTracking.MainGrid.Reports',
  'OrderTracking.MainGrid.Search',
  'OrderTracking.MainGrid.Export',
  'OrderTracking.MainGrid.OrderModify',
  'OrderTracking.MainGrid.SettingsFlyout',
  'OrderTracking.MainGrid.NoAccessScreen',
  'OrderTracking.MainGrid.Pagination',
  'OrderTracking.MainGrid.SearchNoResult',
  'OrderTracking.MainGrid.ProductReplacmentFlyout',
  'OrderTracking.MainGrid.OrderStatuses',
  'OrderTracking.MainGrid.Expand.NotShippedTab',
  'OrderTracking.MainGrid.Expand.ShippedTab',
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
  // Set the document title using the translation for 'OrderTracking.MainGrid.Title'
  document.title = translations['OrderTracking.MainGrid']?.Title;
}