using DigitalCommercePlatform.UIServices.Order.Models.TDOSSalesOrder.Internal;
using System;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Order.Models.TDOSSalesOrder
{
    public class OrderModel
    {
        public IdModel OrderId { get; set; }
        public IdModel QuoteId { get; set; }
        public decimal QuoteRevisionNumber { get; set; }
        public string CustomerNumber { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string EndUserPONumber { get; set; }
        public string CustomerPONumber { get; set; }
        public long WorkflowRequestId { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; }
        public string OrderType { get; set; }
        public ContactModel Reseller { get; set; }
        public ContactModel ShipTo { get; set; }
        public string ShipToName { get; set; }
        public string SalesOrganization { get; set; }
        public BusinessOrderItemModel BusinessOrderLevel { get; set; }
        public BusinessOrderItemModel BusinessOrderType { get; set; }
        public string ContractNumber { get; set; }
        public string BlockStatus { get; set; }
        public string HoldReason { get; set; }
        public int? VendorSolutionAssociate { get; set; }
        public int? VendorSolutionRepresentative { get; set; }

        public List<OrderLineModel> Lines { get; set; }
    }
}