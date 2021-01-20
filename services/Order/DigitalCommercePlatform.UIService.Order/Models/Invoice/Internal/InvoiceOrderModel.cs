using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.Invoice.Internal
{
    [ExcludeFromCodeCoverage]
    public class InvoiceOrderModel
    {
        public string Id { get; set; }
        public string System { get; set; }
        public string SalesOrg { get; set; }
        public DateTime? Created { get; set; }
        public string WorkflowId { get; set; }
    }
}