using System;

namespace DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal
{
    public class ShipmentDto
    {
        public string ID { get; set; }
        public string Carrier { get; set; }
        public string ServiceLevel { get; set; }
        public string TrackingNumber { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public DateTime? Date { get; set; }
    }
}