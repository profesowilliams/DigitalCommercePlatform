using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.DTO.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class IndicatorDto
    {
        public ContextDto Context { get; set; }
        public IDictionary<string, string> Values { get; set; }
    }
}