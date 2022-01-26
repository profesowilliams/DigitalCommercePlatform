//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Models.ProductCompare.Internal
{
    public class StockModel
    {
        public string Corporate { get; set; }
        public IEnumerable<PlantModel> Plants { get; set; }
        public string TotalAvailable { get; set; }
        public string VendorDirectInventory { get; set; }
        public bool VendorShipped { get; set; }
    }
}