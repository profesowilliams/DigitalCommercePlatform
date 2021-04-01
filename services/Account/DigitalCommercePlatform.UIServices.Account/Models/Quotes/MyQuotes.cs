using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Quotes
{
    [ExcludeFromCodeCoverage]
    public class MyQuotes
    {
        public string Converted { get; set; }
        public int Open { get; set; }
        public string QuoteToOrder { get; set; }
        public decimal ActiveQuoteValue { get; set; }
        public string CurrencyCode { get; set; }
        public string FormattedAmount { get; set; }
    }
}
