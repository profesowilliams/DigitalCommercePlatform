using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalFoundation.Common.Extensions;
using Flurl;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    [ExcludeFromCodeCoverage]
    public class CommerceService : ICommerceService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _appOrderServiceUrl;
        //private readonly string _appQuoteServiceUrl;
        public CommerceService(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
            _appOrderServiceUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-order/v1/";
            //_appQuoteServiceUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-quote/v1/";            
        }

        public async Task<OrderModel> GetOrderByIdAsync(string id)
        {
            var url = _appOrderServiceUrl.SetQueryParams(new { id });
            var getOrderByIdRequestMessage = new HttpRequestMessage(HttpMethod.Get, url);

            var apiOrdersClient = _clientFactory.CreateClient("apiServiceClient");

            var getOrderByIdHttpResponse = await apiOrdersClient.SendAsync(getOrderByIdRequestMessage);
            getOrderByIdHttpResponse.EnsureSuccessStatusCode();

            var getOrderByIdResponse = await getOrderByIdHttpResponse.Content.ReadAsAsync<List<OrderModel>>();
            return getOrderByIdResponse?.FirstOrDefault();
        }


        public Task<string> GetQuote(string Id)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetQuotes(string Id)
        {
            throw new NotImplementedException();
        }

        public async Task<OrdersContainer> GetOrdersAsync(SearchCriteria orderParameters)
        {
            var url = _appOrderServiceUrl.AppendPathSegment("Find")
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
