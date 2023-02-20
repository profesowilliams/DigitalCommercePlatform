
import axios from 'axios';
import { get, post } from '../../../../utils/api';

export const resellerLookUp = async (resellerId, endpoint) => {
  const response = await get(
    endpoint.replace('{reseller-id}', resellerId)
  );
  return response.data.error.isError ? response.data.error : response.data.content;
};

export const checkQuoteExitsforReseller = async (
  resellerId,
  agreementNumber,
  endpoint
) => {
  let response = await get(
    endpoint.replace('{reseller-id}', resellerId).replace('{agreement-number}', agreementNumber)
  );

  if (response.status === 204) {
    response = {
        data: {
            content: {
                totalItems: 0
            }
        }
    };
  }
  return response.data.content.totalItems > 0;
};

export const copyQuote = async (quoteId, resellerId, endpoint) => {
  let response;

  try {
    response = await post(
      endpoint,
      {
          QuoteId: quoteId,
          ResellerId: resellerId
      },
      {
          timeout: 6000,
      }
    );
  }
  catch (error) {
    response = {
        data: {
            "error": {
                "code": 408,
                "messages": [],
                "isError": true
            }
        }
    };
  }
  return response.data.error.isError ? response.data.error : response.data.content;
};