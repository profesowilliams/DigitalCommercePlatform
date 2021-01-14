using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.AppServices.Quote.Models.Quote.Internal
{
    [ExcludeFromCodeCoverage]
    public class ReferenceModel
    {
        public string Type { get; set; }
        public string Value { get; set; }
    }
}