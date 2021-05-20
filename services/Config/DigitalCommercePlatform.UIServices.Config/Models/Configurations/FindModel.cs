using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configurations
{
    [ExcludeFromCodeCoverage]
    public class FindModel
    {
        public string Id { get; set; }
        public bool Details { get; set; }
        public string Type { get; set; }
        public string Manufacturer { get; set; }
        public string ResellerName { get; set; }
        public string ResellerId { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public string EndUser { get; set; }
        public string SortBy { get; set; }
        public string SortDirection { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public bool WithPaginationInfo { get; set; }
    }
}
