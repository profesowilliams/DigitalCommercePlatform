using DigitalFoundation.App.Services.Quote.Models.Find.Internal;
using System;

namespace DigitalFoundation.App.Services.Quote.DTO
{
    public class FindQuoteDto
    {
        public string Id { get; set; }
        public string CustomerName { get; set; }
        public string CustomerNumber { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public DateTime? ExpiresFrom { get; set; }
        public DateTime? ExpiresTo { get; set; }
        public string Active { get; set; }
        public StatusModelEnum? Status { get; set; }
        public string CreatedBy { get; set; }
        public string SalesTeamId { get; set; }
        public string SalesTeamName { get; set; }
        public string QuoteType { get; set; }
        public string Manufacturer { get; set; }
        public string OrderId { get; set; }
        public string Material { get; set; }
        public string ManufacturerPart { get; set; }
        public string CustomerPart { get; set; }
        public string ShipToName { get; set; }
        public string EndUserName { get; set; }
        public string CustomerPO { get; set; }
        public string EndUserPO { get; set; }
        public decimal RevenueMaxThreshold { get; set; }
        public decimal RevenueMinThreshold { get; set; }
        public string TDUAN { get; set; }
        public string VendorAgreement { get; set; }
        public string WorkflowId { get; set; }
        public string SalesOrg { get; set; }
        public string AccountOwner { get; set; }
        public string DirectorId { get; set; }
        public string DirectorName { get; set; }
        public string BusinessManagerId { get; set; }
        public string BusinessManagerName { get; set; }
        public string DivisionManagerId { get; set; }
        public string DivisionManagerName { get; set; }
        public string VendorSalesAssociate { get; set; }
        public string VendorSalesRep { get; set; }
        public string SortBy { get; set; }
        public bool SortAscending { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public bool Details { get; set; }
    }
}