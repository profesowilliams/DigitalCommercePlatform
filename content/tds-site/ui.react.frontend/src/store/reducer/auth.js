import { SIGN_IN_REQUEST, SIGN_IN_CODE, SIGN_IN_RESPONSE, SIGN_IN_ERROR } from '../constants/auth';

const INITIAL_STATE = {
  userData: {},
  requested: false,
  showError: false,
  loading: false,
  errorMessage: ''
};

export const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN_REQUEST:
      return Object.assign({}, state, {
        loading: true,
        requested: true,
        showError: false,
        errorMessage: ''
      });
    case SIGN_IN_RESPONSE:
      return Object.assign({}, state, {
        userData: action.payload,
        requested: false,
        showError: false,
        errorMessage: '',
        loading: false
      });
    case SIGN_IN_ERROR:
      return Object.assign({}, state, {
        requested: false,
        showError: true,
        errorMessage: action.payload
      });
    default:
      return state;
  }
}
