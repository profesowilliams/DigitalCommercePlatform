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
        public DateTime? CreatedFrom { get; }
        public DateTime? CreatedTo { get; }
        public string OrderBy { get; }
        public int PageNumber { get; }
        public int PageSize { get; }

        public GetOrdersQuery(string id, string customerPO,DateTime? createdFrom, DateTime? createdTo,string orderBy, int pageNumber, int pageSize)
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
}
