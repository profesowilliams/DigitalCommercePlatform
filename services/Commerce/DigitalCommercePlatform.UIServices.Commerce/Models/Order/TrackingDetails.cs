//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order
{
    public class TrackingDetails
    {
        public string OrderNumber { get; set; }
        public string InvoiceNumber { get; set; }
        public string ID { get; set; }
        public string Carrier { get; set; }
        public string ServiceLevel { get; set; }
        public string TrackingNumber { get; set; }
        public string TrackingLink { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public DateTime? Date { get; set; }
        public string DNote { get; set; }
        public string DNoteLineNumber { get; set; }
        public string GoodsReceiptNo { get; set; }
    }
}
