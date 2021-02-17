using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using DigitalFoundation.Common.Client;
using System.Diagnostics.CodeAnalysis;
using DigitalFoundation.Common.Extensions;
using static DigitalCommercePlatform.UIService.Product.Actions.Product.FindProduct.FindProductHandler;
using static DigitalCommercePlatform.UIService.Product.Actions.Product.FindSummarySearch.FindSummaryHandler;
using static DigitalCommercePlatform.UIService.Product.Actions.Product.GetProductDetails.GetProductDetailsHandler;
using static DigitalCommercePlatform.UIService.Product.Actions.Product.GetProductSummary.GetProductSummaryHandler;

namespace DigitalCommercePlatform.UIServices.Product.Services
{
    [ExcludeFromCodeCoverage]
    public class HttpProductService : IProductService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _appProductURL;
        private readonly ILogger<HttpProductService> _logger;
        public HttpProductService(IHttpClientFactory clientFactory, IMiddleTierHttpClient httpClient,ILogger<HttpProductService> logger)
        {
            //_cachingService = cachingService;
            _logger = logger;
            _clientFactory = clientFactory;
            _appProductURL = "https://eastus-dit-service.dc.tdebusiness.cloud/app-product/v1/";
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "<Pending>")]
        public async Task<GetProductResponse> FindProductdetials(GetProductRequest request)
        {
            var ProductURL = _appProductURL + "Find";
            ProductURL = ProductURL.BuildQuery(request);

            try
            {
                var getProductRequestMessage = new HttpRequestMessage(HttpMethod.Get, ProductURL);

                var apiProductClient = _clientFactory.CreateClient("apiServiceClient");

                var getProductHttpResponse = await apiProductClient.SendAsync(getProductRequestMessage).ConfigureAwait(false);
                getProductHttpResponse.EnsureSuccessStatusCode();

                var getProductResponse = await getProductHttpResponse.Content.ReadAsAsync<GetProductResponse>().ConfigureAwait(false);
                return getProductResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting HttpBrowseService GetCustomerDetails : " + nameof(HttpProductService));
                throw ;
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "<Pending>")]
        public async Task<FindSummaryResponse> FindSummarydetials(FindSummaryRequest request)
        {
            var ProductURL = _appProductURL + "Find";
            ProductURL = ProductURL.BuildQuery(request);

            try
            {
                var getProductSummaryRequestMessage = new HttpRequestMessage(HttpMethod.Get, ProductURL);

                var apiProductSummaryClient = _clientFactory.CreateClient("apiServiceClient");

                var getProductSummaryHttpResponse = await apiProductSummaryClient.SendAsync(getProductSummaryRequestMessage).ConfigureAwait(false);
                getProductSummaryHttpResponse.EnsureSuccessStatusCode();

                var getProductResponse = await getProductSummaryHttpResponse.Content.ReadAsAsync<FindSummaryResponse>().ConfigureAwait(false);
                return getProductResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting HttpBrowseService GetCustomerDetails : " + nameof(HttpProductService));
                throw ;
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "<Pending>")]
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
                    _logger.LogError(ex, "Exception at getting HttpBrowseService GetCustomerDetails : " + nameof(HttpProductService));
                    throw ;
                }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "<Pending>")]
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
                _logger.LogError(ex, "Exception at getting HttpBrowseService GetCustomerDetails : " + nameof(HttpProductService));
                throw ;
            }
        }
    }
}
