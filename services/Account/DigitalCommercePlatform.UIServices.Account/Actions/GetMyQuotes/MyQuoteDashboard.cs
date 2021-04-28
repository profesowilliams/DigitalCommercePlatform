using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Models.Quotes;
using DigitalCommercePlatform.UIServices.Account.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.GetMyQuotes
{
    [ExcludeFromCodeCoverage]
    public sealed class MyQuoteDashboard
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Criteria { get; set; }
        }

        public class Response
        {
            public MyQuotes Items { get; set; }

        }

        public class MyQuotesHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountService;
            private readonly IMapper _mapper;
            private readonly ILogger<MyQuotesHandler> _logger;
            public MyQuotesHandler(IAccountService accountService,IMapper mapper,ILogger<MyQuotesHandler> logger)
            {
                _accountService = accountService;
                _mapper = mapper;
                _logger = logger;
            }
            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var myQuotes = await _accountService.MyQuotesSummaryAsync(request);
                    var getMyQuotes = _mapper.Map<Response>(myQuotes);
                    return new ResponseBase<Response> { Content = getMyQuotes };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting ActionItemsSummaryQueryHandler  : " + nameof(MyQuotesHandler));
                    throw;
                }

            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Criteria).NotNull();
            }
        }
    }
}
