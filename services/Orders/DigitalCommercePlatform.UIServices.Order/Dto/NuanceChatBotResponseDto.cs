//2021 (c) Tech Data Corporation - All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Order.Dto.Internal;

namespace DigitalCommercePlatform.UIServices.Order.Dto
{
    [ExcludeFromCodeCoverage]
    public class NuanceChatBotResponseDto
    {
        public string OrderId { get; set; }
        public string CustomerPo { get; set; }
        public DateTime? PoDate { get; set; }
        public decimal? Price { get; set; }
        public string Currency { get; set; }
        public string Status { get; set; }
        public string BlockReason { get; set; }
        public ResellerDto Reseller { get; set; }
        public List<StatusCountDto> StatusCount { get; set; }
        public string OrderDetailsLink { get; set; }
        public List<ItemDto> Items { get; set; }
        public bool IsDropShip { get; set; }
    }
}
