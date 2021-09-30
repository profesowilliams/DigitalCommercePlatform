//2021 (c) Tech Data Corporation -. All Rights Reserved.
namespace DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct.Internal
{
    public class ProductModel
    {
        public SourceModel Source { get; set; }
        public int? Quantity { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public string DisplayName { get; set; }
        public string ThumbnailImage { get; set; } 
        public PriceModel Pricing { get; set; }
    }
}
