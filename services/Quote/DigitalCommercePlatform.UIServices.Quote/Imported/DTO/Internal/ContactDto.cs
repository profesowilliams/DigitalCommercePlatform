using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.Core.Publishers.Quote.Internal
{
    [ExcludeFromCodeCoverage]
    public class ContactDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}
