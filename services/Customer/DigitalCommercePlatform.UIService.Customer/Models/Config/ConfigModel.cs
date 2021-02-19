using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Customer.Models.Config
{
    [ExcludeFromCodeCoverage]
    public class ConfigModel
    {
        public string ConfigId { get; set; }
        public string Vendor { get; set; }
        public string ConfigName { get; set; }
        public string EndUserName { get; set; }
        public string QuoteId { get; set; }
        public DateTime Created { get; set; }
        //public DateTime UpdatedTime { get; set; }
    }
}
