using MediatR;
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetOrders
{
    [ExcludeFromCodeCoverage]
    public class GetOrdersQuery : IRequest<OrderResponse>
    {
        public string Id { get; }
        public string CustomerPO { get; }
        public string Manufacturer { get; }

        public DateTime? CreatedFrom { get; }
        public DateTime? CreatedTo { get; }
        public string OrderBy { get; }
        public int PageNumber { get; }
        public int PageSize { get; }

        public GetOrdersQuery(FilteringDto filtering,PagingDto paging)
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

    [ExcludeFromCodeCoverage]
    public class PagingDto
    {
        public PagingDto(string orderBy,int pageNumber,int pageSize)
        {
            OrderBy = orderBy;
            PageNumber = pageNumber;
            PageSize = pageSize;
        }

        public string OrderBy { get; }
        public int PageNumber { get; }
        public int PageSize { get; }
    }

    [ExcludeFromCodeCoverage]
    public class FilteringDto
    {
        public FilteringDto(string id, string customerPO,string manufacturer, DateTime? createdFrom, DateTime? createdTo)
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
}
