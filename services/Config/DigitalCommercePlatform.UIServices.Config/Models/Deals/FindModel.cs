using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Deals
{
    [ExcludeFromCodeCoverage]
    public class FindModel
    {
        public string SortBy { get; set; }        
        public bool SortAscending { get; set; }
        public string DealId { get; set; }
        public string Vendor { get; set; }
        public string Market { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public bool? WithPaginationInfo { get; set; }
    }
}
