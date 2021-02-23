using DigitalCommercePlatform.UIServices.Order.Models.Order;
using DigitalCommercePlatform.UIServices.Order.Services.Contracts;
using DigitalFoundation.Common.Extensions;
using Flurl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Order.Services.Implementations
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

        public async Task<OrderModel> GetOrderByIdAsync(string id)
        {
            var url = _applicationServiceOrderUrl.SetQueryParams(new { id });
            var getOrderByIdRequestMessage = new HttpRequestMessage(HttpMethod.Get, url);

            var apiOrdersClient = _clientFactory.CreateClient("apiServiceClient");

            var getOrderByIdHttpResponse = await apiOrdersClient.SendAsync(getOrderByIdRequestMessage);
            getOrderByIdHttpResponse.EnsureSuccessStatusCode();

            var getOrderByIdResponse = await getOrderByIdHttpResponse.Content.ReadAsAsync<List<OrderModel>>();
            return getOrderByIdResponse?.FirstOrDefault();
        }

        public async Task<OrdersContainer> GetOrdersAsync(SearchCriteria orderParameters)
        {
            var url = _applicationServiceOrderUrl.AppendPathSegment("Find")
                        .SetQueryParams(new
                        {
                            orderParameters.Id,
                            orderParameters.CustomerPO,
                            orderParameters.CreatedFrom,
                            orderParameters.CreatedTo,
                            Sort = orderParameters.OrderBy,
                            SortAscending = orderParameters.SortAscending.ToString(),
                            orderParameters.PageSize,
                            Page = orderParameters.PageNumber,
                            WithPaginationInfo = true,
                            Details = true
                        });

            var getOrdersHttpRequestMessage = new HttpRequestMessage(HttpMethod.Get, url);

            var apiOrdersClient = _clientFactory.CreateClient("apiServiceClient");

            var getOrdersHttpResponse = await apiOrdersClient.SendAsync(getOrdersHttpRequestMessage);
            getOrdersHttpResponse.EnsureSuccessStatusCode();

            var findOrdersDto = await getOrdersHttpResponse.Content.ReadAsAsync<OrdersContainer>();
            return findOrdersDto;
        }
    }
}
