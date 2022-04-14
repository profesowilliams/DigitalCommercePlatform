//2022 (c) TD Synnex - All Rights Reserved.

using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class WarehouseDto
    {
        public string Id { get; set; }
        public string Dimensions { get; set; }
        public int? CasePackQuantity { get; set; }
    }
}