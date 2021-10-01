//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIService.Browse.Model.Customer;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product;
using DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct;
using DigitalCommercePlatform.UIServices.Browse.Dto.Validate;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using Flurl;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public class BrowseService : IBrowseService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly string _coreCartURL;
        private readonly string _appCustomerURL;
        private readonly string _appCatalogURL;
        private readonly string _productCatalogURL;
        private readonly string _appProductURL;
        private readonly string _productCatalogFeature;
        private readonly ILogger<BrowseService> _logger;
        private readonly ICachingService _cachingService;
        private readonly IUIContext _uiContext;
        private readonly IMapper _mapper;

        public BrowseService(IMiddleTierHttpClient middleTierHttpClient,
            ICachingService cachingService,
            IAppSettings appSettings,
            IUIContext uiContext,
            IMapper mapper, ILogger<BrowseService> logger)
        {
            _uiContext = uiContext;
            _middleTierHttpClient = middleTierHttpClient;
            _cachingService = cachingService;
            _mapper = mapper;
            _logger = logger;
            _coreCartURL = appSettings.GetSetting("App.Cart.Url");
            _appCustomerURL = appSettings.GetSetting("App.Customer.Url");
            _appCatalogURL = appSettings.GetSetting("App.Catalog.Url");
            _appProductURL = appSettings.GetSetting("App.Product.Url");
            _productCatalogURL = appSettings.GetSetting("External.Product.Catalog.Url");
            _productCatalogFeature = appSettings.GetSetting("Feature.DF.ProuctCatalog");
        }

        public async Task<GetHeaderHandler.Response> GetHeader(GetHeaderHandler.Request request)
        {
            var cartRequest = new GetCartHandler.Request(request.IsDefault);
            var CatalogRequest = new GetCatalogHandler.Request(request.CatalogCriteria);
            var cartResponse = await GetCartDetails(cartRequest);
            var customerDetailsResponse = await GetCustomerDetails();
            var CatalogDetailsResponse = await GetCatalogDetails(CatalogRequest);

            var getHeaderResponse = new GetHeaderHandler.Response
            {
                CartId = cartResponse.CartId,
                CartItemCount = cartResponse.CartItemCount,
                CustomerId = customerDetailsResponse.FirstOrDefault()?.Source?.ID,
                CustomerName = customerDetailsResponse.FirstOrDefault()?.Name,
                UserId = "12345", //Hardcoded now , in future it will come from the UI Security service
                UserName = "Techdata User", //Hardcoded now , in future it will come from the UI Security service
                                            //CatalogHierarchies = CatalogDetailsResponse.Children,
            };

            return getHeaderResponse;
        }

        public async Task<List<CatalogResponse>> GetCatalogDetails(GetCatalogHandler.Request request)
        {
            var CatalogURL = _appCatalogURL.BuildQuery(request);

            var getCatalogResponse = await _cachingService.GetCatalogFromCache(request.Id);
            if (getCatalogResponse == null)
            {
                var response = await _middleTierHttpClient.GetAsync<CatalogDto>(CatalogURL).ConfigureAwait(false);
                if (response != null && response.Catalogs.Any())
                {
                    var tempResponse = _mapper.Map<CatalogModel>(response);
                    getCatalogResponse = new List<CatalogResponse>();
                    var objCatalogResponse = new CatalogResponse
                    {
                        Key = request.Id,
                        Name = null,
                        DocCount = 0, //Fix This
                        Children = tempResponse.Catalogs
                    };

                    getCatalogResponse.Add(objCatalogResponse);
                    await _cachingService.SetCatalogCache(getCatalogResponse, request.Id);
                }
            }
            return getCatalogResponse;
        }

        public async Task<IEnumerable<CustomerModel>> GetCustomerDetails()
        {
            var customerId = _uiContext.User.Customers.FirstOrDefault();
            var CustomerURL = _appCustomerURL.BuildQuery("Id=" + customerId);
            var getCustomerDetailsResponse = await _middleTierHttpClient.GetAsync<IEnumerable<CustomerModel>>(CustomerURL);
            return getCustomerDetailsResponse;
        }

        public Task<GetCartHandler.Response> GetCartDetails(GetCartHandler.Request request)
        {
            string userId = _uiContext.User.ID;
            string customerId = _uiContext.User.Customers.FirstOrDefault();
            var CartURL = _coreCartURL.BuildQuery("UserId=" + userId + "&CustomerId=" + customerId);
            Random rnd = new Random();
            var v1 = new GetCartHandler.Response
            {
                CartId = "1",//Hardcoded now , in future it will come from the app service
#pragma warning disable CA5394 // Do not use insecure randomness
                CartItemCount = rnd.Next(1, 40)//Hardcoded now , in future it will come from the app service
#pragma warning restore CA5394 // Do not use insecure randomness
            };
            return Task.FromResult(v1);
        }

        public async Task<ProductData> FindProductDetails(FindProductHandler.Request request)
        {
            var ProductURL = _appProductURL.AppendPathSegment("Find").BuildQuery(request);

            var getProductResponse = await _middleTierHttpClient.GetAsync<ProductData>(ProductURL);
            return getProductResponse;
        }

        public async Task<SummaryDetails> FindSummaryDetails(FindSummaryHandler.Request request)
        {
            var ProductURL = _appProductURL.AppendPathSegment("Find").BuildQuery(request);
            var getProductResponse = await _middleTierHttpClient.GetAsync<SummaryDetails>(ProductURL).ConfigureAwait(false);
            return getProductResponse;
        }

        public async Task<IEnumerable<ProductDto>> GetProductDetails(GetProductDetailsHandler.Request request)
        {
            var ProductURL = _appProductURL.BuildQuery(request);
            var getProductResponse = await _middleTierHttpClient.GetAsync<IEnumerable<ProductDto>>(ProductURL);
            return getProductResponse;
        }

        public async Task<SummaryModel> GetProductSummary(GetProductSummaryHandler.Request request)
        {
            var ProductURL = _appProductURL.BuildQuery(request);
            var getProductResponse = await _middleTierHttpClient.GetAsync<IEnumerable<SummaryModel>>(ProductURL);
            return getProductResponse.FirstOrDefault();
        }

        public async Task<List<CatalogResponse>> GetProductCatalogDetails(GetProductCatalogHandler.Request request)
        {
            List<CatalogResponse> catalog = new List<CatalogResponse>();
            try
            {
                request.Input.CorporateCode = "0100"; //Need to fix this

                string featureFromCache = await _cachingService.GetFeatureFromCache("useDFeatureToggle", _productCatalogFeature);
                if (featureFromCache != _productCatalogFeature)
                {
                    var clearResult = await _cachingService.ClearFromCache(request.Input.Id);
                }

                bool IsSourceDF = false;
                var result = Boolean.TryParse(_productCatalogFeature, out IsSourceDF);

                if (IsSourceDF && result)
                {
                    catalog = await _cachingService.GetCatalogFromCache(request.Input.Id);
                    if (catalog != null) return catalog;

                    catalog = await GetCatalogUsingDF(request).ConfigureAwait(false);
                }
                else
                {
                    catalog = await _cachingService.GetCatalogFromCache(request.Input.Id);
                    if (catalog != null) return catalog;

                    catalog = await GetCatalogUsingProductService(request);
                }

                await _cachingService.SetCatalogCache(catalog, request.Input.Id);
                _logger.LogInformation($"URL used is {_productCatalogURL}:{"Feature toggle input"}:{_productCatalogFeature} ");
            }
            catch (RemoteServerHttpException ex)
            {
                if (ex.Code == HttpStatusCode.BadRequest && ex.InnerException is RemoteServerHttpException innerException)
                {
                    object exceptionDetails = innerException?.Details;
                    object body = exceptionDetails?.GetType().GetProperty("Body")?.GetValue(exceptionDetails, null);
                    catalog = JsonConvert.DeserializeObject<List<CatalogResponse>>(body as string);
                }
                else
                {
                    throw ex; // fix this
                }
            }

            return catalog;
        }

        private async Task<List<CatalogResponse>> GetCatalogUsingProductService(GetProductCatalogHandler.Request request)
        {
            if (string.IsNullOrWhiteSpace(_productCatalogURL))
            {
                throw new InvalidOperationException("External.Product.Catalog.Url is missing from AppSettings");
            }
            var response = await _middleTierHttpClient.PostAsync<List<CategoryDto>>(_productCatalogURL, null, request);
            List<CatalogModel> tempcatalog = _mapper.Map<List<CatalogModel>>(response);

            List<CatalogResponse> catalog = new List<CatalogResponse>();
            var objCatalogResponse = new CatalogResponse
            {
                Key = request.Input.Id,
                Name = null,
                DocCount = 0, //Fix This
                Children = _mapper.Map<List<CatalogResponse>>(tempcatalog)
            };

            catalog.Add(objCatalogResponse);

            return catalog;
        }

        private async Task<List<CatalogResponse>> GetCatalogUsingDF(GetProductCatalogHandler.Request request)
        {
            List<CatalogResponse> catalog = new List<CatalogResponse>();
            string catalogURL = _appCatalogURL.BuildQuery(request);
            var response = await _middleTierHttpClient.GetAsync<CatalogDto>(catalogURL).ConfigureAwait(false);

            if (response != null && response.Catalogs.Any())
            {
                var tempResponse = _mapper.Map<CatalogModel>(response);
                var objCatalogResponse = new CatalogResponse
                {
                    Key = request.Input.Id,
                    Name = null,
                    DocCount = 0, //Fix This
                    Children = tempResponse.Catalogs
                };

                catalog.Add(objCatalogResponse);
            }

            return catalog;
        }

        public async Task<RelatedProductResponseDto> GetRelatedProducts(RelatedProductRequestDto request)
        {
            var url = _appProductURL.AppendPathSegment("/RelatedProducts");
            var getProductResponse = await _middleTierHttpClient.PostAsync<RelatedProductResponseDto>(url, null, request);
            return getProductResponse;
        }

        public Task<IEnumerable<ValidateDto>> ValidateProductTask(IEnumerable<string> productIds)
        {
            var validateProductUrl = _appProductURL.AppendPathSegment("Validate").SetQueryParam("id", productIds);
            return _middleTierHttpClient.GetAsync<IEnumerable<ValidateDto>>(validateProductUrl);
        }
    }
}
