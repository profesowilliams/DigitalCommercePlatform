using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.AppServices.Quote.Models.Summary.Internal
{
    [ExcludeFromCodeCoverage]
    public class ResellerModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public ContactModel Contact { get; set; }
        public AddressModel Address { get; set; }
    }
}