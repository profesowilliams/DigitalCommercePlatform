using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Order.DTO
{
    public class CoreOrder
    {
        public string OrderNumber { get; set; }
        public string SalesOrg { get; set; }
        public int SystemId { get; set; }
        public string QuoteId { get; set; }
        public int QuoteRevision { get; set; }
        public string CustomerNumber { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string EndUserPONumber { get; set; }
        public string EndUserName { get; set; }
        public string CustomerPONumber { get; set; }
        public string PoNumber { get; set; }
        public DateTime PoDate { get; set; }
        public string WorkflowRequestId { get; set; }
        public string OrderStatus { get; set; }
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; }
        public string OrderType { get; set; }
        public CoreResellerGenerals Reseller { get; set; }
        public CoreResellerGenerals ShipTo { get; set; }
        public string ShipToName { get; set; }
        public CoreBusinessOrderItem BusinessOrderLevel { get; set; }
        public CoreBusinessOrderItem BusinessOrderType { get; set; }
        public string ContractNumber { get; set; }
        public string BlockStatus { get; set; }
        public string HoldReason { get; set; }
        public string VendorSolutionAssociate { get; set; }
        public string VendorSolutionRepresentative { get; set; }
       // public CoreOrderItem[] Items { get; set; }
    }
    public class CoreResellerGenerals
    {
        public string PONumber { get; set; }
        public string CompanyName { get; set; }
        public string Address { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string RegionCode { get; set; }
        public string ContactName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }

}
