using AutoMapper;
using DigitalFoundation.Common.Client;
using MediatR;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Quote.Actions.Quote
{
    public class GetQuoteRequest : IRequest<GetQuoteResponse>
    {
        public string Id { get; }
        public bool Details { get; }
        public string AccessToken { get; }

        public GetQuoteRequest(string id, bool details, string accessToken)
        {
            Id = id;
            Details = details;
            AccessToken = accessToken;
        }
    }

    public class GetQuoteResponse
    {
        public string Content { get; }

        public virtual bool IsError { get; set; }
        public string ErrorCode { get; set; }

        public GetQuoteResponse(string json)
        {
            Content = json;
        }
    }

    public class GetQuoteHandler : IRequestHandler<GetQuoteRequest, GetQuoteResponse>
    {
        //private readonly IMiddleTierHttpClient _middleTierHttpClient;
        //private readonly IMapper _mapper;
        private readonly IHttpClientFactory _httpClientFactory;

        public GetQuoteHandler(IHttpClientFactory httpClientFactory) //IMiddleTierHttpClient middleTierHttpClient, IMapper mapper)
        {
            //if (middleTierHttpClient == null) { throw new ArgumentNullException(nameof(middleTierHttpClient)); }
            //if (mapper == null) { throw new ArgumentNullException(nameof(mapper)); }
            if (httpClientFactory == null) { throw new ArgumentNullException(nameof(httpClientFactory)); }

            //_middleTierHttpClient = middleTierHttpClient;
            //_mapper = mapper;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<GetQuoteResponse> Handle(GetQuoteRequest request, CancellationToken cancellationToken)
        {
            HttpClient httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", request.AccessToken);
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
            httpClient.DefaultRequestHeaders.Add("Site", "NA");
            httpClient.DefaultRequestHeaders.Add("Consumer", "NA");
            var url = "https://eastus-sit-service.dc.tdebusiness.cloud/app-quote/v1/" + request.Id;
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
                var result = new GetQuoteResponse(responseBody);
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