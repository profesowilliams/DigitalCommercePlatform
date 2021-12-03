//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product;
using DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct;
using DigitalCommercePlatform.UIServices.Browse.Dto.Validate;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Providers.Settings;
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
        private readonly string _appCatalogURL;
        private readonly string _productCatalogURL;
        private readonly string _appProductURL;
        private readonly string _productCatalogFeature;
        private readonly ILogger<BrowseService> _logger;
        private readonly ICachingService _cachingService;
        private readonly IMapper _mapper;

        public BrowseService(IMiddleTierHttpClient middleTierHttpClient,
            ICachingService cachingService,
            IAppSettings appSettings,
            IMapper mapper, ILogger<BrowseService> logger)
        {
            _middleTierHttpClient = middleTierHttpClient;
            _cachingService = cachingService;
            _mapper = mapper;
            _logger = logger;
            _appCatalogURL = appSettings.GetSetting("Catalog.App.Url");
            _appProductURL = appSettings.GetSetting("Product.App.Url");
            _productCatalogURL = appSettings.GetSetting("Browse.UI.External.Catalog.Url");
            _productCatalogFeature = appSettings.GetSetting("Feature.DF.ProuctCatalog");
        }

        public async Task<ProductData> FindProductDetails(FindProductHandler.Request request)
        {
            var ProductURL = _appProductURL.AppendPathSegment("Find").BuildQuery(request);

            var getProductResponse = await _middleTierHttpClient.GetAsync<ProductData>(ProductURL);
            return getProductResponse;
        }

        public async Task<IEnumerable<ProductDto>> GetProductDetails(GetProductDetailsHandler.Request request)
        {
            var ProductURL = _appProductURL.BuildQuery(new
            {
                id = request.Id,
                details = true
            });
            var getProductResponse = await _middleTierHttpClient.GetAsync<IEnumerable<ProductDto>>(ProductURL);
            return getProductResponse;
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