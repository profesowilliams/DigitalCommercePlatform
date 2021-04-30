using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Internal
{
    [ExcludeFromCodeCoverage]
    public class QuoteGeneralInformation
    {
        public string Source { get; set; }
        public string Tier { get; set; }
        public string QuoteReference { get; set; }
        public string SPAId { get; set; }
    }
}
