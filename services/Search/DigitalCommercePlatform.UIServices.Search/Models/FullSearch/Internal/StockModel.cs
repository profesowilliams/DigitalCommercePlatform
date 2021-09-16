//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class StockModel
    {
        public int? TotalAvailable { get; set; }
        public int? VendorDirectInventory { get; set; }
        public bool VendorShipped { get; set; }
    }
}
