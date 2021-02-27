using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.GetRecentOrders
{
    public sealed class GetOrders
    {
        public class Request : IRequest<Response>
        {
            public string Id { get; }
            public string CustomerPO { get; }
            public DateTime? CreatedFrom { get; }
            public DateTime? CreatedTo { get; }
            public string OrderBy { get; }
            public int PageNumber { get; }
            public int PageSize { get; }

            public Request(string id, string customerPO, DateTime? createdFrom, DateTime? createdTo, string orderBy, int pageNumber, int pageSize)
            {
                Id = id;
                CustomerPO = customerPO;
                CreatedFrom = createdFrom;
                CreatedTo = createdTo;
                OrderBy = orderBy;
                PageNumber = pageNumber;
                PageSize = pageSize == 0 ? 25 : pageSize;
            }
        }

        public class Response
        {
            public int? TotalItems { get; set; }
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public bool IsError { get; internal set; }
            public string ErrorCode { get; internal set; }

            public IEnumerable<RecentOrdersModel> Orders { get; set; }
        }

        public class GetOrderHandler : IRequestHandler<Request, Response>
        {
            private readonly ISortingService _sortingService;
            private readonly ICommerceService _commerceQueryService;
            private readonly IMapper _mapper;

            public GetOrderHandler(ICommerceService commerceQueryService,
                ISortingService sortingService,
                IMapper mapper)
            {
                _commerceQueryService = commerceQueryService ?? throw new ArgumentNullException(nameof(commerceQueryService));
                _sortingService = sortingService ?? throw new ArgumentNullException(nameof(sortingService));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }
            public async Task<Response> Handle(Request request,
                                               CancellationToken cancellationToken)
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

                var orders = await _commerceQueryService.GetOrdersAsync(orderParameters);
                var ordersDto = _mapper.Map<IEnumerable<RecentOrdersModel>>(orders?.Data);

                var orderResponse = new Response
                {
                    Orders = ordersDto,
                    TotalItems = orders?.Count,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
                return orderResponse;
            }
        }
    }
}
