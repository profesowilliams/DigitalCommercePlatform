//2022 (c) TD Synnex - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Browse.Dto.Price.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Price
{
    public class PriceRequestDto
    {
        public IEnumerable<PriceProductRequestDto> Products { get; set; }
        public bool Details { get; } = false;
        public bool IncludePromotionOptions { get; } = true;
        public bool IncludeQuantityBreaks { get; } = false;

        public PriceRequestDto()
        {
        }

        public PriceRequestDto(string productId)
        {
            Products = new List<PriceProductRequestDto>()
            {
                new PriceProductRequestDto
                {
                    ProductId = productId
                }
            };
        }
    }
}