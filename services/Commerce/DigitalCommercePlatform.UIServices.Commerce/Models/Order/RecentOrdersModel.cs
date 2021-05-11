using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order
{
    [ExcludeFromCodeCoverage]
    public class RecentOrdersModel
    {
        public string Id { get; set; }
        public string Reseller { get; set; }
        public string Vendor { get; set; }
        public string Created { get; set; }
        public string ShipTo { get; set; }
        public string Type { get; set; }
        public string Price { get; set; }
        public string PriceFormatted { get { return string.Format("{0:N2}", Price); } }
        public string Currency { get; set; } = "USD";
        public string CurrencySymbol { get; set; } = "$";
        public string Status { get; set; }
        public string Invoice { get; set; }
        public string IsReturn { get; set; }
        public List<TrackingDetails> Trackings { get; set; }
        public List<InvoiceDetails> Invoices { get; set; }
    }
}
