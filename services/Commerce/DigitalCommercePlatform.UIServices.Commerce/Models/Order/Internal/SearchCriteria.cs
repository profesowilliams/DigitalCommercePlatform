using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal
{
    [ExcludeFromCodeCoverage]
    public class SearchCriteria
    {
        public string Id { get; set; }
        public string CustomerPO { get; set; }
        public string Manufacturer { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public string Status { get; set; }
        public string SortBy { get; set; }
        public bool SortAscending { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public bool WithPaginationInfo { get; set; }
        public string OrderMethod { get; set; }
    }
}