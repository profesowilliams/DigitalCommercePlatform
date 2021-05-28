using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class VolumePricingModel
    {
        public decimal Price { get; set; }
        public int? MinQuantity { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}