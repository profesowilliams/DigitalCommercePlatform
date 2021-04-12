using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Models.Deals;
using DigitalCommercePlatform.UIServices.Account.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
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
            public List<DealModel> Items {get; set; }
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
                try
                {
                    var deals = await _accountService.GetTopDealsAsync(request);
                    var mappedDeals = _mapper.Map<Response>(deals);

                    return new ResponseBase<Response> { Content = mappedDeals };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting TopDealsQueryHandler  : " + nameof(GetTopDealsQueryHandler));
                    throw;
                }
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
