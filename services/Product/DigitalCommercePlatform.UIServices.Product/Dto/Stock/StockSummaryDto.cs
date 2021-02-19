using DigitalCommercePlatform.UIServices.Product.Dto.Stock.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Dto.Stock
{
    [ExcludeFromCodeCoverage]
    public class StockSummaryDto
    {
        public SourceDto Source { get; set; }
        public IDictionary<string, int> Locations { get; set; }
    }
}
