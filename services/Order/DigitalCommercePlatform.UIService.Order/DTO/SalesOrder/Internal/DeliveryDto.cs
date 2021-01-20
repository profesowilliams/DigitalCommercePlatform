using System;

namespace DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal
{
    public class DeliveryDto
    {
        public string ID { get; set; }
        public string Line { get; set; }
        public int Quantity { get; set; }
        public DateTime? Created { get; set; }
        public string ShippedFrom { get; set; }
        public DateTime ActualShipDate { get; set; }
    }
}