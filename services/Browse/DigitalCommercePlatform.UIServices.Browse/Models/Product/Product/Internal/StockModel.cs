//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class StockModel
    {
        public string Corporate { get; set; }
        public IEnumerable<PlantModel> Plants { get; set; }
        public string TotalAvailable { get; set; }
        public string VendorDirectInventory { get; set; }
        public bool VendorShipped { get; set; }
    }
}