import { usGet } from "../../../../../../utils/api";
import { getUrlParams } from '../../../../../../utils';

export async function fetchData(config) {
  const { id = '' } = getUrlParams();

  try {
    const result = await usGet(
      `${config.uiServiceEndPoint}/v3/orderdetails/${id}/lines`
    );
    return result;
  } catch (error) {
    console.error('🚀error on orders tracking details grid >>', error);
  }
}