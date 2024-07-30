import { usGet } from "../../../../../../utils/api";

export async function fetchData(config, id) {
  console.log('OrderTrackingDetailHeader::Utils::fetchData');
  try {
    const result = await usGet(
      `${config.uiCommerceServiceDomain}/v3/orderdetails/${id}/lines`
    );
    return result;
  } catch (error) {
    console.error('OrderTrackingDetailHeader::fetchData::error', error);
    return null;
  }
}