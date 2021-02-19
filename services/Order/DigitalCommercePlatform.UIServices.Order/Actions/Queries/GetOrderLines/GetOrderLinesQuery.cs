using MediatR;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetOrderLines
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
