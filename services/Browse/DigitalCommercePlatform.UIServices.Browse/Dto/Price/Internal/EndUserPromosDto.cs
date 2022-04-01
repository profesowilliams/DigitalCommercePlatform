//2022 (c) TD Synnex - All Rights Reserved.

using System;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Price.Internal
{
    public class EndUserPromosDto
    {
        public string EndCustomer { get; set; }
        public decimal? Value { get; set; }
        public DateTime? Expiration { get; set; }
        public int? MinQuantity { get; set; }
        public string VendorBidNumber { get; set; }
        public int? RemainingQuantity { get; set; }
    }
}