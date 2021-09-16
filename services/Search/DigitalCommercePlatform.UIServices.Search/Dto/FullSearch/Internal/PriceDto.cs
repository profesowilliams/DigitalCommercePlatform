//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;

namespace DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal
{
    public class PriceDto : ElasticPriceDto
    {
        public decimal? BestPrice { get; set; }
        public decimal? BasePrice { get; set; }
        public DateTime? BestPriceExpiration { get; set; }
    }
}
