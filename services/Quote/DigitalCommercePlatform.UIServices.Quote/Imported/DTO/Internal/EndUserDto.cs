using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.Core.Services.Quote.DTO.Internal
{
    [ExcludeFromCodeCoverage]
    public class EndUserDto : PartnerDto
    {
        public AddressDto Address { get; set; }
    }
}
