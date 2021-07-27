using DigitalCommercePlatform.UIServices.Config.Models.Common;
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Deals
{
    [ExcludeFromCodeCoverage]
    public class FindModel : Paginated
    {
        public string SortBy { get; set; }
        public SortDirection SortDirection { get; set; }
        public string DealId { get; set; }
        public string VendorBid { get; set; }
        public string VendorName { get; set; }
        public string EndUserName { get; set; }
        public string Market { get; set; }
        public PricingCondition? Pricing { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public DateTime? ExpiresFrom { get; set; }
        public DateTime? ExpiresTo { get; set; }
    }
}
