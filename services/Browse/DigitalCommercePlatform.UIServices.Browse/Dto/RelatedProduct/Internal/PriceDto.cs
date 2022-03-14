//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct.Internal
{
    [ExcludeFromCodeCoverage]
    public class PriceDto
    {
        public decimal? ListPrice { get; set; }
        public decimal? BestPrice { get; set; }
        public DateOnly? BestPriceExpiration { get; set; }
        public decimal? BasePrice { get; set; }
        public bool? BestPriceIncludesWebDiscount { get; set; }
        public bool ListPriceAvailable { get; set; }
        public string Currency { get; set; }
    }
}
