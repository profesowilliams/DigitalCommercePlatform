using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Quote.DTO.Internal
{
    [ExcludeFromCodeCoverage]
    public class ResellerDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<ContactDto> Contact { get; set; }
        public AddressDto Address { get; set; }
    }
}
