using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Customer.Models.Config
{
    [ExcludeFromCodeCoverage]
    public class ConfigModel
    {
        public string ConfigId { get; set; }
        public string ConfigName { get; set; }
        public DateTime Created { get; set; }
        public string Vendor { get; set; }
        public string EndUserName { get; set; }
        public string QuoteId { get; set; }
        public string OrderId { get; set; }
        public string ActionPossible { get; set; }
    }
}
