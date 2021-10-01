//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct.Internal
{
    [ExcludeFromCodeCoverage]
    public class ProductModel
    {
        public string Id { get; set; }
        public int? Quantity { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public string DisplayName { get; set; }
        public string ThumbnailImage { get; set; }
        public AuthorizationModel Authorization { get; set; }
        public PriceModel Pricing { get; set; }
    }
}
