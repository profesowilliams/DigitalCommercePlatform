using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Estimate
{
    [ExcludeFromCodeCoverage]
    public class Configuration
    {
        public string ConfigId { get; set; }
        public string ConfigurationType { get; set; }
        public DateTime CreatedOn { get; set; }
        public string Vendor { get; set; }
        public string ConfigName { get; set; }
        public string EndUserName { get; set; }
        public string TdQuoteId { get; set; }
        public string VendorQuoteId { get; set; }
        public string Action { get; set; }

        public IList<Line> Details { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class TdQuoteIdDetails
    {
        public string Id { get; set; }
        public string Line { get; set; }
        public int? Quantity { get; set; }
        public decimal? Price { get; set; }
        public DateTime? Created { get; set; }
    }
}
