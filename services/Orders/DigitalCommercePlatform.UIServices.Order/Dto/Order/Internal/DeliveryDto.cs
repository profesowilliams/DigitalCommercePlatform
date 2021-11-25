//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System;

namespace DigitalCommercePlatform.UIServices.Order.Dto.Order.Internal
{
    public class DeliveryDto
    {
        public string ID { get; set; }
        public string Line { get; set; }
        public int Quantity { get; set; }
        public DateTime? Created { get; set; }
        public string ShippedFrom { get; set; }
        public DateTime? ActualShipDate { get; set; }
        public string ShippedFromText { get; set; }
    }
}
