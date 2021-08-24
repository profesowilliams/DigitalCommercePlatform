//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class IndicatorModel
    {
        public ContextModel Context { get; set; }
        public IDictionary<string, IndicatorValueModel> Values { get; set; }
    }
}
