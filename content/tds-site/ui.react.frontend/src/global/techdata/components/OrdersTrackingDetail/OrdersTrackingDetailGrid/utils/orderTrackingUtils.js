import { usGet } from "../../../../../../utils/api";
import { getUrlParams } from '../../../../../../utils';

export async function fetchData(config) {
  const { id = '' } = getUrlParams();

  try {
    const result = await usGet(
      `${config.uiCommerceServiceDomain}/v3/orderdetails/${id}/lines`
    );
    return result;
  } catch (error) {
    console.error('🚀error on orders tracking details grid >>', error);
  }
}

export async function fetchOrderDetailsData(config) {
  const { id = '' } = getUrlParams();

  try {
    const result = await usGet(
      `${config.uiCommerceServiceDomain}/v3/orderdetails/${id}`
    );
    return result;
  } catch (error) {
    console.error('🚀error on orders tracking details grid >>', error);
  }
}

export async function fetchOrderLinesData(config, orderNo) {
  try {
    const result = await usGet(
      `${config.uiCommerceServiceDomain}/v3/order/${orderNo}/lines`
    );
    return result;
  } catch (error) {
    console.error('🚀error on orders tracking details grid >>', error);
  }
}