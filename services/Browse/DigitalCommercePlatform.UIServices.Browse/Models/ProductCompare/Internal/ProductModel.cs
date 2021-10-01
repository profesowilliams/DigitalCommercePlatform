//2021 (c) Tech Data Corporation -. All Rights Reserved.
namespace DigitalCommercePlatform.UIServices.Browse.Models.ProductCompare.Internal
{
    public class ProductModel
    {
        public string Id { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public string Description { get; set; }
        public string DisplayName { get; set; }
        public string ThumbnailImage { get; set; }
        public StockModel Stock { get; set; }
        public AuthorizationModel Authorization { get; set; }
        public PriceModel Price { get; set; }
    }
}