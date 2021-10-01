//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct.Internal
{
    [ExcludeFromCodeCoverage]
    public class CategoryDto
    {
        public string CategoryId { get; set; }
        public string Name { get; set; }
        public List<ProductDto> Products { get; set; }
    }
}
