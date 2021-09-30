//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class RelatedProductDto
    {
        public string Type { get; set; }
        public List<RelatedProductTypeDto> Products { get; set; }
    }
}
