//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;
using DigitalCommercePlatform.UIServices.Config.Actions.FindDealsFor;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Actions.ProductPrice;
using DigitalCommercePlatform.UIServices.Config.Actions.Refresh;
using DigitalCommercePlatform.UIServices.Config.Actions.Spa;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Features.Contexts.Models;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.ExceptionHandling;
using Flurl;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Services
{
    [ExcludeFromCodeCoverage]
    public class ConfigService : IConfigService
    {
        private static readonly Random getrandom = new();

        private readonly IAppSettings _appSettings;
        private readonly IMapper _mapper;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<ConfigService> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IHelperService _helperService;
        private readonly string _appConfigurationUrl;
        private readonly string _appSpaUrl;

        public ConfigService(IAppSettings appSettings, IMapper mapper, IMiddleTierHttpClient middleTierHttpClient,
            ILogger<ConfigService> logger, IHttpClientFactory httpClientFactory, IHelperService helperService)
        {
            _appSettings = appSettings ?? throw new ArgumentNullException(nameof(appSettings));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            _appConfigurationUrl = _appSettings.GetSetting("App.Configuration.Url");
            _appSpaUrl = _appSettings.GetSetting("App.Spa.Url");
            _helperService = helperService ?? throw new ArgumentNullException();
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

        public Task<FindResponse<Configuration>> FindConfigurations(GetConfigurations.Request request)
        {
            try
            {
                Models.Configurations.Internal.FindModel appServiceRequest;
                Url configurationFindUrl;
                FindConfigurationUrl(request, out appServiceRequest, out configurationFindUrl);
                var  result = Configuration(appServiceRequest, configurationFindUrl);
                return result;
            }
            catch (RemoteServerHttpException ex)
            {
                    _logger.LogError(ex, "Exception at : " + nameof(ConfigService));
                    throw new UIServiceException(ex.Message, (int)UIServiceExceptionCode.GenericBadRequestError);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at searching configurations : " + nameof(ConfigService));
                throw;
            }
        }

        private async Task<FindResponse<Configuration>> Configuration(Models.Configurations.Internal.FindModel appServiceRequest ,string configurationFindUrl)
        {
            FindResponse<Configuration> result = new();
            if (appServiceRequest.Details)
            {
                var configurationFindResponse = await _middleTierHttpClient
                    .GetAsync<FindResponse<DetailedDto>>(configurationFindUrl);
                if (configurationFindResponse != null)
                    BuildResult(result, configurationFindResponse);
                else
                    return result;
            }
            else
            {
                var configurationFindResponse = await _middleTierHttpClient
                    .GetAsync<FindResponse<SummaryDto>>(configurationFindUrl);
                if (configurationFindResponse != null)
                    BuildResult(result, configurationFindResponse);
                else
                    return result;
            }
            return result;
        }

        private string FindConfigurationUrl(GetConfigurations.Request request, out Models.Configurations.Internal.FindModel appServiceRequest, out Url configurationFindUrl)
        {
            request.Criteria.SortBy = request.Criteria?.SortBy?.ToLower() switch
            {
                "configid" => "Id",
                "endusername" => "EndUser",
                "expires" => "Expirydate",
                _ => "Created",
            };

            if (request.Criteria.Id != null)
            {
                request.Criteria.Id += "*";
            }
            else if (!string.IsNullOrEmpty(request.Criteria.ConfigName))
            {
                request.Criteria.ConfigName += "*";
            }
            else if (!string.IsNullOrEmpty(request.Criteria.EndUser))
            {
                request.Criteria.EndUser += "*";
            }
            if (request.Criteria.CreatedFrom != null && request.Criteria.CreatedTo != null && string.IsNullOrWhiteSpace(request.Criteria.Id))
            {
                request.Criteria.CreatedFrom = _helperService.GetDateParameter((DateTime)request.Criteria.CreatedFrom, "from");
                request.Criteria.CreatedTo = _helperService.GetDateParameter((DateTime)request.Criteria.CreatedTo, "to");
            }

            var type = GetConfigurationType(request);
            request.Criteria.ConfigurationType = null;

            appServiceRequest = BuildConfigurationsAppServiceRequest(request);
            configurationFindUrl = _appConfigurationUrl.AppendPathSegment("find").SetQueryParams(appServiceRequest);
            configurationFindUrl += type;
            return configurationFindUrl.ToString();
        }

        private void BuildResult<T>(FindResponse<Configuration> result, FindResponse<T> configurationFindResponse) where T : class
        {
            var mappingResult = _mapper.Map<IEnumerable<Configuration>>(configurationFindResponse.Data);
            mappingResult = MapQuotesAsync(mappingResult).Result;
            result.Count = configurationFindResponse.Count;
            result.Data = mappingResult;
        }

        private async Task<IEnumerable<Configuration>> MapQuotesAsync(IEnumerable<Configuration> mappingResult)
        {
            string _appQuoteServiceUrl = _appSettings.GetSetting("App.Quote.Url");

            foreach (var configuration in mappingResult)
            {
                try
                {
                    var query = new QuoteRequestModel { VendorReference = configuration.ConfigId, Details = false };
                    var quoteURL = _appQuoteServiceUrl.AppendPathSegment("Find").BuildQuery(query);

                    _logger.LogInformation("calling Quote Service using configuration id " + quoteURL);

                    var quoteResponse = await _middleTierHttpClient.GetAsync<Quote>(quoteURL);
                    BuildQuotesForConfiguration(configuration, quoteResponse);
                }
                catch (RemoteServerHttpException ex)
                {
                    if (ex.Message.Contains("Reported an error: NotFound"))
                    {
                        _logger.LogError(ex, "Exception calling quote service using config id  : " + configuration.ConfigId);
                    }
                    else
                    {
                        _logger.LogError(ex, "Exception at : " + nameof(ConfigService));
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at searching configurations : " + nameof(ConfigService));
                    throw;
                }

            }
            return mappingResult;
        }

        private void BuildQuotesForConfiguration(Configuration configuration, Quote quoteResponse)
        {
            if (quoteResponse != null)
            {
                var lstQuotes = new List<TdQuoteIdDetails>();

                foreach (var quote in quoteResponse?.Data)
                {
                    var configQuote = new TdQuoteIdDetails
                    {
                        Id = quote.Source.ID,
                        Status = quote.Status,
                        Price = quote.Price,
                        PriceFormatted = string.Format("{0:N2}", quote.Price),
                        System = quote.Source.TargetSystem,
                        SalesOrg = quote.Source.SalesOrg,
                        Currency = "USD",
                        CurrencySymbol = "$",
                        Created = quote.Created.ToString("MM/dd/yy")
                    };

                    lstQuotes.Add(configQuote);
                }

                configuration.Quotes = lstQuotes;
            }
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
                _logger.LogInformation("Record's not found for {ID} and {TYPE}", request.Criteria.Id, request.Criteria.ConfigurationType);
                return false;
            }
        }

        public async Task<string> GetPunchOutUrlAsync(PunchInModel request)
        {
            try
            {
                _logger.LogInformation("Action Name is: {ACTION_NAME}. " +
                    "Function Name is : {FUNCTION_NAME}. " +
                    "PostBackURL is : {URL}. " +
                    "Vendor Name is : {VENDOR_NAME}. " +
                    "EstimateId value is {ID}",
                    request.ActionName, request.FunctionName, request.PostBackUrl, request.VendorName, request.IdValue);
                if (request.ActionName?.ToLower() == "edit")
                {
                    Models.Configurations.FindModel estimateRequest = new()
                    {
                        Id = request.IdValue,
                        ConfigurationType = ConfigType.All
                    };

                    var result = await FindConfigurations(new GetConfigurations.Request { Criteria = estimateRequest });

                    if (result.Count < 1 || result.Count == null)
                        return $"This Config ID is not recognized";
                }

                const string keyForGettingUrlFromSettings = "External.OneSource.PunchOut.Url";

                var requestUrl = _appSettings.TryGetSetting(keyForGettingUrlFromSettings)
                    ?? throw new InvalidOperationException($"{keyForGettingUrlFromSettings} is missing from AppSettings");

                //var requestUrl = "https://svcinternal.prod.svc.us.tdworldwide.com/OneSource/api/AccessManagement/GetPunchOutURL";//for local testing

                _logger.LogInformation($"Requested url is: {requestUrl}");

                var httpClient = _httpClientFactory.CreateClient("OneSourceClient");
                var requestJson = new StringContent(System.Text.Json.JsonSerializer.Serialize(request),
                    Encoding.UTF8, "application/json");
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
                _logger.LogInformation("Exception while calling Punchout url : {MESSAGE} inner Exception is {INNEREX}",
                    ex.Message, ex.InnerException);
                throw ex;
            }
        }

        public Task<FindResponse<DealsBase>> GetDealsFor(GetDealsFor.Request request)
        {
            string[] MfrPartNumbers = new string[] { request.ProductIds };

            if (!string.IsNullOrEmpty(request.Vendor))
                request.Vendor += "*";

            FindSpaCriteriaModel spaRequest = new()
            {
                MfrPartNumbers = MfrPartNumbers,
                EndUserName = request.EndUserName,
                PageSize = 25,
                Page = 1,
                Details = request.Details,
                PricingLevel = request.PricingOption.ToString(),
                EndUserSpaOnly = request.EndUserSpaOnly,
                VendorName = request.Vendor
            };

            var getDealsForGrid = GetDealsDetails(spaRequest);
            return getDealsForGrid;
        }

        public async Task<RefreshData.Response> RefreshVendor(RefreshData.Request request)
        {
            var configurationRefreshUrl = _appConfigurationUrl.AppendPathSegments("Refresh", request.VendorName, request.Type);
            if (!string.IsNullOrWhiteSpace(request.Version))
            {
                configurationRefreshUrl = configurationRefreshUrl.AppendPathSegment(request.Version);
            }

            var refreshResponse = await _middleTierHttpClient.PostAsync<HttpResponseModel>(configurationRefreshUrl, null, null);

            var result = refreshResponse?.StatusCode ?? HttpStatusCode.OK;

            var response = new RefreshData.Response
            {
                Items = result == HttpStatusCode.OK
            };
            return response;

        }

        private async Task<FindResponse<DealsBase>> GetDealsDetails<T>(T request)
        {
            var requestUrl = _appSpaUrl.AppendPathSegments("Find").BuildQuery(request);
            var getSpaResponse = await _middleTierHttpClient.GetAsync<FindResponse<DealsBase>>(requestUrl).ConfigureAwait(false);
            return getSpaResponse;
        }

        private static string GetConfigurationType(GetConfigurations.Request request)
        {
            var ConfigurationType = "";

            if (request.Criteria.ConfigurationType == null)
            {
                request.Criteria.ConfigurationType = ConfigType.EstimateAndVendorAndDeal;
            };

            switch (request.Criteria.ConfigurationType)
            {
                case ConfigType.Estimate:
                    ConfigurationType = "&type=Estimate";
                    break;
                case ConfigType.Deal:
                    ConfigurationType = "&type=Deal";
                    break;
                case ConfigType.Renewal:
                    ConfigurationType = "&type=Renewal";
                    break;
                case ConfigType.RenewalQuote:
                    ConfigurationType = "&type=RenewalQuote";
                    break;
                case ConfigType.VendorQuote:
                    ConfigurationType = "&type=VendorQuote";
                    break;
                case ConfigType.EstimateAndVendor:
                    ConfigurationType = "&type=VendorQuote&type=Estimate";
                    break;
                case ConfigType.EstimateAndVendorAndDeal:
                    ConfigurationType = "&type=VendorQuote&type=Estimate&type=Deal";
                    break;
                case ConfigType.EstimateAndRenewal:
                    ConfigurationType = "&type=Renewal&type=Estimate";
                    break;
                case ConfigType.VendorAndRenewal:
                    ConfigurationType = "&type=Renewal&type=VendorQuote";
                    break;

                default:
                    ConfigurationType = "&type=Renewal&type=VendorQuote&type=RenewalQuote&type=Estimate&type=Deal";
                    break;
            }
            return ConfigurationType;
        }

        public async Task<SpaDetails.Response> GetSpaDetails(SpaDetails.Request request)
        {
            List<string> mfrPartNumbers = request.ProductIds?.Split(",").ToList();
            var requestUrl = _appSpaUrl.BuildQuery(request);
            SpaDetails.Response response = new();
            var spaResponse = await _middleTierHttpClient.GetAsync<List<Models.SPA.SpaDetailModel>>(requestUrl).ConfigureAwait(false);
            if (spaResponse.Any())
            {
                var SPADetailResponse = new List<Models.SPA.SpaDetailModel>(spaResponse);
                if (SPADetailResponse.FirstOrDefault().Products != null)
                {
                    List<Models.SPA.SpaProductModel> listProducts = new();

                    var lstValidProducts = (from p in SPADetailResponse.SelectMany(i => i.Products).Where(i => i.ManufacturerPartNumber != null)
                                            where mfrPartNumbers.Contains(p.ManufacturerPartNumber)
                                            select p.ManufacturerPartNumber).Distinct().ToList();

                    if (lstValidProducts.Any())
                    {
                        response.Items = new List<string>(lstValidProducts);
                    }
                }
                else
                {
                    _logger.LogError("No products returned by app service for SPA id {ID} {NAME}", request.Id, nameof(ConfigService));
                }
            }
            else
            {
                _logger.LogError("No records returned by app service for SPA id {ID} {NAME}", request.Id, nameof(ConfigService));
            }

            return response;
        }

        public async Task<GetProductPrice.Response> GetProductPrice(GetProductPrice.Request request)
        {

            string _appPriceUrl = _appSettings.GetSetting("App.Price.Url");
            GetProductPrice.Response response;
            string json = JsonConvert.SerializeObject(request, Formatting.Indented);
            _logger.LogInformation("Calling App-Quote to create a quote {NEWLINE} {JSON}", Environment.NewLine, json);
            try
            {
                response = await _middleTierHttpClient.PostAsync<GetProductPrice.Response>(_appPriceUrl, null, request);
            }
            catch (RemoteServerHttpException ex)
            {
                if (ex.Code == HttpStatusCode.BadRequest && ex.InnerException is RemoteServerHttpException innerException)
                {
                    object exceptionDetails = innerException?.Details;
                    object body = exceptionDetails?.GetType().GetProperty("Body")?.GetValue(exceptionDetails, null);
                    response = JsonConvert.DeserializeObject<GetProductPrice.Response>(body as string);
                }
                else
                {
                    throw;
                }
            }
            return response;
        }
    }
}
