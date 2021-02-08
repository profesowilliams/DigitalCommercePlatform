using System;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Order.Services
{
    public class OrderDto
    {
        public SourceDto Source { get; set; }
        public AddressDto ShipTo { get; set; }
        public DateTime? Created { get; set; }
        public string DocType { get; set; }
        public decimal? Price { get; set; }
        public string Currency { get; set; }
        public Status Status { get; set; }
        public List<ItemModelDto> Items { get; set; }
    }
}
