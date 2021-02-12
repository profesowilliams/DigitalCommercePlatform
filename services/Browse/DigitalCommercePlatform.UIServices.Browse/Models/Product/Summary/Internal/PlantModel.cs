namespace DigitalCommercePlatform.UIService.Browse.Models.Product.Summary.Internal
{
    public class PlantModel
    {
        public string Id { get; set; }
        public string UPC { get; set; }
        public VendorModel Vendor { get; set; }
        public MaterialProfileModel MaterialProfile { get; set; }
    }
}