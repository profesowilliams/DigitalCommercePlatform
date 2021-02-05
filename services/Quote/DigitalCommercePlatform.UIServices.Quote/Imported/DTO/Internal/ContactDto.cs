using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Quote.DTO.Internal
{
    [ExcludeFromCodeCoverage]
    public class ContactDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}
