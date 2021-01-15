using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Customer.DTO
{
    [ExcludeFromCodeCoverage]
    public class CustomerDto
    {
        public IdDto CustomerId { get; set; }
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
        public string CustomerType { get; set; }
        public ContactDto Reseller { get; set; }
        public ContactDto ShipTo { get; set; }
        public string ShipToName { get; set; }
        public string SalesOrganization { get; set; }
        public CoreBusinessCustomerItem BusinessCustomerLevel { get; set; }
        public CoreBusinessCustomerItem BusinessCustomerType { get; set; }
        public string ContractNumber { get; set; }
        public string BlockStatus { get; set; }
        public string HoldReason { get; set; }
        public string VendorSolutionAssociate { get; set; }
        public string VendorSolutionRepresentative { get; set; }

        public List<CustomerLineDto> Lines { get; set; }
    }
}
