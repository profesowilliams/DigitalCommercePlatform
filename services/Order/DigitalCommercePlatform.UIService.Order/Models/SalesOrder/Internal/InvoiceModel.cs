using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class InvoiceModel
    {
        public string ID { get; set; }
        public string Line { get; set; }
        public int? Quantity { get; set; }
        public decimal? Price { get; set; }
        public DateTime? Created { get; set; }
    }
}