using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
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
        private readonly string _appPriceUrl;

        public ConfigService(IAppSettings appSettings, IMapper mapper, IMiddleTierHttpClient middleTierHttpClient,
            ILogger<ConfigService> logger, IHttpClientFactory httpClientFactory)
        {
            _appSettings = appSettings ?? throw new ArgumentNullException(nameof(appSettings));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            _appConfigurationUrl = _appSettings.GetSetting("App.Configuration.Url");
            _appPriceUrl = _appSettings.GetSetting("App.Price.Url");
        }

        public async Task<FindResponse<DealsBase>> GetDeals(GetDeals.Request request)
        {
            
            var requestUrl = _appPriceUrl.AppendPathSegments("/Spa/Find").BuildQuery(request);
            var getSPAResponse = await _middleTierHttpClient.GetAsync<FindResponse<DealsBase>>(requestUrl).ConfigureAwait(false);
            if (getSPAResponse.Data.Count() >= 2)
            {
                var Quote = new QuoteDetails
                {
                    ID = "40074328",
                    Line = "",
                    Created = DateTime.Now,
                    Quantity = 10,
                    Price = 1500
                };
                var Quote1 = new QuoteDetails
                {
                    ID = "40059342",
                    Line = "",
                    Created = DateTime.Now,
                    Quantity = 02,
                    Price = 2000
                }; var Quote2 = new QuoteDetails
                {
                    ID = "40019648",
                    Line = "",
                    Created = DateTime.Now,
                    Quantity = 11,
                    Price = 2500
                };

                getSPAResponse.Data.FirstOrDefault().Quotes = new List<QuoteDetails> { Quote };

                getSPAResponse.Data.ToArray()[2].Quotes = new List<QuoteDetails> { Quote1, Quote2 };
            }

            return getSPAResponse;
        }

        public async Task<DealsDetailModel> GetDealDetails(GetDeal.Request request)
        {
            var lstMaterials = new List<MaterialInformation>();
            for (int i = 1; i < 16; i++)
            {
                MaterialInformation material = new();
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
            var objResponse = new DealsDetailModel
            {
                EndUserName = "OPEN TO ALL END USERS",
                Vendor = "ERGOTRON INC",
                VendorBidNumber = "3072898",
                Reference = "0002989968",
                ReferenceNumber = "028",
                TotalResultCount = lstMaterials.Count(),
                Prodcuts = lstMaterials,
                InvalidTDPartNumbers = null
            };

            return await Task.FromResult(objResponse);
        }

        public static int GetRandomNumber(int min, int max)
        {
            return getrandom.Next(min, max);
        }

        public async Task<FindResponse<Configuration>> FindConfigurations(GetConfigurations.Request request)
        {
            try
            {
                var appServiceRequest = PrepareConfigurationsAppServiceRequest(request);
                var configurationFindUrl = _appConfigurationUrl
                    .AppendPathSegment("find")
                    .SetQueryParams(appServiceRequest);

                if (appServiceRequest.Details)
                {
                    var configurationFindResponse = await _middleTierHttpClient
                        .GetAsync<FindResponse<DetailedDto>>(configurationFindUrl);
                    var result = _mapper.Map<IEnumerable<Configuration>>(configurationFindResponse.Data);
                    result.ToList().ForEach(c => GenerateConfigurationDetails(c));
                    FindResponse<Configuration> response = new FindResponse<Configuration>();
                    response.Count = configurationFindResponse.Count;
                    response.Data = result;
                    return response;
                }
                else
                {
                    var configurationFindResponse = await _middleTierHttpClient
                        .GetAsync<FindResponse<SummaryDto>>(configurationFindUrl);
                    var result = _mapper.Map<IEnumerable<Configuration>>(configurationFindResponse.Data);
                    result.ToList().ForEach(c => GenerateConfigurationDetails(c));
                    FindResponse<Configuration> response = new FindResponse<Configuration>();
                    response.Count = configurationFindResponse.Count;
                    response.Data = result;
                    return response;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at searching configurations : " + nameof(ConfigService));
                throw;
            }
        }

        private static void GenerateConfigurationDetails(Configuration c)
        {
            c.Quotes = new List<TdQuoteIdDetails>();
            for (int i = 0; i < GetRandomNumber(2, 6); i++)
            {
                c.Quotes.Add(new TdQuoteIdDetails
                {
                    Status = i == 3 ? "Pending" : i == 5 ? "Failed" :  i == 2 ? "Expired" : "Created",
                    Created = i == 5 || i == 2 || i == 3 ? string.Empty : DateTime.UtcNow.AddDays(-1 * GetRandomNumber(1, 10)).ToShortDateString(),
                    Id = i == 5 || i == 2 || i == 3 ? string.Empty : $"CD_ID_{c.ConfigId}_{i + 1}",
                    Line = i == 5 || i == 2 || i == 3 ? string.Empty : $"Line_{GetRandomNumber(1, 1000)}",
                    Price = i == 5 || i == 2 || i == 3 ? 0 : GetRandomNumber(2, 100),
                    Quantity = i == 5 || i == 2 || i == 3 ? 0 : GetRandomNumber(1, 10)
                }); ; ; ;
            }
        }

        private Models.Configurations.Internal.FindModel PrepareConfigurationsAppServiceRequest(GetConfigurations.Request request)
        {
            var result = _mapper.Map<Models.Configurations.Internal.FindModel>(request.Criteria);
            result.WithPaginationInfo = true;
            return result;
        }

        public async Task<bool> EstimationValidate(EstimationValidate.Request request)
        {
            try
            {
                var result = await FindConfigurations(new GetConfigurations.Request { Criteria = request.Criteria });
                return result?.Data.ToList().Count > 0;
            }
            catch (Exception ex)
            {

                _logger.LogError(ex, "Exception at getting Estimation Validate: " + nameof(ConfigService));
                _logger.LogInformation("$Record's not found for " + request.Criteria.Id + " and " + request.Criteria.Type);
                if (ex.Message.ToLower().Contains("reported an error: notfound"))//need to fix this
                {
                    return false;
                }
                throw;
            }
        }

        public async Task<string> GetPunchOutUrlAsync(PunchInModel request)
        {
            const string keyForGettingUrlFromSettings = "External.OneSource.PunchOut.Url";
            var requestUrl = _appSettings.TryGetSetting(keyForGettingUrlFromSettings) ?? throw new InvalidOperationException($"{keyForGettingUrlFromSettings} is missing from AppSettings");

            _logger.LogInformation($"Requested url is: {requestUrl}");

            var httpClient = _httpClientFactory.CreateClient("OneSourceClient");
            var requestJson = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
            var httpResponse = await httpClient.PostAsync(requestUrl, requestJson);

            httpResponse.EnsureSuccessStatusCode();

            var url = await httpResponse.Content.ReadAsStringAsync();
            return url;
        }
    }
}