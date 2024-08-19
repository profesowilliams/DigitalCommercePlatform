export function getModifiedResellerData(resellerResponseAsObj, reseller) {
  
  const { contact, address } = reseller;  
  if (resellerResponseAsObj) {
    return {
      id: reseller?.id,
      name: reseller?.nameUpper || reseller?.name,
      contact: {
        name: contact[0]?.name?.text,
        email: contact[0]?.email?.text,
        phone: contact[0]?.phone?.text,
        nameIsDisplay: contact[0]?.name?.isDisplay,
        emailIsDisplay: contact[0]?.email?.isDisplay

      },
      address: {
        line1: address?.line1,
        line2: address?.line2,
        city: address?.city,
        country: address?.country,
        postalCode: address?.postalCode,
      },
      vendorAccountNumber: reseller.vendorAccountNumber.text,
    };
  }

  return {
    contact: {
      name: contact.name,
      email: contact.email,
      phone: contact.phone
    },
    vendorAccountNumber: reseller.vendorAccountNumber,
  };
}

export function getModifiedEndUserData(endUserResponseAsObj, endUser) {
  const contact = endUser.contact[0];
  const address = endUser.address;
  if (endUserResponseAsObj) {
    return {
      name: endUser.name.text,
      nameUpper: endUser.nameUpper,
      contact: {
        name: contact.name.text,
        email: contact.email.text,
        phone: contact.phone.text,
        nameIsDisplay: contact.name.isDisplay,
        emailIsDisplay: contact.email.isDisplay,
        phoneIsDisplay: contact.phone.isDisplay
      },
      address: {
        line1: address.line1.text,
        line2: address.line2.text,
        line3: address.line3,
        city: address.city.text,
        state: address.state,
        postalCode: address.postalCode.text,
        country: address.country.text,
        county: address.county,
        countryCode: address.countryCode.text,
        line1IsDisplay: address.line1.isDisplay,
        line2IsDisplay: address.line2.isDisplay,
        line3IsDisplay: address.line3.isDisplay,
        cityIsDisplay: address.city.isDisplay,
        countryIsDisplay: address.country.isDisplay,
        postalCodeIsDisplay: address.postalCode.isDisplay
      },
      vendorAccountNumber: endUser?.eaNumber?.text,
      previousEndUserPO: endUser?.previousEndUserPO
    };
  }

  return {
    name: endUser.name,
    nameUpper: endUser.nameUpper,
    contact: {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    },
    address: {
      line1: address.line1,
      line2: address.line2,
      line3: address.line3,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      county: address.county,
      countryCode: address.countryCode,
    },
    vendorAccountNumber: endUser.vendorAccountNumber,
    previousEndUserPO: endUser.previousEndUserPO,
  };
}
