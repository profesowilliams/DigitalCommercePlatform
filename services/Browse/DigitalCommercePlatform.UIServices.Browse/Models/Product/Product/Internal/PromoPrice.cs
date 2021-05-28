using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class PromoPrice
    {
        public decimal PromoPriceValue { get; set; }
        public decimal PromoAmount { get; set; }
        public DateTime? PromoExpirationDate { get; set; }
        public string Type { get; set; }
        public int? MinQuantity { get; set; }
    }
}