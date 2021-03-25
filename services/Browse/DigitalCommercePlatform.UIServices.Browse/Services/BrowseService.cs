using DigitalCommercePlatform.UIService.Browse.Model.Customer;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
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
    [ExcludeFromCodeCoverage]
    public class BrowseService : IBrowseService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly string _coreCartURL;
        private readonly string _appCustomerURL;
        private readonly string _appCatalogURL;
        private readonly string _appProductURL;
        private readonly ILogger<BrowseService> _logger;
        private readonly ICachingService _cachingService;

        public BrowseService(IMiddleTierHttpClient middleTierHttpClient, 
            ICachingService cachingService,
            ILogger<BrowseService> logger, IOptions<AppSettings> options
            )
        {
            _middleTierHttpClient=middleTierHttpClient;
            _cachingService = cachingService;
            _logger = logger;
            _coreCartURL = options?.Value.GetSetting("App.Cart.Url");
            _appCustomerURL = options?.Value.GetSetting("App.Customer.Url");
            _appCatalogURL = options?.Value.GetSetting("App.Catalog.Url");
            _appProductURL = options?.Value.GetSetting("App.Product.Url");
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
                _logger.LogError(ex, $"Exception at getting {nameof(GetHeader)}: {nameof(BrowseService)}");
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
                    getCatalogResponse = await _middleTierHttpClient.GetAsync<GetCatalogResponse>(CatalogURL);
                    await _cachingService.SetCatalogCache(getCatalogResponse, request.Id);
                }
                return getCatalogResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception at getting {nameof(GetCatalogDetails)}: {nameof(BrowseService)}");
                throw ex;
            }
        }

        public async Task<IEnumerable<CustomerModel>> GetCustomerDetails(GetCustomerRequest request)
        {
            var CustomerURL = _appCustomerURL.BuildQuery(request);
            try
            {
                var getCustomerDetailsResponse = await _middleTierHttpClient.GetAsync<IEnumerable<CustomerModel>>(CustomerURL);
                return getCustomerDetailsResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception at getting {nameof(GetCustomerDetails)}: {nameof(BrowseService)}");
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
                _logger.LogError(ex, $"Exception at getting {nameof(GetCartDetails)}: {nameof(BrowseService)}");
                throw ex;
            }
        }

        public async Task<ProductData> FindProductDetails(GetProductRequest request)
        {
            var ProductURL = _appProductURL.AppendPathSegment("Find").BuildQuery(request);
            try
            {
                
                var getProductResponse = await _middleTierHttpClient.GetAsync<ProductData>(ProductURL);
                return getProductResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception at getting {nameof(FindProductDetails)}: {nameof(BrowseService)}");
                throw;
            }
        }

        public async Task<SummaryDetails> FindSummaryDetails(FindSummaryRequest request)
        {
            var ProductURL = _appProductURL.AppendPathSegment("Find").BuildQuery(request);
            try
            {
                var getProductResponse = await _middleTierHttpClient.GetAsync<SummaryDetails>(ProductURL).ConfigureAwait(false);
                return getProductResponse;
            }
           
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception at getting {nameof(FindSummaryDetails)}: {nameof(BrowseService)}");
                throw;
            }
        }

        public async Task<IEnumerable<ProductModel>> GetProductDetails(GetProductDetailsRequest request)
        {
            var ProductURL = _appProductURL.BuildQuery(request);
            try
            {
                var getProductResponse = await _middleTierHttpClient.GetAsync<IEnumerable<ProductModel>>(ProductURL);
                return getProductResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception at getting {nameof(GetProductDetails)}: {nameof(BrowseService)}");
                throw;
            }
        }

        public async Task<SummaryModel> GetProductSummary(GetProductSummaryRequest request)
        {
            var ProductURL = _appProductURL.BuildQuery(request);
            try
            {
                var getProductResponse = await _middleTierHttpClient.GetAsync<IEnumerable<SummaryModel>>(ProductURL);
                return getProductResponse.FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception at getting {nameof(GetProductSummary)}: {nameof(BrowseService)}");
                throw;
            }
        }
    }
}