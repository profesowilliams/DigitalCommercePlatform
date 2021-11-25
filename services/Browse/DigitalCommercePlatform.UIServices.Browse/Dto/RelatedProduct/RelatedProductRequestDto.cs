//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct
{
    [ExcludeFromCodeCoverage]
    public class RelatedProductRequestDto
    {
        public string[] ProductId { get; set; }
        public string[] Type { get; set; }
        public bool SameManufacturerOnly { get; set; }
    }
}
