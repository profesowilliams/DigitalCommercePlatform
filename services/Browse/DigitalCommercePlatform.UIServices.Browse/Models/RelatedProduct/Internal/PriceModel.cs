//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct.Internal
{
    [ExcludeFromCodeCoverage]
    public class PriceModel
    {
        public string BasePrice { get; set; }
        public string BestPrice { get; set; }
        public string BestPriceExpiration { get; set; }
        public bool? BestPriceIncludesWebDiscount { get; set; }
        public string ListPrice { get; set; }
        public string PromoAmount { get; set; }
    }
}