//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Dto.Order
{
    [ExcludeFromCodeCoverage]
    public class FindRequestModel
    {
        public string CustomerPO { get; set; }
        public string ID { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 50;
        public bool Details { get; set; } = true;
        public string ManufacturerPartNumber { get; set; }
    }
}
