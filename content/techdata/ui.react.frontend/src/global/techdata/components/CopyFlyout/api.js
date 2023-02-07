
import axios from 'axios';
import { get, post } from '../../../../utils/api';

export const resellerLookUp = async (resellerId, endpoint) => {
  const response = await get(
    endpoint.replace('{reseller-id}', resellerId)
  );
  return response.data.content;
};

export const checkQuoteExitsforReseller = async (
  resellerId,
  agreementNumber,
  endpoint
) => {
  const response = await get(
    endpoint.replace('{reseller-id}', resellerId).replace('{agreement-number}', agreementNumber)
  );
  return response.data.content.totalItems > 0;
};

export const copyQuote = async (quoteId, resellerId, endpoint) => {

  //call axios post with a 6 seconds timeout
  const response2 = await axios(
    {
      method: 'post',
      url: endpoint.replace('{quote-id}', quoteId).replace('{reseller-id}', resellerId),
      timeout: 6000,
      //signal: 
    }
  );

  const response = await post(
    endpoint.replace('{quote-id}', quoteId).replace('{reseller-id}', resellerId)
  );
  return response.data.error.isError ? response.data.error : response.data.content;
};