using DigitalCommercePlatform.UIService.Browse.DTO.Product.Stock.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Browse.DTO.Product.Stock
{
    public class StockSummaryDto
    {
        public SourceDto Source { get; set; }
        public IDictionary<string, int> Locations { get; set; }
    }
}
