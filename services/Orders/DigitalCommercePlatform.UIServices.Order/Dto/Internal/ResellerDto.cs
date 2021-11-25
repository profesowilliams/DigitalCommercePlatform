//2021 (c) Tech Data Corporation - All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Dto.Internal
{
    [ExcludeFromCodeCoverage]
    public class ResellerDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public AddressDto Address { get; set; }
        public List<StatusCountDto> StatusCount { get; set; }
        public string OrderDetailsLink { get; set; }
        public List<ItemDto> Items { get; set; }
        public bool IsDropShip { get; set; }
    }
}
