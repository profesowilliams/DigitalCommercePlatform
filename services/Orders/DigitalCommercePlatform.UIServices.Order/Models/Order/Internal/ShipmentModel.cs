//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Models.Order.Internal
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
        public string DNote { get; set; }
        public string DNoteLineNumber { get; set; }
        public string GoodsReceiptNo { get; set; }
    }
}
