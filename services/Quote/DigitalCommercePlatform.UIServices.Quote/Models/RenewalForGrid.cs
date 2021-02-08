using System;

namespace DigitalCommercePlatform.UIServices.Quote.Models
{
    public class RenewalForGrid
    {
        public string Agreement { get; set; }
        public string Vendor { get; set; }
        public string EndUserName { get; set; }
        public DateTime CurrentEndDate { get; set; }
        public string Duration { get; set; }
        public DateTime NewStartDate { get; set; }
        public DateTime NewEndDate { get; set; }
        public string ServiceLevel { get; set; }
        public string Opportunity { get; set; }
        public string AutoQuote { get; set; }
    }
}
