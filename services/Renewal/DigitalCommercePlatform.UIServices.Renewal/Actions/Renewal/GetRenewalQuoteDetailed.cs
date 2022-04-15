//2022 (c) Tech Data Corporation - All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
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

            public GetRenewalQuoteDetailedHandler(IRenewalService renewalsService)
            {
                _renewalsService = renewalsService;
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