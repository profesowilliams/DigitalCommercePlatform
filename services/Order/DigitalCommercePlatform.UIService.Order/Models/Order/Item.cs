using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Order.Models.Order
{
    public class Item
    {
        public string ID { get; set; }
        public string Parent { get; set; }
        public int Quantity { get; set; }
        public decimal? TotalPrice { get; set; }
        public decimal? UnitPrice { get; set; }
        public string Currency { get; set; }
        public List<Product> Product { get; set; }
    }
}
