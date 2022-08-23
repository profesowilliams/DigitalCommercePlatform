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
  return {
    contact: {
      name: name || firstName,
      email: emailAddress,
      phone: phoneNumber
    },
    address: {
      line1,
      line2,
      line3,
      city,
      state,
      country,
      county,
      countryCode,
      postalCode
    }
  }
}

const mapRenewalItemProducts = (items = []) => {
  const mapProduct = product => ({type:product?.type, id: product?.id });
  return items.map(item => ({
    id: item?.id,
    product: Array.isArray(item?.product) ? mapProduct(item?.product[1]) || {} : {},
    quantity: item?.quantity,
    unitPrice: item?.unitPrice
  }));
}

export const mapRenewalForUpdateDashboard = (renewalQuote) => {
  console.log('renewalQuote >>', renewalQuote);
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

const extractDetailRenewalData = (quote) => {
  const { contact, address } = quote;
  const [_contact] = contact;
  return {
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

export const mapRenewalForUpdateDetails = (renewalQuote) => {
  const items = mapRenewalItemProducts(renewalQuote.items);
  const { endUser, reseller, customerPO, source } = renewalQuote;
  const resellerData = extractDetailRenewalData(reseller);
  const endUserData = extractDetailRenewalData(endUser);
  return {
    reseller: { ...resellerData },
    source: { id: source?.id },
    customerPO,
    endUser: { ...endUserData, name: endUser?.name?.text },
    items
  }
}