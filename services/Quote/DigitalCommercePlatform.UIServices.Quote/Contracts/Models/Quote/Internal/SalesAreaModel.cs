using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.AppServices.Quote.Models.Quote.Internal
{
    [ExcludeFromCodeCoverage]
    public class SalesAreaModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public ContactModel Contact { get; set; }
    }
}