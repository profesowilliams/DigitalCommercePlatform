//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Models.ProductCompare.Internal
{
    public class PriceModel
    {
        public string BasePrice { get; set; }
        public string BestPrice { get; set; }
        public string BestPriceExpiration { get; set; }
        public bool? BestPriceIncludesWebDiscount { get; set; }
        public string ListPrice { get; set; }
        public string PromoAmount { get; set; }

        public IEnumerable<VolumePricingModel> VolumePricing { get; set; }
    }
}