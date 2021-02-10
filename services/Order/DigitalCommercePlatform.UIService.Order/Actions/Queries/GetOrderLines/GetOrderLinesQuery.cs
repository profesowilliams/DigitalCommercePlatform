using MediatR;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrderLines
{
    public class GetOrderLinesQuery : IRequest<IEnumerable<OrderLineResponse>>
    {
        public string Id { get; }

        public GetOrderLinesQuery(string id)
        {
            Id = id;
        }
    }
}
