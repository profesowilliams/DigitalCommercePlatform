//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Models.ProductCompare.Internal
{
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
                if (BestPrice != null && BasePrice != null)
                {
                    return BasePrice - BestPrice;
                }
                return null;
            }
        }

        public IEnumerable<VolumePricingModel> VolumePricing { get; set; }
    }
}