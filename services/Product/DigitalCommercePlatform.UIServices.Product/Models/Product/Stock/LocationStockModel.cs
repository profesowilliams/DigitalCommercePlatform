//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Models.Product.Stock
{
    [ExcludeFromCodeCoverage]
    public class LocationStockModel
    {
        public int? DeliveryTime { get; set; }
        public int? Stock { get; set; }
        public int? AvailableToPromise { get; set; }
        public int? Ordered { get; set; }
    }
}
