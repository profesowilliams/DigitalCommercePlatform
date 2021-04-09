using AutoMapper;
using DigitalCommercePlatform.UIServices.Quote.Models;
using DigitalFoundation.App.Services.Quote.DTO.Common;
using DigitalFoundation.App.Services.Quote.Models.Quote;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using Flurl;
using MediatR;
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
    public sealed class GetTdQuotesForGridHandler
    {
        public class Request : IRequest<Response>
        {
            public string AccessToken { get; set; }
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

            public Request() { }
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
            private readonly IMiddleTierHttpClient _client;
            // TODO: IMiddleTierHttpClient is not fully implemented yet, so we are using IHttpClientFactory in the meantime
            private readonly IHttpClientFactory _httpClientFactory;
            private readonly ILogger<Handler> _logger;
            private readonly IOptions<AppSettings> _appSettings;

            private readonly string _appQuoteKey;

            public Handler(IOptions<AppSettings> appSettings, IMapper mapper, IMiddleTierHttpClient client, IHttpClientFactory httpClientFactory, ILogger<Handler> logger)
            {
                if (httpClientFactory == null) { throw new ArgumentNullException(nameof(httpClientFactory)); }

                _mapper = mapper;
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

                    var httpRequest = new HttpRequestMessage()
                    {
                        RequestUri = new Uri(url),
                        Method = HttpMethod.Get,
                    };
                    var serializerOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true, };

                    HttpResponseMessage response = await httpClient.SendAsync(httpRequest, cancellationToken);
                    response.EnsureSuccessStatusCode();
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var quotes = JsonSerializer.Deserialize<FindResponse<IEnumerable<QuoteModel>>>(responseBody, serializerOptions);

                    var quotesOutput = _mapper.Map<FindResponse<IEnumerable<TdQuoteForGrid>>>(quotes);
                    var result = new Response(quotesOutput);
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