using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Common.Customer.Models
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
