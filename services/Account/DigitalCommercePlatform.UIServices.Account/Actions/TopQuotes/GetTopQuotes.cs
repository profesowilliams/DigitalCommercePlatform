using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Models.Quotes;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.TopQuotes
{
    [ExcludeFromCodeCoverage]
    public sealed class GetTopQuotes
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public int? Top { get; set; }
            public string SortDirection { get; set; } = "desc";
            public string Sortby { get; set; }
        }

        public class Response
        {
            public IEnumerable<OpenResellerItems> Summary { get; set; }
        }

        public class GetTopQuotesQueryHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountQueryService;
            private readonly IMapper _mapper;
            private readonly ILogger<GetTopQuotesQueryHandler> _logger;

            public GetTopQuotesQueryHandler(IAccountService accountQueryService,
                IMapper mapper,
                ILogger<GetTopQuotesQueryHandler> logger
                )
            {
                _accountQueryService = accountQueryService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                FindResponse<IEnumerable<QuoteModel>> quotes = await _accountQueryService.GetTopQuotesAsync(request);
                var getQuotes = _mapper.Map<Response>(quotes);
                return new ResponseBase<Response> { Content = getQuotes };
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