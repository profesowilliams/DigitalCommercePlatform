import { usGet, usPost } from '../../../../utils/api';

export const getUser = async (endpoint) => {
  let data = null;
  try {
    data = await usGet(endpoint);

    data = data?.data?.content.user;

    //TODO: temporary, there is a ticket on handling the user data in zustand
    if (data) {
      localStorage.setItem('userData', JSON.stringify(data));
    }
  } catch (error) {
    if (error.response.status !== 401) {
      throw error;
    }
  }
  return data;
};

export const performLogin = async (endpoint, data) => {
  const { data: response } = await usPost(endpoint, data);
  return response;
};

export const initializeSession = async (
  userEndpoint,
  loginEndpoint,
  shouldLogin,
) => {
  let userData = null;

  try {
    const userResponse = await getUser(userEndpoint);
    if (userResponse) {
      userData = userResponse;
    } else if (shouldLogin) {
      const { requestUri } = await performLogin(loginEndpoint, {
        continueUrl: window.location.href,
      });

      window.location.href = requestUri;

      userData = null;
    }
  } catch (error) {
    userData = null;
  }

  return userData;
};
