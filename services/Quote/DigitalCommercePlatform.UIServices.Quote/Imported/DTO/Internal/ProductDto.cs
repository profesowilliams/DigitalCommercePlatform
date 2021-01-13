using DigitalFoundation.Core.Services.Quote.Enums;
using System.Diagnostics.CodeAnalysis;


namespace DigitalFoundation.Core.Services.Quote.DTO.Internal
{
    [ExcludeFromCodeCoverage]
    public class ProductDto
    {
        public ProductType? Type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string Manufacturer { get; set; }
        public string LocalManufacturer { get; set; }
        public string Classification { get; set; }
    }
}
