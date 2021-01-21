using AutoMapper;
using DigitalFoundation.Common.Client;
using MediatR;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Quote.Actions.Quote
{
    public class GetQuotesRequest : IRequest<GetQuotesResponse>
    {
        public List<string> Ids { get; }
        public bool Details { get; }
        public string AccessToken { get; }

        public GetQuotesRequest(List<string> ids, bool details, string accessToken)
        {
            Ids = ids;
            Details = details;
            AccessToken = accessToken;
        }
    }

    public class GetQuotesResponse
    {
        public string Content { get; }

        public virtual bool IsError { get; set; }
        public string ErrorCode { get; set; }

        public GetQuotesResponse(string json)
        {
            Content = json;
        }
    }

    public class GetQuotesHandler : IRequestHandler<GetQuotesRequest, GetQuotesResponse>
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public GetQuotesHandler(IHttpClientFactory httpClientFactory) //IMiddleTierHttpClient middleTierHttpClient, IMapper mapper)
        {
            if (httpClientFactory == null) { throw new ArgumentNullException(nameof(httpClientFactory)); }

            _httpClientFactory = httpClientFactory;
        }

        public async Task<GetQuotesResponse> Handle(GetQuotesRequest request, CancellationToken cancellationToken)
        {
            HttpClient httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", request.AccessToken);
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
            httpClient.DefaultRequestHeaders.Add("Site", "NA");
            httpClient.DefaultRequestHeaders.Add("Consumer", "NA");
            var url = "https://eastus-sit-service.dc.tdebusiness.cloud/app-quote/v1/";
            var separator = "?";
            foreach (var item in request.Ids)
            {
                url = string.Concat(url, separator + "id=" + item);
                if (separator == "?") { separator = "&"; }
            }
            var httpRequest = new HttpRequestMessage()
            {
                RequestUri = new Uri(url),
                Method = HttpMethod.Get,
            };

            try
            {
                HttpResponseMessage response = await httpClient.SendAsync(httpRequest, cancellationToken);
                response.EnsureSuccessStatusCode();
                string responseBody = await response.Content.ReadAsStringAsync();
                var result = new GetQuotesResponse(responseBody);
                return result;
            }
            catch (HttpRequestException e)
            {
                var toto = e.Message;
                return null;
            }
        }
    }
}