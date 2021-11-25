using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Order.Enum;

namespace DigitalCommercePlatform.UIServices.Order.Dto.Order
{
    [ExcludeFromCodeCoverage]
    public class FindRequestModel
    {
        public string CustomerPO;
        public string ID { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 50;
        public bool Details { get; set; } = true;
        public string ManufacturerPartNumber { get; set; }
    }
}
