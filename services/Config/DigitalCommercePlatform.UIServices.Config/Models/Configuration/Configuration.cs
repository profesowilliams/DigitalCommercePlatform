using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configuration
{
    [ExcludeFromCodeCoverage]
    public class Configuration
    {        
        public string ConfigId { get; set; }
        public string ConfigurationType { get; set; }
        public DateTime CreatedOn { get; set; }
        public string Vendor { get; set; }
        public string ConfigName { get; set; }
        public string EndUserName { get; set; }
        public string TdQuoteId { get; set; }
        public string VendorQuoteId { get; set; }
        public string Action { get; set; }
    }
}
