using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.DTO.Invoice.Internal
{
    [ExcludeFromCodeCoverage]
    public class InvoiceOrderDto
    {
        public string Id { get; set; }
        public string System { get; set; }
        public string SalesOrg { get; set; }
        public DateTime? Created { get; set; }
        public string RequestNo { get; set; }
    }
}