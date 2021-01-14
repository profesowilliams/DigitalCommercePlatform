using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.DTO.Invoice
{
    [ExcludeFromCodeCoverage]
    public class FindInvoiceCriteriaDto
    {
        public string CustomerNumber { get; set; }
        public string CustomerName { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public string Material { get; set; }
        public string Invoice { get; set; }
        public string SystemId { get; set; }
        public string OrderId { get; set; }
        public string PurchaseOrder { get; set; }
        public string Quote { get; set; }
        public string ManufacturerPart { get; set; }
        public string DirectorId { get; set; }
        public string Director { get; set; }
        public string BusinessManagerId { get; set; }
        public string BusinessManager { get; set; }
        public string DivisionManagerId { get; set; }
        public string DivisionManager { get; set; }
        public string WorkflowId { get; set; }

        public int Page { get; set; }
        public int PageSize { get; set; }
        public string SortBy { get; set; }
        public bool SortAscending { get; set; }
        public bool TotalCount { get; set; }
    }
}