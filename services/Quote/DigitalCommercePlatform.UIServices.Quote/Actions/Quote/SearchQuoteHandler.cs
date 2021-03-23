using AutoMapper;
using DigitalCommercePlatform.UIServices.Quote.Infrastructure;
using DigitalFoundation.App.Services.Quote.DTO.Common;
using DigitalFoundation.App.Services.Quote.Models;
using DigitalFoundation.App.Services.Quote.Models.Quote;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Quote.Actions.Quote
{
    public sealed class SearchQuoteHandler
    {
        public class Request : IRequest<Response>
        {
            public FindModel Search { get; set; }
            public RequestHeaders Headers { get; set; }
            public Request()
            {
                Headers = new RequestHeaders();
            }

            public Request(FindModel search, RequestHeaders headers)
            {
                Search = search;
                Headers = headers;
            }
        }

        public class Response
        {
            public FindResponse<IEnumerable<QuoteModel>> Content { get; set; }

            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }

            public Response(FindResponse<IEnumerable<QuoteModel>> model)
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
            private readonly IUIContext _context;

            private readonly string _appQuoteKey;

            public Handler(IUIContext context, IOptions<AppSettings> appSettings, IMapper mapper, IMiddleTierHttpClient client, IHttpClientFactory httpClientFactory, ILogger<Handler> logger)
            {
                if (httpClientFactory == null) { throw new ArgumentNullException(nameof(httpClientFactory)); }

                _context = context;
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
                    _context.SetContextFromRequest(request.Headers);
                    HttpClient httpClient = _httpClientFactory.CreateClient();
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _context.AccessToken);
                    httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
                    httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
                    httpClient.DefaultRequestHeaders.Add("Site", "NA");
                    httpClient.DefaultRequestHeaders.Add("Consumer", "NA");

                    var baseUrl = _appSettings.Value.GetSetting(_appQuoteKey);
                    var url = baseUrl + "/Find?id=" + request.Search.Id;
                    var httpRequest = new HttpRequestMessage()
                    {
                        RequestUri = new Uri(url),
                        Method = HttpMethod.Get,
                    };
                    var serializerOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true, };

                    HttpResponseMessage response = await httpClient.SendAsync(httpRequest, cancellationToken);
                    response.EnsureSuccessStatusCode();
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var data = JsonSerializer.Deserialize<FindResponse<IEnumerable<QuoteModel>>>(responseBody, serializerOptions);
                    var result = new Response(data);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error getting quote data in {nameof(SearchQuoteHandler)}");
                    throw;
                }
            }
        }
    }
}