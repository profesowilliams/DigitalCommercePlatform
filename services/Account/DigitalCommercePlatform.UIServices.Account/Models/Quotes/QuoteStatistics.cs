using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Quotes
{
    [ExcludeFromCodeCoverage]
    public class QuoteStatistics
    {
        public int Converted { get; set; }
        public int Open { get; set; }
        public int Ratio { get; set; }
        public decimal Percentage { get; set; }
        public decimal QuoteValue { get; set; }
    }
}
