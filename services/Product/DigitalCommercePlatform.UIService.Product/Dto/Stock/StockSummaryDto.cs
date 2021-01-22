using DigitalCommercePlatform.UIService.Product.Dto.Stock.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Product.Dto.Stock
{
    public class StockSummaryDto
    {
        public SourceDto Source { get; set; }
        public IDictionary<string, int> Locations { get; set; }
    }
}
