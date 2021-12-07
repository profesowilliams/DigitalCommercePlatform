//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Deals;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.TopDeals
{
    [ExcludeFromCodeCoverage]
    public sealed class GetTopDeals
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public int? Top { get; set; }
        }

        public class Response
        {
            public DealModel Summary { get; set; }
        }

        public class GetTopDealsQueryHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountService;
            private readonly IMapper _mapper;
            private readonly ILogger<GetTopDealsQueryHandler> _logger;

            public GetTopDealsQueryHandler(IAccountService accountService,
                IMapper mapper,
                ILogger<GetTopDealsQueryHandler> logger
                )
            {
                _accountService = accountService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var deals = await _accountService.GetTopDealsAsync(request);
                var mappedDeals = _mapper.Map<Response>(deals);
                return new ResponseBase<Response> { Content = mappedDeals };
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
