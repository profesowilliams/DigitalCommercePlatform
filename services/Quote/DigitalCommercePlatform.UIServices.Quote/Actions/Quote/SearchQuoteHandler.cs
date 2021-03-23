using AutoMapper;
using DigitalCommercePlatform.UIServices.Quote.Infrastructure;
using DigitalFoundation.App.Services.Quote.DTO.Common;
using DigitalFoundation.App.Services.Quote.Models;
using DigitalFoundation.App.Services.Quote.Models.Quote;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
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
            private readonly IMiddleTierHttpClient _httpClient;
            private readonly ILogger<Handler> _logger;
            private readonly IOptions<AppSettings> _appSettings;
            private readonly IUIContext _context;

            private readonly string _appQuoteKey;

            public Handler(IUIContext context, IOptions<AppSettings> appSettings, IMapper mapper, IMiddleTierHttpClient httpClient, ILogger<Handler> logger)
            {
                if (httpClient == null) { throw new ArgumentNullException(nameof(httpClient)); }

                _context = context;
                _httpClient = httpClient;
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
                    var url = baseUrl + "/Find?id=" + request.Search.Id;
                    var result = await _httpClient.GetAsync<FindResponse<IEnumerable<QuoteModel>>>(url);
                    var response = new Response(result);
                    return response;
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