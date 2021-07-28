using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Models.Configurations;
using DigitalCommercePlatform.UIServices.Account.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.TopConfigurations
{
    [ExcludeFromCodeCoverage]
    public sealed class GetTopConfigurations
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public int? Top { get; init; }
            public string SortDirection { get; init; }
            public string SortBy { get; init; }
        }

        public class Response
        {
            public ActiveOpenConfigurationsModel Summary { get; set; }
        }

        public class GetTopConfigurationsQueryHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountService;
            private readonly IMapper _mapper;
            private readonly ILogger<GetTopConfigurationsQueryHandler> _logger;

            public GetTopConfigurationsQueryHandler(IAccountService accountService,
                IMapper mapper,
                ILogger<GetTopConfigurationsQueryHandler> logger
                )
            {
                _accountService = accountService;
                _mapper = mapper;
                _logger = logger;
            }
            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var topConfigurations = await _accountService.GetTopConfigurationsAsync(request);

                var openResellerItems = topConfigurations?.Data?.Select(i => new OpenResellerItems
                {
                    CurrencyCode = "USD",
                    CurrencySymbol = "$",
                    Amount = i.TotalListPrice,
                    FormattedAmount = string.Format("{0:N2}", i.TotalListPrice),
                    EndUserName = i.EndUser?.Name ?? i.Source?.Id ?? string.Empty
                }).ToList();

                var activeOpenConfigurationsModel = new Response { Summary = new ActiveOpenConfigurationsModel { Items = openResellerItems } };
                return new ResponseBase<Response> { Content = activeOpenConfigurationsModel };
            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Top).GreaterThan(4);
            }
        }
    }
}
