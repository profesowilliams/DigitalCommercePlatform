import { CREATE_QUOTE_REQUEST, CREATE_QUOTE_RESPONSE, CREATE_QUOTE_RESPONSE_ERROR } from '../constants/quote';

const INITIAL_STATE = {
  quoteCreated: {},
  requested: false,
  showError: false,
};

export const quoteReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_QUOTE_REQUEST:
      return { ...state, requested: true }
    case CREATE_QUOTE_RESPONSE:
      return { ...state, quoteCreated: action.payload, requested: false }
    case CREATE_QUOTE_RESPONSE_ERROR:
      return { 
        ...state, 
        quoteCreated: {}, 
        requested: false,
        showError: true,
      }
    default:
      return state;
  }
}
