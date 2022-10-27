import produce from "immer";
import set from "lodash.set";
import { endUserConstants } from "../EndUser/utils";

// Helper function that uses a setState function and calls it using immer produce.
// Uses lodash set to be able to use a path instead of manually navigating the draft object.
export const setStateWithProduce = (setStateFn, path, value) => {
    setStateFn(
        produce((draft) => {
            set(draft, path, value);
        })
    )
};

// Curried function that helps create a setStateWithProduce with always the same setStateFn
// Helps to not call all the time the function with the same first argument (see reseller use).
export const createProducedSetter = (setStateFn) => {
    return (path, value) => setStateWithProduce(setStateFn, path, value);
}

/**
 * Util methods to handle input error validations in
 * enduser and reseller edit
 */
const { REQUIRED_FIELD, REQUIRED_MAX_LENGTH_FIELD, MAX_LENGTH_FIELD, INVALID_EMAIL_TEXT } = endUserConstants;
const showErrorField = (obj) => {
  return { error: obj?.isValid === false && obj?.text?.length === '' };
};

const showErrorMsg = (obj) => {
  if (obj?.text?.length === 0 && obj?.isMandatory === true) {
    return { helperText: REQUIRED_FIELD };
  }
};

export const handleEmailHelperText = (text, isEmailValid) => {
  if (!isEmailValid && text.length !== 0) {
    return INVALID_EMAIL_TEXT;
  }

  return REQUIRED_FIELD;
};

export const getOptionalFieldMessage = (obj) => {
  return obj.allowedLength
    ? MAX_LENGTH_FIELD.replace("{max-length}", obj.allowedLength)
    : null;
};

export const getFieldMessage = (obj, useRequiredMaxLengthMessage) => {
  if (!obj?.isMandatory || !obj?.canEdit) {
    return undefined;
  }
  return useRequiredMaxLengthMessage && obj.allowedLength
    ? REQUIRED_MAX_LENGTH_FIELD.replace("{max-length}", obj.allowedLength)
    : REQUIRED_FIELD;
};

export const handleValidation = (obj, useRequiredMaxLengthMessage) => {
  if (!obj) return;

  if (obj.isMandatory && !obj?.text) {
    return {
      error: true,
      helperText: getFieldMessage(obj, useRequiredMaxLengthMessage),
    };
  }

  return {
    ...showErrorField(obj),
    ...showErrorMsg(obj),
  };
};

export const getInputProps = (obj) => {
  if (!obj) return;

  const inputProps = { maxLength: obj.allowedLength?? undefined };

  return inputProps;
}

export const populateFieldConfigsFromService = (field) => ({
  disabled: field?.canEdit === false,
  required: field?.isMandatory,
  value: field?.text || '',
  inputProps: getInputProps(field),
});