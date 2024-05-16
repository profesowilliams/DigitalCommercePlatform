
import axios from 'axios';
import { get, post } from '../../../../utils/api';

export const requestRevision = async (activeAgreementID, AdditionalComments, endpoint) => {
  let response;

  try {
    response = await post(
      endpoint,
      {
        QuoteNumber: activeAgreementID,
        AdditionalComments: AdditionalComments
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