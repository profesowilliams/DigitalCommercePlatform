import React from "react";
import Info from "../../common/quotes/DisplayItemInfo";
import Edit from "../Edit";
import { MissingInfo } from "../MissingInfo";
import { If } from "../../../helpers/If";
import CancelAndSave from "../CancelAndSave";
import Saving from "../Saving";
import { useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import { isObject } from "../../../../../utils";

function EndUserInfo({ endUser, endUserType, productLines }) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const { canEdit, isValid } = endUser;

  console.log("ed", endUser);
  const handleIconEditClick = () => {
    setEditMode(true);
  };

  const handleIconCancelClick = () => {
    setEditMode(false);
  };

  const handleIconSaveClick = () => {
    setSaving(true);
    // timeout will be replaced with API promise return.
    setTimeout(() => {
      setSaving(false)
      setEditMode(false)
    }, 2000);
  };

  const showEditButton = canEdit && !saving,
        showError = !isValid && !saving;

  const EditFlow = () => {
    return (
      <If
        condition={!editMode}
        Then={<Edit btnClass="icon-button__endUser" handler={handleIconEditClick} />}
        Else={
          <CancelAndSave
            customClass="cancel-save__absolute"
            cancelHandler={handleIconCancelClick}
            saveHandler={handleIconSaveClick}
          />
        }
      />
    )
  };

  const EndUserInfo = ({ endUser }) => {
    const address = endUser.address;
    const contact = (Array.isArray(endUser.contact) ? endUser.contact[0] : endUser.contact);
    let email = isObject(contact.email) ? contact['email'].text : contact.email;
    let phone = isObject(contact.phone) ? contact['phone'].text : contact.phone;
    let city = isObject(address.city) ? address.city.text : address.city;
    let addressLine1 = isObject(address.line1) ? address.line1.text : address.line1;
    let addressLine2 = isObject(address.line2) ? address.line2.text : address.line2;
    let postalCode = isObject(address.postalCode) ? address['postalCode'].text : address['postalCode'];

    return (
      <div className="cmp-renewals-qp__enduser-info--address-group">
        <p>
          {endUser.nameUpper && <Info>{endUser.nameUpper}</Info>}
          {address?.line1 && <Info>{addressLine1}</Info>}      
          {address?.line2 && <Info>{addressLine2}</Info>}   
          <Info>{(city ?? '') + (address?.state ? `, ${address?.state}` : '') + (` ${postalCode}` || '')}</Info>      
          <Info>{address?.countryCode}</Info>
        </p>
        
        <p>
          {contact?.email && <Info label={productLines.emailLabel} noColon>{email}</Info>}
          {contact?.phone && <Info label={productLines.phoneLabel} noColon>{phone}</Info>}
        </p>
        
        <p>          
          {endUserType && <Info label={productLines.endCustomerType} noColon>{endUserType}</Info>}
          <Info label={productLines.vendorAccountNo} noColon>{endUser?.vendorAccountNumber}</Info>
          <Info label={productLines.endCustpreviousPurchaseOrderNo} noColon>{endUser?.previousEndUserPO ?? 'N/A'}</Info>
        </p>
      </div>
    );
  };

  const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: '#727679',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#005758',
    },
  });

  const showErrorField = (obj) => {
    if (obj && obj['isValid'] === false) {
      return { "error": "error" };
    }
  };

  const REQUIRED_FIELD = "This is a required field.";
  const showErrorMsg = (obj) => {
    if (obj && obj['isValid'] === false && obj['text'].length === 0 && obj['isMandatory'] === true) {
      return { "helperText": REQUIRED_FIELD };
    }
  };

  const EndUserEdit = ({}) => {
    return (
      <Box
        component="form"
        sx={{
          "& > :not(style)": { width: "100%" },
          "& > div": { marginBottom: "16px" },
          "&.MuiBox-root": { marginTop: "20px" },
        }}
        noValidate
        autoComplete="off"
      >
        <CustomTextField
          required
          id="end-user-name"
          label="End user name"
          variant="standard"
          defaultValue={endUser["name"]["text"] || ""}
          {...showErrorField(endUser["name"])}
          {...showErrorMsg(endUser["name"])}
        />
        <CustomTextField
          required
          id="contact-name"
          label="Contact name"
          variant="standard"
          defaultValue={endUser.contact[0]["name"]["text"]}
          {...showErrorField(endUser.contact[0]["name"])}
          {...showErrorMsg(endUser.contact[0]["name"])}
        />
        <CustomTextField
          required
          id="address"
          label="Address 1"
          variant="standard"
          defaultValue={endUser["address"]["line1"]["text"]}
          {...showErrorField(endUser["address"]["line1"])}
          {...showErrorMsg(endUser["address"]["line1"])}
        />
        <CustomTextField
          required
          id="city"
          label="City"
          variant="standard"
          defaultValue={endUser["address"]["city"]["text"]}
          {...showErrorField(endUser["address"]["city"])}
          {...showErrorMsg(endUser["address"]["city"])}
        />
        <CustomTextField
          required
          id="country"
          label="Country"
          variant="standard"
          defaultValue={endUser["address"]["country"]}
          {...showErrorMsg(endUser["address"]["country"])}
        />
        <CustomTextField
          required
          id="area-code"
          label="Area Code"
          variant="standard"
          defaultValue={endUser["address"]["postalCode"]["text"]}
          {...showErrorField(endUser["address"]["postalCode"])}
          {...showErrorMsg(endUser["address"]["postalCode"])}
        />
        <CustomTextField
          required
          id="email"
          label="Contact email"
          variant="standard"
          defaultValue={endUser.contact[0]["email"]["text"]}
          {...showErrorField(endUser.contact[0]["email"])}
          {...showErrorMsg(endUser.contact[0]["email"])}
        />
        <CustomTextField
          id="phone"
          label="Contact phone number"
          variant="standard"
          defaultValue={endUser.contact[0]["phone"]["text"]}
        />
      </Box>
    );
  };

  return (
    <div className={`cmp-renewals-qp__enduser-info ${showError && `error-feedback`}`}>
      <span className="cmp-renewals-qp__enduser-info--title">{productLines.endCustomerLabel}</span>
      {showError && <MissingInfo>
        End user missing information
      </MissingInfo>}
      {showEditButton && <EditFlow />}
      {saving && <Saving customClass="saving__absolute"/>}
      {editMode ? <EndUserEdit /> : <EndUserInfo endUser={endUser} />}
    </div>
  );
}

export default EndUserInfo;
