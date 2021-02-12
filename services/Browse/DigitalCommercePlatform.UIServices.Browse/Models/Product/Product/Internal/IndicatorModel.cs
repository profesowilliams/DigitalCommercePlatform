using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class IndicatorModel
    {
        public ContextModel Context { get; set; }
        public IDictionary<string, string> Values { get; set; }
    }
}