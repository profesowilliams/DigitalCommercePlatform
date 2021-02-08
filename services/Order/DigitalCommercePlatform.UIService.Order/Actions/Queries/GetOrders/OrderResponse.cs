using System;

namespace DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrders
{
    public class OrderResponse
    {
        public string Id { get; set; }
        public string ShipTo { get; set; }
        public DateTime? Created { get; set; }
        public string Type { get; set; }
        public string Price { get; set; }
        public string Status { get; set; }
    }
}
