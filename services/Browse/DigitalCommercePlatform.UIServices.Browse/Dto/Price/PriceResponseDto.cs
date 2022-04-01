//2022 (c) TD Synnex - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Browse.Dto.Price.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Price
{
    public class PriceResponseDto
    {
        public SourceDto Source { get; set; }
        public IEnumerable<EndUserPromosDto> EndUserPromos { get; set; }
        public string Currency { get; set; } = "USD";
    }
}