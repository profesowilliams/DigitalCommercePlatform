export default function getModifiedEndUserData(endUserResponseAsObj, endUser) {
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
      },
      address: {
        line1: address.line1.text,
        line2: address.line2.text,
        line3: address.line3,
        city: address.city.text,
        state: address.state,
        postalCode: address.postalCode.text,
        country: address.country,
        county: address.county,
        countryCode: address.countryCode.text,
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

export const endUserConstants = {
  INVALID_EMAIL_TEXT: 'Enter a valid email address. For example, name@email.com',
  REQUIRED_FIELD: 'This is a required field.',
  REQUIRED_MAX_LENGTH_FIELD: 'This is a required field, max {max-length} characters.',
  MAX_LENGTH_FIELD: 'Max {max-length} characters.',
  SIXTY: 60,
  TWENTY: 20,
};

export const endUserLables = {
  endUserName: 'Company name',
  endUserFullName: 'Contact full name',
  endUserEmail: 'Contact email',
  endUserPhone: 'Contact telephone number',
  endUserAddress1: 'Address 1',
  endUserAddress2: 'Address 2',
  endUserCity: 'City',
  endUserCountry: 'Country',
  endUserAreaCode: 'Area code',
  endUserVendorAccountNumber: 'Vendor account №',
};
