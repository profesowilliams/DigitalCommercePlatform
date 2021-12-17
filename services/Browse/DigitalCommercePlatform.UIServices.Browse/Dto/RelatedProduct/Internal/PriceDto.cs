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
        public DateTime? BestPriceExpiration { get; set; }
        public decimal? BasePrice { get; set; }
        public bool? BestPriceIncludesWebDiscount { get; set; }
    }
}
