//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals
{
    [ExcludeFromCodeCoverage]
    public sealed class GetRenewalQuoteDetailed
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string[] Id { get; set; }
            public string Type { get; set; }
            public bool Details { get; set; } = true;
        }

        public class Response
        {
            public List<QuoteDetailedModel> Details { get; set; }
        }

        [ExcludeFromCodeCoverage]
        public class GetRenewalQuoteDetailedHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IRenewalService _renewalsService;
            private readonly IMapper _mapper;
            private readonly ILogger<GetRenewalQuoteDetailedHandler> _logger;

            public GetRenewalQuoteDetailedHandler(IRenewalService renewalsService, IMapper mapper, ILogger<GetRenewalQuoteDetailedHandler> logger)
            {
                _renewalsService = renewalsService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                List<QuoteDetailedModel> renewalsResponse = await _renewalsService.GetRenewalsQuoteDetailedFor(request);

                var response = new Response
                {
                    Details = renewalsResponse
                };
                return new ResponseBase<Response> { Content = response };
            }

            public class Validator : AbstractValidator<Request>
            {
                public Validator()
                {
                    RuleFor(c => c.Id).NotNull().NotEmpty();
                    RuleFor(c => c.Type).NotNull().NotEmpty();
                }
            }
        }
    }
}