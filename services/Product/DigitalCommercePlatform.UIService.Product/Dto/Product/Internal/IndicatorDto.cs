using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Product.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class IndicatorDto
    {
        public ContextDto Context { get; set; }
        public IDictionary<string, string> Values { get; set; }
    }
}