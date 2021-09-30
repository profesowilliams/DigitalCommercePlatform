//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class VolumePricingDto
    {
        public decimal Price { get; set; }
        public int? MinQuantity { get; set; }
    }
}
