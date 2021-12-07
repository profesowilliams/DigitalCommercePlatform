//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Renewals;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
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
            public int Days { get; set; }
            public string CustomerNumber { get; set; }
            public string SalesOrganization { get; set; }
        }

        public class Response
        {
            public List<RenewalsSummaryModel> Items { get; set; }
        }

        public class RenewalsSummaryQueryHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountService;
            private readonly IRenewalsSummaryService _renewalsSummaryService;
            private readonly IMapper _mapper;
            private readonly ILogger<RenewalsSummaryQueryHandler> _logger;

            public RenewalsSummaryQueryHandler(IAccountService accountService, IRenewalsSummaryService renewalsSummaryService,
                IMapper mapper,
                ILogger<RenewalsSummaryQueryHandler> logger
                )
            {
                _accountService = accountService ?? throw new ArgumentNullException(nameof(accountService));
                _renewalsSummaryService = renewalsSummaryService ?? throw new ArgumentNullException(nameof(renewalsSummaryService));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var renewalsExpirationDates = await _accountService.GetRenewalsExpirationDatesAsync(request.CustomerNumber, request.SalesOrganization, request.Days);
                var summaryItems = _renewalsSummaryService.GetSummaryItemsFrom(renewalsExpirationDates);
                var response = _mapper.Map<Response>(summaryItems);
                return new ResponseBase<Response> { Content = response };
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
