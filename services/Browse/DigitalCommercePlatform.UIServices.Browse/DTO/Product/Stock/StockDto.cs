using DigitalCommercePlatform.UIService.Browse.DTO.Product.Stock.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Browse.DTO.Product.Stock
{
    public class StockDto
    {
        public SourceDto Source { get; set; }
        public IEnumerable<LocationDto> Locations { get; set; }
    }
}
