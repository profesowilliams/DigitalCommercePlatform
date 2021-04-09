using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Product.Dto.Stock.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Product.Dto.Stock
{
    [ExcludeFromCodeCoverage]
    public class StockDto
    {
        public SourceDto Source { get; set; }
        public IEnumerable<LocationDto> Locations { get; set; }
    }
}
