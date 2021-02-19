namespace DigitalCommercePlatform.UIServices.Product.Models.Summary.Internal
{
    public class PlantModel
    {
        public string Id { get; set; }
        public string UPC { get; set; }
        public VendorModel Vendor { get; set; }
        public MaterialProfileModel MaterialProfile { get; set; }
    }
}