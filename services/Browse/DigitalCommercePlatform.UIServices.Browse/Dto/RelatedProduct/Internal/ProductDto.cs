//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct.Internal
{
    [ExcludeFromCodeCoverage]
    public class ProductDto
    {
        public SourceDto Source { get; set; }
        public int? Quantity { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public string DisplayName { get; set; }
        public string ThumbnailImage { get; set; }
        public PriceDto Pricing { get; set; }
        public IEnumerable<MainSpecificationDto> MainSpecifications { get; set; }
        public string ServicePriority { get; set; }
    }
}