//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;

namespace DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct.Internal
{
    public class PriceModel
    {
        public decimal? ListPrice { get; set; }
        public decimal? BestPrice { get; set; }
        public DateTime? BestPriceExpiration { get; set; }
        public decimal? BasePrice { get; set; }
    }
}
