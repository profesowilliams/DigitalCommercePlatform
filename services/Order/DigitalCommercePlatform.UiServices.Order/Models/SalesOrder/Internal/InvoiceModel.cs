using System;

namespace DigitalCommercePlatform.UIServices.Order.Models.SalesOrder.Internal
{
    public class InvoiceModel
    {
        public string ID { get; set; }
        public string Line { get; set; }
        public int? Quantity { get; set; }
        public decimal? Price { get; set; }
        public DateTime? Created { get; set; }
    }
}