//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class PriceModel : ElasticPriceModel
    {
        public decimal? BasePrice { get; set; }
        public decimal? BestPrice { get; set; }
        public DateTime? BestPriceExpiration { get; set; }
        public bool? BestPriceIncludesWebDiscount { get; set; }
        public decimal? PromoAmount { get; set; }
        public List<VolumePricing> VolumePricing { get; set; }
    }
}