//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Renewal.Dto.CoreQuote.Internal
{
    [ExcludeFromCodeCoverage]
    public class ProductDto
    {
        public string Type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string Manufacturer { get; set; }
        public string ManufacturerId { get; set; }
        public string LocalManufacturer { get; set; }
        public string Classification { get; set; }
        public string Family { get; set; }
    }
}
