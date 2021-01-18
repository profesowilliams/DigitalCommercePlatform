using DigitalCommercePlatform.UIServices.Order.Models.TDOSSalesOrder.Internal;
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Models.TDOSSalesOrder
{
    [ExcludeFromCodeCoverage]
    public class FindCriteriaRequestModel
    {
        public IdModel OrderId { get; set; }
        public IdModel QuoteId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerNumber { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public string CreatedBy { get; set; }
        public decimal? TotalAmount { get; set; }
        public string EndUserPONumber { get; set; }
        public string CustomerPONumber { get; set; }
        public string VendorPONumber { get; set; }
        public string EndUserName { get; set; }
        public string Status { get; set; }
        public string Revenue { get; set; }

        /// <summary>
        /// Indicates how an order's revenue will be compared to the Revenue value specified in the search criteria.
        /// Valid Values:
        /// lt        Less Than
        /// lte       Less Than or Equal To
        /// gt        Greater Than
        /// gte       Greater Than or Equal To
        /// eq        Equals
        /// </summary>
        public string RevenueOperation { get; set; }

        public string MaterialNumber { get; set; }
        public string VendorAgreementNumber { get; set; }
        public long? WorkflowRequestId { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public string CustomerPartNumber { get; set; }
        public string ShipToName { get; set; }
        public string SalesTeamName { get; set; }
        public string SalesOrganization { get; set; }
        public string SerialNumber { get; set; }
        public string DeliveryDocument { get; set; }
        public string VendorGlobalMan { get; set; }
        public string UniqueApprovalNumber { get; set; }
        public string OrderType { get; set; }
        public SalesOrganizationLevelModel BusinessManager { get; set; }
        public SalesOrganizationLevelModel Director { get; set; }
        public SalesOrganizationLevelModel DivisionManager { get; set; }
        public string[] TeamIds { get; set; }
        public int[] VendorSolutionAssociate { get; set; }
        public int[] VendorSolutionRepresentative { get; set; }
        public string ContractNumber { get; set; }
        public bool Details { get; set; } = true;

        public int Page { get; set; }
        public int PageSize { get; set; }
        public string SortBy { get; set; }
        public bool SortAscending { get; set; }

        public string[] DocTypeCodes { get; set; }
        public string[] DistributionChannels { get; set; }
        public string ObjVersCode1 { get; set; }
        public string[] ExcludedCustomerTypeCodes { get; set; }
        public string ObjVersCode2 { get; set; }
        public string SourSystemCode { get; set; }
        public DateTime? UpdatedFrom { get; set; }
        public DateTime? UpdatedTo { get; set; }
        public string TDOSSearchable { get; set; }

        public FindCriteriaRequestModel()
        {
            // default values
            Page = 1;
            PageSize = 25;
            SortAscending = true;
        }
    }
}