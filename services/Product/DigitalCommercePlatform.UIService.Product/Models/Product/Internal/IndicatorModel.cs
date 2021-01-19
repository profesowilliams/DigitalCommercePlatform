using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Product.Models.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class IndicatorModel
    {
        public ContextModel Context { get; set; }
        public IDictionary<string, string> Values { get; set; }
    }
}