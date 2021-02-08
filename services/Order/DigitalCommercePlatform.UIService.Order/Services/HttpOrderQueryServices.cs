using DigitalFoundation.Common.Extensions;
using Flurl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Order.Services
{
    public class HttpOrderQueryServices : IOrderQueryServices
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _applicationServiceOrderUrl;

        public HttpOrderQueryServices(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory ?? throw new ArgumentNullException(nameof(clientFactory));
            
            _applicationServiceOrderUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-order/v1/";
            // check is something like https://eastus-dit-service.dc.tdebusiness.cloud/core-config/v1/appSetting/UI.Order to take URL 
        }

        public async Task<OrderDto> GetOrderByIdAsync(string id)
        {
            var url = _applicationServiceOrderUrl.SetQueryParams(new { id });
            var getOrderByIdRequestMessage = new HttpRequestMessage(HttpMethod.Get, url);

            var apiOrdersClient = _clientFactory.CreateClient("apiServiceClient");
            apiOrdersClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "0006QBwns0hmrIsX9t6GDRtfZM4w"); // in future from Redis

            var getOrderByIdHttpResponse = await apiOrdersClient.SendAsync(getOrderByIdRequestMessage);
            getOrderByIdHttpResponse.EnsureSuccessStatusCode();

            var getOrderByIdResponse = await getOrderByIdHttpResponse.Content.ReadAsAsync<List<OrderDto>>();
            return getOrderByIdResponse?.FirstOrDefault();
        }

        public async Task<OrdersCollectionDto> GetOrdersAsync(string orderBy, bool sortAscending)
        {
            var url = _applicationServiceOrderUrl.AppendPathSegment("Find")
                        .SetQueryParams(new
                        {
                            SortAscending = sortAscending.ToString(),
                            Sort = orderBy,
                            Details = true
                        });

            var getOrdersHttpRequestMessage = new HttpRequestMessage(HttpMethod.Get, url);

            var apiOrdersClient = _clientFactory.CreateClient("apiServiceClient");
            apiOrdersClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "0006QBwns0hmrIsX9t6GDRtfZM4w");

            var getOrdersHttpResponse = await apiOrdersClient.SendAsync(getOrdersHttpRequestMessage);
            getOrdersHttpResponse.EnsureSuccessStatusCode();

            var findOrdersDto = await getOrdersHttpResponse.Content.ReadAsAsync<OrdersCollectionDto>();
            return findOrdersDto;
        }
    }
}
