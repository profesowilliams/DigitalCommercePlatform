using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order
{
    [ExcludeFromCodeCoverage]
    public class GetOrdersDto
    {
        public string Id { get; set; }
        public string Reseller { get; set; }
        public string Vendor { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public string OrderBy { get; set; }
        public bool SortAscending { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
