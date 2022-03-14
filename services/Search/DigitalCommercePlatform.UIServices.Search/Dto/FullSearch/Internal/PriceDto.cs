//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;

namespace DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal
{
    public class PriceDto : ElasticPriceDto
    {
        public decimal? BasePrice { get; set; }
        public decimal? BestPrice { get; set; }
        public DateOnly? BestPriceExpiration { get; set; }
        public bool? BestPriceIncludesWebDiscount { get; set; }
        public bool ListPriceAvailable { get; set; }
        public string Currency { get; set; }
    }
}