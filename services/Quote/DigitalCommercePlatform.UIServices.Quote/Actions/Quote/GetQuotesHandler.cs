using AutoMapper;
using DigitalFoundation.App.Services.Quote.Models.Quote;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
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
    public sealed class GetQuotesHandler
    {
        public class Request : IRequest<Response>
        {
            public List<string> Ids { get; set; }
            public bool Details { get; set; }
            public string AccessToken { get; }

            public Request(List<string> ids, bool details, string accessToken)
            {
                Ids = ids;
                Details = details;
                AccessToken = accessToken;
            }
        }

        public class Response
        {
            public IEnumerable<QuoteModel> Content { get; set; }

            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }

            public Response(IEnumerable<QuoteModel> model)
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
                    var separator = "?";
                    var url = _appQuoteUrl;
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
                    var serializerOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true, };

                    HttpResponseMessage response = await httpClient.SendAsync(httpRequest, cancellationToken);
                    response.EnsureSuccessStatusCode();
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var data = JsonSerializer.Deserialize<IEnumerable<QuoteModel>>(responseBody, serializerOptions);
                    var result = new Response(data);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error getting quote data in {nameof(GetQuotesHandler)}");
                    throw;
                }
            }
        }
    }
}