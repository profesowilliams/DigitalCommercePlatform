using DigitalCommercePlatform.UIServices.Order.Enums;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Models.SalesOrder
{
    [ExcludeFromCodeCoverage]
    public class FindRequestModel
    {
        public string ID { get; set; }
        public string SystemId { get; set; }
        public string CustomerID { get; set; }
        public string CustomerName { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public DateTime? UpdatedFrom { get; set; }
        public DateTime? UpdatedTo { get; set; }
        public string Type { get; set; }
        public string QuoteId { get; set; }
        public string QuoteSystemId { get; set; }
        public string ShipToName { get; set; }
        public string EndUserName { get; set; }
        public string CustomerPO { get; set; }
        public string VendorPO { get; set; }
        public string EndUserPO { get; set; }
        public DateTime? PoDateFrom { get; set; }
        public DateTime? PoDateTo { get; set; }
        public string Product { get; set; }
        public string Serial { get; set; }
        public Status Status { get; set; }
        public string DeliveryNote { get; set; }
        public string SalesTeamName { get; set; }
        public string Manufacturer { get; set; }
        public string CustomerPartNumber { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public decimal? Revenue { get; set; }
        public string RevenueOperation { get; set; }
        public decimal? RevenueMaxThreshold { get; set; }
        public decimal? RevenueMinThreshold { get; set; }
        public string Agreement { get; set; }
        public string VendorAgreementNumber { get; set; }
        public string Request { get; set; }
        public string SalesOrg { get; set; }
        public string BusinessManagerID { get; set; }
        public string BusinessManagerName { get; set; }
        public string BusinessManagerSystemId { get; set; }
        public string DivisionManagerID { get; set; }
        public string DivisionManagerName { get; set; }
        public string DivisionManagerSystemId { get; set; }
        public string DirectorID { get; set; }
        public string DirectorName { get; set; }
        public string DirectorSystemId { get; set; }
        public string[] TeamIds { get; set; }
        public int[] VendorSolutionAssociate { get; set; }
        public int[] VendorSolutionRepresentative { get; set; }
        public string ContractNumber { get; set; }
        public IEnumerable<string> DocCategories { get; set; } = new string[] { "C" };
        public bool TDOSSearchable { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; } = 50;
        public int? Skip { get; set; }
        public int? Count { get; set; } = 50;
        public bool SortAscending { get; set; }

        public bool Details { get; set; }
        public bool WithPaginationInfo { get; set; }

        public OrderSort Sort { get; set; } = OrderSort.CREATED;
    }
}