using System;

namespace DigitalCommercePlatform.UIServices.Quote.Models
{
    public class DealForGrid
    {
        public string DealId { get; set; }
        public string Vendor { get; set; }
        public string EndUserName { get; set; }
        public string TdQuoteId { get; set; }
        public string TdVendorBid { get; set; }
        public string Status { get; set; }
        public DateTime DealExpires { get; set; }
    }
}
