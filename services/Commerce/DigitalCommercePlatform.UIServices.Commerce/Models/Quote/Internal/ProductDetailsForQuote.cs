using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Internal
{
    public class ProductDetailsForQuote
    {
            public string Name { get; set; }
            public string Class { get; set; }
            public string ShortDescription { get; set; }
            public string MFRNum { get; set; }
            public string TDNum { get; set; }
            public string UPCNum { get; set; }
            public string PartNum { get; set; }
            public string SupplierPartNum { get; set; }
            public string Description { get; set; }
            public int Qty { get; set; }
            public double UnitPrice { get; set; }
            public double UnitListPrice { get; set; }
            public double RebateValue { get; set; }
            public string URLProductImage { get; set; }
            public string URLProductSpecs { get; set; }
    }
}
