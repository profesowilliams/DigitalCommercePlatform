using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Models;
using DigitalCommercePlatform.UIServices.Order.Models.Order;
using DigitalCommercePlatform.UIServices.Order.Services;
using MediatR;

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

            public Handler(IOrderService orderService, IMapper mapper)
            {
                _orderService = orderService;
                _mapper = mapper;
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
                    Console.WriteLine(e);
                    throw;
                }
               
            }
        }
    }
}
