using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.Core.Services.Quote.DTO.Internal
{
    [ExcludeFromCodeCoverage]
    public class AgreementDto
    {
        public string Id { get; set; }
        public string Version { get; set; }
        public string VendorId { get; set; }
        public string SelectionFlag { get; set; }
    }
}
