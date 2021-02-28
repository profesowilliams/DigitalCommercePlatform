using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Models
{
    public class Line
    {
        public string Id { get; set; }
        public string Parent { get; set; }
        public int Quantity { get; set; }
        public decimal? TotalPrice { get; set; }
        public decimal? MSRP { get; set; }
        public decimal? UnitPrice { get; set; }
        public string Currency { get; set; }
        public string Invoice { get; set; }
        public string Description { get; set; }

    }
}
