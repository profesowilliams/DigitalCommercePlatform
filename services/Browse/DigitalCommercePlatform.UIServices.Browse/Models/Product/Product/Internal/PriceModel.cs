//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class PriceModel
    {
        public decimal? ListPrice { get; set; }
        public decimal? BasePrice { get; set; }
        public decimal? BestPrice { get; set; }
        public DateTime? BestPriceExpiration { get; set; }
        public bool? BestPriceIncludesWebDiscount { get; set; }

        public decimal? PromoAmount
        {
            get
            {
                if (!BasePrice.HasValue || !BestPrice.HasValue)
                    return null;

                return BasePrice.Value - BestPrice.Value;
            }
        }

        public IEnumerable<VolumePricingModel> VolumePricing { get; set; }
    }
}