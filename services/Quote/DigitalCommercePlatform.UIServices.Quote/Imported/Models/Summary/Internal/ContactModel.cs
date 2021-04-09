using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Quote.Models.Summary.Internal
{
    [ExcludeFromCodeCoverage]
    public class ContactModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}