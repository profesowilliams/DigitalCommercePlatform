using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Models.Renewals;
using DigitalCommercePlatform.UIServices.Account.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.RenewalsSummary
{
    [ExcludeFromCodeCoverage]
    public sealed class GetRenewalsSummary
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Criteria { get; set; }
        }

        public class Response
        {
            public RenewalsSummaryModel Summary { get; set; }            
        }

        public class RenewalsSummaryQueryHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountService;
            private readonly IMapper _mapper;
            private readonly ILogger<RenewalsSummaryQueryHandler> _logger;
            public RenewalsSummaryQueryHandler(IAccountService accountService, 
                IMapper mapper,
                ILogger<RenewalsSummaryQueryHandler> logger
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
                    RenewalsSummaryModel renewals = await _accountService.GetRenewalsSummaryAsync(request);
                    var getConfigurations = _mapper.Map<Response>(renewals);
                    return new ResponseBase<Response> { Content = getConfigurations };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting ConfigurationsSummaryQueryHandler  : " + nameof(RenewalsSummaryQueryHandler));
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
