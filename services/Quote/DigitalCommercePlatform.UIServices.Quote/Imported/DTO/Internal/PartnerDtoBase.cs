using System.Diagnostics.CodeAnalysis;
using DigitalFoundation.Core.Services.Quote.DTO.Internal;

namespace DigitalFoundation.Core.Publishers.Quote.Internal
{
    [ExcludeFromCodeCoverage]
    public abstract class PartnerDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public ContactDto Contact { get; set; }
    }
}
