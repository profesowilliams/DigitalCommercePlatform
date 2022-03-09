//2022 (c) Tech Data Corporation - All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Stock
{
    public class StockModel
    {
        public IEnumerable<LocationModel> Locations { get; set; }
        public int? VendorDirect { get; set; }
    }
}
