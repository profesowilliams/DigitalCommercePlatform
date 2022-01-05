//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Models.ProductCompare.Internal
{
    public class StockModel
    {
        public int? Corporate { get; set; }
        public IEnumerable<PlantModel> Plants { get; set; }
        public int? TotalAvailable { get; set; }
        public int? VendorDirectInventory { get; set; }
        public bool VendorShipped { get; set; }
    }
}