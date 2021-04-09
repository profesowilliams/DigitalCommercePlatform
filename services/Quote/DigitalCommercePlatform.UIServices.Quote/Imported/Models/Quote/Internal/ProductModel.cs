using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Quote.Models.Quote.Internal
{
    [ExcludeFromCodeCoverage]
    public class ProductModel
    {
        public string Type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string Manufacturer { get; set; }
        public string LocalManufacturer { get; set; }
        public string Classification { get; set; }
    }
}