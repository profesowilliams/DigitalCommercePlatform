//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Actions.ConnectToVendor;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorAuthorizedURL;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorDisconnect;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorRefreshToken;
using DigitalCommercePlatform.UIServices.Account.Infrastructure;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Models.Vendors;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Services.UI.ExceptionHandling;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    [ExcludeFromCodeCoverage]
    public class VendorService : IVendorService
    {
        private readonly string _coreSecurityUrl;
        private readonly string _VendorAutorizationURL;
        private readonly IUIContext _uiContext;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<AccountService> _logger;

        private static readonly string[] _allowedVendorValues = { "cisco", "hp", "apple", "dell", "vendor.test" };

        public VendorService(IMiddleTierHttpClient middleTierHttpClient, IAppSettings appSettings,
            ILogger<AccountService> logger, IUIContext uiContext)
        {
            _uiContext = uiContext;
            _middleTierHttpClient = middleTierHttpClient;
            _logger = logger;
            _coreSecurityUrl = appSettings.GetSetting(Globals.CoreSecurityUrl);
            _VendorAutorizationURL = appSettings.GetSetting("Vendor.Login.Cisco.Url");
        }

        public static string[] GetAllowedVendorValues()
        {
            return _allowedVendorValues;
        }

        public async Task<SetVendorConnection.Response> SetVendorConnection(SetVendorConnection.Request request)
        {
            try
            {
                var url = _coreSecurityUrl.AppendPathSegment("/VendorPortalLogin")
                      .SetQueryParams(new
                      {
                          Code = request.Code,
                          Vendor = request.Vendor,
                          RedirectUri = request.RedirectURL,
                      });

                var vendorResponse = await _middleTierHttpClient.GetAsync<HttpResponseModel>(url).ConfigureAwait(false);

                var result = vendorResponse?.StatusCode ?? HttpStatusCode.OK;

                var response = new SetVendorConnection.Response();
                response.Items = result == HttpStatusCode.OK ? true : false;
                return response;
            }
            catch (RemoteServerHttpException ex)
            {
                if (ex.Message.Contains("Error"))
                {
                    var response = new SetVendorConnection.Response();
                    response.Items = false;
                    return response;
                    throw new UIServiceException(ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
                }
                else
                {
                    _logger.LogError(ex, "Exception at : " + nameof(VendorService));
                    throw new UIServiceException(ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception from the Core-Security : " + nameof(VendorService));
                throw ex;
            }
        }

        public async Task<List<VendorConnection>> GetVendorConnectionsAsync()
        {
            try
            {
                var url = _coreSecurityUrl.AppendPathSegment("/GetVendorConnections");
                var vendorResponse = await _middleTierHttpClient.GetAsync<List<VendorConnection>>(url).ConfigureAwait(false);
                return vendorResponse;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Exception from the Core-Security : " + nameof(VendorService));
                throw ex;
            }            
        }

        public async Task<VendorRefreshToken.Response> VendorRefreshToken(VendorRefreshToken.Request request)
        {
            try
            {
                var url = _coreSecurityUrl.AppendPathSegment("VendorRefreshToken")
                        .SetQueryParams(new
                        {
                            request.Vendor
                        });

                var vendorResponse = await _middleTierHttpClient.GetAsync<HttpResponseModel>(url);
                var result = vendorResponse?.StatusCode ?? HttpStatusCode.OK;

                var response = new VendorRefreshToken.Response();
                response.IsSuccess = result == HttpStatusCode.OK ? true : false;
                return response;
            }
            catch (RemoteServerHttpException ex)
            {
                if (ex.Message.Contains("Error"))
                {
                    var response = new VendorRefreshToken.Response();
                    response.IsSuccess = false;
                    return response;
                    throw new UIServiceException(ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
                }
                else
                {
                    _logger.LogError(ex, "Exception at : " + nameof(VendorService));
                    throw new UIServiceException(ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception from the Core-Security : " + nameof(VendorService));
                throw ex;
            }            
        }

        public async Task<GetVendorDisconnect.Response> VendorDisconnect(GetVendorDisconnect.Request request)
        {
            try
            {
                var url = _coreSecurityUrl.AppendPathSegment("/VendorDisconnect")
                      .SetQueryParams(new
                      {
                          Vendor = request.Vendor
                      });

                var vendorResponse = await _middleTierHttpClient.GetAsync<HttpResponseModel>(url);
                var result = vendorResponse?.StatusCode ?? HttpStatusCode.OK;

                var response = new GetVendorDisconnect.Response();
                response.Items = result == HttpStatusCode.OK ? true : false;
                return response;
            }
            catch (RemoteServerHttpException ex)
            {
                if (ex.Message.Contains("Error"))
                {
                    var response = new GetVendorDisconnect.Response();
                    response.Items = false;
                    return response;
                    throw new UIServiceException(ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
                }
                else
                {
                    _logger.LogError(ex, "Exception at : " + nameof(VendorService));
                    throw new UIServiceException(ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception from the Core-Security : " + nameof(VendorService));
                throw ex;
            }
            // return await Task.FromResult(false); // if no error and status != 200 
        }

        public Task<string> VendorAutorizationURL(getVendorAuthorizeURL.Request request)
        {
            var url = string.Empty;
            try
            {
                request.Vendor = string.IsNullOrEmpty(request.Vendor) ? "Cisco" : request.Vendor;
                if (request.Vendor.ToLower() == "cisco")
                    url = _VendorAutorizationURL;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception to fetch data from Mongo DB: " + nameof(VendorService));
                throw ex;
            }
            return Task.FromResult(url);
        }
    }
}
