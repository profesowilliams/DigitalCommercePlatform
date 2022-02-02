//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class PriceModel : ElasticPriceModel
    {
        public string BasePrice { get; set; }
        public string BestPrice { get; set; }
        public string BestPriceExpiration { get; set; }
        public bool? BestPriceIncludesWebDiscount { get; set; }
        public string PromoAmount { get; set; }
        public List<VolumePricing> VolumePricing { get; set; }
    }
}