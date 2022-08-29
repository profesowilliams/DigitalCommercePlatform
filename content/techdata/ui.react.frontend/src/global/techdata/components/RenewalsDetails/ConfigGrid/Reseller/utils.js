export default function getModifiedResellerData(resellerResponseAsObj, reseller) {
  const contact = reseller.contact[0];
  if (resellerResponseAsObj) {
    return {
      contact: {
        name: contact.name.text,
        email: contact.email.text,
        phone: contact.phone.text,
      },
      vendorAccountNumber: reseller.vendorAccountNumber.text,
    };
  }

  return {
    contact: {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    },
    vendorAccountNumber: reseller.vendorAccountNumber,
  };
};

export const resellerConstants = {
  INVALID_EMAIL_TEXT: 'Enter a valid email address. For example, name@email.com',
  REQUIRED_FIELD: 'This is a required field.',
  SIXTY: 60,
  TWENTY: 20,
}
