using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class ShipmentModel
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