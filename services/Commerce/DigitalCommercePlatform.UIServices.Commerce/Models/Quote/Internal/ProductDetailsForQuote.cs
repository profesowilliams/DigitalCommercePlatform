//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;
namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Internal
{
    [ExcludeFromCodeCoverage]
    public class ProductDetailsForQuote
    {
            public string Name { get; set; }
            public string Class { get; set; }
            public string ShortDescription { get; set; }
            public string MFRNumber { get; set; }
            public string TDNumber { get; set; }
            public string UPCNumber { get; set; }
            public string PartNumber { get; set; }
            public string SupplierPartNum { get; set; }
            public string Description { get; set; }
            public decimal Quantity { get; set; }
            public double UnitPrice { get; set; }
            public double UnitListPrice { get; set; }
            public double RebateValue { get; set; }
            public string URLProductImage { get; set; }
            public string URLProductSpecs { get; set; }
    }
}
