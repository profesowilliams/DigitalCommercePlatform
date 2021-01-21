using System;

namespace DigitalCommercePlatform.UIServices.Quote.Models
{
    public class QuoteSummaryModel
    {
        public string TdQuoteId { get; set; }
        public string MyQuoteReference { get; set; }
        public string EndUserName { get; set; }
        public string DealId { get; set; }
        public string QuoteValue { get; set; }
        public DateTime QuoteCreationDate { get; set; }
        public DateTime QuoteExpirationDate { get; set; }
    }
}
