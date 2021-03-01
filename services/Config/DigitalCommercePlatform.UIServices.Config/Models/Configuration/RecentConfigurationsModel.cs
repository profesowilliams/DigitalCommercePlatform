using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configuration
{
    [ExcludeFromCodeCoverage]
    public class RecentConfigurationsModel
    {
        public List<Configuration> ListOfConfigurations { get; set; }
        public int TotalRecords { get; set; }
        public string SortBy { get; set; } // columnName
        public string SortDirection { get; set; } // Ascending or Decnding
        public int PageSize { get; set; } 
        public int CurrentPage { get; set; } 
    }
}
