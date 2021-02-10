using AutoMapper;
using DigitalCommercePlatform.UIService.Order.Services.Contracts;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrders
{
    public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, IEnumerable<OrderResponse>>
    {
        private readonly IOrderQueryServices _orderQueryServices;
        private readonly ISortingService _sortingService;
        private readonly IMapper _mapper;

        public GetOrdersQueryHandler(IOrderQueryServices orderQueryServices, ISortingService sortingService, IMapper mapper)
        {
            _orderQueryServices = orderQueryServices ?? throw new ArgumentNullException(nameof(orderQueryServices));
            _sortingService = sortingService ?? throw new ArgumentNullException(nameof(sortingService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<OrderResponse>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
        {
            (string sortingProperty, bool sortAscending) = _sortingService.GetSortingParameters(request.OrderBy);

            var orders = await _orderQueryServices.GetOrdersAsync(sortingProperty, sortAscending);
            var ordersResponse = _mapper.Map<IEnumerable<OrderResponse>>(orders?.Data);
            return ordersResponse;
        }
    }
}