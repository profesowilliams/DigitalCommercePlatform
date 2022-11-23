import { getDictionaryValue } from '../../../../../../utils/utils';

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
  SIXTY: 60,
  TWENTY: 20,
};

export const endUserLables = {
  endUserName: getDictionaryValue("techdata.renewals.label.companyName", 'Company name'), 
  endUserFullName: getDictionaryValue("techdata.renewals.label.contactName", 'Contact full name'),
  endUserEmail: getDictionaryValue("techdata.renewals.label.email", 'Contact email'),
  endUserPhone: getDictionaryValue("techdata.renewals.label.telephoneNumber", 'Contact telephone number'),
  endUserAddress1: getDictionaryValue("techdata.renewals.label.address1", 'Address 1'),
  endUserAddress2: getDictionaryValue("techdata.renewals.label.address2", 'Address 2'),
  endUserCity: getDictionaryValue("techdata.renewals.label.city", 'City'),
  endUserCountry: getDictionaryValue("techdata.renewals.label.country", 'Country'),
  endUserAreaCode: getDictionaryValue("techdata.renewals.label.areaCode", 'Area code'),
  endUserVendorAccountNumber: getDictionaryValue("techdata.renewals.label.vendorAccountNumber", 'Vendor account №'),
};

export const getInvalidEmailText = () =>
  getDictionaryValue("techdata.validation.message.invalidEmail", 'Enter a valid email address. For example, name@email.com');

export const getRequiredFieldText = () =>
  getDictionaryValue("techdata.validation.message.requiredField", 'This is a required field.');

export const getRequiredMaxLengthFieldText = () =>
  getDictionaryValue("techdata.validation.message.requiredMaxLengthField", 'This is a required field, max {max-length} characters.');

export const getMaxLengthFieldText = () =>
  getDictionaryValue("techdata.validation.message.maxLengthField", 'Max {max-length} characters.');
