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
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalFoundation.Common.Contexts;

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
        private readonly IUIContext _uiContext;

        public BrowseService(IMiddleTierHttpClient middleTierHttpClient, ICachingService cachingService, ILogger<BrowseService> logger, IOptions<AppSettings> options, IUIContext uiContext)
        {
            _uiContext = uiContext;
            _middleTierHttpClient = middleTierHttpClient;
            _cachingService = cachingService;
            _logger = logger;
            _coreCartURL = options?.Value.GetSetting("App.Cart.Url");
            _appCustomerURL = options?.Value.GetSetting("App.Customer.Url");
            _appCatalogURL = options?.Value.GetSetting("App.Catalog.Url");
            _appProductURL = options?.Value.GetSetting("App.Product.Url");
        }


        public async Task<GetHeaderHandler.Response> GetHeader(GetHeaderHandler.Request request)
        {
            try
            {
                var customerRequest = new GetCustomerHandler.Request(_uiContext.User.Customers.FirstOrDefault());
                var cartRequest = new GetCartHandler.Request(_uiContext.User.ID, _uiContext.User.Customers.FirstOrDefault());
                var CatalogRequest = new GetCatalogHandler.Request(request.CatalogCriteria);
                var cartResponse = await GetCartDetails(cartRequest);
                var customerDetailsResponse = await GetCustomerDetails(customerRequest);
                var CatalogDetailsResponse = await GetCatalogDetails(CatalogRequest);

                var getHeaderResponse = new GetHeaderHandler.Response
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

        public async Task<GetCatalogHandler.Response> GetCatalogDetails(GetCatalogHandler.Request request)
        {
            var CatalogURL = _appCatalogURL.BuildQuery(request);
            try
            {
                var getCatalogResponse = await _cachingService.GetCatalogFromCache(request.Id);
                if (getCatalogResponse == null)
                {
                    getCatalogResponse = await _middleTierHttpClient.GetAsync<GetCatalogHandler.Response>(CatalogURL);
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

        public async Task<IEnumerable<CustomerModel>> GetCustomerDetails(GetCustomerHandler.Request request)
        {
            var CustomerURL = _appCustomerURL.BuildQuery(request);
            try
            {
                var customerRequest = new GetCustomerHandler.Request(_uiContext.User.Customers.FirstOrDefault());
                var getCustomerDetailsResponse = await _middleTierHttpClient.GetAsync<IEnumerable<CustomerModel>>(CustomerURL);
                return getCustomerDetailsResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception at getting {nameof(GetCustomerDetails)}: {nameof(BrowseService)}");
                throw ex;
            }
            
        }

        public Task<GetCartHandler.Response> GetCartDetails(GetCartHandler.Request request)
        {
            var CartURL = _coreCartURL.BuildQuery(request);
            try
            {
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
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception at getting {nameof(GetCartDetails)}: {nameof(BrowseService)}");
                throw ex;
            }
        }

        public async Task<ProductData> FindProductDetails(FindProductHandler.Request request)
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

        public async Task<SummaryDetails> FindSummaryDetails(FindSummaryHandler.Request request)
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

        public async Task<IEnumerable<ProductModel>> GetProductDetails(GetProductDetailsHandler.Request request)
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

        public async Task<SummaryModel> GetProductSummary(GetProductSummaryHandler.Request request)
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