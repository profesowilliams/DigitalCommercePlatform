import { get } from "../../../../../utils/api";
import { RENEWAL_STATUS_ACTIVE } from "../../../../../utils/constants";

const awaitRequest = (fetch, delay) =>
  new Promise((resolve) => setTimeout(() => resolve(fetch()), delay));

export const getStatusLoopUntilStatusIsActive = async ({
  getStatusEndpoint,
  id,
  delay,
  iterations,
}) => {
  // make series of request not concurrently
  let isActive = false;
  for (const iteration of new Array(iterations)) {
    const { data } = await awaitRequest(
      () => get(`${getStatusEndpoint}?id=${id}`),
      delay
    );
    console.log("🚀data >>", data);
    if (data?.content?.status === RENEWAL_STATUS_ACTIVE) {
      isActive = true;
      break;    
    }
  }
  return isActive;
};
