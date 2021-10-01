//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class StockModel
    {
        public int? TotalAvailable { get; set; }
        public int? VendorDirectInventory { get; set; }
        public bool VendorShipped { get; set; }
        public IEnumerable<PlantModel> Plants { get; set; }
    }
}
