using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Quote.Models.Quote.Internal
{
    [ExcludeFromCodeCoverage]
    public class AgreementModel
    {
        public string Id { get; set; }
        public string Version { get; set; }
        public string VendorId { get; set; }
        public string SelectionFlag { get; set; }
    }
}