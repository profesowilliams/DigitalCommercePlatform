import { CREATE_QUOTE_REQUEST, CREATE_QUOTE_RESPONSE, CREATE_QUOTE_RESPONSE_ERROR } from '../constants/quote';
import { get } from '../../utils/api';

export const createQuoteRequest = () => {
	return {
		type: CREATE_QUOTE_REQUEST
	};  
};

export const createQuoteResponse = quote => {
  return {
		type: CREATE_QUOTE_RESPONSE,
    payload: quote,
	};
}

export const createQuoteResponseError = () => {
  return {
		type: CREATE_QUOTE_RESPONSE_ERROR
	};
}

export const createQuoteRequestDispatcher = ( apiUrl, cart ) => {
  const { cartId, cartItemCount } = cart;
  const apiUrlConstruct = `${apiUrl}/${cartId}`;

  return async (dispatch) => {
    if( !cartId && cartItemCount === 0 )
      return dispatch(createQuoteResponseError());
    
    dispatch(createQuoteRequest());
    const { data: {content, error} } = await get(apiUrlConstruct,{});
    if( error.isError )
      dispatch(createQuoteResponseError());
    else
      dispatch(createQuoteResponse(content));
  };
}