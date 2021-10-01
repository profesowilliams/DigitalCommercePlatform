//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct.Internal
{
    [ExcludeFromCodeCoverage]
    public class TypeDto
    {
        public string Type { get; set; }
        public List<CategoryDto> Categories { get; set; }
    }
}
