
import axios from 'axios';
import { get, post } from '../../../../utils/api';

export const shareQuote = async (dataObj, endpoint) => {
  const response = await post(
    endpoint, dataObj);
  return response.data.error.isError ? response.data.error : response.data.content;
};
export const vendorPartNoLookUp = async (endpoint, payload) => {
  const response = await post(endpoint, payload);
  return response.data.foundParts;
};
export const addProductToGrid = async (endpoint, payload) => {
  const response = await post(endpoint, payload);
  return response.data.content;
};