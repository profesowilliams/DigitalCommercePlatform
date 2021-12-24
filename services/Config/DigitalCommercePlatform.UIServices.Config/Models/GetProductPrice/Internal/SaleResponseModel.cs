//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.GetProductPrice.Internal
{
    [ExcludeFromCodeCoverage]
    public class SaleResponseModel
    {
        public string EndCustomer { get; set; }
        public IEnumerable<string> Id { get; set; }
        public bool IncludesWebDiscount { get; set; }
        public string Type { get; set; }
        public decimal? Value { get; set; }
        public DateTime? Expiration { get; set; }
        public int? MinQuantity { get; set; }

        public SaleResponseModel()
        {
            Id = Array.Empty<string>();
        }
    }
}
