//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Orders;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.MyOrders
{
    [ExcludeFromCodeCoverage]
    public sealed class GetMyOrdersStatus
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public DateTime? FromDate { get; init; }
            public DateTime? ToDate { get; init; }
        }

        [ExcludeFromCodeCoverage]
        public class Response
        {
            public MyOrdersStatusDashboard Items { get; set; }
        }

        [ExcludeFromCodeCoverage]
        public class MyOrdersStatusHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountService;
            private readonly IMapper _mapper;
            private readonly ILogger<MyOrdersStatusHandler> _logger;

            public MyOrdersStatusHandler(IAccountService accountService, IMapper mapper, ILogger<MyOrdersStatusHandler> logger)
            {
                _accountService = accountService;
                _mapper = mapper;
                _logger = logger;
            }

            [ExcludeFromCodeCoverage]
            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var myOrders = await _accountService.GetMyOrdersStatusAsync(request);
                var getMyOrders = _mapper.Map<Response>(myOrders);
                return new ResponseBase<Response> { Content = getMyOrders };
            }
        }

        [ExcludeFromCodeCoverage]
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.ToDate ).NotNull();
                RuleFor(x => x.FromDate).NotNull();
            }
        }
    }
}
