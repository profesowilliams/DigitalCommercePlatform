using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrders
{
    public class OrderResponse
    {
        public int? TotalItems { get; set; }
        public IEnumerable<OrderDto> Items { get; set; }

    }
}
