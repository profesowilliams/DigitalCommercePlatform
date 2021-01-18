using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.AppServices.Quote.Models.Quote.Internal
{
    [ExcludeFromCodeCoverage]
    public class MarginModel
    {
        public MarginType TypeMargin { get; set; }
        public decimal Amount { get; set; }
        public decimal Percent { get; set; }
    }
}