using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Common.Configuration.Models.Configurations.Internal
{
    [ExcludeFromCodeCoverage]
    public class FindModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool Details { get; set; }
        public string Type { get; set; }
        public string Manufacturer { get; set; }
        public string ResellerName { get; set; }
        public string ResellerId { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public string EndUser { get; set; }
        public string SortBy { get; set; }
        public bool SortByAscending { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public bool WithPaginationInfo { get; set; }
        public string DUANS { get; set; }
        public string VATNumber { get; set; }
        public string VendorAccountName { get; set; }
        public string VendorAccountNumber { get; set; }
    }
}
