//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct
{
    [ExcludeFromCodeCoverage]
    public class RelatedProductResponseDto
    {
        public Dictionary<string, List<TypeDto>> Product { get; set; }
        public string[] ProductsNotFound { get; set; }
    }
}
