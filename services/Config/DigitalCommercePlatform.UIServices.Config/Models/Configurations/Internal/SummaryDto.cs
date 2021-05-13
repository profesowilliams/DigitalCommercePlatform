using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal
{
    [ExcludeFromCodeCoverage]
    public class SummaryDto
    {
        public SourceDto Source { get; set; }
        public string Description { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Updated { get; set; }
        public DateTime? Published { get; set; }
        public string SalesOrg { get; set; }
        public AdditionalIdentifierDto AdditionalIdentifiers { get; set; }
        public string PriceListId { get; set; }
        public DateTime? NetPriceProtectionDate { get; set; }
        public string VendorStatus { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public ResellerDto Reseller { get; set; }
        public EndUserDto EndUser { get; set; }
        public VendorDto Vendor { get; set; }

        public decimal? TotalListPrice { get; set; }
        public decimal? TotalCost { get; set; }
    }
}
