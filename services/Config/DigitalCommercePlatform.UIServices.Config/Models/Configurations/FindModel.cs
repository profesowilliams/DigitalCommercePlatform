using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configurations
{
    [ExcludeFromCodeCoverage]
    public class FindModel
    {        
        public string SortBy { get; set; }
        public bool SortAscending { get; set; }
        public string ConfigurationId { get; set; }
        public string Vendor { get; set; }
        public string Market { get; set; }
    }
}
