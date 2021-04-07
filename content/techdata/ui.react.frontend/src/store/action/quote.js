import { CREATE_QUOTE_REQUEST, CREATE_QUOTE_RESPONSE, CREATE_QUOTE_RESPONSE_ERROR } from '../constants/quote';
import axios from '../../utils/axios';
import { nanoid } from "nanoid";
import { prepareCommonHeader } from '../../utils/utils';

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
  const { activeCart } = cart;
  const apiUrlConstruct = `${apiUrl}/${activeCart}`;
  const headerJson = prepareCommonHeader();
  const code = localStorage.getItem("signInCode");
  const body = {
    code,
  };

  return dispatch => {
    if( !activeCart && itemsQuantity === 0 )
    return dispatch(createQuoteResponseError());
    
    dispatch(createQuoteRequest());
    axios.get(apiUrlConstruct, {params: body}, { headers: headerJson })
      .then(response => {
        const {content, error} = response.data
        if( error.isError )
          dispatch(createQuoteResponseError());
        else
          dispatch(createQuoteResponse(content));
        // should redirect but we need to define the URL 
        // for now lets save the response and show it in the FE
      })
      .catch(err => {
        dispatch(createQuoteResponseError(err));
      });
  };
}