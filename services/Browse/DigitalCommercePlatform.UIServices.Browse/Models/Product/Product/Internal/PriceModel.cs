//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class PriceModel
    {
        public decimal? ListPrice { get; set; }
        public decimal? UnpromotedPrice { get; set; }
        public decimal? BestPrice { get; set; }
        public List<PromoPrice> PromoPrices { get; set; }
        public List<VolumePricingModel> VolumePricing { get; set; }
    }
}
