//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class LocationStockDto
    {
        public int? DeliveryTime { get; set; }
        public int? Stock { get; set; }
        public int? AvailableToPromise { get; set; }
        public int? Ordered { get; set; }
        public string LocationName { get; set; }
    }
}
