using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configurations
{
    [ExcludeFromCodeCoverage]
    public class Configuration
    {        
        public string ConfigId { get; set; }
        public string ConfigurationType { get; set; }
        public string Created { get; set; }
        public string Expires { get; set; }
        public string Vendor { get; set; }
        public string ConfigName { get; set; }
        public string EndUserName { get; set; }        
        public string VendorQuoteId { get; set; }
        public string Action { get; set; } = ConfigurationAction.CreateQuote.ToString();
        public IList<TdQuoteIdDetails> Quotes { get; set; }
    }
}
