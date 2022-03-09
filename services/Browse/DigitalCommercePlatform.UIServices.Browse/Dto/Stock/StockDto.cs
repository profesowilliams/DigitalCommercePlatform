//2022 (c) Tech Data Corporation - All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Stock
{
    public class StockDto
    {
        public IEnumerable<LocationDto> Locations { get; set; }
        public int? VendorDirect { get; set; }
    }
}
