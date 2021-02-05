using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Quote.Models.Quote.Internal
{
    [ExcludeFromCodeCoverage]
    public class SuperSalesAreaModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public ContactModel Contact { get; set; }
    }
}