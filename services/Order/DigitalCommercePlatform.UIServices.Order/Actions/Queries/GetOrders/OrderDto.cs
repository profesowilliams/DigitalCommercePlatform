using System;

namespace DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetOrders
{
    public class OrderDto
    {
        public string Id { get; set; }
        public string Reseller { get; set; }
        public string ShipTo { get; set; }
        public DateTime? Created { get; set; }
        public string Type { get; set; }
        public string Price { get; set; }
        public string Status { get; set; }
    }
}
