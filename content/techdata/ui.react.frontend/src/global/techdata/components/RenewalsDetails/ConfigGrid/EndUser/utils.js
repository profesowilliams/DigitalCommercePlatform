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
  SIXTY: 60,
  TWENTY: 20,
}
