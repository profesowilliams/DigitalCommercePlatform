//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Find;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.Quote
{
    [ExcludeFromCodeCoverage]
    public class FindQuotes
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public FindModel Query { get; set; }

            public Request(FindModel query)
            {
                Query = query;
            }
        }

        public class Response : FindResponse<IEnumerable<QuoteModel>>
        {
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ICommerceService _commerceQueryService;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(ICommerceService commerceQueryService, IMapper mapper, ILogger<Handler> logger)
            {
                _commerceQueryService = commerceQueryService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var result = await _commerceQueryService.FindQuotes(request.Query).ConfigureAwait(false);
                    var response = _mapper.Map<Response>(result);
                    return new ResponseBase<Response> { Content = response };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at setting GetCustomerHandler : " + nameof(Handler));
                    throw;
                }
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(r => r.Query).Cascade(CascadeMode.Stop).NotNull()
                    .ChildRules(request =>
                    {
                        request.RuleFor(c => c.Id).NotEmpty();
                        request.RuleFor(c => c.OrderId).NotEmpty();
                    });
            }
        }
    }
}
