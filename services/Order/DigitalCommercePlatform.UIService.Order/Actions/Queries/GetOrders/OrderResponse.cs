using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrders
{
    public class OrderResponse
    {
        public int? TotalItems { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public IEnumerable<OrderDto> Items { get; set; }

    }
}
