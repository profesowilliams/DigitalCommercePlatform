using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Order.DTO
{
    [ExcludeFromCodeCoverage]
    public class OrderDto
    {
        public IdDto OrderId { get; set; }
        public IdDto QuoteId { get; set; }
        public decimal QuoteRevisionNumber { get; set; }
        public string CustomerNumber { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string EndUserPONumber { get; set; }
        public string CustomerPONumber { get; set; }
        public string ResellerPONumber { get; set; }
        public string VendorPONumber { get; set; }
        public DateTime VendorPoDate { get; set; }
        public long WorkflowRequestId { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; }
        public string OrderType { get; set; }
        public ContactDto Reseller { get; set; }
        public ContactDto ShipTo { get; set; }
        public string ShipToName { get; set; }
        public string SalesOrganization { get; set; }
        public CoreBusinessOrderItem BusinessOrderLevel { get; set; }
        public CoreBusinessOrderItem BusinessOrderType { get; set; }
        public string ContractNumber { get; set; }
        public string BlockStatus { get; set; }
        public string HoldReason { get; set; }
        public string VendorSolutionAssociate { get; set; }
        public string VendorSolutionRepresentative { get; set; }

        public List<OrderLineDto> Lines { get; set; }
    }
}
