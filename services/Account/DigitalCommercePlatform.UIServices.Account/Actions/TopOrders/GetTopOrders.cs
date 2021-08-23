using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Models.Orders;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.TopOrders
{
    [ExcludeFromCodeCoverage]
    public sealed class GetTopOrders
    {       
        public class Request : IRequest<ResponseBase<Response>>
        {
            public int? Top { get; set; }
            public string SortDirection { get; set; } = "desc";
            public string Sortby { get; set; }
        }
        [ExcludeFromCodeCoverage]
        public class Response
        {
            public List<OpenResellerItems> Summary { get; set; }
        }
        [ExcludeFromCodeCoverage]
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
                var orders = await _accountService.GetTopOrdersAsync(request);
                
                var tempOrders = _mapper.Map<List<OpenResellerItems>>(orders);
                var topOrders = _mapper.Map<Response>(tempOrders);

                return new ResponseBase<Response> { Content = topOrders };
            }
        }

        [ExcludeFromCodeCoverage]
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Top).GreaterThan(4);
            }
        }
    }
}