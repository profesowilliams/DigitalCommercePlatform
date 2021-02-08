using AutoMapper;
using DigitalCommercePlatform.UIService.Order.Services;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrderLines
{
    public class GetOrderLinesQueryHandler : IRequestHandler<GetOrderLinesQuery, IEnumerable<OrderLineResponse>>
    {
        private readonly IOrderQueryServices _orderQueryServices;
        private readonly IMapper _mapper;

        public GetOrderLinesQueryHandler(IOrderQueryServices orderQueryServices, IMapper mapper)
        {
            _orderQueryServices = orderQueryServices ?? throw new ArgumentNullException(nameof(orderQueryServices));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<OrderLineResponse>> Handle(GetOrderLinesQuery request, CancellationToken cancellationToken)
        {
            var order = await _orderQueryServices.GetOrderByIdAsync(request.Id);

            if (order == null)
            {
                return null;
            }

            var orderLinesResponse = _mapper.Map<IEnumerable<OrderLineResponse>>(order.Items);
            return orderLinesResponse;
        }
    }
}