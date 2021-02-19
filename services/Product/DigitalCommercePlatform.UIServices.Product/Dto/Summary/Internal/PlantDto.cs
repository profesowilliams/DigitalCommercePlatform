using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Dto.Summary.Internal
{
    [ExcludeFromCodeCoverage]
    public class PlantDto
    {
        public string Id { get; set; }
        public string UPC { get; set; }
        public VendorDto Vendor { get; set; }
        public MaterialProfileDto MaterialProfile { get; set; }
    }
}