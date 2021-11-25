//2021 (c) Tech Data Corporation - All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Actions.NuanceChat
{
    [ExcludeFromCodeCoverage]
    public class RequestOrderQuery
    {
        public string ManufacturerPartNumber { get; set; }
        public string LineId { get; set; }
        public string OrderId { get; set; }
        public string CustomerPo { get; set; }
    }
}
