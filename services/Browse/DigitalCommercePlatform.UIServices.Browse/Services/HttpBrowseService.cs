using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using System.Collections.Generic;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalCommercePlatform.UIService.Browse.Model.Customer;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogueDetails;
using Microsoft.Extensions.Logging;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public class HttpBrowseService : IBrowseService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _coreCartURL;
        private readonly string _appCustomerURL;
        private readonly string _appCatalogURL;
        private readonly ILogger<HttpBrowseService> _logger;
        private readonly ICachingServicec _cachingService;
        public HttpBrowseService(IHttpClientFactory clientFactory, 
            IMiddleTierHttpClient httpClient,
            ICachingServicec cachingService,
            ILogger<HttpBrowseService> logger)
        {
            _cachingService = cachingService;
            _logger = logger;
            _clientFactory = clientFactory;
            _coreCartURL = "http://Core-Cart/v1/";
            _appCustomerURL = "https://eastus-sit-service.dc.tdebusiness.cloud/app-customer/v1";
            _appCatalogURL = "https://eastus-dit-service.dc.tdebusiness.cloud/app-catalog/v1/";
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
                _logger.LogError(ex, "Exception at getting HttpBrowseService GetHeader : " + nameof(HttpBrowseService));
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
                _logger.LogError(ex, "Exception at getting HttpBrowseService GetCatalogueDetails : " + nameof(HttpBrowseService));
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
                _logger.LogError(ex, "Exception at getting HttpBrowseService GetCustomerDetails : " + nameof(HttpBrowseService));
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
                _logger.LogError(ex, "Exception at getting GetCartDetails : " + nameof(HttpBrowseService));
                throw ex;
            }   
        }
    }
}

