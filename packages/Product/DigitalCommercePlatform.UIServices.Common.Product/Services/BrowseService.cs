using AutoMapper;
using DigitalCommercePlatform.UIServices.Common.Product.Contracts;
using DigitalCommercePlatform.UIServices.Common.Product.Models.Catalog;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Common.Product.Services
{
    public class BrowseService : IBrowseService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly string _catalogURL;
        private readonly string _productCatalogURL;
        private readonly string _productCatalogFeature;
        private readonly IMapper _mapper;
        private readonly ICachingService _cachingService;
        private readonly ILogger<BrowseService> _logger;



        public BrowseService(IOptions<AppSettings> options, IMiddleTierHttpClient middleTierHttpClient ,IMapper mapper,ICachingService cachingService, ILogger<BrowseService> logger)
        {
            if (options == null) { throw new ArgumentNullException(nameof(options)); }
            _catalogURL = options.Value?.TryGetSetting("App.Catalog.Url") ?? throw new InvalidOperationException("App.Catalog.Url is missing from AppSettings");
            _productCatalogURL = options.Value?.TryGetSetting("External.Product.Catalog.Url") ?? throw new InvalidOperationException("External.Product.Catalog.Url is missing from AppSettings");
            _productCatalogFeature = options.Value?.TryGetSetting("Feature.DF.ProuctCatalog") ?? throw new InvalidOperationException("Feature.DF.ProuctCatalog is missing from AppSettings");

            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _mapper = mapper;
            _cachingService = cachingService;
            _logger = logger;
        }

        public async Task<List<CatalogResponse>> GetCatalogDetails(string Id)
        {
            var CatalogURL = _catalogURL.BuildQuery(Id);

            var getCatalogResponse = await _cachingService.GetCatalogFromCache(Id);
            if (getCatalogResponse == null)
            {
                var response = await _middleTierHttpClient.GetAsync<CatalogDto>(CatalogURL).ConfigureAwait(false);
                if (response != null && response.Catalogs.Any())
                {
                    var tempResponse = _mapper.Map<CatalogModel>(response);
                    getCatalogResponse = new List<CatalogResponse>();
                    var objCatalogResponse = new CatalogResponse
                    {
                        Key = Id,
                        Name = null,
                        DocCount = 0, //Fix This
                        Children = tempResponse.Catalogs
                    };

                    getCatalogResponse.Add(objCatalogResponse);
                    await _cachingService.SetCatalogCache(getCatalogResponse, Id);
                }
            }
            return getCatalogResponse;
        }

        public async Task<List<CatalogResponse>> GetProductCatalogDetails(ProductCatalog request)
        {
            List<CatalogResponse> catalog = new List<CatalogResponse>();
            try
            {
                request.CorporateCode = "0100"; //Need to fix this

                string featureFromCache = await _cachingService.GetFeatureFromCache("useDFeatureToggle", _productCatalogFeature);
                if (featureFromCache != _productCatalogFeature)
                {
                    var clearResult = await _cachingService.ClearFromCache(request.Id);
                }

                bool IsSourceDF = false;
                var result = Boolean.TryParse(_productCatalogFeature, out IsSourceDF);

                if (IsSourceDF && result)
                {
                    catalog = await _cachingService.GetCatalogFromCache(request.Id);
                    if (catalog != null) return catalog;

                    catalog = await GetCatalogUsingDF(request).ConfigureAwait(false);
                }
                else
                {
                    catalog = await _cachingService.GetCatalogFromCache(request.Id);
                    if (catalog != null) return catalog;

                    catalog = await GetCatalogUsingProductService(request);
                }

                await _cachingService.SetCatalogCache(catalog, request.Id);
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
                    throw; // fix this
                }
            }

            return catalog;
        }


        private async Task<List<CatalogResponse>> GetCatalogUsingProductService(ProductCatalog request)
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
                Key = request.Id,
                Name = null,
                DocCount = 0, //Fix This
                Children = _mapper.Map<List<CatalogResponse>>(tempcatalog)
            };

            catalog.Add(objCatalogResponse);

            return catalog;
        }

        private async Task<List<CatalogResponse>> GetCatalogUsingDF(ProductCatalog request)
        {
            List<CatalogResponse> catalog = new List<CatalogResponse>();
            string catalogURL = _catalogURL.BuildQuery(request);
            var response = await _middleTierHttpClient.GetAsync<CatalogDto>(catalogURL).ConfigureAwait(false);

            if (response != null && response.Catalogs.Any())
            {
                var tempResponse = _mapper.Map<CatalogModel>(response);
                var objCatalogResponse = new CatalogResponse
                {
                    Key = request.Id,
                    Name = null,
                    DocCount = 0, //Fix This
                    Children = tempResponse.Catalogs
                };

                catalog.Add(objCatalogResponse);
            }

            return catalog;
        }
    }
}
