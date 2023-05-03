import { usGet, usPost } from '../../../../utils/api';

export const getUser = async (endpoint) => {
  let data = null;
  try {
    data = await usGet(endpoint);

    data = data?.data?.content.user;
  } catch (error) {
    if (error.response.status !== 401) {
      throw new Error(response.status);
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
    const getUserFunctionToUse = getUser;//window.getUserData ?? getUser;
    const userResponse = await getUserFunctionToUse(userEndpoint);
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
    throw new Error(error);
  }

  return userData;
};
