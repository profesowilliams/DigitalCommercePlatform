using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Model.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class DeliveryModel
    {
        public string ID { get; set; }
        public string Line { get; set; }
        public int Quantity { get; set; }
        public DateTime? Created { get; set; }
        public string ShippedFrom { get; set; }
        public DateTime ActualShipDate { get; set; }
    }
}