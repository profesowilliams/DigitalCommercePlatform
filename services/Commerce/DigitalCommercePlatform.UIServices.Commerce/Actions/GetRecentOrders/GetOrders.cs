using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using FluentValidation;
using MediatR;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.GetRecentOrders
{
    [ExcludeFromCodeCoverage]
    public sealed class GetOrders
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; }
            public string CustomerPO { get; }
            public string Manufacturer { get; }
            public DateTime? CreatedFrom { get; }
            public DateTime? CreatedTo { get; }
            public string OrderBy { get; }
            public int PageNumber { get; }
            public int PageSize { get; }

            public Request(FilteringDto filtering, PagingDto paging)
            {
                Id = filtering.Id;
                CustomerPO = filtering.CustomerPO;
                Manufacturer = filtering.Manufacturer;
                CreatedFrom = filtering.CreatedFrom;
                CreatedTo = filtering.CreatedTo;
                OrderBy = paging.OrderBy;
                PageNumber = paging.PageNumber;
                PageSize = paging.PageSize == 0 ? 25 : paging.PageSize;
            }
        }


        public class PagingDto
        {
            public PagingDto(string orderBy, int pageNumber, int pageSize)
            {
                OrderBy = orderBy;
                PageNumber = pageNumber;
                PageSize = pageSize;
            }

            public string OrderBy { get; }
            public int PageNumber { get; }
            public int PageSize { get; }
        }

        public class FilteringDto
        {
            public FilteringDto(string id, string customerPO, string manufacturer, DateTime? createdFrom, DateTime? createdTo)
            {
                Id = id;
                CustomerPO = customerPO;
                Manufacturer = manufacturer;
                CreatedFrom = createdFrom;
                CreatedTo = createdTo;
            }

            public string Id { get; }
            public string CustomerPO { get; }
            public string Manufacturer { get; }
            public DateTime? CreatedFrom { get; }
            public DateTime? CreatedTo { get; }
        }





        public class Response
        {
            public int? TotalItems { get; set; }
            public int PageNumber { get; set; }
            public int PageSize { get; set; }

            public IEnumerable<RecentOrdersModel> Orders { get; set; }
        }

        public class GetOrderHandler : IRequestHandler<Request, ResponseBase<Response>>
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
            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                (string sortingProperty, bool sortAscending) = _sortingService.GetSortingParameters(request.OrderBy);

                var orderParameters = new SearchCriteria
                {
                    Id = request.Id,
                    CustomerPO = request.CustomerPO,
                    Manufacturer = request.Manufacturer,
                    CreatedFrom = request.CreatedFrom,
                    CreatedTo = request.CreatedTo,
                    OrderBy = sortingProperty,
                    SortAscending = sortAscending,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
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

                return new ResponseBase<Response> { Content = orderResponse };
            }
        }

        public class GetOrdersValidator : AbstractValidator<Request>
        {
            private readonly ISortingService _sortingService;

            public GetOrdersValidator(ISortingService sortingService)
            {
                _sortingService = sortingService ?? throw new ArgumentNullException(nameof(sortingService));

                var validProperties = _sortingService.GetValidProperties();
                RuleFor(i => i.OrderBy).Must(IsPropertyValidForSorting).WithMessage(i => $"You can't sort by {i.OrderBy} property. Valid properties are: {validProperties}");
                RuleFor(i => i.PageSize).GreaterThan(0).WithMessage("Page Size must be greater than 0.");
                RuleFor(i => i.PageNumber).GreaterThanOrEqualTo(0).WithMessage("PageNumber must be greater than or equal to 0.");
            }

            private bool IsPropertyValidForSorting(string propertyValue)
            {
                return _sortingService.IsPropertyValid(propertyValue);
            }
        }
    }
}
