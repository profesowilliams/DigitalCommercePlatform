using System;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote
{
    public class RecentQuotesModel
    {
        public string Id { get; set; }
        public string QuoteReference { get; set; }
        public string Vendor { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Expires { get; set; }
        public string EndUserName { get; set; }
        public string DealId { get; set; }
        public string Status { get; set; }
        public double QuoteValue { get; set; }
        public string FormatedQuoteValue { get; set; }
        public bool CanUpdate { get; set; } = true;
        public bool CanCheckOut { get; set; } = true;
    }
}
