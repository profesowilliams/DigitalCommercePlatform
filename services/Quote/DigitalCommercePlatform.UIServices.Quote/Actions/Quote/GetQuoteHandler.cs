using AutoMapper;
using DigitalFoundation.App.Services.Quote.Models.Quote;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Quote.Actions.Quote
{
    public sealed class GetQuoteHandler
    {
        public class Request : IRequest<Response>
        {
            public string Id { get; }
            public bool Details { get; }
            public string AccessToken { get; }

            public Request(string id, bool details, string accessToken)
            {
                Id = id;
                Details = details;
                AccessToken = accessToken;
            }
        }

        public class Response
        {
            public QuoteModel Content { get; }

            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }

            public Response(QuoteModel model)
            {
                Content = model;
            }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IMiddleTierHttpClient _client;
            private readonly IHttpClientFactory _httpClientFactory;
            private readonly ILogger<Handler> _logger;
            private readonly IOptions<AppSettings> _appSettings;

            private readonly string _appQuoteKey;

            public Handler(IOptions<AppSettings> appSettings, IMapper mapper, IMiddleTierHttpClient client, IHttpClientFactory httpClientFactory, ILogger<Handler> logger)
            {
                if (httpClientFactory == null) { throw new ArgumentNullException(nameof(httpClientFactory)); }

                _client = client;
                _httpClientFactory = httpClientFactory;
                _logger = logger;
                _appSettings = appSettings;
                _appQuoteKey = "App.Quote.Url";
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

                    var baseUrl = _appSettings.Value.TryGetSetting(_appQuoteKey);
                    var url = baseUrl + "/" + request.Id;
                    var httpRequest = new HttpRequestMessage()
                    {
                        RequestUri = new Uri(url),
                        Method = HttpMethod.Get,
                    };
                    var serializerOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true, };

                    HttpResponseMessage response = await httpClient.SendAsync(httpRequest, cancellationToken);
                    response.EnsureSuccessStatusCode();
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var data = JsonSerializer.Deserialize<QuoteModel>(responseBody, serializerOptions);
                    var result = new Response(data);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error getting quote data in {nameof(GetQuoteHandler)}");
                    throw;
                }
            }
        }
    }
}