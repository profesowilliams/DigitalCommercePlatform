//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;
using DigitalCommercePlatform.UIServices.Config.Actions.FindDealsFor;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Actions.Refresh;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Models;
using DigitalFoundation.Common.Services.UI.ExceptionHandling;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
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

        /// <summary>
        /// This method is not being called by Deal,Deals(SPA) . Which is not being called from AEM
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<FindResponse<Deal>> GetDeals(GetDeals.Request request)
        {
            var findResponse = await GetDealsDetails(request);
            if (findResponse.Count >= 2)
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
                };
                var Quote2 = new QuoteDetails
                {
                    ID = "40019648",
                    Line = "",
                    Created = DateTime.Now,
                    Quantity = 11,
                    Price = 2500
                };

                findResponse.Data.FirstOrDefault().Quotes = new List<QuoteDetails> { Quote };
                findResponse.Data.ToArray()[2].Quotes = new List<QuoteDetails> { Quote1, Quote2 };
            }
            var result = new FindResponse<Deal>()
            {
                Count = findResponse.Count,
                Data = _mapper.Map<IEnumerable<Deal>>(findResponse.Data)
            };
            return result;
        }

        /// <summary>
        /// This method is not being called by Deal,Deals(SPA) . Which is not being called from AEM
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
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
            FindResponse<Configuration> result = new();
            try
            {
                if (request.Criteria?.SortBy?.ToLower() == "configid")
                    request.Criteria.SortBy = "Id";
                else if (request.Criteria?.SortBy?.ToLower() == "endusername")
                    request.Criteria.SortBy = "EndUser";
                else if (request.Criteria?.SortBy?.ToLower() == "expires")
                    request.Criteria.SortBy = "Expirydate";
                else
                    request.Criteria.SortBy = "Created";

                if (request.Criteria.Id != null)
                {
                    request.Criteria.Id = request.Criteria.Id + "*";
                }
                else if (request.Criteria.ConfigName != null)
                {
                    request.Criteria.ConfigName = request.Criteria.ConfigName + "*";
                }
                else if (request.Criteria.EndUser != null)
                {
                    request.Criteria.EndUser = request.Criteria.EndUser + "*";
                }

                var type = GetConfigurationType(request);
                request.Criteria.ConfigurationType = null;

                var appServiceRequest = BuildConfigurationsAppServiceRequest(request);
                var configurationFindUrl = _appConfigurationUrl
                    .AppendPathSegment("find")
                    .SetQueryParams(appServiceRequest);
                configurationFindUrl = configurationFindUrl + type;
                var stringUrl = configurationFindUrl.ToString();

                if (appServiceRequest.Details)
                {
                    var configurationFindResponse = await _middleTierHttpClient
                        .GetAsync<FindResponse<DetailedDto>>(configurationFindUrl);
                    BuildResult(result, configurationFindResponse);
                }
                else
                {
                    var configurationFindResponse = await _middleTierHttpClient
                        .GetAsync<FindResponse<SummaryDto>>(configurationFindUrl);
                    BuildResult(result, configurationFindResponse);
                }
            }
            catch (RemoteServerHttpException ex)
            {
                if (ex.Message.Contains("Reported an error: NotFound"))
                {
                    return result;
                }
                else
                {
                    _logger.LogError(ex, "Exception at : " + nameof(ConfigService));
                    throw new UIServiceException(ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at searching configurations : " + nameof(ConfigService));
                throw;
            }
            return result;
        }

        private void BuildResult<T>(FindResponse<Configuration> result, FindResponse<T> configurationFindResponse) where T : class
        {
            var mappingResult = _mapper.Map<IEnumerable<Configuration>>(configurationFindResponse.Data);
            result.Count = configurationFindResponse.Count;
            result.Data = mappingResult;
        }

        private Models.Configurations.Internal.FindModel BuildConfigurationsAppServiceRequest(GetConfigurations.Request request)
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
                _logger.LogInformation("$Record's not found for " + request.Criteria.Id + " and " + request.Criteria.ConfigurationType);
                return false;
            }
        }

        public async Task<string> GetPunchOutUrlAsync(PunchInModel request)
        {
            try
            {
                _logger.LogInformation($" {"Action Name is: " + request.ActionName + " Function Name is : " + request.FunctionName + " PostBackURL is : " + request.PostBackUrl + " Vendor Name is : " + request.VendorName + " EstimateId value is " + request.IdValue}");
                if (request.ActionName?.ToLower() == "edit")
                {
                    var estimateRequest = new Models.Configurations.FindModel();
                    estimateRequest.Id = request.IdValue;
                    estimateRequest.ConfigurationType = ConfigType.All;

                    var result = await FindConfigurations(new GetConfigurations.Request { Criteria = estimateRequest });

                    if (result.Count < 1 || result.Count == null)
                        return $"This Config ID is not recognized";
                }

                const string keyForGettingUrlFromSettings = "External.OneSource.PunchOut.Url";

                var requestUrl = _appSettings.TryGetSetting(keyForGettingUrlFromSettings)
                ?? throw new InvalidOperationException($"{keyForGettingUrlFromSettings} is missing from AppSettings");

                _logger.LogInformation($"Requested url is: {requestUrl}");

                var httpClient = _httpClientFactory.CreateClient("OneSourceClient");
                var requestJson = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
                var httpResponse = await httpClient.PostAsync(requestUrl, requestJson);

                httpResponse.EnsureSuccessStatusCode();

                var url = await httpResponse.Content.ReadAsStringAsync();
                try
                {
                    var response = Regex.Replace(url, "^\"|\"$", ""); //remove last and first double quotes.
                    return response;
                }
                catch (Exception)
                {
                    _logger.LogInformation("error in replacing double quotes using regex  ");
                }

                return url;
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Exception while calling Punchout url : {ex.Message + " inner Exception is " + ex.InnerException}");
                throw ex;
            }
        }

        public Task<FindResponse<DealsBase>> GetDealsFor(GetDealsFor.Request request)
        {
            string[] MfrPartNumbers = request.ProductIds?.Split(",").ToArray();

            Models.Configurations.Internal.FindSpaCriteriaModel spaRequest = new Models.Configurations.Internal.FindSpaCriteriaModel
            {
                MfrPartNumbers = MfrPartNumbers,
                EndUserName = request.EndUserName,
                PageSize = 25,
                Page = 1,
                Details=request.Details,
                PricingLevel=request.PricingOption
            };

            var getDealsForGrid = GetDealsDetails(spaRequest);
            return getDealsForGrid;
        }

        public async Task Refresh(Refresh.Request request)
        {
            try
            {
                var configurationRefreshUrl = _appConfigurationUrl.AppendPathSegments("Refresh", request.ProviderName, request.ConfigurationType);

                if (!string.IsNullOrWhiteSpace(request.Version))
                {
                    configurationRefreshUrl = configurationRefreshUrl.AppendPathSegment(request.Version);
                }
                
                if (request.QueryParams != null)
                {
                    configurationRefreshUrl = configurationRefreshUrl.SetQueryParams(request.QueryParams);
                }
                
                _ = await _middleTierHttpClient.PostAsync<Task>(configurationRefreshUrl, null, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in refresh configurations : " + nameof(ConfigService));
                throw;
            }

        }

        private async Task<FindResponse<DealsBase>> GetDealsDetails<T>(T request)
        {
            var requestUrl = _appPriceUrl.AppendPathSegments("/Spa/Find").BuildQuery(request);
            var getSpaResponse = await _middleTierHttpClient.GetAsync<FindResponse<DealsBase>>(requestUrl).ConfigureAwait(false);
            return getSpaResponse;
        }

        private string GetConfigurationType(GetConfigurations.Request request)
        {
            var ConfigurationType = "";

            if (request.Criteria.ConfigurationType == null)
            {
                request.Criteria.ConfigurationType = ConfigType.EstimateAndVendor;
            };


            if (request.Criteria.ConfigurationType == ConfigType.Estimate)
            {
                return ConfigurationType.AppendPathSegment("&type=Estimate");
            }
            else if (request.Criteria.ConfigurationType == ConfigType.Renewal)
            {
                return ConfigurationType.AppendPathSegment("&type=Renewal");
            }
            else if (request.Criteria.ConfigurationType == ConfigType.RenewalQuote)
            {
                return ConfigurationType.AppendPathSegment("&type=RenewalQuote");
            }
            else if (request.Criteria.ConfigurationType == ConfigType.VendorQuote)
            {
                return ConfigurationType.AppendPathSegment("&type=VendorQuote");
            }
            else if (request.Criteria.ConfigurationType == ConfigType.EstimateAndVendor)
            {
                return ConfigurationType.AppendPathSegment("&type=VendorQuote&type=Estimate");
            }
            else if (request.Criteria.ConfigurationType == ConfigType.EstimateAndRenewal)
            {
                return ConfigurationType.AppendPathSegment("&type=Renewal&type=Estimate");
            }
            else if (request.Criteria.ConfigurationType == ConfigType.VendorAndRenewal)
            {
                return ConfigurationType.AppendPathSegment("&type=Renewal&type=VendorQuote");
            }
            else
            {
                return ConfigurationType.AppendPathSegment("&type=Renewal&type=VendorQuote&type=RenewalQuote&type=Estimate");
            }

        }
    }
}
