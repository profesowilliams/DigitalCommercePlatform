//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class IndicatorDto
    {
        public ContextDto Context { get; set; }
        public IDictionary<string, IndicatorValueDto> Values { get; set; }
    }
}
