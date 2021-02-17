using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Order.Models.Order
{
    public class OrdersContainer
    {
        public int Count { get; set; }
        public IEnumerable<OrderModel> Data { get; set; }
    }
}
