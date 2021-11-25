//2021 (c) Tech Data Corporation - All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Models;
using DigitalCommercePlatform.UIServices.Order.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;

namespace DigitalCommercePlatform.UIServices.Order.Actions.NuanceChat
{
    [ExcludeFromCodeCoverage]
    public sealed class GetOrder
    {
       
        public class Request : IRequest<NuanceChatBotResponseModel>
        {
            public NuanceWebChatRequest WbChatRequest { get; set; }
        }
       
        public class Handler : IRequestHandler<Request, NuanceChatBotResponseModel>
        {
            private readonly IOrderService _orderService;
            private readonly IMapper _mapper;
            private readonly ILogger<GetOrder> _logger;

            public Handler(IOrderService orderService, IMapper mapper, ILogger<GetOrder> logger)
            {
                _orderService = orderService;
                _mapper = mapper;
                _logger = logger;
            }
            public async Task<NuanceChatBotResponseModel> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var order = await _orderService.GetOrders(request.WbChatRequest);
                    var result = _mapper.Map<NuanceChatBotResponseModel>(order);
                    return  result;
                }
                catch (Exception e)
                {
                    _logger.LogError($"Error while send request {e.Message}");
                    throw;
                }
               
            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
            }
        }
    }
}
