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
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    [ExcludeFromCodeCoverage]
    public class VendorService : IVendorService
    {
        private readonly string _coreSecurityUrl;
        private readonly string _vendorAutorizationURL;
        private readonly IUIContext _uiContext;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<VendorService> _logger;
        private readonly IAppSettings _appSettings;
        private static List<string> _validVendors;

        public VendorService(IMiddleTierHttpClient middleTierHttpClient, IAppSettings appSettings,
            ILogger<VendorService> logger, IUIContext uiContext)
        {
            _uiContext = uiContext;
            _middleTierHttpClient = middleTierHttpClient;
            _logger = logger;
            _coreSecurityUrl = appSettings.GetSetting(Globals.CoreSecurityUrl);
            _vendorAutorizationURL = appSettings.GetSetting("Vendor.Login.Cisco.Url");
            _appSettings = appSettings;
        }


        public static string[] GetAllowedVendorValues()
        {
            return new string[] { "CISCO" }; // fix this in next push         
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
                var validVendors = VendorList();
                var url = _coreSecurityUrl.AppendPathSegment("/GetVendorConnections");
                var vendorResponse = await _middleTierHttpClient.GetAsync<List<VendorConnection>>(url).ConfigureAwait(false);
                if (vendorResponse.Any())
                {
                    var response = (from v in vendorResponse
                                    where validVendors.Contains(v.Vendor?.ToLower())
                                    select v).ToList();
                    if (!response.Any() || response == null)
                        response = BuildVendorListResponse(validVendors);
                    else
                        return response;

                    return response;
                }
                return BuildVendorListResponse(validVendors);
            }
            catch (Exception ex)
            {
                // never throw exception 
                _logger.LogError(ex, "Exception from the Core-Security : " + nameof(VendorService));
                var validVendors = VendorList();
                return BuildVendorListResponse(validVendors);
               
                //throw ex;
            }
        }

        private List<VendorConnection> BuildVendorListResponse(List<string> validVendors)
        {
            List<VendorConnection> response = new List<VendorConnection>();
            foreach (var vendor in validVendors)
            {
                response.Add(new VendorConnection
                {
                    Vendor = vendor,
                    ConnectionDate = null,
                    IsConnected = false,
                    IsValidRefreshToken = false
                });
            }

            return response;
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
                    url = _vendorAutorizationURL;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception to fetch data from Mongo DB: " + nameof(VendorService));
                throw ex;
            }
            return Task.FromResult(url);
        }

        private List<string> VendorList()
        {
            try
            {
                var vendors = _appSettings.GetSetting("Feature.UI.VendorName");

                if (!string.IsNullOrWhiteSpace(vendors))
                    _validVendors = vendors.Split(',').ToList().ConvertAll(d => d.ToLower());
                else
                    _validVendors = new List<string> { "cisco" };
            }
            catch (Exception)
            {
                _validVendors = new List<string> { "cisco" }; // never throw exception
            }            

            return _validVendors;
        }
    }
}
