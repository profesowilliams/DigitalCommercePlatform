using AutoMapper;
using DigitalFoundation.AppServices.Quote.Models.Quote;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
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
            public IEnumerable<QuoteModel> Content { get; }

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
            private readonly ILogger<Handler> _logger;

            private readonly string _appQuoteUrl;

            public Handler(IMapper mapper, IMiddleTierHttpClient client, ILogger<Handler> logger)
            {
                _client = client;
                _logger = logger;
                _appQuoteUrl = "https://eastus-sit-service.dc.tdebusiness.cloud/app-quote/v1/";
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    _logger.LogInformation($"UIService.Quote.GetQuote");
                    var url = $"{_appQuoteUrl}/"
                        .BuildQuery(request);

                    var data = await _client.GetAsync<Response>(url).ConfigureAwait(false);
                    return data;

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