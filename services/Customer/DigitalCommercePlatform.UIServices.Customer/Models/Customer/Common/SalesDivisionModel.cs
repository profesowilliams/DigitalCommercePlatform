using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Customer.Models.Customer.Common
{
    [ExcludeFromCodeCoverage]
    public class SalesDivisionModel
    {
        public string SalesDivisionCodepublic { get; set; }
        public string SalesOrg { get; set; }
        public string AccountGroup { get; set; }
        public string DefaultShippingCondition { get; set; }
        public string OrderNotesFlag { get; set; }
        public string CustomerGroupCode { get; set; }
        public string FreightColumnCode { get; set; }
        public string OrderFulfillmentCode { get; set; }
        public string RateRequestOptionFlag { get; set; }
        public string ShipSameDayFlag { get; set; }
        public string CustomerDesignationGroup { get; set; }
    }
}