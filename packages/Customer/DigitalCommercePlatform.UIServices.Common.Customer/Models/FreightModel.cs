using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Common.Customer.Models
{
    [ExcludeFromCodeCoverage]
    public class FreightModel
    {
        public string ShippingCondition { get; set; }
        public string SalesDocType { get; set; }
        public decimal FreeFreightThreshold { get; set; }
        public string IsHeavyWeight { get; set; }
        public string CustomerName { get; set; }
        public string FpsFlag { get; set; }
    }
}
