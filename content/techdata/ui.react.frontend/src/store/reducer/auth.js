import { SIGN_IN_REQUEST, SIGN_IN_CODE, SIGN_IN_RESPONSE, SIGN_IN_ERROR } from '../constants/auth';

const INITIAL_STATE = {
  userData: {},
  requested: false,
  showError: false,
};

export const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN_REQUEST:
      return Object.assign({}, state, {
        requested: true
      });
    case SIGN_IN_RESPONSE:
      return Object.assign({}, state, {
        userData: action.payload,
        requested: false
      });
    case SIGN_IN_ERROR:
      return Object.assign({}, state, {
        requested: false,
        showError: true
      });
    default:
      return state;
  }
}
