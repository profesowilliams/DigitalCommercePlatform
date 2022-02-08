//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Models.Internal
{
    [ExcludeFromCodeCoverage]
    public class DeliveryModel
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
