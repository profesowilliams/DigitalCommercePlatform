using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetEstimations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalCommercePlatform.UIServices.Config.Models.Estimations;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Models;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Services
{
    [ExcludeFromCodeCoverage]
    public class ConfigService : IConfigService
    {
        private static readonly Random getrandom = new Random();

        private readonly IAppSettings _appSettings;
        private readonly IMapper _mapper;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<ConfigService> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _appConfigurationUrl;

        public ConfigService(IAppSettings appSettings, IMapper mapper, IMiddleTierHttpClient middleTierHttpClient,
            ILogger<ConfigService> logger, IHttpClientFactory httpClientFactory)
        {
            _appSettings = appSettings ?? throw new ArgumentNullException(nameof(appSettings));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            _appConfigurationUrl = _appSettings.GetSetting("App.Configuration.Url");
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
                var appServiceRequest = PrepareConfigurationsAppServiceRequest(request);
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
                throw;
            }
        }

        private List<Configuration> MapAppResponseToConfigurations<T>(FindResponse<T> findConfigurationResponse)
        {
            var data = findConfigurationResponse.Data;
            var result = _mapper.Map<List<Configuration>>(data);
            result.ForEach(c => GenerateConfigurationDetails(c));
            
            return result;
        }

        private void GenerateConfigurationDetails(Configuration c)
        {
            c.Details = new List<TdQuoteIdDetails>();
            for (int i = 0; i < GetRandomNumber(2, 6); i++)
            {
                c.Details.Add(new TdQuoteIdDetails
                {
                    Created = DateTime.UtcNow.AddDays(-1 * GetRandomNumber(1, 10)),
                    Id = $"CD_ID_{c.ConfigId}_{i + 1}",
                    Line = $"Line_{GetRandomNumber(1, 1000)}",
                    Price = GetRandomNumber(2, 100),
                    Quantity = GetRandomNumber(1, 10)
                });
            }
        }

        private List<Estimation> MapAppResponseToEstimations<T>(FindResponse<T> findConfigurationResponse)
        {
            var data = findConfigurationResponse.Data;
            var result = _mapper.Map<List<Estimation>>(data);
            return result;
        }

        private Models.Configurations.Internal.FindModel PrepareConfigurationsAppServiceRequest(GetConfigurations.Request request)
        {
            var result = _mapper.Map<Models.Configurations.Internal.FindModel>(request.Criteria);
            return result;
        }

        private Models.Configurations.Internal.FindModel PrepareEstimationsAppServiceRequest(GetEstimations.Request request)
        {
            var result = _mapper.Map<Models.Configurations.Internal.FindModel>(request.Criteria);
            result.Type = "Estimate";
            return result;
        }

        public async Task<List<Estimation>> FindEstimations(GetEstimations.Request request)
        {
            try
            {
                var appServiceRequest = PrepareEstimationsAppServiceRequest(request);
                var findConfigurationUrl = _appConfigurationUrl
                    .AppendPathSegment("find")
                    .SetQueryParams(appServiceRequest);

                if (appServiceRequest.Details)
                {
                    var findConfigurationResponse = await _middleTierHttpClient
                        .GetAsync<FindResponse<DetailedDto>>(findConfigurationUrl);
                    var result = MapAppResponseToEstimations(findConfigurationResponse);
                    return result;
                }
                else
                {
                    var findConfigurationResponse = await _middleTierHttpClient
                        .GetAsync<FindResponse<SummaryDto>>(findConfigurationUrl);
                    var result = MapAppResponseToEstimations(findConfigurationResponse);
                    return result;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting estimations: " + nameof(ConfigService));
                throw;
            }
        }

        public async Task<bool> EstimationValidate(EstimationValidate.Request request)
        {
            try
            {
                var result = await FindEstimations(_mapper.Map<GetEstimations.Request>(request));

                return result?.ToList().Count > 0 ? true : false;

            }
            catch (Exception ex)
            {

                _logger.LogError(ex, "Exception at getting Estimation Validate: " + nameof(ConfigService));
                _logger.LogInformation("$Record's not found for " + request.Criteria.Id + " and " + request.Criteria.Type);
                if (ex.Message.ToLower().Contains("reported an error: notfound"))//need to fix this
                {
                    return false;
                }
                throw ex;
            }
        }

        public async Task<string> GetPunchOutURLAsync(PunchInModel request)
        {
            const string keyForGettingUrlFromSettings = "External.OneSource.PunchOut.Url";
            var requestUrl = _appSettings.TryGetSetting(keyForGettingUrlFromSettings) ?? throw new InvalidOperationException($"{keyForGettingUrlFromSettings} is missing from AppSettings");

            _logger.LogInformation($"Requested URL is: {requestUrl}");


            var httpClient = _httpClientFactory.CreateClient("OneSourceClient");

            var requestJson = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
            var httpResponse = await httpClient.PostAsync(requestUrl, requestJson);

            httpResponse.EnsureSuccessStatusCode();

            var url = await httpResponse.Content.ReadAsStringAsync();
            return url;
        }
    }
}