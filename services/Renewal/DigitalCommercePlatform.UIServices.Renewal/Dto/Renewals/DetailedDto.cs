//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals
{
    [ExcludeFromCodeCoverage]
    public class DetailedDto : SummaryDto
    {
        public List<ItemDto> Items { get; set; }
    }
}
