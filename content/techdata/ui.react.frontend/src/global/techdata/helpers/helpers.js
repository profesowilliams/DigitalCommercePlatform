import axios from 'axios';
export async function makeRequest(method = "", url = "", body = {}) {
  const params = {
    method,
    url,
    headers: {
      accept: '*/*'
    },
    body,
  };
  try {
    const response = await axios.request(params);
    return response.data
  } catch (error) {
    return error;
  }
}