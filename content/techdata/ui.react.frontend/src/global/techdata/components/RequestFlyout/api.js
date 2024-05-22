
import axios from 'axios';
import { get, post } from '../../../../utils/api';

export const requestQuote = async (dataObj, endpoint) => {
  const response = await post(
    endpoint, dataObj);
  return response.data.error.isError ? response.data.error : response.data.content;
};