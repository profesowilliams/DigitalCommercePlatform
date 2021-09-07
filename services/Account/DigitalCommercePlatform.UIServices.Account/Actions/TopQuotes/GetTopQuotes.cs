//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models;
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
            public TopQuotes Summary { get; set; }
        }

        public class TopQuotes
        {
            public IEnumerable<OpenResellerItems> Items  { get; set; }

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
                    var quotes = await _accountQueryService.GetTopQuotesAsync(request);
                    var tempQuotes = _mapper.Map<TopQuotes>(quotes);
                    var getQuotes = _mapper.Map<Response>(tempQuotes);
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
