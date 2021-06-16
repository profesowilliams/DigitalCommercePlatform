using DigitalCommercePlatform.UIServices.Account.Actions.VendorRefreshToken;
using DigitalCommercePlatform.UIServices.Account.Infrastructure;
using DigitalCommercePlatform.UIServices.Account.Models.Vendors;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
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

        public async Task<List<VendorReferenceModel>> GetVendorReference()
        {
            //Returning dummy data for now as App-Service is not yet ready
            //var Vendorurl = _quoteServiceURL
            //        .AppendPathSegment("find")  //Change the actuall method when the App-Service is ready
            //        .SetQueryParams(new{});

            //var getVendorResponse = await _middleTierHttpClient.GetAsync<List<VendorReferenceModel>>(Vendorurl);
            //return getVendorResponse;

            var response = new List<VendorReferenceModel>();

            for (int i = 0; i < 2; i++)
            {
                var Vendors = new VendorReferenceModel();
                Vendors.Vendor = _allowedVendorValues[i];
                Vendors.IsConnected = true;
                Vendors.IsValidRefreshToken = false;
                Vendors.ConnectionDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                response.Add(Vendors);
            }
            return await Task.FromResult(response);
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
    }
}