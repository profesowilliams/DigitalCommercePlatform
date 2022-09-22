import { getHeaderInfoFromUrl } from "../../../../../utils";
import { get, post } from "../../../../../utils/api";
import { GET_STATUS_FAILED, PROCESS_ORDER_FAILED, RENEWAL_STATUS_ACTIVE, UPDATE_FAILED } from "../../../../../utils/constants";
import { isHouseAccount } from "../../../../../utils/user-utils";

const awaitRequest = (fetch, delay) =>
  new Promise((resolve) => setTimeout(() => resolve(fetch()), delay));

const headerInfo = getHeaderInfoFromUrl(window.location.pathname);

const setAdditionalHeaders = (impersonationAccount) => {
  return (headerInfo.site?.toUpperCase() === "HK" || headerInfo.site?.toUpperCase() === "IN") && isHouseAccount() ? {headers: {impersonateAccount: impersonationAccount}} : {};
}

export const getStatusLoopUntilStatusIsActive = async ({
  getStatusEndpoint,
  id,
  delay,
  iterations
}, headers) => {
  // make series of request not concurrently
  let isActive = false;
  for (const iteration of new Array(iterations)) {
    const { data } = await awaitRequest(
      () => get(`${getStatusEndpoint}?id=${id}`, headers),
      delay
    );
    if (data?.content?.status === RENEWAL_STATUS_ACTIVE) {
      isActive = true;
      break;
    }
  }
  return isActive;
};

const extractRenewalData = (quote) => {
  const { contact, address } = quote;
  const { name, firstName, emailAddress, phoneNumber } = contact;
  const { city, country, county, countryCode, postalCode, line1, line2, line3, state } = address;
  const {address1, address2, address3} = address;
  return {
    contact: {
      name: name || firstName,
      email: emailAddress,
      phone: phoneNumber
    },
    address: {
      line1 : line1 || address1,
      line2 : line2 || address2,
      line3: line3 || address3,
      city,
      state,
      country,
      county,
      countryCode,
      postalCode
    }
  }
}

export const mapRenewalItemProducts = (items = []) => {
  const mapProduct = product => ({type:product?.type, id: product?.id });
  return items.map(item => ({
    id: item?.id,
    product: Array.isArray(item?.product) ? mapProduct(item?.product[1]) || {} : {},
    quantity: item?.quantity,
    unitPrice: item?.unitPrice
  }));
}

export const fetchQuoteRenewalDetails = async (renewalDetailsEndpoint, id , type) => {
  try {
    const details = await get(`${renewalDetailsEndpoint}?id=${id}`);
    if (!details) return false;
    return details.data;
  } catch (error) {
    console.log('error >>', error);
  }
}

export const mapRenewalForUpdateDashboard = (renewalQuote) => {
  const { source, reseller, endUser, customerPO } = renewalQuote;
  const items = mapRenewalItemProducts(renewalQuote.items);
  const { id } = source;
  const resellerData = extractRenewalData(reseller);
  const endUserData = extractRenewalData(endUser);
  return {
    source: { id },
    customerPO,
    reseller: { ...resellerData },
    endUser: { ...endUserData, name: endUser?.name },
    items
  }
}

export const extractDetailRenewalData = (quote) => {
  const { id, contact, address, vendorAccountNumber } = quote;
  const [_contact] = contact;
  return {
    id,
    contact: {
      name: _contact?.name?.text,
      email: _contact?.email?.text,
      phone: _contact?.phone?.text,
    },
    address: {
      line1: address?.line1?.text,
      line2: address?.line2?.text,
      line3: address?.line3?.text,
      city: address?.city?.text,
      state: address?.state?.text,
      postalCode: address?.postalCode?.text,
      country: address?.country?.text,
      county: address?.county?.text,
      countryCode: address?.countryCode?.text
    },
    vendorAccountNumber: vendorAccountNumber?.text,
  }
}

export const mapRenewalForUpdateDetails = (renewalQuote) => {
  const items = mapRenewalItemProducts(renewalQuote.items);
  const { endUser, reseller, customerPO, source } = renewalQuote;
  const resellerData = extractDetailRenewalData(reseller);
  const endUserData = extractDetailRenewalData(endUser);
  endUserData.name = endUserData.name;
  resellerData.vendorAccountNumber = reseller.vendorAccountNumber.text; 
  return {
    reseller: { ...resellerData },
    source: { id: source?.id },
    customerPO,
    endUser: { ...endUserData, name: endUser?.name?.text },
    items
  }
}

export async function handleOrderRequesting({ orderEndpoints, renewalData, purchaseOrderNumber }) {
  const { updateRenewalOrderEndpoint = "", getStatusEndpoint = "", orderRenewalEndpoint = "", } = orderEndpoints;
  if (!updateRenewalOrderEndpoint || !getStatusEndpoint || !orderRenewalEndpoint) {
    console.log("⚠ please author renewal order endpoints");
    return {
      onClose:false
    };
  }
  try {
    const { source, reseller, endUser } = renewalData;
    const impersonationAccount = renewalData.reseller.id;
    const payload = { source, reseller, endUser, customerPO: purchaseOrderNumber };
    if (renewalData?.items) payload.items = renewalData.items;
    const updateresponse = await post(updateRenewalOrderEndpoint, payload, setAdditionalHeaders(impersonationAccount));
    if (updateresponse.status === 200) {
      const isError = updateresponse.data?.error?.isError;
      if (isError) throw UPDATE_FAILED
      const getStatusConf = { getStatusEndpoint, id: source.id, delay: 1000, iterations: 8 };
      const getStatusResponse = await getStatusLoopUntilStatusIsActive(getStatusConf, setAdditionalHeaders(impersonationAccount));
      if (getStatusResponse) {
        const orderPayload = { id: source.id };
        const orderResponse = await post(orderRenewalEndpoint, orderPayload, setAdditionalHeaders(impersonationAccount));
        if (orderResponse.status === 200) {
          const transactionNumber =
            orderResponse.data.content.confirmationNumber;
          return {
            onClose: true,           
            transactionNumber,
            isSuccess: true
          }          
        } else
          throw PROCESS_ORDER_FAILED
      } else 
        throw GET_STATUS_FAILED;
    } else {
      throw UPDATE_FAILED
    }
  } catch (error) {      
    const response = error?.response?.data;
    const salesContentEmail = response?.salesContactEmail;
    if (salesContentEmail && PROCESS_ORDER_FAILED) {
      console.log("error.response >> ", error.response);
      return {
        transactionNumber:'',
        isSuccess:false,
        failedReason:PROCESS_ORDER_FAILED,
        salesContentEmail
      }    
    } 
    if (error === GET_STATUS_FAILED) {
      return {       
        transactionNumber: "",
        isSuccess: false,
        failedReason:GET_STATUS_FAILED,
        salesContentEmail
      }
    }    
    if (error === UPDATE_FAILED) {
      return {       
        transactionNumber: "",
        isSuccess: false,
        failedReason:UPDATE_FAILED,
        salesContentEmail
      }
    }    
  }
}
