import { usGet } from "../../../../../utils/api";

export async function fetchOrderDetailsData(config, id) {
  try {
    const result = await usGet(
      `${config.uiCommerceServiceDomain}/v3/orderdetails/${id}`
    );
    return result;
  } catch (error) {
    console.error('OrderTrackingDetailHeader::fetchOrderDetailsData::error', error);
    return null;
  }
}

export async function fetchNavigationData(config, queryCacheKeyParam, id) {
  console.log('OrderTrackingDetailHeader::Utils::fetchNavigationData');
  try {
    if (!queryCacheKeyParam || !id) return null;
    const results = await usGet(
      `${config.uiCommerceServiceDomain}/v3/cache/${queryCacheKeyParam}/order/${id}`
    );
    return results.data.content;
  } catch (error) {
    console.error('OrderTrackingDetailHeader::fetchNavigationData::error', error);
    return null;
  }
};

export async function fetchCriteriaData(config, queryCacheKeyParam) {
  console.log('OrderTrackingDetailHeader::Utils::fetchCriteriaData');
  try {
    if (!queryCacheKeyParam) return null;
    const results = await usGet(
      `${config.uiCommerceServiceDomain}/v3/cache/${queryCacheKeyParam}/criteria`
    );
    return results.data.content;
  } catch (error) {
    console.error('OrderTrackingDetailHeader::fetchCriteriaData::error', error);
    return null;
  }
};

export async function fetchFiltersRefinements(config) {
  console.log('OrderTrackingDetailHeader::Utils::fetchFiltersRefinements');

  try {
    const results = await usGet(
      `${config.uiCommerceServiceDomain}/v3/refinements`
    );

    return results.data.content;
  } catch (error) {
    console.error('OrderTrackingDetailHeader::fetchFiltersRefinements::error', error);
    return null;
  }
};