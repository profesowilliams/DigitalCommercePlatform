using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Quote.DTO.Internal
{
    [ExcludeFromCodeCoverage]
    public class ShipToDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public ContactDto Contact { get; set; }
        public AddressDto Address { get; set; }
    }
}
