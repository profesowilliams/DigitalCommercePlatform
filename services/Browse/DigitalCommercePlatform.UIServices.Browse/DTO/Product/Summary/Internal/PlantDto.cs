namespace DigitalCommercePlatform.UIService.Browse.DTO.Product.Summary.Internal
{
    public class PlantDto
    {
        public string Id { get; set; }
        public string UPC { get; set; }
        public VendorDto Vendor { get; set; }
        public MaterialProfileDto MaterialProfile { get; set; }
    }
}