using MediatR;

namespace DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetOrders
{
    public class GetOrdersQuery : IRequest<OrderResponse>
    {
        public string OrderBy { get; }
        public int PageNumber { get; }
        public int PageSize { get; } 

        public GetOrdersQuery(string orderBy,int pageNumber,int pageSize)
        {
            OrderBy = orderBy;
            PageNumber = pageNumber;
            PageSize = pageSize == 0 ? 25 : pageSize;
        }
    }
}
