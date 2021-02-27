using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order
{
    public class TrackingDetails
    {
        public string OrderNumber { get; set; }
        public string InvoiceNumber { get; set; }
        public string TrackingLink { get; set; }
        public string ShipDate { get; set; }
        public string TrackingNumber { get; set; }
        public string Shipper { get; set; }
    }
}
