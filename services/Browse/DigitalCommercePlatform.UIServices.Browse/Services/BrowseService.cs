using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalCommercePlatform.UIService.Browse.Model.Customer;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails.GetCartHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails.GetHeaderHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails.GetCustomerHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogueDetails.GetCatalogueHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary.FindProductHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails.GetProductSummaryHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails.GetProductDetailsHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary.FindSummaryHandler;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    [ExcludeFromCodeCoverage]
    public class BrowseService : IBrowseService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _coreCartURL;
        private readonly string _appCustomerURL;
        private readonly string _appCatalogURL;
        private readonly string _appProductURL;
        private readonly ILogger<BrowseService> _logger;
        private readonly ICachingServicec _cachingService;
        public BrowseService(IHttpClientFactory clientFactory, 
            IMiddleTierHttpClient httpClient,
            ICachingServicec cachingService,
            ILogger<BrowseService> logger)
        {
            _cachingService = cachingService;
            _logger = logger;
            _clientFactory = clientFactory;
            _coreCartURL = "http://Core-Cart/v1/";
            _appCustomerURL = "https://eastus-sit-service.dc.tdebusiness.cloud/app-customer/v1";
            _appCatalogURL = "https://eastus-dit-service.dc.tdebusiness.cloud/app-catalog/v1/";
            //_appProductURL = "https://eastus-dit-service.dc.tdebusiness.cloud/app-product/v1/";
            _appProductURL = "https://eastus-dit-service.dc.tdebusiness.cloud/app-product/v1/";
        }

        public async Task<GetHeaderResponse> GetHeader(GetHeaderRequest request)
        {
            try
            {
                var customerRequest = new GetCustomerRequest(request.customerId);
                var cartRequest = new GetCartRequest(request.userId, request.customerId);
                var catalogueRequest = new GetCatalogueRequest(request.catalogueCriteria);

                var cartResponse = await GetCartDetails(cartRequest);
                var customerDetailsResponse = await GetCustomerDetails(customerRequest);
                var catalogueDetailsResponse = await GetCatalogueDetails(catalogueRequest);


                var getHeaderResponse = new GetHeaderResponse
                {
                    CartId = cartResponse.CartId,
                    CartItemCount = cartResponse.CartItemCount,
                    CustomerId = customerDetailsResponse.FirstOrDefault().Source.ID,
                    CustomerName = customerDetailsResponse.FirstOrDefault().Name,
                    UserId = "12345", //Hardcoded now , in future it will come from the UI Security service
                    UserName = "Techdata User", //Hardcoded now , in future it will come from the UI Security service
                    CatalogHierarchies = catalogueDetailsResponse.CatalogHierarchies.ToList(),
                };

                return getHeaderResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting BrowseService GetHeader : " + nameof(BrowseService));
                throw ex;
            }
            

        }
        public async Task<GetCatalogueResponse> GetCatalogueDetails(GetCatalogueRequest request)
        {
            var CatalogueURL = _appCatalogURL.BuildQuery(request);
            try
            {
                var getCatalogueResponse = await _cachingService.GetCatalogueFromCache(request.Id);
                if (getCatalogueResponse == null)
                {
                    var getCatalogueByCategory = new HttpRequestMessage(HttpMethod.Get, CatalogueURL);

                    var apiCatalogueClient = _clientFactory.CreateClient("apiServiceClient");

                    var getCatalogueHttpResponse = await apiCatalogueClient.SendAsync(getCatalogueByCategory);
                    getCatalogueHttpResponse.EnsureSuccessStatusCode();

                    getCatalogueResponse = await getCatalogueHttpResponse.Content.ReadAsAsync<GetCatalogueResponse>();
                    // set cache 
                    await _cachingService.SetCatalogueCache(getCatalogueResponse, request.Id);
                }
                return getCatalogueResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting BrowseService GetCatalogueDetails : " + nameof(BrowseService));
                throw ex;
            }
        }

        public async Task<IEnumerable<CustomerModel>> GetCustomerDetails(GetCustomerRequest request)
        {
            var CustomerURL = _appCustomerURL.BuildQuery(request);

            try
            {
                var getCustomerRequestMessage = new HttpRequestMessage(HttpMethod.Get, CustomerURL);

                var apiCustomerClient = _clientFactory.CreateClient("apiServiceClient");

                var getOCustomerHttpResponse = await apiCustomerClient.SendAsync(getCustomerRequestMessage);
                getOCustomerHttpResponse.EnsureSuccessStatusCode();

                var getCustomerResponse = await getOCustomerHttpResponse.Content.ReadAsAsync<IEnumerable<CustomerModel>>();
                return getCustomerResponse;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Exception at getting BrowseService GetCustomerDetails : " + nameof(BrowseService));
                throw ex;
            }
           
        }

       

        public Task<GetCartResponse> GetCartDetails(GetCartRequest request)
        {
            var CartURL=_coreCartURL.BuildQuery(request);
            try
            {
                Random rnd = new Random();
                var v1 = new GetCartResponse
                {
                    CartId = "1",//Hardcoded now , in future it will come from the app service
                    CartItemCount = rnd.Next(1,40)//Hardcoded now , in future it will come from the app service
                };
                return Task.FromResult(v1);              
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting GetCartDetails : " + nameof(BrowseService));
                throw ex;
            }   
        }


        public async Task<IEnumerable<ProductModel>> FindProductdetials(GetProductRequest request)
        {
            var ProductURL = _appProductURL + "Find";
            ProductURL = ProductURL.BuildQuery(request);

            try
            {
                var getProductRequestMessage = new HttpRequestMessage(HttpMethod.Get, ProductURL);

                var apiProductClient = _clientFactory.CreateClient("apiServiceClient");

                var getProductHttpResponse = await apiProductClient.SendAsync(getProductRequestMessage).ConfigureAwait(false);
                getProductHttpResponse.EnsureSuccessStatusCode();

                var getProductResponse = await getProductHttpResponse.Content.ReadAsAsync<IEnumerable<ProductModel>>().ConfigureAwait(false);
                return getProductResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting BrowseService FindProductdetials : " + nameof(BrowseService));
                throw;
            }
        }

        public async Task<IEnumerable<SummaryModel>> FindSummarydetials(FindSummaryRequest request)
        {
            var ProductURL = _appProductURL + "Find";
            ProductURL = ProductURL.BuildQuery(request);

            try
            {
                var getProductSummaryRequestMessage = new HttpRequestMessage(HttpMethod.Get, ProductURL);

                var apiProductSummaryClient = _clientFactory.CreateClient("apiServiceClient");

                var getProductSummaryHttpResponse = await apiProductSummaryClient.SendAsync(getProductSummaryRequestMessage).ConfigureAwait(false);
                getProductSummaryHttpResponse.EnsureSuccessStatusCode();

                var getProductResponse = await getProductSummaryHttpResponse.Content.ReadAsAsync<IEnumerable<SummaryModel>>().ConfigureAwait(false);
                return getProductResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting BrowseService FindSummarydetials : " + nameof(BrowseService));
                throw;
            }
        }

        public async Task<GetProductDetailsResponse> GetProductdetials(GetProductDetailsRequest request)
        {
            var ProductURL = _appProductURL.BuildQuery(request);

            try
            {
                var getProductSummaryRequestMessage = new HttpRequestMessage(HttpMethod.Get, ProductURL);

                var apiProductSummaryClient = _clientFactory.CreateClient("apiServiceClient");

                var getProductSummaryHttpResponse = await apiProductSummaryClient.SendAsync(getProductSummaryRequestMessage).ConfigureAwait(false);
                getProductSummaryHttpResponse.EnsureSuccessStatusCode();

                var getProductResponse = await getProductSummaryHttpResponse.Content.ReadAsAsync<GetProductDetailsResponse>().ConfigureAwait(false);
                return getProductResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting BrowseService GetProductdetials : " + nameof(BrowseService));
                throw;
            }
        }

        public async Task<GetProductSummaryResponse> GetProductSummary(GetProductSummaryRequest request)
        {
            var ProductURL = _appProductURL.BuildQuery(request);

            try
            {
                var getProductSummaryRequestMessage = new HttpRequestMessage(HttpMethod.Get, ProductURL);

                var apiProductSummaryClient = _clientFactory.CreateClient("apiServiceClient");

                var getProductSummaryHttpResponse = await apiProductSummaryClient.SendAsync(getProductSummaryRequestMessage).ConfigureAwait(false);
                getProductSummaryHttpResponse.EnsureSuccessStatusCode();

                var getProductResponse = await getProductSummaryHttpResponse.Content.ReadAsAsync<GetProductSummaryResponse>().ConfigureAwait(false);
                return getProductResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting BrowseService GetProductSummary : " + nameof(BrowseService));
                throw;
            }
        }
    }
}

