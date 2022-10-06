export default function getModifiedResellerData(resellerResponseAsObj, reseller) {  
  
  const { contact, address } = reseller;  
  if (resellerResponseAsObj) {
    return {
      id: reseller?.id,
      name: reseller?.nameUpper || reseller?.name,
      contact: {
        name: contact[0]?.name?.text,
        email: contact[0]?.email?.text,
        phone: contact[0]?.phone?.text,
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
      phone: contact.phone,
    },
    vendorAccountNumber: reseller.vendorAccountNumber,
  };
}
