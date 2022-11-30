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
  endUserName: getDictionaryValue("details.renewal.editLabel.companyName", 'Company name'), 
  endUserFullName: getDictionaryValue("details.renewal.editLabel.contactName", 'Contact full name'),
  endUserEmail: getDictionaryValue("details.renewal.editLabel.contactEmail", 'Contact email'),
  endUserPhone: getDictionaryValue("details.renewal.editLabel.contactPhone", 'Contact telephone number'),
  endUserAddress1: getDictionaryValue("details.renewal.editLabel.contactAddress", 'Address 1'),
  endUserAddress2: getDictionaryValue("details.renewal.editLabel.contactAddress2", 'Address 2'),
  endUserCity: getDictionaryValue("details.renewal.editLabel.city", 'City'),
  endUserCountry: getDictionaryValue("details.renewal.editLabel.country", 'Country'),
  endUserAreaCode: getDictionaryValue("details.renewal.editLabel.areaCode", 'Area code'),
  endUserVendorAccountNumber: getDictionaryValue("details.renewal.label.vendorAccountNo", 'Vendor account №'),
};

export const getInvalidEmailText = () =>
  getDictionaryValue("details.common.validation.invalidEmail", 'Enter a valid email address. For example, name@email.com');

export const getRequiredFieldText = () =>
  getDictionaryValue("details.common.validation.requiredField", 'This is a required field.');

export const getRequiredMaxLengthFieldText = () =>
  getDictionaryValue("details.common.validation.requiredFieldMaxChars", 'This is a required field, max {max-length} characters.');

export const getMaxLengthFieldText = () =>
  getDictionaryValue("details.common.validation.maxLength", 'Max {max-length} characters.');
