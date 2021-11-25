//2021 (c) Tech Data Corporation - All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Order.Models.Internal;

namespace DigitalCommercePlatform.UIServices.Order.Models
{
    [ExcludeFromCodeCoverage]
    public class NuanceChatBotResponseModel
    {
        public string OrderId { get; set; }
        public string CustomerPo { get; set; }
        public DateTime? PoDate { get; set; }
        public decimal? Price { get; set; }
        public string Currency { get; set; }
        public string Status { get; set; }
        public string BlockReason { get; set; }
        public ResellerModel Reseller { get; set; }
        public StatusCountModel StatusCount { get; set; }
        public string OrderDetailsLink { get; set; }
        public List<ItemModel> Items { get; set; }
        public bool IsDropShip { get; set; }
    }
}
