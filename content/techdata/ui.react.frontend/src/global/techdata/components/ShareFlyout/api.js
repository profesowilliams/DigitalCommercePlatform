
import axios from 'axios';
import { get, post } from '../../../../utils/api';

export const shareQuote = async (dataObj, endpoint) => {
  const response = await get(
    endpoint, dataObj);
  return response.data.error.isError ? response.data.error : response.data.content;
};