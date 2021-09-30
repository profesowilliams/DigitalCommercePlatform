//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class PropertyDto
    {
        public string Group { get; set; }
        public List<PropertyValueItemDto> Values { get; set; }
    }
}
