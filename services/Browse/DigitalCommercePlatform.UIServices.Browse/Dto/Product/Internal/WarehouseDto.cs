//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class WarehouseDto
    {
        public string Id { get; set; }
        public string Dimensions { get; set; }
        public string GrossWeight { get; set; }
        public int? CasePackQuantity { get; set; }
    }
}
