import { usGet } from "../../../../../utils/api";
import { buildQueryString } from '../../OrdersTrackingGrid/utils/gridUtils'; // move to common
import { getHeaderInfo } from '../../../../../utils/headers/get';

// Define the dictionaries that need to be translated
const translationDictionaries = [
  'OrderTracking.Common.InvoicesFlyout',
  'OrderTracking.Common.DnoteFlyout',
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
];

//TODO: move to common, the same method is in Details Page
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