using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Order.Services
{
    public class OrdersCollectionDto
    {
        public IEnumerable<OrderDto> Data { get; set; }
    }
}
