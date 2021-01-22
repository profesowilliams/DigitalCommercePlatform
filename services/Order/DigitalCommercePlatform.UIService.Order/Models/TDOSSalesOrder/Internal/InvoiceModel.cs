using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.TDOSSalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class InvoiceModel
    {
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
    }
}