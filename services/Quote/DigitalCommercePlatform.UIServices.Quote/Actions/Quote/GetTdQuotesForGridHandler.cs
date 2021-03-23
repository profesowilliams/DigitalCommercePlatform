using AutoMapper;
using DigitalCommercePlatform.UIServices.Quote.Infrastructure;
using DigitalCommercePlatform.UIServices.Quote.Models;
using DigitalFoundation.App.Services.Quote.DTO.Common;
using DigitalFoundation.App.Services.Quote.Models.Quote;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using Flurl;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Quote.Actions.Quote
{
    public sealed class GetTdQuotesForGridHandler
    {
        public class Request : IRequest<Response>
        {
            public string CreatedBy { get; set; }
            public string QuoteIdFilter { get; set; }
            public string ConfigIdFilter { get; set; }
            public DateTime? QuoteCreationDateFilter { get; set; }
            public DateTime? QuoteExpirationDateFilter { get; set; }
            public string SortBy { get; set; }
            public bool? SortAscending { get; set; }
            public int? PageSize { get; set; }
            public int? PageNumber { get; set; }
            public bool? WithPaginationInfo { get; set; }
            public RequestHeaders Headers { get; set; }
            public Request()
            {
                Headers = new RequestHeaders();
            }
        }

        public class Response
        {
            public FindResponse<IEnumerable<TdQuoteForGrid>> Content { get; set; }

            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }

            public Response(FindResponse<IEnumerable<TdQuoteForGrid>> model)
            {
                Content = model;
            }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IMapper _mapper;
            private readonly IMiddleTierHttpClient _httpClient;
            private readonly ILogger<Handler> _logger;
            private readonly IOptions<AppSettings> _appSettings;
            private readonly IUIContext _context;

            private readonly string _appQuoteKey;

            public Handler(IUIContext context, IOptions<AppSettings> appSettings, IMapper mapper, IMiddleTierHttpClient httpClient, ILogger<Handler> logger)
            {
                if (httpClient == null) { throw new ArgumentNullException(nameof(httpClient)); }

                _context = context;
                _mapper = mapper;
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
                    var url = baseUrl
                        .AppendPathSegment("find")
                        .SetQueryParams(new
                        {
                            createdBy = request.CreatedBy,
                            sortBy = request.SortBy,
                            sortAscending = request.SortAscending,
                            page = request.PageNumber,
                            pageSize = request.PageSize,
                            withPaginationInfo = request.WithPaginationInfo,
                            // Filters
                            id = request.QuoteIdFilter,
                            // ??? = request.ConfigIdFilter, // JH: I'm not able to find which field allows me to filter by ConfigId in App-Quote
                            createdTo = request.QuoteCreationDateFilter,
                            expiresTo = request.QuoteExpirationDateFilter,
                        });
                    var result = await _httpClient.GetAsync<FindResponse<IEnumerable<QuoteModel>>>(url);
                    var quotesOutput = _mapper.Map<FindResponse<IEnumerable<TdQuoteForGrid>>>(result);
                    var response = new Response(quotesOutput);
                    return response;
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