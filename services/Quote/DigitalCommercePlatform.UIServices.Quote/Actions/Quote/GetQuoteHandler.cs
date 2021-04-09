using AutoMapper;
using DigitalCommercePlatform.UIServices.Quote.Infrastructure;
using DigitalFoundation.App.Services.Quote.Models.Quote;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Quote.Actions.Quote
{
    public sealed class GetQuoteHandler
    {
        public class Request : IRequest<Response>
        {
            [FromRoute]
            public string Id { get; set; }
            [FromQuery]
            public bool Details { get; set; }
            public RequestHeaders Headers { get; set; }
            public Request()
            {
                Headers = new RequestHeaders();
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
            private readonly IMiddleTierHttpClient _httpClient;
            private readonly IHttpClientFactory _httpClientFactory;
            private readonly ILogger<Handler> _logger;
            private readonly IOptions<AppSettings> _appSettings;
            private readonly IUIContext _context;

            private readonly string _appQuoteKey;

            public Handler(IUIContext context, IOptions<AppSettings> appSettings, IMapper mapper, IMiddleTierHttpClient httpClient, IHttpClientFactory httpClientFactory, ILogger<Handler> logger)
            {
                if (httpClient == null) { throw new ArgumentNullException(nameof(httpClient)); }

                _context = context;
                _httpClient = httpClient;
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
                    var baseUrl = _appSettings.Value.GetSetting(_appQuoteKey);
                    var url = baseUrl + "/" + request.Id;
                    var result = await _httpClient.GetAsync<QuoteModel>(url);
                    var response = new Response(result);
                    return response;
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