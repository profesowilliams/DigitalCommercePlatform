using System;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Order.Models.Order
{
    public class OrderModel
    {
        public Source Source { get; set; }
        public AddressModel ShipTo { get; set; }
        public DateTime? Created { get; set; }
        public string DocType { get; set; }
        public decimal? Price { get; set; }
        public string Currency { get; set; }
        public Status Status { get; set; }
        public List<Item> Items { get; set; }
        public string CustomerPO { get; set; }
    }
}
