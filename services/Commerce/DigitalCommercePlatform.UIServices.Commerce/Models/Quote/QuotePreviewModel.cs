using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote
{
    [ExcludeFromCodeCoverage]
    public class QuotePreviewModel
    {
        public QuotePreview QuoteDetails { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class QuotePreview
    {
        public List<Address> ShipTo { get; set; }
        public List<Address> EndUser { get; set; }
        public List<Address> Reseller { get; set; }
        public VendorReferenceModel Source { get; set; }
        public string Notes { get; set; }
        public List<Line> Items { get; set; }
        public string Id { get; set; } //configid
        public List<OrderModel> Orders { get; set; }
        public string CustomerPO { get; set; }
        public string EndUserPO { get; set; }
        public string PODate { get; set; }
        public string QuoteReference { get; set; }
        public string SPAId { get; set; }
        public string Currency { get; set; } = "USD";
        public string CurrencySymbol { get; set; } = "$";
        public decimal SubTotal { get; set; }
        public string SubTotalFormatted { get; set; }
        public string Tier { get; set; }
        public string ConfigurationId { get; set; }
        public string Description { get; set; }
        public string Vendor { get; set; }

    }
}

