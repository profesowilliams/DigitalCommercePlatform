using DigitalCommercePlatform.UIService.Product.Dto.Stock.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Product.Dto.Stock
{
    public class StockDto
    {
        public SourceDto Source { get; set; }
        public IEnumerable<LocationDto> Locations { get; set; }
    }
}