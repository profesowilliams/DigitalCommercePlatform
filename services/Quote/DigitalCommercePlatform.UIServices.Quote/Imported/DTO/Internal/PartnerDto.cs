using System.Diagnostics.CodeAnalysis;
using DigitalFoundation.Core.Publishers.Quote.Internal;


namespace DigitalFoundation.Core.Services.Quote.DTO.Internal
{
    [ExcludeFromCodeCoverage]
    public abstract class PartnerDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public ContactDto Contact { get; set; }
    }
}
