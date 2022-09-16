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
const { REQUIRED_FIELD } = endUserConstants;
const showErrorField = (obj) => {
  return { error: obj?.isValid === false && obj?.text?.length === '' };
};

const showErrorMsg = (obj) => {
  if (obj?.text?.length === 0 && obj?.isMandatory === true) {
    return { helperText: REQUIRED_FIELD };
  }
};

export const handleValidation = (obj) => {
  if (!obj) return;

  if (!obj?.text) {
    return {
      error: true,
      helperText: REQUIRED_FIELD,
    };
  }

  return {
    ...showErrorField(obj),
    ...showErrorMsg(obj),
  };
};
