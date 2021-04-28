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

namespace DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary
{
    [ExcludeFromCodeCoverage]
    public sealed class GetDealsSummary
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Days { get; set; }
        }

        public class Response
        {
            public List<DealsSummaryModel> Items { get; set; }           
        }

        public class DealsSummaryQueryHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountService;
            private readonly IMapper _mapper;
            private readonly ILogger<DealsSummaryQueryHandler> _logger;
            public DealsSummaryQueryHandler(IAccountService accountService, 
                IMapper mapper,
                ILogger<DealsSummaryQueryHandler> logger
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
                    var deals = await _accountService.GetDealsSummaryAsync(request);
                    var getDeals = _mapper.Map<Response>(deals);
                    return new ResponseBase<Response> { Content = getDeals };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting DealsSummaryQueryHandler  : " + nameof(DealsSummaryQueryHandler));
                    throw;
                }

            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Days).NotNull();
            }
        }
    }
}
