using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Models;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Services
{
    [ExcludeFromCodeCoverage]
    public class ConfigService : IConfigService
    {
        private static readonly Random getrandom = new Random();
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
#pragma warning disable CS0414 // The field is assigned but its value is never used
        private readonly string _appConfigurationUrl;
#pragma warning restore CS0414

        private readonly IMapper _mapper;
        private readonly ILogger<ConfigService> _logger;

        public ConfigService(IAppSettings appSettings, IMapper mapper, IMiddleTierHttpClient middleTierHttpClient,
            ILogger<ConfigService> logger)
        {
            //_appQuoteServiceUrl = options?.Value.GetSetting("App.Quote.Url");
            //currently there are no settings which provides below url.
            _appConfigurationUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-configuration/v1";
            _mapper = mapper;
            _middleTierHttpClient = middleTierHttpClient;
            _logger = logger;
        }

        public async Task<List<Deal>> GetDeals(GetDeals.Request request)
        {
            var lstDeals = new List<Deal>();
            for (int i = 0; i < 30; i++)
            {
                Deal objDeal = new Deal();
                var randomNumber = Convert.ToString(GetRandomNumber(1000, 6509));
                objDeal.DealId = "Dummy-Deals : " + randomNumber;
                objDeal.Vendor = i % 2 == 0 ? "HP" : i % 5 == 0 ? "Dell" : "Intel";
                objDeal.TdQuoteId = i < 2 ? "" : objDeal.Vendor != "Dell" ? Convert.ToString(GetRandomNumber(20000000, 50000000)) : "";
                objDeal.Description = i % 2 == 0 ? objDeal.DealId + "-" + Convert.ToString(GetRandomNumber(20000000, 50000000)) : "Deal from - " + objDeal.Vendor;
                objDeal.EndUserName = i % 2 == 0 ? "SHI International" : i % 5 == 0 ? "CDW International" : "Davidson Russel Holdings";
                objDeal.Action = string.IsNullOrWhiteSpace(objDeal.TdQuoteId) ? "Create Quote" : "Update Quote";
                objDeal.CreatedOn = DateTime.Now.AddDays(i * -5);
                lstDeals.Add(objDeal);
            }

            return await Task.FromResult(lstDeals.ToList());
        }

        public async Task<DealsDetailModel> GetDealDetails(GetDeal.Request request)
        {
            var lstMaterials = new List<MaterialInformation>();
            for (int i = 1; i < 16; i++)
            {
                MaterialInformation material = new MaterialInformation();
                material.Allowance = i % 2 == 0 ? GetRandomNumber(50, 10000).ToString() + ".65" : GetRandomNumber(10, 40).ToString() + ".36";
                material.AllowanceType = i % 2 == 0 ? "% OFF LIST PRICE" : i % 5 == 0 ? "$ OFF LIST PRICE" : "";
                material.MaximumQuantityPerCustomer = GetRandomNumber(50, 1000);
                material.RemainingQuantity = material.MaximumQuantityPerCustomer - GetRandomNumber(0, 25);
                material.HasErrors = false;
                material.MinimumQuantity = GetRandomNumber(0, 5).ToString();
                material.MaximumQuantity = 2000;
                material.Description = "ransition Networks Stand-Alone 10...";
                material.VendorPartNumber = "SBFTF1011-105-NA";
                material.TDPartNumber = "1227948" + i;
                lstMaterials.Add(material);
            }
            var objResponse = new DealsDetailModel();

            objResponse.EndUserName = "OPEN TO ALL END USERS";
            objResponse.Vendor = "ERGOTRON INC";
            objResponse.VendorBidNumber = "3072898";
            objResponse.Reference = "0002989968";
            objResponse.ReferenceNumber = "028";
            objResponse.TotalResultCount = lstMaterials.Count();
            objResponse.Prodcuts = lstMaterials;
            objResponse.InvalidTDPartNumbers = null;

            return await Task.FromResult(objResponse);
        }

        public static int GetRandomNumber(int min, int max)
        {
            return getrandom.Next(min, max);
        }

        public async Task<List<Configuration>> FindConfigurations(GetConfigurations.Request request)
        {
            try
            {
                var appServiceRequest = PrepareAppServiceRequest(request);
                var findConfigurationUrl = _appConfigurationUrl
                    .AppendPathSegment("find")
                    .SetQueryParams(appServiceRequest);

                if (appServiceRequest.Details)
                {
                    var findConfigurationResponse = await _middleTierHttpClient
                        .GetAsync<FindResponse<DetailedDto>>(findConfigurationUrl);
                    var result = MapAppResponseToConfigurations(findConfigurationResponse);
                    return result;
                }
                else
                {
                    var findConfigurationResponse = await _middleTierHttpClient
                        .GetAsync<FindResponse<SummaryDto>>(findConfigurationUrl);
                    var result = MapAppResponseToConfigurations(findConfigurationResponse);
                    return result;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at searching configurations : " + nameof(ConfigService));
                throw ex;
            }
        }

        private List<Configuration> MapAppResponseToConfigurations<T>(FindResponse<T> findConfigurationResponse)
        {
            var data = findConfigurationResponse.Data;
            var result = _mapper.Map<List<Configuration>>(data);
            return result;
        }

        private Models.Configurations.Internal.FindModel PrepareAppServiceRequest(GetConfigurations.Request request)
        {
            var result = _mapper.Map<Models.Configurations.Internal.FindModel>(request.Criteria);
            return result;
        }
    }
}