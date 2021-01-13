using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.Core.Services.Quote.DTO.Internal
{
    [ExcludeFromCodeCoverage]
    public class ShipToDto : PartnerDto
    {
        public AddressDto Address { get; set; }
    }
}
