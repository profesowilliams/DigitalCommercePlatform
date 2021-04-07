import { createQuoteRequestDispatcher } from '../../../../store/action/quote.js';
import { getLocalStorageUser } from '../../../../store/action/authAction.js';
import { bindActionCreators } from 'redux';

export const mapDispatchToProps = ( dispatch ) => {
  return bindActionCreators({ 
    getLocalStorageUser,
    createQuoteRequestDispatcher 
  }, dispatch);
}