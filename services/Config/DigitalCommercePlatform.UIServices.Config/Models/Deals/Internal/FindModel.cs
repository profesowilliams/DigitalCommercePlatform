using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Deals.Internal
{
    [ExcludeFromCodeCoverage]
    public class FindModel
    {
        public string SortBy { get; set; }
        public string SortDirection { get; set; }
        public string DealId { get; set; }
        public string VendorBid { get; set; }
        public string VendorName { get; set; }
        public string Pricing { get; set; }
        public string EndUserName { get; set; }
        public string DealTyp { get; set; }
        public string Market { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public bool? WithPaginationInfo { get; set; }
    }
}
