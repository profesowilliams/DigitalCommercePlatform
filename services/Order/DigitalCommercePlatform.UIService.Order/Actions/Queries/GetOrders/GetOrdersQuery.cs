using MediatR;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrders
{
    public class GetOrdersQuery : IRequest<IEnumerable<OrderResponse>>
    {
        public string OrderBy { get; }

        public GetOrdersQuery(string orderBy)
        {
            OrderBy = orderBy;
        }
    }
}
