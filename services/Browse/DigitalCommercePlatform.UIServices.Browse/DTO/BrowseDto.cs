using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.DTO
{
    [ExcludeFromCodeCoverage]
    public class BrowseDto
    {
        public IdDto BrowseId { get; set; }
        public IdDto QuoteId { get; set; }
        public decimal QuoteRevisionNumber { get; set; }
        public string BrowseNumber { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string EndUserPONumber { get; set; }
        public string BrowsePONumber { get; set; }
        public string ResellerPONumber { get; set; }
        public string VendorPONumber { get; set; }
        public DateTime VendorPoDate { get; set; }
        public long WorkflowRequestId { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; }
        public string BrowseType { get; set; }
        public BrowseDto Reseller { get; set; }
        public BrowseDto ShipTo { get; set; }
        public string ShipToName { get; set; }
        public string SalesOrganization { get; set; }
        public CoreBusinessBrowseItem BusinessBrowseLevel { get; set; }
        public CoreBusinessBrowseItem BusinessBrowseType { get; set; }
        public string ContractNumber { get; set; }
        public string BlockStatus { get; set; }
        public string HoldReason { get; set; }
        public string VendorSolutionAssociate { get; set; }
        public string VendorSolutionRepresentative { get; set; }

        public List<BrowseLineDto> Lines { get; set; }
    }
}
