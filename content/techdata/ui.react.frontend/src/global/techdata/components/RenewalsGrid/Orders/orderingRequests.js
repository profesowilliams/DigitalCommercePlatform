import { getHeaderInfoFromUrl } from "../../../../../utils";
import { get, post } from "../../../../../utils/api";
import { GET_STATUS_FAILED, PROCESS_ORDER_FAILED, RENEWAL_STATUS_ACTIVE, UPDATE_FAILED } from "../../../../../utils/constants";
import { isImpersonateAccountHeaderDisabled } from "../../../../../utils/featureFlagUtils";
import { isHouseAccount } from "../../../../../utils/user-utils";

const awaitRequest = (fetch, delay) =>
  new Promise((resolve) => setTimeout(() => resolve(fetch()), delay));

const headerInfo = getHeaderInfoFromUrl(window.location.pathname);

const setAdditionalHeaders = (impersonationAccount) => {
  return isHouseAccount() ? {headers: {impersonateAccount: impersonationAccount}, validateStatus: false } : {validateStatus: false};
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
  const { id, contact, address } = quote;
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
    }
  }
}

export const extractDetailResellerData = (quote) => {
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
      line1: address?.line1,
      line2: address?.line2,
      line3: address?.line3,
      city: address?.city,
      state: address?.state,
      postalCode: address?.postalCode,
      country: address?.country,
      county: address?.county,
      countryCode: address?.countryCode
    },
    vendorAccountNumber: vendorAccountNumber?.text,
  }
}

export const extractDetailShipToData = (shipTo) => {
  if (shipTo) {
    const { id, name, address } = shipTo;
    return {
      id: id?.text,
      name,
      address: {
        line1: address?.line1,
        line2: address?.line2,
        line3: address?.line3,
        city: address?.city,
        state: address?.state,
        stateName: address?.stateName,
        postalCode: address?.postalCode,
        country: address?.country,
        county: address?.county,
        countryCode: address?.countryCode,
      },
    };
  }
  return null;
};

export const mapAddressToShipTo = (address) => {  
  return {
    id: address?.id,
    name: address?.name,
    address: {
      line1: address?.line1,
      line2: address?.line2,
      line3: address?.line3,
      city: address?.city,
      state: address?.state,
      stateName: address?.stateName,
      postalCode: address?.postalCode,
      country: address?.country,
      county: address?.county,
      countryCode: address?.countryCode,
    },
  };
}

export const mapRenewalForUpdateDetails = (renewalQuote) => {
  const items = mapRenewalItemProducts(renewalQuote.items);
  const { endUser, reseller, shipTo, customerPO, source } = renewalQuote;
  const resellerData = extractDetailResellerData(reseller);
  const endUserData = extractDetailRenewalData(endUser);
  const shipToData = extractDetailShipToData(shipTo);
  const EANumber = renewalQuote.endUser?.eaNumber?.text;
  return {
    reseller: { ...resellerData },
    source: { id: source?.id },
    customerPO: customerPO?.text || customerPO,
    endUser: { ...endUserData, name: endUser?.name?.text },
    shipTo: { ...shipToData },
    items,  
    POAllowedLength: customerPO?.allowedLength,
    EANumber 
  }
}

export async function handleOrderRequesting({ orderEndpoints, renewalData, purchaseOrderNumber, isDetails }) {
  let currentResponse = {};
  const { updateRenewalOrderEndpoint = "", getStatusEndpoint = "", orderRenewalEndpoint = "", renewalDetailsEndpoint="" } = orderEndpoints;
  if (!updateRenewalOrderEndpoint || !getStatusEndpoint || !orderRenewalEndpoint) {
    console.log("⚠ please author renewal order endpoints");
    return {
      onClose:false
    };
  }
  try {
    let quoteForOrdering = renewalData;
    if (!isDetails) {
      const quoteDetails = await fetchQuoteRenewalDetails(
        renewalDetailsEndpoint,
        renewalData.source.id
      );
      quoteForOrdering = mapRenewalForUpdateDetails(quoteDetails.content.details[0]);
    }
    quoteForOrdering.customerPO = purchaseOrderNumber;
    
    const { source, reseller, endUser, EANumber } = quoteForOrdering;  
    const impersonationAccount = quoteForOrdering.reseller.id;
    const payload = { source, reseller, endUser, customerPO: purchaseOrderNumber, EANumber };
    if (quoteForOrdering?.items) payload.items = quoteForOrdering.items;
    const updateresponse = await post(updateRenewalOrderEndpoint, quoteForOrdering, !isImpersonateAccountHeaderDisabled() && setAdditionalHeaders(impersonationAccount));
    currentResponse = updateresponse;
    if (updateresponse.status === 200 || updateresponse.status === 204) {
      const isError = updateresponse.data?.error?.isError;
      if (isError) throw UPDATE_FAILED
      const getStatusConf = { getStatusEndpoint, id: source.id, delay: 1000, iterations: 8 };
      const getStatusResponse = await getStatusLoopUntilStatusIsActive(getStatusConf, !isImpersonateAccountHeaderDisabled() && setAdditionalHeaders(impersonationAccount));
      currentResponse = getStatusResponse;
      if (getStatusResponse) {
        const orderPayload = { id: source.id };
        const orderResponse = await post(orderRenewalEndpoint, orderPayload, !isImpersonateAccountHeaderDisabled() && setAdditionalHeaders(impersonationAccount));
        currentResponse = orderResponse;
        if (orderResponse.status === 200 && !orderResponse.data?.error.isError) {
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
    const response = currentResponse?.data;
    const salesContentEmail = response?.salesContactEmail;

    if (salesContentEmail && error === PROCESS_ORDER_FAILED) {
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
    return {       
      transactionNumber: "",
      isSuccess: false,
      failedReason:PROCESS_ORDER_FAILED,
      salesContentEmail
    }
  }
}
