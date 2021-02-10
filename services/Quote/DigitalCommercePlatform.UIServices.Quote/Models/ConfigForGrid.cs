using System;

namespace DigitalCommercePlatform.UIServices.Quote.Models
{
    public class ConfigForGrid
    {
        public string ConfigId { get; set; }
        public DateTime Created { get; set; }
        public string Vendor { get; set; }
        public string ConfigName { get; set; }
        public string EndUserName { get; set; }
        public string TdQuoteId { get; set; }
    }
}
