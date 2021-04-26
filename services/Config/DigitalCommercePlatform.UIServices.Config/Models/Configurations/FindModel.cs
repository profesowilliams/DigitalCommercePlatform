using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configurations
{
    [ExcludeFromCodeCoverage]
    public class FindModel
    {
        public string CreatedBy { get; set; }
        public string SortBy { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public bool SortAscending { get; set; }
        public string Vendor { get; set; }
        public string Market { get; set; }
        public string ConfigurationIdFilter { get; set; }
        public string ConfigurationNameFilter { get; set; }
        public string EndUserFilter { get; set; }
        public string ConfigurationTypeFilter { get; set; }
        public DateTime? CreationDateFromFilter { get; set; }
        public DateTime? CreationDateToFilter { get; set; }
    }
}
