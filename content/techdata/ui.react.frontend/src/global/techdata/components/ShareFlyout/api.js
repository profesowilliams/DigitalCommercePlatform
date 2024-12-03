
import axios from 'axios';
import { get, post } from '../../../../utils/api';

export const shareQuote = async (endpoint, dataObj) => {
  const response = await post(
    endpoint, dataObj);
  return response.data.error.isError ? response.data.error : response.data.content;
};