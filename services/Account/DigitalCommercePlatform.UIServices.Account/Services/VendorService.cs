using DigitalCommercePlatform.UIServices.Account.Actions.ConnectToVendor;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorDisconnect;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorRefreshToken;
using DigitalCommercePlatform.UIServices.Account.Infrastructure;
using DigitalCommercePlatform.UIServices.Account.Infrastructure.ExceptionHandling;
using DigitalCommercePlatform.UIServices.Account.Models.Vendors;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
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
        private readonly IUIContext _uiContext;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<AccountService> _logger;

        private static readonly string[] _allowedVendorValues = { "cisco", "hp", "apple", "dell" , "vendor.test" };

        public VendorService(IMiddleTierHttpClient middleTierHttpClient, IAppSettings appSettings,
            ILogger<AccountService> logger, IUIContext uiContext)
        {
            _uiContext = uiContext;
            _middleTierHttpClient = middleTierHttpClient;
            _logger = logger;
            _coreSecurityUrl = appSettings.GetSetting(Globals.CoreSecurityUrl);
        }
        
        public static string[] GetAllowedVendorValues()
        {
            return _allowedVendorValues;
        }

        public async Task<bool> SetVendorConnection(SetVendorConnection.Request request)
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

                var response = await _middleTierHttpClient.GetAsync<bool>(url).ConfigureAwait(false);

                return await Task.FromResult(response);
            }
            catch (RemoteServerHttpException ex)
            {
                _logger.LogError(ex, "Exception from the Core-Security : " + nameof(VendorService));
                throw new UIServiceException("Error while calling Core-Security Service" + ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception from the Core-Security : " + nameof(VendorService));
                throw ex;
            }

        }

        public Task<List<VendorConnection>> GetVendorConnectionsAsync()
        {
            var vendorConnections = new List<VendorConnection>()
            {
                new VendorConnection
                {
                    Vendor = "Cisco",
                    IsConnected = true,
                    ConnectionDate = new DateTime(2021,12,4,12,54,46),
                    IsValidRefreshToken = true
                },
                new VendorConnection
                {
                    Vendor = "HP",
                    IsConnected = false,
                    ConnectionDate = new DateTime(2021,3,4,10,24,16),
                    IsValidRefreshToken = false
                }
            };

            return Task.FromResult(vendorConnections);
        }

        public async Task<VendorRefreshToken.Response> VendorRefreshToken(VendorRefreshToken.Request request)
        {
            var url = _coreSecurityUrl.AppendPathSegment("VendorRefreshToken")
                        .SetQueryParams(new
                        {
                            request.Vendor
                        });

            await _middleTierHttpClient.GetAsync<string>(url);
            return new VendorRefreshToken.Response { IsSuccess = true };
        }

        public async Task<bool> VendorDisconnect(GetVendorDisconnect.Request request)
        {
            try
            {
                var url = _coreSecurityUrl.AppendPathSegment("/VendorDisconnect")
                      .SetQueryParams(new
                      {
                          Vendor = request.Vendor
                      });

                var response = await _middleTierHttpClient.GetAsync<bool>(url).ConfigureAwait(false);

                return await Task.FromResult(response);
            }
            catch (RemoteServerHttpException ex)
            {
                _logger.LogError(ex, "Exception from the Core-Security : " + nameof(VendorService));
                throw new UIServiceException("Error while calling Core-Security Service " + ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception from the Core-Security : " + nameof(VendorService));
                throw ex;
            }
        }
    }
}