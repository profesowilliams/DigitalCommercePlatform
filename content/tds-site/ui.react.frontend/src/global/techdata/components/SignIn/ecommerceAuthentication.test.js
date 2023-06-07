import {
  getUser,
  initializeSession,
  performLogin,
} from './ecommerceAuthentication';
import { usGet, usPost } from '../../../../utils/api';

jest.mock('../../../../utils/api');

describe('Ecommerce Authentication', () => {
  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost:3000/dashboard',
    },
  });

  const userData = {
    content: {
      user: {
        id: '516514',
        firstName: 'DAYNA',
        lastName: 'KARAPHILLIS',
        name: '516514',
        email: 'daniel.vogt@techdata.com',
        phone: null,
        customers: ['0038048612', '0009000325', '0009000325'],
        roles: null,
        isHouseAccount: true,
        roleList: [
          {
            entitlement: 'CanManageOwnProfile',
            accountId: '',
          },
          {
            entitlement: 'CanAccessAccount',
            accountId: '0038048612',
          },
          {
            entitlement: 'CanAccessDeveloperCenter',
            accountId: '0038048612',
          },
          {
            entitlement: 'CanViewCreditStatement',
            accountId: '0038048612',
          },
          {
            entitlement: 'CanDownloadPriceFiles',
            accountId: '0038048612',
          },
          {
            entitlement: 'CanViewInvoices',
            accountId: '0038048612',
          },
          {
            entitlement: 'CanPlaceOrder',
            accountId: '0038048612',
          },
          {
            entitlement: 'AdminUser',
            accountId: '0038048612',
          },
          {
            entitlement: 'CanViewOrders',
            accountId: '0038048612',
          },
          {
            entitlement: 'hasDCPAccess',
            accountId: '',
          },
          {
            entitlement: 'hasRenewalsAccess',
            accountId: '',
          },
          {
            entitlement: 'CanAccessRenewals',
            accountId: '',
          },
        ],
        customersV2: [
          {
            number: '0038048612',
            name: 'SHI INTERNATIONAL CORP',
            customerNumber: '0038048612',
            customerName: 'SHI INTERNATIONAL CORP',
            salesOrg: '0101',
            system: '2',
            dcpAccess: true,
          },
          {
            number: '0009000325',
            name: 'SHI INTERNATIONAL CORP.',
            customerNumber: '0009000325',
            customerName: 'SHI INTERNATIONAL CORP.',
            salesOrg: '1001',
            system: '3',
            dcpAccess: false,
          },
          {
            number: '0009000325',
            name: null,
            customerNumber: '0009000325',
            customerName: null,
            salesOrg: null,
            system: null,
            dcpAccess: false,
          },
        ],
        activeCustomer: {
          number: '0038048612',
          name: 'SHI INTERNATIONAL CORP',
          customerNumber: '0038048612',
          customerName: 'SHI INTERNATIONAL CORP',
          salesOrg: '0101',
          system: '2',
          dcpAccess: true,
        },
      },
    },
    error: { code: 0, messages: [], isError: false },
  };
  const successfulLoginResponse = {
    requestUri:
      'http://localhost:3000/?continue_url=http://localhost:3000/dashboard',
    expiresIn: 60,
    isError: false,
    errorCode: null,
    errorType: 0,
    errorDescription: null,
    exception: null,
  };
  describe('getUser', () => {
    afterEach(() => {
      localStorage.clear();
    });

    it('returns user data if successful', async () => {
      usGet.mockResolvedValueOnce({ data: userData });

      const result = await getUser('/ui-account/v1/GetUser');

      expect(usGet).toHaveBeenCalledWith('/ui-account/v1/GetUser');
      expect(result).toEqual(userData.content.user);
      expect(localStorage.getItem('userData')).toBeNull();
    });

    it('returns null if there is an error and response status is 401', async () => {
      const error = new Error('Unauthorized');
      error.response = { status: 401 };
      usGet.mockRejectedValue(error);

      const result = await getUser('/ui-account/v1/GetUser');

      expect(usGet).toHaveBeenCalledWith('/ui-account/v1/GetUser');
      expect(result).toBeNull();
      expect(localStorage.getItem('userData')).toBeNull();
    });
  });

  describe('performLogin', () => {
    const endpoint = '/ui-account/v1/login/par';
    const data = { continueUrl: 'http://localhost:3000/dashboard' };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('calls usPost with the correct arguments', async () => {
      usPost.mockResolvedValue({ data: {} });
      const expectedArgs = [endpoint, data];

      await performLogin(endpoint, data);

      expect(usPost).toHaveBeenCalledWith(...expectedArgs);
    });

    it('returns the response data from usPost', async () => {
      usPost.mockResolvedValue({ data: successfulLoginResponse });

      const result = await performLogin(endpoint, data);

      expect(result).toEqual(successfulLoginResponse);
    });
  });

  describe('initializeSession', () => {
    const userEndpoint = '/api/user';
    const loginEndpoint = '/api/login';
    const isLogin = true;
    const continueUrl = 'http://localhost:3000/dashboard';

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('calls getUser with the userEndpoint', async () => {
      const expectedArgs = [userEndpoint];

      usGet.mockResolvedValueOnce({ data: userData });

      await initializeSession(userEndpoint, loginEndpoint, isLogin);

      expect(usGet).toHaveBeenCalledWith(...expectedArgs);
    });

    it('returns user data if getUser is successful', async () => {
      usGet.mockResolvedValueOnce({ data: userData });

      const result = await initializeSession(
        userEndpoint,
        loginEndpoint,
        isLogin
      );

      expect(result).toEqual(userData.content.user);
    });

    it('calls performLogin with the loginEndpoint and continueUrl', async () => {
      usPost.mockResolvedValue({ data: successfulLoginResponse });
      const expectedArgs = [loginEndpoint, { continueUrl: "http://localhost:3000/dashboard" }];

      await initializeSession(userEndpoint, loginEndpoint, isLogin);

      expect(usPost).toHaveBeenCalledWith(...expectedArgs);
    });

    it('redirects to the returned requestUri if performLogin is called', async () => {
      const requestUri =
        'http://localhost:3000/?continue_url=http://localhost:3000/dashboard';
      const performLoginMock = jest.fn();
      performLoginMock.mockResolvedValue({ requestUri });
      const expectedUrl = requestUri;

      await initializeSession(userEndpoint, loginEndpoint, isLogin);

      expect(window.location.href).toEqual(expectedUrl);
    });

    it('returns null if getUser and performLogin both fail', async () => {
      const getUserMock = jest.fn();
      getUserMock.mockRejectedValue(new Error('Failed to get user'));
      const performLoginMock = jest.fn();
      performLoginMock.mockRejectedValue(new Error('Failed to perform login'));

      const result = await initializeSession(
        userEndpoint,
        loginEndpoint,
        isLogin
      );

      expect(result).toBeNull();
    });

    it('returns null if getUser fails and isLogin is false', async () => {
      const getUserMock = jest.fn();
      getUserMock.mockRejectedValue(new Error('Failed to get user'));

      const result = await initializeSession(
        userEndpoint,
        loginEndpoint,
        false
      );

      expect(result).toBeNull();
    });
  });
});
