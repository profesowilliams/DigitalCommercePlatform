using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal
{
    [ExcludeFromCodeCoverage]
    public class OrdersContainer
    {
        public int Count { get; set; }
        public IEnumerable<OrderModel> Items { get; set; }
    }
}
