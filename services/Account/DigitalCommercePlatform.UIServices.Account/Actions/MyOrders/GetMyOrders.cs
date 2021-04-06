using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using MediatR;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Account.Services;
using AutoMapper;
using Microsoft.Extensions.Logging;
using System.Threading;
using FluentValidation;
using DigitalCommercePlatform.UIServices.Account.Models.Orders;

namespace DigitalCommercePlatform.UIServices.Account.Actions.MyOrders
{
    [ExcludeFromCodeCoverage]
    public sealed class GetMyOrders
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public bool IsMonthly { get; set; }
        }

        public class Response
        {
            public MyOrdersDashboard items { get; set; }

        }

        public class MyOrdersHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountService;
            private readonly IMapper _mapper;
            private readonly ILogger<MyOrdersHandler> _logger;
            public MyOrdersHandler(IAccountService accountService, IMapper mapper, ILogger<MyOrdersHandler> logger)
            {
                _accountService = accountService;
                _mapper = mapper;
                _logger = logger;
            }
            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var myOrders = await _accountService.GetMyOrdersSummaryAsync(request);
                    var getMyOrders = _mapper.Map<Response>(myOrders);
                    return new ResponseBase<Response> { Content = getMyOrders };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting MyOrders from  : " + nameof(MyOrdersHandler));
                    throw;
                }

            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.IsMonthly).NotNull();
            }
        }
    }
}
