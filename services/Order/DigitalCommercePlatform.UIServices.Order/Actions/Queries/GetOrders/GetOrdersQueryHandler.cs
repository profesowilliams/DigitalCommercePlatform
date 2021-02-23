using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Models.Order;
using DigitalCommercePlatform.UIServices.Order.Services.Contracts;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetOrders
{
    public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, OrderResponse>
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

        public async Task<OrderResponse> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
        {
            (string sortingProperty, bool sortAscending) = _sortingService.GetSortingParameters(request.OrderBy);


            var orderParameters = new SearchCriteria
            {
                Id = request.Id,
                CustomerPO = request.CustomerPO,
                CreatedFrom = request.CreatedFrom,
                CreatedTo = request.CreatedTo,
                OrderBy = sortingProperty,
                SortAscending = sortAscending,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
            };


            var orders = await _orderQueryServices.GetOrdersAsync(orderParameters);
            var ordersDto = _mapper.Map<IEnumerable<OrderDto>>(orders?.Data);

            var orderResponse = new OrderResponse
            {
                Items = ordersDto,
                TotalItems = orders?.Count,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };

            return orderResponse;
        }
    }
}