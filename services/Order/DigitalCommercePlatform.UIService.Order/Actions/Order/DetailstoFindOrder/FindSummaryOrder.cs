using AutoMapper;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Diagnostics.CodeAnalysis;
using FluentValidation;

namespace DigitalCommercePlatform.UIService.Order.Actions.Order.DetailstoFindOrder
{
    [ExcludeFromCodeCoverage]
    public class FindSummaryOrder
    {
        public class Request : IRequest<Response>
        {
            public FindRequestModel SearchQuery { get; set; }
        }

        public class Response
        {
            public IEnumerable<SummaryModel> Data { get; set; }
            public long Count { get; set; }
            public Response() { }
            public Response(IEnumerable<SummaryModel> orders)
            {
                Data = orders ?? throw new ArgumentNullException(nameof(orders));
            }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IMiddleTierHttpClient _client;
            private readonly ILogger<Handler> _logger;
            private readonly string _appOrderUrl;

            public Handler( IMiddleTierHttpClient client, ILogger<Handler> logger)
            {
                _client = client ?? throw new ArgumentNullException(nameof(client));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _appOrderUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-order/v1/Find";
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {

                try
                {
                    _logger.LogInformation($"UIService.Order.FindOrder");

                    //------------Need to implement passing the headers to the client-------------------------
                    //_client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Context.AccessToken);
                    //_client.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
                    //_client.DefaultRequestHeaders.Add("Accept-Language", "en-us");
                    //_client.DefaultRequestHeaders.Add("Site", "NA");
                    //_client.DefaultRequestHeaders.Add("Consumer", "NA");

                    var url = _appOrderUrl.BuildQuery(request);

                    var appResponse = await _client.GetAsync<Response>(url).ConfigureAwait(false);
                    return appResponse;

                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at: " + nameof(FindOrder));
                    throw;
                }
            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(r => r).Cascade(CascadeMode.Stop).NotNull()
                .ChildRules(re =>
                re.RuleFor(r => r.SearchQuery).Cascade(CascadeMode.Stop).NotNull()
                .ChildRules(request =>
                {
                    request.RuleFor(r => r.Page).GreaterThanOrEqualTo(0);
                    request.RuleFor(r => r.PageSize).GreaterThan(0);
                    request.RuleFor(r => r.CreatedFrom).LessThan(DateTime.Now)
                        .WithMessage($"{nameof(Request.SearchQuery.CreatedFrom)} can't be in the future.");

                    request.RuleFor(r => r.CreatedTo).LessThanOrEqualTo(DateTime.Now)
                        .WithMessage($"{nameof(Request.SearchQuery.CreatedTo)} can't be in the future.");
                }));
            }
        }
    }
}
