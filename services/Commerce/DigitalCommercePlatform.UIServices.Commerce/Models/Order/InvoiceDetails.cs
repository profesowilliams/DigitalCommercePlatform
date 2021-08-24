//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order
{
    public class InvoiceDetails
    {
        public string ID { get; set; }
        public string Line { get; set; }
        public int? Quantity { get; set; }
        public decimal? Price { get; set; }
        public DateTime? Created { get; set; }
    }
}
