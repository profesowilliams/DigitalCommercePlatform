using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.Core.Services.Quote.DTO.Internal
{
    [ExcludeFromCodeCoverage]
    public class ResellerDto : PartnerDto
    {
        public AddressDto Address { get; set; }
    }
}
