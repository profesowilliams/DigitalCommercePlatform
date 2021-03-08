using DigitalCommercePlatform.UIService.Browse.Model.Customer;
using DigitalFoundation.Common.Extensions;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails.GetCartHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails.GetCatalogHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails.GetCustomerHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails.GetHeaderHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails.GetProductDetailsHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails.GetProductSummaryHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary.FindProductHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary.FindSummaryHandler;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public class HttpBrowseService : IBrowseService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _coreCartURL;
        private readonly string _appCustomerURL;
        private readonly string _appCatalogURL;
        private readonly string _appProductURL;
        private readonly ILogger<HttpBrowseService> _logger;
        private readonly ICachingService _cachingService;

        public HttpBrowseService(IHttpClientFactory clientFactory,
            ICachingService cachingService,
            ILogger<HttpBrowseService> logger)
        {
            _cachingService = cachingService;
            _logger = logger;
            _clientFactory = clientFactory;
            _coreCartURL = "http://Core-Cart/v1/";
            _appCustomerURL = "https://eastus-sit-service.dc.tdebusiness.cloud/app-customer/v1";
            _appCatalogURL = "https://eastus-dit-service.dc.tdebusiness.cloud/app-catalog/v1/";
            _appProductURL = "https://eastus-dit-service.dc.tdebusiness.cloud/app-product/v1/";
        }

        public async Task<GetHeaderResponse> GetHeader(GetHeaderRequest request)
        {
            try
            {
                var customerRequest = new GetCustomerRequest(request.CustomerId);
                var cartRequest = new GetCartRequest(request.UserId, request.CustomerId);
                var CatalogRequest = new GetCatalogRequest(request.CatalogCriteria);

                var cartResponse = await GetCartDetails(cartRequest);
                var customerDetailsResponse = await GetCustomerDetails(customerRequest);
                var CatalogDetailsResponse = await GetCatalogDetails(CatalogRequest);

                var getHeaderResponse = new GetHeaderResponse
                {
                    CartId = cartResponse.CartId,
                    CartItemCount = cartResponse.CartItemCount,
                    CustomerId = customerDetailsResponse.FirstOrDefault()?.Source?.ID,
                    CustomerName = customerDetailsResponse.FirstOrDefault()?.Name,
                    UserId = "12345", //Hardcoded now , in future it will come from the UI Security service
                    UserName = "Techdata User", //Hardcoded now , in future it will come from the UI Security service
                    CatalogHierarchies = CatalogDetailsResponse.CatalogHierarchies.ToList(),
                };

                return getHeaderResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting HttpBrowseService GetHeader : " + nameof(HttpBrowseService));
                throw ex;
            }
        }

        public async Task<GetCatalogResponse> GetCatalogDetails(GetCatalogRequest request)
        {
            var CatalogURL = _appCatalogURL.BuildQuery(request);
            try
            {
                var getCatalogResponse = await _cachingService.GetCatalogFromCache(request.Id);
                if (getCatalogResponse == null)
                {
                    using var getCatalogByCategory = new HttpRequestMessage(HttpMethod.Get, CatalogURL);

                    var apiCatalogClient = _clientFactory.CreateClient("apiServiceClient");

                    var getCatalogHttpResponse = await apiCatalogClient.SendAsync(getCatalogByCategory);
                    getCatalogHttpResponse.EnsureSuccessStatusCode();

                    getCatalogResponse = await getCatalogHttpResponse.Content.ReadAsAsync<GetCatalogResponse>();
                    // set cache
                    await _cachingService.SetCatalogCache(getCatalogResponse, request.Id);
                }
                return getCatalogResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting HttpBrowseService GetCatalogDetails : " + nameof(HttpBrowseService));
                throw ex;
            }
        }

        public async Task<IEnumerable<CustomerModel>> GetCustomerDetails(GetCustomerRequest request)
        {
            var CustomerURL = _appCustomerURL.BuildQuery(request);

            try
            {
                using var getCustomerRequestMessage = new HttpRequestMessage(HttpMethod.Get, CustomerURL);

                var apiCustomerClient = _clientFactory.CreateClient("apiServiceClient");

                var getOCustomerHttpResponse = await apiCustomerClient.SendAsync(getCustomerRequestMessage);
                getOCustomerHttpResponse.EnsureSuccessStatusCode();

                var getCustomerResponse = await getOCustomerHttpResponse.Content.ReadAsAsync<IEnumerable<CustomerModel>>();
                return getCustomerResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting HttpBrowseService GetCustomerDetails : " + nameof(HttpBrowseService));
                throw ex;
            }
        }

        public Task<GetCartResponse> GetCartDetails(GetCartRequest request)
        {
            var CartURL = _coreCartURL.BuildQuery(request);
            try
            {
                Random rnd = new Random();
                var v1 = new GetCartResponse
                {
                    CartId = "1",//Hardcoded now , in future it will come from the app service
#pragma warning disable CA5394 // Do not use insecure randomness
                    CartItemCount = rnd.Next(1, 40)//Hardcoded now , in future it will come from the app service
#pragma warning restore CA5394 // Do not use insecure randomness
                };
                return Task.FromResult(v1);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting GetCartDetails : " + nameof(HttpBrowseService));
                throw ex;
            }
        }

        public async Task<GetProductResponse> FindProductDetails(GetProductRequest request)
        {
            var ProductURL = _appProductURL + "Find";
            ProductURL = ProductURL.BuildQuery(request);

            try
            {
                using var getProductRequestMessage = new HttpRequestMessage(HttpMethod.Get, ProductURL);

                var apiProductClient = _clientFactory.CreateClient("apiServiceClient");

                var getProductHttpResponse = await apiProductClient.SendAsync(getProductRequestMessage).ConfigureAwait(false);
                getProductHttpResponse.EnsureSuccessStatusCode();

                var getProductResponse = await getProductHttpResponse.Content.ReadAsAsync<GetProductResponse>().ConfigureAwait(false);
                return getProductResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting HttpProductService FindProductdetials : " + nameof(HttpBrowseService));
                throw;
            }
        }

        public async Task<FindSummaryResponse> FindSummaryDetails(FindSummaryRequest request)
        {
            var ProductURL = _appProductURL + "Find";
            ProductURL = ProductURL.BuildQuery(request);

            try
            {
                using var getProductSummaryRequestMessage = new HttpRequestMessage(HttpMethod.Get, ProductURL);

                var apiProductSummaryClient = _clientFactory.CreateClient("apiServiceClient");

                var getProductSummaryHttpResponse = await apiProductSummaryClient.SendAsync(getProductSummaryRequestMessage).ConfigureAwait(false);
                getProductSummaryHttpResponse.EnsureSuccessStatusCode();

                var getProductResponse = await getProductSummaryHttpResponse.Content.ReadAsAsync<FindSummaryResponse>().ConfigureAwait(false);
                return getProductResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting HttpProductService FindSummarydetials : " + nameof(HttpBrowseService));
                throw;
            }
        }

        public async Task<GetProductDetailsResponse> GetProductDetails(GetProductDetailsRequest request)
        {
            var ProductURL = _appProductURL.BuildQuery(request);

            try
            {
                using var getProductSummaryRequestMessage = new HttpRequestMessage(HttpMethod.Get, ProductURL);

                var apiProductSummaryClient = _clientFactory.CreateClient("apiServiceClient");

                var getProductSummaryHttpResponse = await apiProductSummaryClient.SendAsync(getProductSummaryRequestMessage).ConfigureAwait(false);
                getProductSummaryHttpResponse.EnsureSuccessStatusCode();

                var getProductResponse = await getProductSummaryHttpResponse.Content.ReadAsAsync<GetProductDetailsResponse>().ConfigureAwait(false);
                return getProductResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting HttpProductService GetProductdetials : " + nameof(HttpBrowseService));
                throw;
            }
        }

        public async Task<GetProductSummaryResponse> GetProductSummary(GetProductSummaryRequest request)
        {
            var ProductURL = _appProductURL.BuildQuery(request);

            try
            {
                using var getProductSummaryRequestMessage = new HttpRequestMessage(HttpMethod.Get, ProductURL);

                var apiProductSummaryClient = _clientFactory.CreateClient("apiServiceClient");

                var getProductSummaryHttpResponse = await apiProductSummaryClient.SendAsync(getProductSummaryRequestMessage).ConfigureAwait(false);
                getProductSummaryHttpResponse.EnsureSuccessStatusCode();

                var getProductResponse = await getProductSummaryHttpResponse.Content.ReadAsAsync<GetProductSummaryResponse>().ConfigureAwait(false);
                return getProductResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting HttpProductService GetProductSummary : " + nameof(HttpBrowseService));
                throw;
            }
        }
    }
}