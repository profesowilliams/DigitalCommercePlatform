using DigitalCommercePlatform.UIService.Product.Dto.Stock.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Product.Dto.Stock
{
    public class StockDto
    {
        public SourceDto Source { get; set; }
        public IEnumerable<LocationDto> Locations { get; set; }
    }
}
