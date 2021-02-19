using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Quote.Models.Quote.Internal
{
    [ExcludeFromCodeCoverage]
    public class ShipToModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<ContactModel> Contact { get; set; }
        public AddressModel Address { get; set; }
    }
}