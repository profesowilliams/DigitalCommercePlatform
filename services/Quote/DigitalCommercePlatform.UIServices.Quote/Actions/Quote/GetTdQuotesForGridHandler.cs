using AutoMapper;
using DigitalFoundation.App.Services.Quote.Models.Quote;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Core.Models.DTO.Common;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Quote.Actions.Quote
{
    public sealed class GetTdQuotesForGridHandler
    {
        public class Request : IRequest<Response>
        {
            public string CreatedBy { get; }
            public string AccessToken { get; }

            public Request(string createdBy, string accessToken)
            {
                CreatedBy = createdBy;
                AccessToken = accessToken;
            }
        }

        public class Response
        {
            public PaginatedResponse<IEnumerable<QuoteModel>> Content { get; set; }

            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }

            public Response(PaginatedResponse<IEnumerable<QuoteModel>> model)
            {
                Content = model;
            }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IMiddleTierHttpClient _client;
            private readonly IHttpClientFactory _httpClientFactory;
            private readonly ILogger<Handler> _logger;

            private readonly string _appQuoteUrl;

            public Handler(IMapper mapper, IMiddleTierHttpClient client, IHttpClientFactory httpClientFactory, ILogger<Handler> logger)
            {
                if (httpClientFactory == null) { throw new ArgumentNullException(nameof(httpClientFactory)); }

                _client = client;
                _httpClientFactory = httpClientFactory;
                _logger = logger;
                _appQuoteUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-quote/v1/";
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    HttpClient httpClient = _httpClientFactory.CreateClient();
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", request.AccessToken);
                    httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
                    httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
                    httpClient.DefaultRequestHeaders.Add("Site", "NA");
                    httpClient.DefaultRequestHeaders.Add("Consumer", "NA");
                    var url = _appQuoteUrl + "find?createdBy=" + request.CreatedBy;
                    var httpRequest = new HttpRequestMessage()
                    {
                        RequestUri = new Uri(url),
                        Method = HttpMethod.Get,
                    };
                    var serializerOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true, };

                    HttpResponseMessage response = await httpClient.SendAsync(httpRequest, cancellationToken);
                    response.EnsureSuccessStatusCode();
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var data = JsonSerializer.Deserialize<PaginatedResponse<IEnumerable<QuoteModel>>>(responseBody, serializerOptions);
                    var result = new Response(data);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error getting quote data in {nameof(GetTdQuotesForGridHandler)}");
                    throw;
                }
            }
        }
    }
}