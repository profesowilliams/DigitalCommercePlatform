using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Services.Contracts;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetSingleOrder
{
    public class GetSingleOrderQueryHandler : IRequestHandler<GetSingleOrderQuery, SingleOrderResponse>
    {
        private readonly IOrderQueryServices _orderQueryServices;
        private readonly IMapper _mapper;

        public GetSingleOrderQueryHandler(IOrderQueryServices orderQueryServices, IMapper mapper)
        {
            _orderQueryServices = orderQueryServices ?? throw new ArgumentNullException(nameof(orderQueryServices));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<SingleOrderResponse> Handle(GetSingleOrderQuery request, CancellationToken cancellationToken)
        {
            var order = await _orderQueryServices.GetOrderByIdAsync(request.Id);
            var orderResponse = _mapper.Map<SingleOrderResponse>(order);
            return orderResponse;
        }
    }
}
