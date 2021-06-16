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
using System.Linq;
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
            public string Status { get; }
            public string SortBy { get; }
            public string SortDirection { get; set; }
            public int PageNumber { get; }
            public int PageSize { get; }
            public bool WithPaginationInfo { get; set; }

            public Request(FilteringDto filtering, PagingDto paging)
            {
                Id = filtering.Id;
                CustomerPO = filtering.CustomerPO;
                Manufacturer = filtering.Manufacturer;
                CreatedFrom = filtering.CreatedFrom;
                CreatedTo = filtering.CreatedTo;
                Status = filtering.Status;
                SortBy = paging.SortBy;
                SortDirection = paging.SortDirection;
                PageNumber = paging.PageNumber;
                PageSize = paging.PageSize == 0 ? 25 : paging.PageSize;
                WithPaginationInfo = paging.WithPaginationInfo;
            }
        }


        public class PagingDto
        {
            public PagingDto(string sortBy, string sortDirection, int pageNumber, int pageSize, bool withPaginationInfo)
            {
                SortBy = sortBy;
                SortDirection = sortDirection;
                PageNumber = pageNumber;
                PageSize = pageSize;
                WithPaginationInfo = withPaginationInfo;
            }

            public string SortBy { get; set; }
            public string SortDirection { get; set; }
            public int PageNumber { get; }
            public int PageSize { get; }
            public bool WithPaginationInfo { get; set; }
        }

        public class FilteringDto
        {
            public FilteringDto(string id, string customerPO, string manufacturer, DateTime? createdFrom, DateTime? createdTo,string status)
            {
                Id = id;
                CustomerPO = customerPO;
                Manufacturer = manufacturer;
                CreatedFrom = createdFrom;
                CreatedTo = createdTo;
                Status = status;
            }

            public string Id { get; }
            public string CustomerPO { get; }
            public string Manufacturer { get; }
            public DateTime? CreatedFrom { get; }
            public DateTime? CreatedTo { get; }
            public string Status { get; }
        }


        public class Response
        {
            public long? TotalItems { get; set; }
            public long? PageCount { get; set; }
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public IEnumerable<RecentOrdersModel> Items { get; set; }
        }

        public class GetOrderHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ISortingService _sortingService;
            private readonly IStatusMappingService _statusMappingService;
            private readonly ICommerceService _commerceQueryService;
            private readonly IMapper _mapper;

            public GetOrderHandler(ICommerceService commerceQueryService,
                ISortingService sortingService,
                IStatusMappingService statusMappingService,
                IMapper mapper)
            {
                _commerceQueryService = commerceQueryService ?? throw new ArgumentNullException(nameof(commerceQueryService));
                _sortingService = sortingService ?? throw new ArgumentNullException(nameof(sortingService));
                _statusMappingService = statusMappingService ?? throw new ArgumentNullException(nameof(statusMappingService));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }
            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var sortingProperty = _sortingService.GetSortingPropertyValue(request.SortBy);
                var sortAscending = _sortingService.IsSortingDirectionAscending(request.SortDirection);
                var status = _statusMappingService.GetMappingPropertyValue(request.Status);

                var orderParameters = new SearchCriteria
                {
                    Id = request.Id,
                    CustomerPO = request.CustomerPO,
                    Manufacturer = request.Manufacturer,
                    CreatedFrom = request.CreatedFrom,
                    CreatedTo = request.CreatedTo,
                    Status = status,
                    SortBy = sortingProperty,
                    SortAscending = sortAscending,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize,
                    WithPaginationInfo = request.WithPaginationInfo
                };

                var orders = await _commerceQueryService.GetOrdersAsync(orderParameters);
                var ordersDto = _mapper.Map<IEnumerable<RecentOrdersModel>>(orders?.Data);

                var orderResponse = new Response
                {
                    Items = ordersDto,
                    TotalItems = request.WithPaginationInfo ? orders?.Count : 0,
                    PageNumber = request.WithPaginationInfo ? request.PageNumber : 0,
                    PageSize = request.WithPaginationInfo ? request.PageSize : 0,
                    PageCount = request.WithPaginationInfo ? (orders?.Count + request.PageSize - 1) / request.PageSize : 0
                };
                return new ResponseBase<Response> { Content = orderResponse };
            }
        }

        public class GetOrdersValidator : AbstractValidator<Request>
        {
            private readonly ISortingService _sortingService;
            private readonly IStatusMappingService _statusMappingService;


            public GetOrdersValidator(ISortingService sortingService, IStatusMappingService statusMappingService)
            {
                _sortingService = sortingService ?? throw new ArgumentNullException(nameof(sortingService));
                _statusMappingService = statusMappingService ?? throw new ArgumentNullException(nameof(statusMappingService));


                var validProperties = _sortingService.GetValidProperties();
                var validSortingValues = _sortingService.GetValidSortingValues();
                var validStatuses = _statusMappingService.GetValidStatusValues();

                RuleFor(i => i.SortBy).Must(IsPropertyValidForSorting).WithMessage(i => $"You can't sort by {i.SortBy} property. Valid properties are: {validProperties}");
                RuleFor(i => i.SortDirection).Must(IsSortingDirectionValid).WithMessage(i => $"You can't order by {i.SortDirection} value. Valid values are: {validSortingValues}");
                RuleFor(i => i.PageSize).GreaterThan(0).WithMessage("Page Size must be greater than 0.");
                RuleFor(i => i.PageNumber).GreaterThanOrEqualTo(0).WithMessage("PageNumber must be greater than or equal to 0.");
                RuleFor(i => i.Status).Must(IsStatusValid).WithMessage(i => $"You can't filter by {i.Status} value. Valid statuses are: {validStatuses}");
            }

            private bool IsPropertyValidForSorting(string propertyValue)
            {
                return _sortingService.IsPropertyValid(propertyValue);
            }

            private bool IsSortingDirectionValid(string sortingValue)
            {
                return _sortingService.IsSortingDirectionValid(sortingValue);
            }

            private bool IsStatusValid(string status)
            {
                return _statusMappingService.IsStatusValid(status);
            }
        }
    }
}
